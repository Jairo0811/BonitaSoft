# 6. Componentes principales

Este apartado descompone Bonita desde una perspectiva técnica y de proyecto.

## 6.1 Diagramas y procesos

Los diagramas BPMN describen el flujo del proceso. Incluyen tareas, eventos, gateways, secuencias, actores y configuración de ejecución.

## 6.2 Bonita Engine

El motor es responsable de ejecutar procesos, administrar estados, tareas, transacciones y trabajo interno del runtime.

## 6.3 Business Data Model

Define las entidades persistentes del dominio. Bonita separa el almacenamiento interno del motor de los datos de negocio; la documentación describe un almacenamiento compuesto por base de datos del core y base dedicada a Business Data.

## 6.4 Organización

Representa usuarios, grupos, roles y membresías. Los actores de un proceso se mapean hacia esta estructura para resolver quién puede ejecutar cada tarea humana.

## 6.5 Contratos

Los contratos definen la estructura de datos que un formulario o consumidor debe suministrar para iniciar un proceso o completar una tarea.

## 6.6 Formularios y páginas

Los formularios recopilan información vinculada al proceso; las páginas se utilizan para construir aplicaciones y vistas de negocio.

## 6.7 Conectores

Automatizan la interacción con sistemas externos. Un conector puede ejecutarse asociado a una actividad y procesar una respuesta o producir datos para pasos posteriores.

## 6.8 Actor Filters

Permiten resolver de manera dinámica qué usuario o conjunto de usuarios puede ejecutar una tarea.

## 6.9 REST API y extensiones

El runtime expone APIs para operar sobre procesos, tareas y datos. Cuando las APIs estándar no son suficientes, pueden desarrollarse **REST API Extensions**.

## 6.10 Aplicaciones, layouts y themes

Una aplicación basada en procesos combina páginas, navegación, layout y apariencia. Estos elementos permiten separar la experiencia de usuario de la lógica BPMN.

## 6.11 Apache Tomcat y Java

La línea 2025.1 documenta **Java 17** y Apache Tomcat 9.0.x como base del runtime soportado. Los artefactos personalizados deben ser compatibles con la versión Java exigida por la versión de Bonita utilizada.

## 6.12 Base de datos

Para 2025.1 la documentación soporta PostgreSQL y, según edición, MySQL, SQL Server y Oracle. La selección debe verificarse siempre contra la matriz de compatibilidad de la versión exacta que se instalará.

## Vista simplificada

```text
Interfaces / Aplicaciones
          ↓
REST API / Contratos
          ↓
Procesos BPMN ── Organización
          │
          ├── BDM / Persistencia
          ├── Connectors
          └── Extensions
          ↓
Bonita Engine / Runtime
          ↓
Tomcat + Java + RDBMS
```

## Fuentes

- https://documentation-bonita.netlify.app/bonita/2025.1/bonita-overview/project-structure
- https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- https://documentation-bonita.netlify.app/bonita/2025.1/runtime/hardware-and-software-requirements
