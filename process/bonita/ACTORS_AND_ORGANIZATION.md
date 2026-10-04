# Actores y organización

## Organización mínima

```text
/Empresa
  /Solicitantes
  /Aprobadores
```

## Roles

Crear al menos:

```text
Solicitante
Aprobador
```

## Usuarios de prueba

### solicitante.demo

- Grupo: `/Empresa/Solicitantes`
- Rol: `Solicitante`
- Uso: iniciar solicitudes.

### aprobador.demo

- Grupo: `/Empresa/Aprobadores`
- Rol: `Aprobador`
- Uso: ejecutar la tarea humana de decisión.

> Las contraseñas de prueba se configuran localmente en Studio y no deben versionarse en el repositorio.

## Actores del proceso

### Solicitante

Responsabilidad:

- iniciar el caso;
- completar el formulario de solicitud.

Mapeo recomendado:

```text
Actor: Solicitante
Grupo: /Empresa/Solicitantes
Rol: Solicitante
```

### Aprobador

Responsabilidad:

- revisar la solicitud;
- aprobar/rechazar;
- resolver un error técnico si se utiliza la tarea de recuperación.

Mapeo recomendado:

```text
Actor: Aprobador
Grupo: /Empresa/Aprobadores
Rol: Aprobador
```

## Validación de asignación

Antes de probar rutas funcionales:

1. iniciar sesión como `solicitante.demo`;
2. crear una instancia;
3. cerrar sesión;
4. entrar como `aprobador.demo`;
5. confirmar que `Revisar y decidir solicitud` aparece en su bandeja;
6. completar la tarea;
7. confirmar que la decisión queda asociada al caso.

## Evidencia

Capturar:

- organización completa;
- actor `Solicitante` mapeado;
- actor `Aprobador` mapeado;
- bandeja del aprobador mostrando la tarea del caso.
