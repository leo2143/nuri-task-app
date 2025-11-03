# Paleta de Colores - Nuri Task App

Esta es la guía de referencia de la paleta de colores configurada en Tailwind CSS.

## 🎨 Colores Principales

### Primary (Verde Azulado)

- **`primary-light`**: `#75BDC9` - Azul claro
  - **Uso**: Acentos, estados hover, elementos secundarios
  - **Significado**: Transmite tranquilidad, claridad mental y frescura
  - **Clases Tailwind**: `bg-primary-light`, `text-primary-light`, `border-primary-light`
  - **Alias**: `secondary`

- **`primary`** (DEFAULT): `#2F9685` - Verde azulado
  - **Uso**: Botones principales, enlaces, elementos destacados
  - **Significado**: Simboliza equilibrio y constancia. Aporta solidez a la identidad
  - **Clases Tailwind**: `bg-primary`, `text-primary`, `border-primary`
  - **Alias**: `balance`

- **`primary-dark`**: `#37241C` - Marrón oscuro
  - **Uso**: Texto principal, contraste, elementos de UI fuertes
  - **Significado**: Brinda contraste y estabilidad, transmite confianza y profundidad
  - **Clases Tailwind**: `bg-primary-dark`, `text-primary-dark`, `border-primary-dark`
  - **Alias**: `contrast`

### Neutral (Tonos Neutros y Cálidos)

- **`neutral-light`**: `#F7F6F2` - Beige claro
  - **Uso**: Fondo base de la aplicación, áreas neutras
  - **Significado**: Color base neutro que aporta limpieza visual
  - **Clases Tailwind**: `bg-neutral-light`, `text-neutral-light`, `border-neutral-light`
  - **Alias**: `base`

- **`neutral`** (DEFAULT): `#EDCBB1` - Melocotón/Durazno
  - **Uso**: Elementos secundarios, áreas de énfasis suave
  - **Significado**: Aporta cercanía, empatía y calidez humana
  - **Clases Tailwind**: `bg-neutral`, `text-neutral`, `border-neutral`
  - **Alias**: `warmth`

- **`neutral-dark`**: `#3A251D` - Marrón muy oscuro
  - **Uso**: Acentos de texto, sombras, detalles
  - **Significado**: Complementa al #37241C, aportando calidez y naturalidad
  - **Clases Tailwind**: `bg-neutral-dark`, `text-neutral-dark`, `border-neutral-dark`
  - **Alias**: `depth`

## 📝 Aliases Semánticos

Para mayor claridad en el código, también puedes usar estos nombres:

```tsx
// Colores semánticos
bg - secondary; // #75BDC9 - Azul claro
bg - balance; // #2F9685 - Verde azulado
bg - base; // #F7F6F2 - Beige claro
bg - warmth; // #EDCBB1 - Melocotón
bg - contrast; // #37241C - Marrón oscuro
bg - depth; // #3A251D - Marrón muy oscuro
```

## 🎨 Ejemplos de Uso

### Botones

```tsx
// Botón primario
<button className="bg-primary hover:bg-balance text-base">
  Primary Button
</button>

// Botón secundario
<button className="bg-secondary hover:bg-primary-light text-contrast">
  Secondary Button
</button>

// Botón neutral
<button className="bg-warmth hover:bg-neutral text-contrast">
  Neutral Button
</button>
```

### Tarjetas

```tsx
<div className="bg-white border border-neutral-light hover:border-warmth">
  <h2 className="text-contrast">Título</h2>
  <p className="text-depth">Descripción</p>
</div>
```

### Texto

```tsx
<h1 className="text-contrast">Encabezado Principal</h1>
<p className="text-depth">Texto de cuerpo</p>
<a className="text-primary hover:text-balance">Enlace</a>
```

## 🔤 Tipografía

### Montserrat Alternates - Títulos

- **Uso**: Todos los encabezados (h1-h6)
- **Clases**: `font-heading`
- **Pesos disponibles**: 100, 200, 300, 400, 500, 600, 700, 800, 900

```tsx
<h1 className="font-heading font-bold">Título Principal</h1>
```

### Nunito Sans - Texto de cuerpo

- **Uso**: Párrafos, texto general, UI
- **Clases**: `font-body`
- **Pesos disponibles**: 300 (light), 400 (regular), 600 (semibold), 700 (bold), 800 (extrabold)

```tsx
<p className="font-body">Texto de párrafo</p>
```

## ✅ Combinaciones Recomendadas

### Header/Navigation

- Background: `bg-primary`
- Text: `text-base`
- Hover: `hover:text-warmth`

### Content Cards

- Background: `bg-white`
- Border: `border-neutral-light`
- Hover Border: `hover:border-warmth`
- Title: `text-contrast`
- Body: `text-depth`

### Buttons

- **Primary Action**: `bg-primary text-base hover:bg-balance`
- **Secondary Action**: `bg-secondary text-contrast hover:bg-primary-light`
- **Tertiary Action**: `bg-warmth text-contrast hover:bg-neutral`

### Footer

- Background: `bg-contrast`
- Text: `text-base`

## 🌈 Accesibilidad

Todas las combinaciones de colores han sido diseñadas teniendo en cuenta:

- Contraste mínimo WCAG AA (4.5:1 para texto normal)
- Legibilidad en diferentes dispositivos
- Armonía visual y coherencia

### Combinaciones de Alto Contraste Validadas

- ✅ `text-contrast` sobre `bg-base` (fondo principal)
- ✅ `text-base` sobre `bg-primary` (botones/header)
- ✅ `text-depth` sobre `bg-base` (texto secundario)
- ✅ `text-contrast` sobre `bg-warmth` (elementos cálidos)
