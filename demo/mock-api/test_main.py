from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


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


def test_create_and_approve_access_request() -> None:
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

    approve = client.post(f"/requests/{created['id']}/approve")
    assert approve.status_code == 200
    approved = approve.json()
    assert approved["status"] == "COMPLETED"
    assert approved["external_reference"].startswith("ACC-")

    audit = client.get(f"/audit/{created['id']}")
    assert audit.status_code == 200
    assert audit.json()["status"] == "PROVISIONED"


def test_create_and_reject_access_request() -> None:
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

    approve_after_reject = client.post(f"/requests/{request_id}/approve")
    assert approve_after_reject.status_code == 409


def test_requests_and_stats_are_available() -> None:
    requests = client.get("/requests")
    stats = client.get("/stats")

    assert requests.status_code == 200
    assert isinstance(requests.json(), list)
    assert stats.status_code == 200
    body = stats.json()
    assert body["total"] >= 5
    assert body["completed"] >= 1
