# Guion de demostración — Primer parcial

## Preparación

1. Iniciar la Mock Provisioning API.
2. Verificar `GET /health`.
3. Abrir Bonita Studio con el proyecto del equipo.
4. Confirmar organización/actores y proceso desplegado en runtime de desarrollo.
5. Tener preparados dos casos: aprobado y rechazado.

## Demo A — Ruta aprobada

### 1. Crear solicitud

Datos sugeridos:

```text
Nombre: Usuario Demo
Correo: demo@example.com
Departamento: Tecnología
Sistema: ERP
Nivel: Lectura
Justificación: Requiere consultar información para sus funciones.
```

### 2. Mostrar instancia

Explicar que el caso tiene un ID y que la información pasa al BDM.

### 3. Completar tarea humana

El usuario aprobador abre la tarea `Revisar y decidir solicitud`, selecciona **Aprobar** y agrega un comentario.

### 4. Mostrar gateway

Explicar que la decisión dirige la instancia hacia la integración.

### 5. Integración REST

Bonita ejecuta `POST /provision` contra la API local.

Resultado esperado:

```json
{
  "status": "PROVISIONED",
  "external_reference": "ACC-..."
}
```

### 6. Cierre

Mostrar:

- estado COMPLETADA;
- referencia externa;
- historial/tareas del caso;
- registro de auditoría de la API.

## Demo B — Ruta rechazada

1. Crear segunda solicitud.
2. Aprobador selecciona **Rechazar**.
3. Introducir comentario obligatorio.
4. Mostrar que el gateway evita llamar a `/provision`.
5. Verificar estado RECHAZADA.

## Demo C — Error de integración

1. Detener temporalmente la API local.
2. Aprobar una solicitud.
3. Mostrar el fallo del conector.
4. Explicar la ruta de resolución/reintento.
5. Reiniciar API y reintentar según la implementación en Studio.

## Cierre oral

La demo debe conectar tres conceptos:

- **BPM:** controla el ciclo de vida de la solicitud.
- **BPMN:** expresa tareas, decisión y rutas.
- **SOA/Integración:** el proceso consume un servicio externo mediante REST.

## Importante

El repositorio contiene el modelo, contratos, API de apoyo y guion. La ejecución real debe hacerse desde Bonita Studio; no afirmar que el `.bpmn` de referencia es por sí solo el artefacto ejecutable de Bonita.
