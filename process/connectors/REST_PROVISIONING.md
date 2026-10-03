# Integración REST — Aprovisionamiento de acceso

## Objetivo

La ruta aprobada del proceso consumirá un servicio REST para demostrar integración de aplicaciones.

El repositorio incluye una API demostrativa en `demo/mock-api/`.

## Endpoint

```http
POST http://localhost:8000/provision
Content-Type: application/json
```

### Request

```json
{
  "request_id": "REQ-001",
  "user_email": "persona@example.com",
  "system": "ERP",
  "access_level": "Lectura"
}
```

### Response esperada

```json
{
  "request_id": "REQ-001",
  "status": "PROVISIONED",
  "external_reference": "ACC-..."
}
```

## Configuración conceptual en Bonita

1. Seleccionar la actividad automática `Provisionar acceso`.
2. Agregar un REST connector POST.
3. Configurar URL mediante parámetro de ambiente, no valor rígido en producción.
4. Enviar `application/json`.
5. Construir el payload a partir del Business Data Model.
6. Procesar el código HTTP y JSON retornado.
7. Guardar `external_reference` y actualizar estado.

## Manejo de errores

- Timeout → error técnico / reintento controlado.
- HTTP 4xx → revisar datos o configuración; no marcar como completada.
- HTTP 5xx → ruta de error/reintento.
- JSON inválido → error de integración.
- Servicio no disponible → tarea manual de resolución.

## Seguridad

Para la demo local no se implementa autenticación. Una implantación real debe utilizar HTTPS y un esquema de autenticación apropiado (token, OAuth2, credenciales de servicio u otro mecanismo según el API), además de administración segura de secretos.

## Evidencia esperada

La demo debe mostrar:

- payload enviado;
- respuesta recibida;
- referencia externa almacenada;
- estado final del caso;
- comportamiento cuando la API no está disponible.

## Fuente

Bonita Documentation — REST connectors: https://documentation.bonitasoft.com/bonita/2024.1/process/rest-connector
