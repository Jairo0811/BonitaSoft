from __future__ import annotations

import os
import sqlite3
from datetime import datetime, timedelta, timezone
from enum import Enum
from pathlib import Path
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="BonitaSoft ISO-815 Mock Provisioning API",
    version="3.0.0",
    description="Servicio demostrativo persistente para la integración REST y flujo local de solicitudes del proyecto BonitaSoft.",
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

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("BONITASOFT_DB_PATH", str(BASE_DIR / "data" / "bonitasoft.db")))
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


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


class RequestEvent(BaseModel):
    id: int
    request_id: str
    event_type: str
    from_status: str | None = None
    to_status: str | None = None
    message: str
    occurred_at: datetime


class UserSummary(BaseModel):
    name: str
    email: EmailStr
    request_count: int
    completed_count: int
    systems: list[str]
    last_activity: datetime


class DashboardStats(BaseModel):
    total: int
    completed: int
    in_progress: int
    pending: int
    rejected: int
    error: int
    rest_requests: int


def _now() -> datetime:
    return datetime.now(timezone.utc)


def _iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).isoformat()


def _parse_dt(value: str) -> datetime:
    return datetime.fromisoformat(value)


def _connect() -> sqlite3.Connection:
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def _new_request_id() -> str:
    return f"SA-{uuid4().hex[:6].upper()}"


def _row_to_request(row: sqlite3.Row) -> AccessRequest:
    return AccessRequest(
        id=row["id"],
        requester_name=row["requester_name"],
        user_email=row["user_email"],
        system=row["system"],
        access_level=row["access_level"],
        justification=row["justification"],
        status=RequestStatus(row["status"]),
        created_at=_parse_dt(row["created_at"]),
        updated_at=_parse_dt(row["updated_at"]),
        external_reference=row["external_reference"],
    )


def _row_to_audit(row: sqlite3.Row) -> AuditRecord:
    return AuditRecord(
        request_id=row["request_id"],
        user_email=row["user_email"],
        system=row["system"],
        access_level=row["access_level"],
        status=row["status"],
        external_reference=row["external_reference"],
        provisioned_at=_parse_dt(row["provisioned_at"]),
    )


def _row_to_event(row: sqlite3.Row) -> RequestEvent:
    return RequestEvent(
        id=row["id"],
        request_id=row["request_id"],
        event_type=row["event_type"],
        from_status=row["from_status"],
        to_status=row["to_status"],
        message=row["message"],
        occurred_at=_parse_dt(row["occurred_at"]),
    )


def _upsert_user(connection: sqlite3.Connection, name: str, email: str, when: datetime) -> None:
    connection.execute(
        """
        INSERT INTO users (email, name, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(email) DO UPDATE SET
            name = excluded.name,
            updated_at = excluded.updated_at
        """,
        (email, name, _iso(when), _iso(when)),
    )


