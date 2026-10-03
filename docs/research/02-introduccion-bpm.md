# 2. Introducción a BPM

## Concepto

**BPM (Business Process Management / Gestión de Procesos de Negocio)** es una disciplina para identificar, diseñar, ejecutar, medir, analizar y mejorar procesos de una organización. Su objetivo no es solamente dibujar diagramas, sino administrar el ciclo de vida de los procesos y hacer visible cómo fluye el trabajo entre personas y sistemas.

## Ciclo de vida BPM

Un ciclo típico puede expresarse así:

```text
Descubrir → Modelar → Implementar → Ejecutar → Medir → Mejorar
     ↑                                                   │
     └───────────────────────────────────────────────────┘
```

### Descubrimiento
Se entiende el proceso actual, actores, reglas, datos y problemas.

### Modelado
Se representa el flujo mediante una notación comprensible y verificable.

### Implementación
El modelo se convierte en un proceso ejecutable, incluyendo formularios, reglas, datos e integraciones.

### Ejecución
Usuarios y sistemas participan en instancias reales del proceso.

### Monitoreo
Se revisan estados, tiempos, fallos y cargas de trabajo.

### Optimización
La evidencia de ejecución se utiliza para mejorar el proceso.

## BPMN

**BPMN (Business Process Model and Notation)** es la notación gráfica utilizada ampliamente para representar procesos. Entre sus elementos se encuentran:

- eventos de inicio y fin;
- tareas humanas y automáticas;
- gateways de decisión y paralelismo;
- secuencias;
- pools y lanes;
- temporizadores;
- eventos de mensaje y error;
- subprocesos.

Bonita Studio permite modelar procesos mediante BPMN y asociar a esos elementos la configuración necesaria para ejecutarlos.

## BPM frente a workflow

Un workflow representa el flujo de tareas. BPM abarca un alcance mayor: incluye modelado, reglas, datos, integración, ejecución, control, trazabilidad y mejora continua.

## BPM y Bonita

Bonita combina:

- modelado del proceso;
- organización y actores;
- Business Data Model;
- contratos de entrada;
- formularios y páginas;
- conectores;
- runtime de ejecución;
- administración y seguimiento.

Esto permite pasar del diagrama a una aplicación basada en procesos.

## Aplicación al proyecto

El proceso demostrativo de ISO-815 seguirá el patrón:

```text
Solicitud → Validación → Revisión humana → Decisión
                                      ├─ Rechazo → Cierre
                                      └─ Aprobación → Integración REST → Cierre
```

## Fuentes

- Bonita Documentation — Bonita components: https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- Bonita Documentation — Project structure: https://documentation-bonita.netlify.app/bonita/2025.1/bonita-overview/project-structure
