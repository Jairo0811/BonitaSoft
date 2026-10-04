import os
import sqlite3
import tempfile
from pathlib import Path

from fastapi.testclient import TestClient

TEST_DB = Path(tempfile.mkdtemp(prefix="bonitasoft-tests-")) / "bonitasoft-test.db"
os.environ["BONITASOFT_DB_PATH"] = str(TEST_DB)

from main import DB_PATH, app  # noqa: E402

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
    assert DB_PATH.exists()


def test_seed_is_consistent_across_requests_audit_and_stats() -> None:
    requests = client.get("/requests")
    audit = client.get("/audit")
    stats = client.get("/stats")

    assert requests.status_code == 200
    assert audit.status_code == 200
    assert stats.status_code == 200

    completed = [item for item in requests.json() if item["status"] == "COMPLETED"]
    assert len(completed) >= 1
    assert any(record["request_id"] == completed[0]["id"] for record in audit.json())
    assert stats.json()["rest_requests"] == len(audit.json())


def test_provision_and_audit() -> None:
    payload = {
        "request_id": "REQ-TEST-001",
        "user_email": "demo@example.com",
        "system": "ERP",
        "access_level": "Lectura",
    }

    provision = client.post("/provision", json=payload)
    assert provision.status_code == 201
    body = provision.json()
    assert body["request_id"] == payload["request_id"]
    assert body["status"] == "PROVISIONED"
    assert body["external_reference"].startswith("ACC-")

    audit = client.get(f"/audit/{payload['request_id']}")
    assert audit.status_code == 200
    assert audit.json()["user_email"] == payload["user_email"]

    audit_list = client.get("/audit")
    assert audit_list.status_code == 200
    assert any(item["request_id"] == payload["request_id"] for item in audit_list.json())


def test_provision_is_idempotent_by_request_id() -> None:
    payload = {
        "request_id": "REQ-TEST-002",
        "user_email": "idempotent@example.com",
        "system": "CRM",
        "access_level": "Operación",
    }

    first = client.post("/provision", json=payload)
    second = client.post("/provision", json=payload)

    assert first.status_code == 201
    assert second.status_code == 201
    assert first.json()["external_reference"] == second.json()["external_reference"]


def test_unknown_audit_returns_404() -> None:
    response = client.get("/audit/DOES-NOT-EXIST")
    assert response.status_code == 404


def test_create_approve_and_trace_access_request() -> None:
    create = client.post(
        "/requests",
        json={
            "requester_name": "Usuario Prueba",
            "user_email": "workflow@example.com",
            "system": "ERP Pruebas",
            "access_level": "Estándar",
            "justification": "Validar flujo completo.",
        },
    )
    assert create.status_code == 201
    created = create.json()
    assert created["status"] == "PENDING_APPROVAL"

    initial_events = client.get(f"/requests/{created['id']}/events")
    assert initial_events.status_code == 200
    assert [item["event_type"] for item in initial_events.json()] == ["REQUEST_CREATED"]

    approve = client.post(f"/requests/{created['id']}/approve")
    assert approve.status_code == 200
    approved = approve.json()
    assert approved["status"] == "COMPLETED"
    assert approved["external_reference"].startswith("ACC-")

    audit = client.get(f"/audit/{created['id']}")
    assert audit.status_code == 200
    assert audit.json()["status"] == "PROVISIONED"

    events = client.get(f"/requests/{created['id']}/events")
    assert events.status_code == 200
    event_types = [item["event_type"] for item in events.json()]
    assert event_types == ["REQUEST_CREATED", "APPROVED", "PROVISIONED"]

    detail = client.get(f"/requests/{created['id']}")
    assert detail.status_code == 200
    assert detail.json()["external_reference"] == approved["external_reference"]


def test_create_and_reject_access_request_records_event() -> None:
    create = client.post(
        "/requests",
        json={
            "requester_name": "Usuario Rechazo",
            "user_email": "rejected@example.com",
            "system": "Sistema Restringido",
            "access_level": "Administración",
            "justification": "Validar ruta de rechazo.",
        },
    )
    request_id = create.json()["id"]

    reject = client.post(f"/requests/{request_id}/reject")
    assert reject.status_code == 200
    assert reject.json()["status"] == "REJECTED"

    events = client.get(f"/requests/{request_id}/events")
    assert events.status_code == 200
    assert [item["event_type"] for item in events.json()] == ["REQUEST_CREATED", "REJECTED"]

    approve_after_reject = client.post(f"/requests/{request_id}/approve")
    assert approve_after_reject.status_code == 409


def test_users_are_persisted_and_summarized() -> None:
    users = client.get("/users")
    assert users.status_code == 200
    body = users.json()
    assert len(body) >= 5
    ana = next(item for item in body if item["email"] == "ana.perez@example.com")
    assert ana["request_count"] >= 1
    assert ana["completed_count"] >= 1
    assert "ERP Finanzas" in ana["systems"]


def test_requests_and_stats_are_available() -> None:
    requests = client.get("/requests")
    stats = client.get("/stats")

    assert requests.status_code == 200
    assert isinstance(requests.json(), list)
    assert stats.status_code == 200
    body = stats.json()
    assert body["total"] >= 5
    assert body["completed"] >= 1


def test_sqlite_file_contains_persisted_requests() -> None:
    with sqlite3.connect(TEST_DB) as connection:
        count = connection.execute("SELECT COUNT(*) FROM access_requests").fetchone()[0]
        event_count = connection.execute("SELECT COUNT(*) FROM request_events").fetchone()[0]
        user_count = connection.execute("SELECT COUNT(*) FROM users").fetchone()[0]

    assert count >= 5
    assert event_count >= 5
    assert user_count >= 5
