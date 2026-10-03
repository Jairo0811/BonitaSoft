# Mock Provisioning API

API local utilizada por la demo de Bonita para simular un sistema externo de aprovisionamiento.

## Ejecutar con Python

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# Linux/macOS
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Swagger/OpenAPI:

```text
http://localhost:8000/docs
```

## Ejecutar con Docker

```bash
docker build -t bonita-iso815-mock .
docker run --rm -p 8000:8000 bonita-iso815-mock
```

## Smoke test

```bash
curl http://localhost:8000/health
```

```bash
curl -X POST http://localhost:8000/provision \
  -H "Content-Type: application/json" \
  -d '{"request_id":"REQ-001","user_email":"demo@example.com","system":"ERP","access_level":"Lectura"}'
```

Consultar auditoría:

```bash
curl http://localhost:8000/audit/REQ-001
```

## Alcance

El almacenamiento es deliberadamente **in-memory** para una demo académica. Al reiniciar el servicio se pierden los registros. No se debe presentar esta API como un backend productivo.