def _record_event(
    connection: sqlite3.Connection,
    request_id: str,
    event_type: str,
    message: str,
    *,
    from_status: str | None = None,
    to_status: str | None = None,
    occurred_at: datetime | None = None,
) -> None:
    connection.execute(
        """
        INSERT INTO request_events (
            request_id, event_type, from_status, to_status, message, occurred_at
        ) VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            request_id,
            event_type,
            from_status,
            to_status,
            message,
            _iso(occurred_at or _now()),
        ),
    )


def _init_db() -> None:
    with _connect() as connection:
        connection.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                email TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS access_requests (
                id TEXT PRIMARY KEY,
                requester_name TEXT NOT NULL,
                user_email TEXT NOT NULL,
                system TEXT NOT NULL,
                access_level TEXT NOT NULL,
                justification TEXT NOT NULL,
                status TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                external_reference TEXT,
                FOREIGN KEY (user_email) REFERENCES users(email)
            );

            CREATE TABLE IF NOT EXISTS audit_records (
                request_id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL,
                system TEXT NOT NULL,
                access_level TEXT NOT NULL,
                status TEXT NOT NULL,
                external_reference TEXT NOT NULL,
                provisioned_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS request_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                request_id TEXT NOT NULL,
                event_type TEXT NOT NULL,
                from_status TEXT,
                to_status TEXT,
                message TEXT NOT NULL,
                occurred_at TEXT NOT NULL
            );

            CREATE INDEX IF NOT EXISTS idx_requests_status ON access_requests(status);
            CREATE INDEX IF NOT EXISTS idx_requests_email ON access_requests(user_email);
            CREATE INDEX IF NOT EXISTS idx_events_request ON request_events(request_id, occurred_at);
            """
        )

        existing = connection.execute("SELECT COUNT(*) AS total FROM access_requests").fetchone()["total"]
        if existing:
            return

        now = _now()
        seeds = [
            {
                "id": "SA-1048",
                "requester_name": "Ana Pérez",
                "user_email": "ana.perez@example.com",
                "system": "ERP Finanzas",
                "access_level": "Lectura",
                "justification": "Consulta de reportes financieros.",
                "status": RequestStatus.COMPLETED.value,
                "created_at": now - timedelta(hours=9),
                "updated_at": now - timedelta(hours=8, minutes=42),
                "external_reference": "ACC-DEMO1048",
            },
            {
                "id": "SA-1047",
                "requester_name": "Carlos Díaz",
                "user_email": "carlos.diaz@example.com",
                "system": "Mesa de Ayuda",
                "access_level": "Estándar",
                "justification": "Gestión de incidencias de soporte.",
                "status": RequestStatus.PENDING_APPROVAL.value,
                "created_at": now - timedelta(hours=6),
                "updated_at": now - timedelta(hours=6),
                "external_reference": None,
            },
            {
                "id": "SA-1046",
                "requester_name": "María Santos",
                "user_email": "maria.santos@example.com",
                "system": "Gestión Documental",
                "access_level": "Supervisor",
                "justification": "Revisión de documentos del área.",
                "status": RequestStatus.PENDING_APPROVAL.value,
                "created_at": now - timedelta(days=1, hours=2),
                "updated_at": now - timedelta(days=1, hours=2),
                "external_reference": None,
            },
            {
                "id": "SA-1045",
                "requester_name": "Luis Méndez",
                "user_email": "luis.mendez@example.com",
                "system": "Portal Interno",
                "access_level": "Administración",
                "justification": "Administración de contenidos internos.",
                "status": RequestStatus.REJECTED.value,
                "created_at": now - timedelta(days=1, hours=7),
                "updated_at": now - timedelta(days=1, hours=6, minutes=34),
                "external_reference": None,
            },
            {
                "id": "SA-1044",
                "requester_name": "Elena Ruiz",
                "user_email": "elena.ruiz@example.com",
                "system": "Inventario",
                "access_level": "Operación",
                "justification": "Operación del módulo de inventario.",
                "status": RequestStatus.ERROR.value,
                "created_at": now - timedelta(days=2, hours=3),
                "updated_at": now - timedelta(days=2, hours=2, minutes=48),
                "external_reference": None,
            },
        ]

        for seed in seeds:
            _upsert_user(connection, seed["requester_name"], seed["user_email"], seed["updated_at"])
            connection.execute(
                """
                INSERT INTO access_requests (
                    id, requester_name, user_email, system, access_level,
                    justification, status, created_at, updated_at, external_reference
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    seed["id"],
                    seed["requester_name"],
                    seed["user_email"],
                    seed["system"],
                    seed["access_level"],
                    seed["justification"],
                    seed["status"],
                    _iso(seed["created_at"]),
                    _iso(seed["updated_at"]),
                    seed["external_reference"],
                ),
            )
            _record_event(
                connection,
                seed["id"],
                "REQUEST_CREATED",
                "Solicitud registrada en el proceso.",
                to_status=RequestStatus.PENDING_APPROVAL.value,
                occurred_at=seed["created_at"],
            )

        completed = seeds[0]
        connection.execute(
            """
            INSERT INTO audit_records (
                request_id, user_email, system, access_level, status,
                external_reference, provisioned_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                completed["id"],
                completed["user_email"],
                completed["system"],
                completed["access_level"],
                "PROVISIONED",
                completed["external_reference"],
                _iso(completed["updated_at"]),
            ),
        )
        _record_event(
            connection,
            completed["id"],
            "APPROVED",
            "Solicitud aprobada por el responsable.",
            from_status=RequestStatus.PENDING_APPROVAL.value,
            to_status=RequestStatus.IN_PROGRESS.value,
            occurred_at=completed["updated_at"] - timedelta(minutes=2),
        )
        _record_event(
            connection,
            completed["id"],
            "PROVISIONED",
            "Acceso aprovisionado y cierre exitoso.",
            from_status=RequestStatus.IN_PROGRESS.value,
            to_status=RequestStatus.COMPLETED.value,
            occurred_at=completed["updated_at"],
        )

        rejected = seeds[3]
        _record_event(
            connection,
            rejected["id"],
            "REJECTED",
            "Solicitud rechazada por el responsable.",
            from_status=RequestStatus.PENDING_APPROVAL.value,
            to_status=RequestStatus.REJECTED.value,
            occurred_at=rejected["updated_at"],
        )

        failed = seeds[4]
        _record_event(
            connection,
            failed["id"],
            "APPROVED",
            "Solicitud aprobada; se inicia aprovisionamiento.",
            from_status=RequestStatus.PENDING_APPROVAL.value,
            to_status=RequestStatus.IN_PROGRESS.value,
            occurred_at=failed["updated_at"] - timedelta(minutes=1),
        )
        _record_event(
            connection,
            failed["id"],
            "PROVISION_FAILED",
            "La integración REST no pudo completar el aprovisionamiento.",
            from_status=RequestStatus.IN_PROGRESS.value,
            to_status=RequestStatus.ERROR.value,
            occurred_at=failed["updated_at"],
        )


