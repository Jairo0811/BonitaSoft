# 8. Hardware y/o appliance para una empresa con 500 usuarios

## Punto de partida oficial

La documentación de Bonita 2025.1 aclara que el hardware depende fuertemente de la carga real: cantidad de instancias, usuarios concurrentes, operaciones, integraciones y complejidad de los procesos.

Como referencia general, documenta para Bonita Platform:

| Recurso | Mínimo | Recomendado oficial |
|---|---:|---:|
| CPU | 4 cores | 4 cores o más |
| RAM | 4 GB | 8 GB o más |
| Disco | 10 GB | 30 GB o más según uso |

Esto **no significa que 8 GB sean suficientes para cualquier organización de 500 usuarios**. Es una base de plataforma, no un dimensionamiento específico por cantidad de cuentas.

## Software soportado de referencia — 2025.1

- Java 17.
- Apache Tomcat 9.0.x dentro de la línea soportada.
- PostgreSQL 16.x soportado.
- SQL Server 2022, Oracle y MySQL aparecen con disponibilidad asociada a Subscription según la matriz de esa versión.
- Linux/Windows Server compatibles según la matriz oficial.

## Propuesta de dimensionamiento académico para 500 usuarios

Para esta práctica se plantea una empresa con **500 usuarios registrados**, pero no 500 usuarios ejecutando operaciones al mismo tiempo. El factor crítico es la concurrencia.

### Escenario A — pequeña/mediana concurrencia

Supuesto: 500 cuentas, 50–100 usuarios concurrentes, procesos administrativos de complejidad moderada.

```text
Reverse proxy / Load balancer
           │
           ▼
Bonita Runtime
4–8 vCPU / 8–16 GB RAM
           │
           ▼
PostgreSQL dedicado
4–8 vCPU / 16–32 GB RAM
           │
           ▼
Backups + almacenamiento persistente
```

### Escenario B — alta disponibilidad

Para procesos críticos, y utilizando una edición que soporte las capacidades necesarias, la arquitectura puede evolucionar a:

```text
              Load Balancer
             /             \
            ▼               ▼
 Runtime Node A         Runtime Node B
 4–8 vCPU               4–8 vCPU
 8–16 GB RAM            8–16 GB RAM
            \               /
             ▼             ▼
        Base de datos gestionada
          + backups / réplica
```

Bonita documenta que un Runtime puede estar compuesto por uno o varios nodos; determinadas capacidades de cluster pertenecen a Subscription.

## Almacenamiento

Debe contemplarse espacio para:

- datos internos del motor;
- Business Data;
- índices y logs;
- documentos si el diseño los almacena dentro de la solución;
- respaldos;
- crecimiento histórico de casos.

Por ello, para producción no se tomarían los 30 GB recomendados como capacidad final. Se mediría el crecimiento durante pruebas y se definiría retención.

## Appliance

Bonita no obliga a adquirir un appliance físico dedicado. Puede ejecutarse en:

- servidor físico;
- máquina virtual;
- instancia cloud;
- contenedor Docker.

La documentación 2025.2 proporciona una distribución Docker y ejemplos con PostgreSQL y, para Subscription, otros motores compatibles.

## Lo que debe medirse antes de comprar infraestructura

1. Usuarios concurrentes reales.
2. Instancias creadas por hora/día.
3. Cantidad de tareas por instancia.
4. Tamaño de Business Data.
5. Uso de documentos.
6. Duración y latencia de conectores.
7. Scripts Groovy/Java pesados.
8. SLA de disponibilidad.
9. Retención histórica.
10. Recuperación ante desastres.

## Recomendación académica

Para la exposición no se debe afirmar que “500 usuarios = X GB”. La respuesta técnicamente correcta es presentar los requisitos oficiales y luego explicar una **arquitectura de referencia** que deberá validarse mediante pruebas de carga.

## Fuentes

- Bonita 2025.1 — Hardware and software requirements: https://documentation-bonita.netlify.app/bonita/2025.1/runtime/hardware-and-software-requirements
- Bonita 2025.2 — Components: https://documentation-bonita.netlify.app/bonita/2025.2/bonita-overview/bonita-bpm-overview
- Bonita 2025.2 — Docker deployment: https://documentation-bonita.netlify.app/bonita/2025.2/runtime/bonita-docker-installation
