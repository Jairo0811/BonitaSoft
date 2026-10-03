# 9. Elementos usuales de una solución SOA con Bonita

Una solución construida alrededor de Bonita puede combinar elementos de interfaz, proceso, datos e integración. No todos son obligatorios en cada proyecto.

## 9.1 Procesos BPMN

Definen la orquestación: orden de tareas, decisiones, eventos, excepciones y puntos de integración.

## 9.2 Formularios

Capturan información al iniciar procesos y completar tareas humanas. Se vinculan a contratos de entrada para controlar la estructura de los datos recibidos.

## 9.3 Páginas y aplicaciones

Las páginas muestran datos y acciones de negocio. Una aplicación puede organizar páginas mediante navegación, layout y theme.

## 9.4 Business Data Model

Representa entidades persistentes del dominio, por ejemplo `Solicitud`, `Empleado`, `Aprobacion` o `AccesoProvisionado`.

## 9.5 Servicios REST consumidos

Los conectores REST nativos permiten ejecutar operaciones HTTP hacia terceros. Esto convierte al proceso en un orquestador de capacidades existentes.

Ejemplo:

```text
Bonita Process
     │
     ├── GET  /empleados/{id}
     ├── POST /accesos
     ├── PUT  /solicitudes/{id}
     └── POST /notificaciones
```

## 9.6 APIs expuestas por Bonita

Aplicaciones externas pueden utilizar las APIs del runtime para interactuar con procesos, tareas y recursos, respetando autenticación y autorización.

## 9.7 REST API Extensions

Cuando las APIs estándar no cubren una necesidad, pueden agregarse extensiones personalizadas, por ejemplo para consultas especializadas del BDM o integración adicional.

## 9.8 Conectores no REST

Dependiendo de edición, versión y catálogo disponible, Bonita ofrece conectores para distintos sistemas. La plataforma permite desarrollar conectores propios en Java cuando no existe uno adecuado.

## 9.9 Organización y actores

Usuarios, grupos y roles determinan quién puede iniciar procesos y ejecutar tareas. Los Actor Filters permiten resolver asignaciones más dinámicas.

## 9.10 Reglas y expresiones

Las condiciones de gateways, scripts y expresiones permiten decidir rutas y preparar datos. Deben mantenerse simples y documentadas para no esconder lógica crítica dentro del diagrama.

## 9.11 Seguridad

Una solución empresarial debe incluir:

- HTTPS;
- gestión segura de secretos;
- mínimo privilegio;
- autenticación y autorización;
- protección de APIs;
- auditoría;
- separación de ambientes.

## 9.12 Administración y monitoreo

Los administradores necesitan desplegar procesos, revisar casos, detectar errores y mantener el entorno. En producción también se requieren logs, health checks, backups y métricas de infraestructura.

## Arquitectura de ejemplo

```text
Usuarios
   ↓
Aplicación / Formularios Bonita
   ↓
Bonita Runtime + BPMN
   ├── Business Data
   ├── Organización
   ├── REST API
   └── Connectors
           ↓
 ┌─────────┼────────────┐
 ▼         ▼            ▼
RRHH     Directorio   Servicio externo
API      identidad    / ERP / CRM
```

## Fuentes

- Project structure: https://documentation-bonita.netlify.app/bonita/2025.1/bonita-overview/project-structure
- REST connectors: https://documentation.bonitasoft.com/bonita/2024.1/process/rest-connector
- Platform extensibility: https://documentation-bonita.netlify.app/bonita/2025.2/software-extensibility/software-extensibility
