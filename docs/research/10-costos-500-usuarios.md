# 10. Costos aproximados para una empresa con 500 usuarios

## Importante: no existe una tarifa pública única por 500 usuarios

La documentación pública de Bonita distingue entre **Community edition** y **Subscription editions**. Las ediciones Subscription requieren licencia válida, pero el precio empresarial no aparece publicado como una tarifa universal por “500 usuarios”; depende de la oferta comercial y debe solicitarse a Bonitasoft.

Por ello, esta investigación **no inventa un precio de licencia**. Se presenta un modelo de TCO (Total Cost of Ownership) separando componentes verificables y estimaciones de planificación.

## Escenario 1 — Bonita Community

### Licencia del software

**US$0 de licencia de Bonita Community**, al tratarse de la edición comunitaria. Esto no significa costo total cero.

### Costos que siguen existiendo

- servidores o cloud;
- base de datos;
- backups;
- HTTPS/DNS y servicios de red;
- monitoreo;
- administración de sistemas;
- desarrollo e integración;
- QA;
- soporte interno o consultoría;
- continuidad y recuperación.

## Escenario 2 — Bonita Subscription / Enterprise

Además de infraestructura y personal, debe agregarse:

- suscripción/licencia Bonita;
- soporte asociado al contrato;
- posibles servicios profesionales;
- capacidades empresariales incluidas en la edición adquirida.

**Costo de licencia:** solicitar cotización al proveedor. No se asigna una cifra sin una fuente contractual.

## Estimación académica de infraestructura

Para el escenario de referencia de 500 usuarios registrados y 50–100 concurrentes, una arquitectura simple podría usar:

- 1 Runtime: 4–8 vCPU, 8–16 GB RAM;
- 1 servidor PostgreSQL: 4–8 vCPU, 16–32 GB RAM;
- 100–300 GB iniciales de almacenamiento total entre datos, logs y backups;
- servicio de backup;
- reverse proxy/load balancer cuando aplique.

Un presupuesto cloud de planificación para esa infraestructura puede reservar aproximadamente **US$300–US$900/mes**, dependiendo enormemente del proveedor, región, alta disponibilidad, tipo de disco, tráfico y base de datos gestionada. **Este rango es una estimación del proyecto, no una tarifa oficial de Bonitasoft ni de un proveedor cloud.**

Con alta disponibilidad, réplicas y múltiples nodos, la infraestructura puede superar con facilidad ese rango.

## Costos de implementación

La parte más variable suele ser el trabajo del equipo. Debe estimarse por horas o por proyecto:

| Actividad | Ejemplo de esfuerzo |
|---|---:|
| Descubrimiento y modelado | 40–120 h |
| Desarrollo BPM / formularios | 80–240 h |
| Integraciones | 80–300 h |
| QA / pruebas de carga | 40–160 h |
| DevOps / despliegue | 24–80 h |
| Capacitación / documentación | 16–80 h |

Estos valores son **supuestos académicos de planificación**, no precios oficiales. El costo monetario surge al multiplicarlos por la tarifa del equipo o proveedor.

## Ejemplo de fórmula TCO anual

```text
TCO = Licencia
    + Infraestructura
    + Implementación
    + Operación
    + Soporte
    + Capacitación
    + Contingencia
```

Ejemplo únicamente de infraestructura con el rango académico anterior:

```text
US$300 × 12 = US$3,600/año
US$900 × 12 = US$10,800/año
```

Esto excluye licencia Subscription, salarios/consultoría e impuestos.

## Cómo presentar este punto al profesor

La respuesta defendible es:

1. Community no implica pago de licencia de Bonita, pero sí TCO.
2. Subscription requiere cotización empresarial; no debe inventarse una tarifa.
3. Para 500 usuarios se dimensiona por concurrencia y carga, no solo por cantidad de cuentas.
4. Infraestructura y mano de obra se estiman por arquitectura y SLA.
5. Antes de contratar se realiza prueba de carga y se solicita cotización formal.

## Fuentes

- Bonita Studio Community/Subscription: https://documentation-bonita.netlify.app/bonita/2025.1/bonita-studio-download-installation
- Bonita Docker — licencias Subscription: https://documentation-bonita.netlify.app/bonita/2025.2/runtime/bonita-docker-installation
- Hardware requirements: https://documentation-bonita.netlify.app/bonita/2025.1/runtime/hardware-and-software-requirements
