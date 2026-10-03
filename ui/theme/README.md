# BonitaSoft UI Theme

Tema visual basado en la identidad azul/rojo del proyecto BonitaSoft.

## Archivos

- `tokens.css`: variables CSS globales y paleta.
- `bonitasoft-components.css`: estilos reutilizables para layout, sidebar, topbar, cards, botones, inputs, tablas, badges y nodos de proceso.
- `theme.ts`: objeto tipado para React + TypeScript.
- `angular-theme.scss`: variables y mixins para Angular/SCSS.

## React / TypeScript

Importa el CSS global una sola vez:

```ts
import './ui/theme/tokens.css';
import './ui/theme/bonitasoft-components.css';
```

Si necesitas los colores desde TypeScript:

```ts
import { bonitaTheme, statusColors } from './ui/theme/theme';

console.log(bonitaTheme.colors.brandBlue);
console.log(statusColors.approved);
```

Ejemplo de tarjeta:

```tsx
<section className="bs-card bs-card--accent">
  <p className="bs-card-title">Procesos activos</p>
  <p className="bs-card-value">284</p>
</section>
```

Ejemplo de botón:

```tsx
<button className="bs-btn bs-btn--primary">Nueva solicitud</button>
```

## Angular / SCSS

En `styles.scss`:

```scss
@use './ui/theme/angular-theme' as bonita;
@import './ui/theme/tokens.css';
@import './ui/theme/bonitasoft-components.css';
```

Ejemplo en un componente:

```scss
.dashboard-card {
  @include bonita.bs-card;
  padding: 20px;
}

.primary-action {
  @include bonita.bs-primary-button;
}
```

## Convenciones visuales

- Fondo global: azul marino/azul profundo.
- Navegación activa: azul eléctrico con glow moderado.
- Acciones principales: azul eléctrico.
- Marca, alertas y estados críticos: rojo Bonita.
- Aprobado/completado: verde.
- Espera/advertencia: ámbar.
- Texto: blanco y gris azulado.

## Estados BPM sugeridos

| Estado | Color |
|---|---|
| Pendiente / en progreso | Azul `#2F80FF` |
| Aprobado / completado | Verde `#22C55E` |
| Advertencia / espera | Ámbar `#F59E0B` |
| Rechazado / error | Rojo `#FF1744` |

## Accesibilidad

El rojo no debe utilizarse como único indicador de estado: acompáñalo con icono, etiqueta o texto. Mantén foco visible en controles interactivos y contraste suficiente entre texto y fondos oscuros.
