# 📁 Estructura de Assets (SVG e Imágenes)

Guía completa para organizar archivos SVG, imágenes y otros assets en el proyecto.

---

## 📂 Estructura Recomendada

```
proyecto/
├── public/                      # Assets estáticos (URL absoluta)
│   ├── favicon.ico
│   ├── logo.svg                # Logo principal
│   ├── og-image.png            # Open Graph image
│   └── robots.txt
│
└── src/
    └── assets/                 # Assets importados en componentes
        ├── icons/              # Iconos SVG
        │   ├── check.svg
        │   ├── close.svg
        │   ├── menu.svg
        │   └── user.svg
        │
        ├── illustrations/      # Ilustraciones SVG
        │   ├── empty-state.svg
        │   ├── error-404.svg
        │   └── success.svg
        │
        ├── logos/              # Logos de marca
        │   ├── logo-light.svg
        │   ├── logo-dark.svg
        │   └── logo-icon.svg
        │
        ├── images/             # Imágenes (PNG, JPG, WebP)
        │   ├── hero.webp
        │   └── banner.jpg
        │
        └── brand/              # Assets de marca
            ├── watermark.svg
            └── pattern.svg
```

---

## 🎯 ¿Dónde Colocar Cada Tipo de Asset?

### 1️⃣ `public/` - Assets Estáticos

**Usar cuando:**

- ✅ El archivo NO cambiará (favicon, robots.txt)
- ✅ Necesitas una URL absoluta predecible
- ✅ El archivo NO necesita ser procesado por Vite
- ✅ SEO: Open Graph images, favicons

**Ejemplos:**

```
public/
├── favicon.ico
├── logo-512.png          # Para manifest
├── og-image.png          # Para meta tags
├── apple-touch-icon.png  # Para iOS
└── robots.txt
```

**Cómo usar:**

```tsx
// En HTML/JSX - Ruta desde la raíz pública
<img src="/logo-512.png" alt="Logo" />

// En meta tags
<meta property="og:image" content="/og-image.png" />
```

---

### 2️⃣ `src/assets/` - Assets Importados

**Usar cuando:**

- ✅ El asset se importa en componentes React
- ✅ Quieres optimización automática (Vite/Webpack)
- ✅ Necesitas versionado automático
- ✅ El asset puede cambiar durante desarrollo

**Ejemplos:**

```
src/assets/
├── icons/          # Iconos reutilizables
├── illustrations/  # Ilustraciones grandes
├── logos/          # Logos variantes
└── images/         # Fotos/imágenes
```

**Cómo usar:**

```tsx
// Importar como módulo
import logo from "../assets/logos/logo-light.svg";

<img src={logo} alt="Logo" />;
```

---

## 🎨 Organización por Categorías

### A) Iconos (`src/assets/icons/`)

**Propósito:** Iconos pequeños reutilizables (16-48px)

```
src/assets/icons/
├── navigation/
│   ├── menu.svg
│   ├── close.svg
│   └── arrow.svg
│
├── actions/
│   ├── edit.svg
│   ├── delete.svg
│   ├── save.svg
│   └── add.svg
│
├── status/
│   ├── success.svg
│   ├── error.svg
│   ├── warning.svg
│   └── info.svg
│
└── social/
    ├── facebook.svg
    ├── twitter.svg
    └── linkedin.svg
```

**Uso en componentes:**

```tsx
import CheckIcon from "../../assets/icons/status/success.svg";

export function SuccessMessage() {
  return (
    <div>
      <img src={CheckIcon} alt="" className="w-6 h-6" />
      <span>Operación exitosa</span>
    </div>
  );
}
```

---

### B) Logos (`src/assets/logos/`)

**Propósito:** Logos de marca, variantes y versiones

```
src/assets/logos/
├── logo-light.svg       # Logo para fondo claro
├── logo-dark.svg        # Logo para fondo oscuro
├── logo-icon.svg        # Solo icono (sin texto)
├── logo-full.svg        # Logo completo
└── logo-horizontal.svg  # Versión horizontal
```

**Uso en Navbar:**

```tsx
import LogoLight from "../assets/logos/logo-light.svg";
import LogoDark from "../assets/logos/logo-dark.svg";

export function Navbar() {
  const isDarkMode = useDarkMode();

  return (
    <header>
      <img
        src={isDarkMode ? LogoDark : LogoLight}
        alt="Nuri Task App"
        className="h-8"
      />
    </header>
  );
}
```

---

### C) Ilustraciones (`src/assets/illustrations/`)

**Propósito:** Ilustraciones decorativas grandes

```
src/assets/illustrations/
├── empty-state.svg      # Sin datos
├── error-404.svg        # Página no encontrada
├── error-500.svg        # Error del servidor
├── success.svg          # Operación exitosa
├── loading.svg          # Cargando
└── welcome.svg          # Bienvenida
```

**Uso en páginas:**

