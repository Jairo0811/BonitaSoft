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
