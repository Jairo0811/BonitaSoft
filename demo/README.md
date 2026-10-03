# Demo — Solicitud de acceso

Esta carpeta contiene los recursos prácticos para complementar la investigación del primer parcial.

## Contenido

- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — guion de demostración.
- [`TEST_CASES.md`](TEST_CASES.md) — casos de prueba end-to-end.
- [`mock-api/`](mock-api/) — servicio FastAPI que simula el sistema externo de aprovisionamiento.

## Flujo

```text
Bonita
  ↓ POST /provision
Mock FastAPI
  ↓
201 PROVISIONED + external_reference
  ↓
Bonita guarda resultado y cierra el caso
```

## Arranque rápido de la API

```bash
cd demo/mock-api
python -m venv .venv
# activar entorno virtual
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Comprobar:

```text
GET http://localhost:8000/health
```

Swagger:

```text
http://localhost:8000/docs
```

## Pruebas de la API

```bash
pip install -r requirements-dev.txt
pytest -q
```

También existe CI en `.github/workflows/mock-api-ci.yml`.

## Límite del repositorio

La API de apoyo, especificaciones y modelo BPMN de referencia pueden prepararse desde Git. El proceso **ejecutable de Bonita** debe validarse en Bonita Studio porque allí se configuran elementos propios de la plataforma: BDM, contratos, organización, formularios y connectors.
