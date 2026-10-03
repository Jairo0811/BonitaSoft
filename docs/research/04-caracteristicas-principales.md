# 4. Características principales de Bonita

Bonita es una plataforma **open source y extensible** orientada a la automatización y optimización de procesos. Su propuesta combina modelado visual con capacidades de desarrollo profesional.

## 4.1 Modelado BPMN

Bonita Studio permite representar procesos con actividades, transiciones, decisiones, eventos, temporizadores y otros elementos BPMN. El diagrama no queda únicamente como documentación: se configura para ser ejecutado por el runtime.

## 4.2 Tareas humanas y automatizadas

Un proceso puede combinar actividades realizadas por usuarios con tareas automáticas. Los actores permiten asignar trabajo según la organización definida en la plataforma.

## 4.3 Business Data Model

El **BDM** representa entidades de negocio y sus relaciones. Esto separa los datos del dominio de variables técnicas temporales y facilita construir aplicaciones alrededor del proceso.

## 4.4 Formularios, páginas y aplicaciones

Bonita permite crear:

- formularios de inicio;
- formularios de tareas humanas;
- páginas de aplicación;
- layouts;
- temas;
- aplicaciones personalizadas basadas en procesos.

La plataforma está en transición desde UI Designer hacia herramientas de interfaz más recientes como UI Builder, por lo que conviene verificar la versión utilizada antes de desarrollar una interfaz definitiva.

## 4.5 Integración

Bonita incorpora conectores y puntos de extensión. Los conectores REST permiten consumir servicios HTTP y existen extensiones para cubrir necesidades no incluidas de fábrica. La documentación describe más de 80 conectores estándar en la plataforma, además de la posibilidad de crear conectores propios.

## 4.6 APIs y extensibilidad

El runtime ofrece APIs y el proyecto puede ampliarse mediante:

- Connectors;
- Actor Filters;
- REST API Extensions;
- Themes;
- código y dependencias Java/Maven.

## 4.7 Organización e identidad

La organización de Bonita maneja usuarios, grupos, roles y membresías. Las ediciones empresariales añaden opciones avanzadas de autenticación e integración con sistemas de identidad.

## 4.8 Runtime y administración

El entorno de ejecución gestiona instancias de procesos, tareas, datos y aplicaciones. Incluye aplicaciones provistas por Bonita para usuarios y administración.

## 4.9 DevOps

Los proyectos modernos de Bonita pueden integrarse en flujos basados en Git y Maven. La construcción de aplicaciones puede producir artefactos desplegables y, según configuración/edición, imágenes Docker.

## 4.10 Trazabilidad

Cada instancia de proceso mantiene estado e historial. Esto permite conocer tareas, responsables, decisiones y errores, un aspecto esencial en procesos administrativos y de cumplimiento.

## Fuentes

- https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- https://documentation-bonita.netlify.app/bonita/2025.1/bonita-overview/project-structure
- https://documentation-bonita.netlify.app/bonita/2025.2/software-extensibility/software-extensibility
- https://documentation.bonitasoft.com/bonita/2024.1/process/rest-connector
