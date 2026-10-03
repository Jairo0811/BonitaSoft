# Especificación de formularios y contratos

## 1. Formulario de inicio — Nueva solicitud

Campos:

| Campo | Tipo | Obligatorio | Validación |
|---|---|---:|---|
| Nombre | texto | Sí | 3–120 caracteres |
| Correo | email | Sí | formato email |
| Departamento | texto/lista | Sí | valor no vacío |
| Sistema solicitado | lista | Sí | catálogo definido |
| Nivel de acceso | lista | Sí | Lectura / Operación / Administración |
| Justificación | textarea | Sí | mínimo 20 caracteres |

### Contrato sugerido

```text
requestInput
  nombreSolicitante: TEXT
  correo: TEXT
  departamento: TEXT
  sistema: TEXT
  nivelAcceso: TEXT
  justificacion: TEXT
```

## 2. Formulario de aprobación

Debe mostrar la solicitud en modo lectura y permitir:

- `aprobada`: Boolean / radio Aprobar-Rechazar.
- `comentarioAprobador`: texto.

Regla: comentario obligatorio si `aprobada == false`.

### Contrato sugerido

```text
decisionInput
  aprobada: BOOLEAN
  comentarioAprobador: TEXT
```

## 3. Vista de cierre

Mostrar:

- ID de solicitud;
- estado final;
- decisión;
- comentario;
- referencia externa cuando aplique;
- fecha de cierre.

## UX mínima

- Etiquetas claras.
- Validación junto al campo.
- No solicitar información que ya posee el proceso.
- Diferenciar errores funcionales de errores de integración.
- Confirmar visualmente el envío exitoso.

## Mapeo a Bonita

1. Definir el contrato antes de generar el formulario.
2. Crear el formulario de instanciación desde el pool.
3. Crear el formulario de tarea desde la Human Task.
4. Mapear el contrato hacia el BDM mediante operaciones.
5. Validar expresiones y ejecutar el proceso localmente.

## Fuente

Bonita Documentation — Create or modify UI elements: https://documentation.bonitasoft.com/bonita/next/pages-and-forms/create-or-modify-a-page
