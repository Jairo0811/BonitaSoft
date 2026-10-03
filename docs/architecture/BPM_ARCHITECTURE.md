# Arquitectura BPM inicial

## Propósito

Definir la arquitectura conceptual del proceso que será implementado en Bonita para ISO-815.

## Flujo de referencia

```text
Solicitud
   ↓
Validación
   ↓
Aprobación humana
   ↓
Decisión
 ┌───────┴────────┐
 ▼                ▼
Aprobada        Rechazada
 │
 ▼
Integración / Servicio
 │
 ▼
Cierre + Auditoría
```

## Componentes previstos

### Actor solicitante
Inicia el proceso y suministra la información requerida.

### Validación
Comprueba que la solicitud contenga los datos mínimos y que pueda continuar.

### Aprobador
Ejecuta una tarea humana y toma una decisión sobre la solicitud.

### Gateway de decisión
Separa la ruta aprobada de la ruta rechazada.

### Integración
Consume un servicio o API para demostrar integración de aplicaciones.

### Auditoría
Registra el resultado final, decisiones y evidencias del proceso.

## Principios

- El proceso debe ser demostrable end-to-end.
- Debe incluir interacción humana real.
- Debe existir al menos una decisión BPMN.
- Debe existir al menos una integración con otro servicio o aplicación.
- Las rutas de error y rechazo deben ser explícitas.
- La documentación debe corresponder con la implementación real.
