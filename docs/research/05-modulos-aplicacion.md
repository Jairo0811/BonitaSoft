# 5. Módulos de la aplicación

Para fines académicos, los “módulos” de Bonita pueden entenderse como los principales entornos y aplicaciones que intervienen en el ciclo de desarrollo y operación.

## 5.1 Bonita Studio

Es el entorno principal de desarrollo. Permite modelar procesos, definir datos, organización, actores, contratos, conectores, parámetros y otros elementos del proyecto.

Bonita Studio incluye un runtime local para **desarrollo y pruebas**. La documentación oficial advierte que este runtime integrado no debe utilizarse como entorno de producción.

## 5.2 Herramientas de interfaz

Bonita dispone de herramientas para construir formularios y páginas. En la línea actual conviven conceptos de **UI Designer** y la evolución hacia **UI Builder**. Estas interfaces consumen procesos y datos mediante contratos y APIs.

## 5.3 Bonita Runtime

Es el entorno que ejecuta procesos y aplicaciones. Puede instalarse en máquinas físicas, virtuales, cloud o contenedores. Un runtime puede estar compuesto por uno o varios nodos según edición y arquitectura.

## 5.4 Bonita User Application

Aplicación orientada al usuario final para consultar y completar tareas de los procesos en los que participa.

## 5.5 Bonita Administrator Application

Permite a administradores instalar y gestionar procesos, supervisar ejecución, administrar recursos y atender determinados errores operativos.

## 5.6 Bonita Super Administrator Application

Se utiliza para tareas técnicas de plataforma, como configuración de organización, BDM, aplicaciones y operaciones de mantenimiento.

## 5.7 Application Directory

Proporciona un punto de acceso a las aplicaciones disponibles para el usuario autenticado.

## 5.8 Bonita Continuous Delivery

**BCD** está disponible en ediciones por suscripción. Su propósito es facilitar la entrega continua de proyectos Bonita entre entornos.

## Resumen

| Módulo / entorno | Función principal |
|---|---|
| Bonita Studio | Diseño y desarrollo |
| UI Builder / UI Designer | Formularios, páginas e interfaces |
| Bonita Runtime | Ejecución |
| User Application | Trabajo de usuarios finales |
| Administrator Application | Administración funcional |
| Super Administrator | Administración técnica |
| Application Directory | Acceso a aplicaciones |
| BCD | Entrega continua, Subscription |

## Fuente principal

- Bonita Documentation — Bonita components: https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- Bonita Documentation — Bonita Studio: https://documentation.bonitasoft.com/bonita/2024.1/bonita-overview/bonita-studio
