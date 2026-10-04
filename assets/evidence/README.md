# Evidencias de runtime — Bonita Studio

Guardar aquí las capturas y exportaciones que demuestren la ejecución real del proceso.

## Convención de nombres

```text
01-diagrama-studio.png
02-bdm-solicitud-acceso.png
03-organizacion-actores.png
04-formulario-inicio.png
05-human-task-aprobacion.png
06-gateway-decision.png
07-rest-connector.png
08-ruta-aprobada.png
09-audit-aprobada.png
10-ruta-rechazada.png
11-error-integracion.png
12-reintento-exitoso.png
13-historial-caso.png
```

## Qué debe demostrar cada evidencia

### 01 — Diagrama

Pool completo con tareas, gateway, REST y finales.

### 02 — BDM

Entidad `SolicitudAcceso` y sus atributos principales.

### 03 — Organización

Actores `Solicitante` y `Aprobador` correctamente mapeados.

### 04 — Inicio

Formulario/contrato con los datos de la solicitud.

### 05 — Aprobación

Tarea humana visible para el aprobador.

### 06 — Gateway

Condiciones de salida aprobada/rechazada.

### 07 — REST

Método, URL y configuración de body/headers del connector.

### 08–09 — Ruta aprobada

Caso completado, referencia `ACC-...` y auditoría coincidente en FastAPI.

### 10 — Ruta rechazada

Caso terminado como `RECHAZADA` sin aprovisionamiento.

### 11–12 — Error/reintento

Fallo técnico visible y recuperación posterior con el servicio restaurado.

### 13 — Historial

Trazabilidad del caso dentro del runtime de Bonita.

## Regla

No agregar capturas simuladas para sustituir evidencia de runtime. El dashboard React puede apoyar la exposición, pero no reemplaza la ejecución dentro de Bonita Studio.