```tsx
import EmptyState from "../../assets/illustrations/empty-state.svg";

export function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <img
          src={EmptyState}
          alt="No hay tareas"
          className="w-64 h-64 mx-auto mb-4"
        />
        <p>No hay tareas aún</p>
      </div>
    );
  }

  return <TaskListContent tasks={tasks} />;
}
```

---

### D) Brand Assets (`src/assets/brand/`)

**Propósito:** Assets específicos de marca

```
src/assets/brand/
├── watermark.svg        # Marca de agua
├── pattern.svg          # Patrón decorativo
├── divider.svg          # Divisores
└── background.svg       # Fondos decorativos
```

---

## 💡 Mejores Prácticas

### 1. Nomenclatura

✅ **Buenas prácticas:**

```
logo-light.svg          # Descriptivo con contexto
icon-check-circle.svg   # Prefijo + descripción
illustration-empty.svg  # Tipo + propósito
```

❌ **Evitar:**

```
Logo1.svg              # Números poco descriptivos
check.svg              # Sin contexto de carpeta
img-final-v2.svg       # Versionado manual
```

### 2. Optimización de SVG

Antes de agregar SVGs, optimízalos:

```bash
# Usando SVGO (recomendado)
npx svgo -f src/assets/icons

# O herramientas online:
# - https://jakearchibald.github.io/svgomg/
# - https://www.svgminify.com/
```

### 3. Tamaños Recomendados

| Tipo          | Tamaño Recomendado | Uso               |
| ------------- | ------------------ | ----------------- |
| Iconos        | 16-48px            | UI pequeña        |
| Logos         | 200-400px ancho    | Headers, footers  |
| Ilustraciones | 400-800px          | Páginas completas |
| Backgrounds   | Variable           | Decoración        |

### 4. Formato y Exportación

**Desde Figma/Sketch/Illustrator:**

- ✅ Exportar como SVG
- ✅ Outline strokes (convertir trazos a paths)
- ✅ Simplificar paths
- ✅ Remover metadata innecesario
- ✅ ViewBox correcto

---

## 🚀 Patrones de Uso

### Patrón 1: Componente de Icono Reutilizable

```tsx
// src/components/ui/Icon.tsx
interface IconProps {
  name: "check" | "close" | "menu" | "user";
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Icon({ name, className = "", size = "md" }: IconProps) {
  const icons = {
    check: () => import("../assets/icons/check.svg"),
    close: () => import("../assets/icons/close.svg"),
    menu: () => import("../assets/icons/menu.svg"),
    user: () => import("../assets/icons/user.svg"),
  };

  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const [icon, setIcon] = useState("");

  useEffect(() => {
    icons[name]().then((module) => setIcon(module.default));
  }, [name]);

  return <img src={icon} alt="" className={`${sizes[size]} ${className}`} />;
}

// Uso:
<Icon name="check" size="sm" />;
```

### Patrón 2: SVG Inline (Mejor para iconos)

```tsx
// src/components/icons/CheckIcon.tsx
export function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Uso:
<CheckIcon className="w-6 h-6 text-green-500" />;
```

### Patrón 3: Lazy Loading de Ilustraciones

```tsx
import { lazy, Suspense } from "react";

const EmptyStateIllustration = lazy(
  () => import("../assets/illustrations/empty-state.svg"),
);

export function EmptyState() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <img src={EmptyStateIllustration} alt="No hay datos" loading="lazy" />
    </Suspense>
  );
}
```

---

## 📦 Crear Estructura de Carpetas

Puedes crear la estructura manualmente o usar este comando:

```bash
# Windows (PowerShell)
mkdir -p src/assets/icons/navigation, src/assets/icons/actions, src/assets/icons/status, src/assets/logos, src/assets/illustrations, src/assets/brand, src/assets/images

# Linux/Mac
mkdir -p src/assets/{icons/{navigation,actions,status},logos,illustrations,brand,images}
```

---

## 🎯 Resumen Rápido

| Tipo de Asset             | Ubicación                   | Cuándo Usar    |
| ------------------------- | --------------------------- | -------------- |
| **Favicon, robots.txt**   | `public/`                   | Siempre        |
| **OG Images**             | `public/`                   | Para SEO       |
| **Logos de marca**        | `src/assets/logos/`         | En componentes |
| **Iconos UI**             | `src/assets/icons/`         | En componentes |
| **Ilustraciones**         | `src/assets/illustrations/` | En componentes |
| **Imágenes de contenido** | `src/assets/images/`        | En componentes |
| **Assets de marca**       | `src/assets/brand/`         | En componentes |

---

## ✅ Checklist

Antes de agregar un asset:

- [ ] Optimizado (SVGO para SVG, ImageOptim para imágenes)
- [ ] Nombre descriptivo y consistente
- [ ] En la carpeta correcta según su propósito
- [ ] Tamaño apropiado
- [ ] Accesibilidad: `alt` text cuando sea necesario
- [ ] Lazy loading si es grande

---

**¡Estructura de assets lista para escalar!** 🎨✨