_init_db()


def _get_request(request_id: str) -> AccessRequest | None:
    with _connect() as connection:
        row = connection.execute("SELECT * FROM access_requests WHERE id = ?", (request_id,)).fetchone()
    return _row_to_request(row) if row else None


def _provision(payload: ProvisionRequest) -> ProvisionResponse:
    with _connect() as connection:
        existing = connection.execute(
            "SELECT * FROM audit_records WHERE request_id = ?",
            (payload.request_id,),
        ).fetchone()
        if existing:
            record = _row_to_audit(existing)
            return ProvisionResponse(
                request_id=record.request_id,
                status=record.status,
                external_reference=record.external_reference,
                provisioned_at=record.provisioned_at,
            )

        provisioned_at = _now()
        external_reference = f"ACC-{uuid4().hex[:12].upper()}"
        connection.execute(
            """
            INSERT INTO audit_records (
                request_id, user_email, system, access_level, status,
                external_reference, provisioned_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (
                payload.request_id,
                str(payload.user_email),
                payload.system,
                payload.access_level,
                "PROVISIONED",
                external_reference,
                _iso(provisioned_at),
            ),
        )

    return ProvisionResponse(
        request_id=payload.request_id,
        status="PROVISIONED",
        external_reference=external_reference,
        provisioned_at=provisioned_at,
    )


@app.get("/health")
def health() -> dict[str, str]:
    with _connect() as connection:
        connection.execute("SELECT 1").fetchone()
    return {"status": "ok"}


@app.post("/provision", response_model=ProvisionResponse, status_code=201)
def provision(payload: ProvisionRequest) -> ProvisionResponse:
    return _provision(payload)


@app.get("/audit", response_model=list[AuditRecord])
def list_audit() -> list[AuditRecord]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM audit_records ORDER BY provisioned_at DESC"
        ).fetchall()
    return [_row_to_audit(row) for row in rows]


@app.get("/audit/{request_id}", response_model=AuditRecord)
def audit(request_id: str) -> AuditRecord:
    with _connect() as connection:
        row = connection.execute(
            "SELECT * FROM audit_records WHERE request_id = ?",
            (request_id,),
        ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Request not found")
    return _row_to_audit(row)


@app.delete("/audit", status_code=204)
def clear_audit() -> None:
    with _connect() as connection:
        connection.execute("DELETE FROM audit_records")


@app.get("/requests", response_model=list[AccessRequest])
def list_requests() -> list[AccessRequest]:
    with _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM access_requests ORDER BY created_at DESC"
        ).fetchall()
    return [_row_to_request(row) for row in rows]


@app.get("/requests/{request_id}", response_model=AccessRequest)
def get_request(request_id: str) -> AccessRequest:
    request = _get_request(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    return request


@app.get("/requests/{request_id}/events", response_model=list[RequestEvent])
def list_request_events(request_id: str) -> list[RequestEvent]:
    if _get_request(request_id) is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    with _connect() as connection:
        rows = connection.execute(
            "SELECT * FROM request_events WHERE request_id = ? ORDER BY occurred_at ASC, id ASC",
            (request_id,),
        ).fetchall()
    return [_row_to_event(row) for row in rows]


@app.post("/requests", response_model=AccessRequest, status_code=201)
def create_request(payload: AccessRequestCreate) -> AccessRequest:
    now = _now()
    request_id = _new_request_id()
    with _connect() as connection:
        _upsert_user(connection, payload.requester_name, str(payload.user_email), now)
        connection.execute(
            """
            INSERT INTO access_requests (
                id, requester_name, user_email, system, access_level,
                justification, status, created_at, updated_at, external_reference
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
            """,
            (
                request_id,
                payload.requester_name,
                str(payload.user_email),
                payload.system,
                payload.access_level,
                payload.justification,
                RequestStatus.PENDING_APPROVAL.value,
                _iso(now),
                _iso(now),
            ),
        )
        _record_event(
            connection,
            request_id,
            "REQUEST_CREATED",
            "Solicitud creada y enviada a aprobación.",
            to_status=RequestStatus.PENDING_APPROVAL.value,
            occurred_at=now,
        )

    request = _get_request(request_id)
    assert request is not None
    return request


def _transition_to_in_progress(request: AccessRequest, event_type: str, message: str) -> AccessRequest:
    now = _now()
    with _connect() as connection:
        connection.execute(
            "UPDATE access_requests SET status = ?, updated_at = ? WHERE id = ?",
            (RequestStatus.IN_PROGRESS.value, _iso(now), request.id),
        )
        _record_event(
            connection,
            request.id,
            event_type,
            message,
            from_status=request.status.value,
            to_status=RequestStatus.IN_PROGRESS.value,
            occurred_at=now,
        )
    updated = _get_request(request.id)
    assert updated is not None
    return updated


def _complete_request(request: AccessRequest, result: ProvisionResponse) -> AccessRequest:
    with _connect() as connection:
        connection.execute(
            """
            UPDATE access_requests
            SET status = ?, external_reference = ?, updated_at = ?
            WHERE id = ?
            """,
            (
                RequestStatus.COMPLETED.value,
                result.external_reference,
                _iso(result.provisioned_at),
                request.id,
            ),
        )
        _record_event(
            connection,
            request.id,
            "PROVISIONED",
            f"Acceso aprovisionado. Referencia {result.external_reference}.",
            from_status=RequestStatus.IN_PROGRESS.value,
            to_status=RequestStatus.COMPLETED.value,
            occurred_at=result.provisioned_at,
        )
    completed = _get_request(request.id)
    assert completed is not None
    return completed


def _mark_error(request: AccessRequest, message: str) -> None:
    now = _now()
    with _connect() as connection:
        connection.execute(
            "UPDATE access_requests SET status = ?, updated_at = ? WHERE id = ?",
            (RequestStatus.ERROR.value, _iso(now), request.id),
        )
        _record_event(
            connection,
            request.id,
            "PROVISION_FAILED",
            message,
            from_status=RequestStatus.IN_PROGRESS.value,
            to_status=RequestStatus.ERROR.value,
            occurred_at=now,
        )


@app.post("/requests/{request_id}/approve", response_model=AccessRequest)
def approve_request(request_id: str) -> AccessRequest:
    request = _get_request(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status == RequestStatus.REJECTED:
        raise HTTPException(status_code=409, detail="Rejected requests cannot be approved")
    if request.status == RequestStatus.COMPLETED:
        return request

    in_progress = _transition_to_in_progress(
        request,
        "APPROVED" if request.status != RequestStatus.ERROR else "RETRY_STARTED",
        "Solicitud aprobada; se inicia aprovisionamiento."
        if request.status != RequestStatus.ERROR
        else "Reintento manual de aprovisionamiento iniciado.",
    )

    try:
        result = _provision(
            ProvisionRequest(
                request_id=in_progress.id,
                user_email=in_progress.user_email,
                system=in_progress.system,
                access_level=in_progress.access_level,
            )
        )
        return _complete_request(in_progress, result)
    except Exception as exc:
        _mark_error(in_progress, "La integración REST no pudo completar el aprovisionamiento.")
        raise HTTPException(status_code=502, detail="Provisioning failed") from exc


@app.post("/requests/{request_id}/reject", response_model=AccessRequest)
def reject_request(request_id: str) -> AccessRequest:
    request = _get_request(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status == RequestStatus.COMPLETED:
        raise HTTPException(status_code=409, detail="Completed requests cannot be rejected")

    now = _now()
    with _connect() as connection:
        connection.execute(
            "UPDATE access_requests SET status = ?, updated_at = ? WHERE id = ?",
            (RequestStatus.REJECTED.value, _iso(now), request.id),
        )
        _record_event(
            connection,
            request.id,
            "REJECTED",
            "Solicitud rechazada por el responsable.",
            from_status=request.status.value,
            to_status=RequestStatus.REJECTED.value,
            occurred_at=now,
        )

    rejected = _get_request(request.id)
    assert rejected is not None
    return rejected


@app.post("/requests/{request_id}/retry", response_model=AccessRequest)
def retry_request(request_id: str) -> AccessRequest:
    request = _get_request(request_id)
    if request is None:
        raise HTTPException(status_code=404, detail="Access request not found")
    if request.status != RequestStatus.ERROR:
        raise HTTPException(status_code=409, detail="Only requests in ERROR can be retried")
    return approve_request(request_id)


@app.get("/users", response_model=list[UserSummary])
def list_users() -> list[UserSummary]:
    with _connect() as connection:
        users = connection.execute(
            """
            SELECT
                u.name,
                u.email,
                COUNT(r.id) AS request_count,
                SUM(CASE WHEN r.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed_count,
                MAX(r.updated_at) AS last_activity
            FROM users u
            LEFT JOIN access_requests r ON r.user_email = u.email
            GROUP BY u.email, u.name
            ORDER BY last_activity DESC, u.name ASC
            """
        ).fetchall()

        result: list[UserSummary] = []
        for user in users:
            system_rows = connection.execute(
                "SELECT DISTINCT system FROM access_requests WHERE user_email = ? ORDER BY system",
                (user["email"],),
            ).fetchall()
            result.append(
                UserSummary(
                    name=user["name"],
                    email=user["email"],
                    request_count=int(user["request_count"] or 0),
                    completed_count=int(user["completed_count"] or 0),
                    systems=[row["system"] for row in system_rows],
                    last_activity=_parse_dt(user["last_activity"] or _iso(_now())),
                )
            )
    return result


@app.get("/stats", response_model=DashboardStats)
def dashboard_stats() -> DashboardStats:
    with _connect() as connection:
        counts = connection.execute(
            """
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress,
                SUM(CASE WHEN status = 'PENDING_APPROVAL' THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected,
                SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) AS error
            FROM access_requests
            """
        ).fetchone()
        rest_requests = connection.execute("SELECT COUNT(*) AS total FROM audit_records").fetchone()["total"]

    return DashboardStats(
        total=int(counts["total"] or 0),
        completed=int(counts["completed"] or 0),
        in_progress=int(counts["in_progress"] or 0),
        pending=int(counts["pending"] or 0),
        rejected=int(counts["rejected"] or 0),
        error=int(counts["error"] or 0),
        rest_requests=int(rest_requests or 0),
    )
