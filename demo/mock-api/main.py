from datetime import datetime, timedelta, timezone
from enum import Enum
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="BonitaSoft ISO-815 Mock Provisioning API",
    version="2.1.0",
    description="Servicio demostrativo para la integración REST y flujo local de solicitudes del proyecto BonitaSoft.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RequestStatus(str, Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"
    ERROR = "ERROR"


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


class AccessRequestCreate(BaseModel):
    requester_name: str = Field(min_length=2, max_length=120)
    user_email: EmailStr
    system: str = Field(min_length=2, max_length=100)
    access_level: str = Field(min_length=2, max_length=50)
    justification: str = Field(min_length=3, max_length=500)


class AccessRequest(BaseModel):
    id: str
    requester_name: str
    user_email: EmailStr
    system: str
    access_level: str
    justification: str
    status: RequestStatus
    created_at: datetime
    updated_at: datetime
    external_reference: str | None = None


class DashboardStats(BaseModel):
    total: int
    completed: int
    in_progress: int
    pending: int
    rejected: int
    error: int
    rest_requests: int


_records: dict[str, AuditRecord] = {}
_requests: dict[str, AccessRequest] = {}


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _new_request_id() -> str:
    return f"SA-{uuid4().hex[:6].upper()}"


def _seed_demo_requests() -> None:
    if _requests:
        return

    now = _now()
    seeds = [
        AccessRequest(
            id="SA-1048",
            requester_name="Ana Pérez",
            user_email="ana.perez@example.com",
            system="ERP Finanzas",
            access_level="Lectura",
            justification="Consulta de reportes financieros.",
            status=RequestStatus.COMPLETED,
            created_at=now - timedelta(hours=9),
            updated_at=now - timedelta(hours=8, minutes=42),
            external_reference="ACC-DEMO1048",
        ),
        AccessRequest(
            id="SA-1047",
            requester_name="Carlos Díaz",
            user_email="carlos.diaz@example.com",
            system="Mesa de Ayuda",
            access_level="Estándar",
            justification="Gestión de incidencias de soporte.",
            status=RequestStatus.PENDING_APPROVAL,
            created_at=now - timedelta(hours=6),
            updated_at=now - timedelta(hours=6),
        ),
        AccessRequest(
            id="SA-1046",
            requester_name="María Santos",
            user_email="maria.santos@example.com",
            system="Gestión Documental",
            access_level="Supervisor",
            justification="Revisión de documentos del área.",
            status=RequestStatus.PENDING_APPROVAL,
            created_at=now - timedelta(days=1, hours=2),
            updated_at=now - timedelta(days=1, hours=2),
        ),
        AccessRequest(
            id="SA-1045",
            requester_name="Luis Méndez",
            user_email="luis.mendez@example.com",
            system="Portal Interno",
            access_level="Administración",
            justification="Administración de contenidos internos.",
            status=RequestStatus.REJECTED,
            created_at=now - timedelta(days=1, hours=7),
            updated_at=now - timedelta(days=1, hours=6, minutes=34),
        ),
        AccessRequest(
            id="SA-1044",
            requester_name="Elena Ruiz",
            user_email="elena.ruiz@example.com",
            system="Inventario",
            access_level="Operación",
            justification="Operación del módulo de inventario.",
            status=RequestStatus.ERROR,
            created_at=now - timedelta(days=2, hours=3),
            updated_at=now - timedelta(days=2, hours=2, minutes=48),
        ),
    ]

    for item in seeds:
        _requests[item.id] = item


_seed_demo_requests()


def _provision(payload: ProvisionRequest) -> ProvisionResponse:
    if payload.request_id in _records:
        existing = _records[payload.request_id]
        return ProvisionResponse(
            request_id=existing.request_id,
            status=existing.status,
            external_reference=existing.external_reference,
            provisioned_at=existing.provisioned_at,
        )

    provisioned_at = _now()
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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/provision", response_model=ProvisionResponse, status_code=201)
def provision(payload: ProvisionRequest) -> ProvisionResponse:
    return _provision(payload)


@app.get("/audit", response_model=list[AuditRecord])
def list_audit() -> list[AuditRecord]:
    return sorted(_records.values(), key=lambda item: item.provisioned_at, reverse=True)


@app.get("/audit/{request_id}", response_model=AuditRecord)
def audit(request_id: str) -> AuditRecord:
    record = _records.get(request_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return record


@app.delete("/audit", status_code=204)
def clear_audit() -> None:
    _records.clear()


@app.get("/requests", response_model=list[AccessRequest])
def list_requests() -> list[AccessRequest]:
    return sorted(_requests.values(), key=lambda item: item.created_at, reverse=True)


@app.post("/requests", response_model=AccessRequest, status_code=201)
def create_request(payload: AccessRequestCreate) -> AccessRequest:
    now = _now()
    request = AccessRequest(
        id=_new_request_id(),
        requester_name=payload.requester_name,
        user_email=payload.user_email,
        system=payload.system,
        access_level=payload.access_level,
        justification=payload.justification,
        status=RequestStatus.PENDING_APPROVAL,
        created_at=now,
        updated_at=now,
    )
    _requests[request.id] = request
    return request


@app.post("/requests/{request_id}/approve", response_model=AccessRequest)
def approve_request(request_id: str) -> AccessRequest:
    request = _requests.get(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status == RequestStatus.REJECTED:
        raise HTTPException(status_code=409, detail="Rejected requests cannot be approved")
    if request.status == RequestStatus.COMPLETED:
        return request

    request.status = RequestStatus.IN_PROGRESS
    request.updated_at = _now()

    try:
        result = _provision(
            ProvisionRequest(
                request_id=request.id,
                user_email=request.user_email,
                system=request.system,
                access_level=request.access_level,
            )
        )
        request.status = RequestStatus.COMPLETED
        request.external_reference = result.external_reference
        request.updated_at = result.provisioned_at
    except Exception as exc:
        request.status = RequestStatus.ERROR
        request.updated_at = _now()
        raise HTTPException(status_code=502, detail="Provisioning failed") from exc

    return request


@app.post("/requests/{request_id}/reject", response_model=AccessRequest)
def reject_request(request_id: str) -> AccessRequest:
    request = _requests.get(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status == RequestStatus.COMPLETED:
        raise HTTPException(status_code=409, detail="Completed requests cannot be rejected")

    request.status = RequestStatus.REJECTED
    request.updated_at = _now()
    return request


@app.post("/requests/{request_id}/retry", response_model=AccessRequest)
def retry_request(request_id: str) -> AccessRequest:
    request = _requests.get(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status != RequestStatus.ERROR:
        raise HTTPException(status_code=409, detail="Only requests in ERROR can be retried")
    return approve_request(request_id)


@app.get("/stats", response_model=DashboardStats)
def dashboard_stats() -> DashboardStats:
    values = list(_requests.values())
    return DashboardStats(
        total=len(values),
        completed=sum(item.status == RequestStatus.COMPLETED for item in values),
        in_progress=sum(item.status == RequestStatus.IN_PROGRESS for item in values),
        pending=sum(item.status == RequestStatus.PENDING_APPROVAL for item in values),
        rejected=sum(item.status == RequestStatus.REJECTED for item in values),
        error=sum(item.status == RequestStatus.ERROR for item in values),
        rest_requests=len(_records),
    )
