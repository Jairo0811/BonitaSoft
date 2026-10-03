from datetime import datetime, timezone
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="BonitaSoft ISO-815 Mock Provisioning API",
    version="1.0.0",
    description="Servicio demostrativo para la integración REST del proceso Bonita.",
)


class ProvisionRequest(BaseModel):
    request_id: str = Field(min_length=1, max_length=100)
    user_email: EmailStr
    system: str = Field(min_length=1, max_length=100)
    access_level: str = Field(min_length=1, max_length=50)


class ProvisionResponse(BaseModel):
    request_id: str
    status: str
    external_reference: str
    provisioned_at: datetime


class AuditRecord(BaseModel):
    request_id: str
    user_email: EmailStr
    system: str
    access_level: str
    status: str
    external_reference: str
    provisioned_at: datetime


_records: dict[str, AuditRecord] = {}


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/provision", response_model=ProvisionResponse, status_code=201)
def provision(payload: ProvisionRequest) -> ProvisionResponse:
    if payload.request_id in _records:
        existing = _records[payload.request_id]
        return ProvisionResponse(
            request_id=existing.request_id,
            status=existing.status,
            external_reference=existing.external_reference,
            provisioned_at=existing.provisioned_at,
        )

    provisioned_at = datetime.now(timezone.utc)
    external_reference = f"ACC-{uuid4().hex[:12].upper()}"

    record = AuditRecord(
        request_id=payload.request_id,
        user_email=payload.user_email,
        system=payload.system,
        access_level=payload.access_level,
        status="PROVISIONED",
        external_reference=external_reference,
        provisioned_at=provisioned_at,
    )
    _records[payload.request_id] = record

    return ProvisionResponse(
        request_id=record.request_id,
        status=record.status,
        external_reference=record.external_reference,
        provisioned_at=record.provisioned_at,
    )


@app.get("/audit/{request_id}", response_model=AuditRecord)
def audit(request_id: str) -> AuditRecord:
    record = _records.get(request_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return record


@app.delete("/audit", status_code=204)
def clear_audit() -> None:
    _records.clear()
