# 🎨 useClassNames Hook

Custom hook para combinar y limpiar múltiples clases CSS de forma eficiente.

---

## 📋 Problema Resuelto

**Antes:** Código repetitivo en múltiples componentes para combinar clases CSS:

```tsx
// Button.tsx
const buttonClasses = `
  ${baseStyles}
  ${variantStyles[variant]}
  ${sizeStyles[size]}
  ${className}
`
  .trim()
  .replace(/\s+/g, " ");

// Badge.tsx
const badgeClasses = `${baseStyles} ${getVariantStyles()} ${className}`
  .trim()
  .replace(/\s+/g, " ");

// ❌ Duplicación en 3+ componentes
```

**Después:** Hook reutilizable en un solo lugar:

```tsx
// Badge.tsx
const badgeClasses = useClassNames(baseStyles, getVariantStyles(), className);

// Button.tsx
const buttonClasses = useClassNames(
  baseStyles,
  variantStyles[variant],
  sizeStyles[size],
  widthStyle,
  className
);

// ✅ DRY (Don't Repeat Yourself)
```

---

## 🎯 Funcionalidad

El hook `useClassNames`:
1. ✅ Combina múltiples strings de clases CSS
2. ✅ Elimina valores falsy (false, null, undefined, '')
3. ✅ Elimina espacios múltiples consecutivos
4. ✅ Elimina espacios al inicio y final
5. ✅ Usa `useMemo` para optimizar rendimiento

---

## 📦 Ubicación

```
src/
└── hooks/
    ├── useClassNames.ts    # ✅ Hook
    └── index.ts            # Exportación
```

---

## 🔧 Implementación

### Hook (`src/hooks/useClassNames.ts`)

```typescript
import { useMemo } from "react";

export function useClassNames(...classes: (string | boolean | null | undefined)[]): string {
  return useMemo(() => {
    return classes
      .filter(Boolean)        // Elimina valores falsy
      .join(" ")              // Une con espacios
      .trim()                 // Elimina espacios al inicio/final
      .replace(/\s+/g, " ");  // Reemplaza múltiples espacios con uno
  }, [classes]);
}
```

---

## 📚 Uso

### Importación

```tsx
import { useClassNames } from '../../hooks';
```

### Ejemplo Básico

```tsx
function MyComponent({ className }) {
  const classes = useClassNames(
    'px-4 py-2',
    'bg-blue-500',
    className
  );
  
  return <div className={classes}>Content</div>;
}
```

### Ejemplo con Condicionales

```tsx
function Button({ isActive, disabled, className }) {
  const buttonClasses = useClassNames(
    'px-4 py-2 rounded',
    isActive && 'bg-blue-500 text-white',
    disabled && 'opacity-50 cursor-not-allowed',
    !isActive && 'bg-gray-200',
    className
  );
  
  return <button className={buttonClasses}>Click me</button>;
}

// Resultado si isActive=true, disabled=false, className="shadow-lg":
// "px-4 py-2 rounded bg-blue-500 text-white shadow-lg"
```

### Ejemplo en Badge.tsx

**Antes:**
```tsx
const badgeClasses = `${baseStyles} ${getVariantStyles()} ${className}`
  .trim()
  .replace(/\s+/g, " ");
```

**Después:**
```tsx
import { useClassNames } from "../../hooks";

const badgeClasses = useClassNames(baseStyles, getVariantStyles(), className);
```

### Ejemplo en Button.tsx

**Antes:**
```tsx
const buttonClasses = `
  ${baseStyles}
  ${variantStyles[variant]}
  ${sizeStyles[size]}
  ${widthStyle}
  ${className}
`
  .trim()
  .replace(/\s+/g, " ");
```

**Después:**
```tsx
import { useClassNames } from "../../hooks";

const buttonClasses = useClassNames(
  baseStyles,
  variantStyles[variant],
  sizeStyles[size],
  widthStyle,
  className
);
```

---

## 🎨 Casos de Uso

### 1. Componente con Variantes

```tsx
function Alert({ variant, className }) {
  const baseStyles = "p-4 rounded-lg border";
  
  const variantStyles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };
  
  const alertClasses = useClassNames(
    baseStyles,
    variantStyles[variant],
    className
  );
  
  return <div className={alertClasses}>Alert message</div>;
}
```

### 2. Componente con Estado

```tsx
function Card({ isHovered, isSelected, className }) {
  const cardClasses = useClassNames(
    'p-6 rounded-lg border-2 transition-all duration-200',
    isHovered && 'shadow-lg scale-105',
    isSelected && 'border-blue-500 bg-blue-50',
    !isSelected && 'border-gray-200',
    className
  );
  
  return <div className={cardClasses}>Card content</div>;
}
```

### 3. Componente con Tamaños

```tsx
function Avatar({ size, className }) {
  const baseStyles = "rounded-full overflow-hidden";
  
  const sizeStyles = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };
  
  const avatarClasses = useClassNames(
    baseStyles,
    sizeStyles[size],
    className
  );
  
  return <img className={avatarClasses} src="..." alt="Avatar" />;
}
```

---

## 🚀 Ventajas

### 1. DRY (Don't Repeat Yourself)
- Lógica centralizada
- Fácil de mantener
- Cambios en un solo lugar

### 2. Type-Safe
```typescript
// Acepta múltiples tipos
useClassNames(
  'class1',           // string
  true && 'class2',   // string | false
  null,               // null
  undefined,          // undefined
  someCondition ? 'class3' : null
);
// ✅ Todo funciona correctamente
```

### 3. Performance
- Usa `useMemo` para evitar recalcular en cada render
- Solo recalcula si las clases cambian

### 4. Limpieza Automática
```typescript
useClassNames(
  'px-4   py-2',      // Espacios múltiples
  '  rounded  ',      // Espacios al inicio/final
  false && 'hidden',  // Valor falsy
  className           // Prop del usuario
);
// Resultado limpio: "px-4 py-2 rounded custom-class"
```

---

## 🔄 Comparación

### Sin el Hook

```tsx
// ❌ Repetitivo y propenso a errores
const classes1 = `${base} ${variant} ${size} ${className}`.trim().replace(/\s+/g, " ");
const classes2 = `${base} ${variant} ${size} ${className}`.trim().replace(/\s+/g, " ");
const classes3 = `${base} ${variant} ${size} ${className}`.trim().replace(/\s+/g, " ");

// Si necesitas cambiar la lógica, hay que actualizar 3+ lugares
```

### Con el Hook

```tsx
// ✅ Limpio y mantenible
const classes1 = useClassNames(base, variant, size, className);
const classes2 = useClassNames(base, variant, size, className);
const classes3 = useClassNames(base, variant, size, className);

// Cambios centralizados en un solo lugar
```

---

## 🧪 Testing

### Ejemplo de Test

```typescript
import { renderHook } from '@testing-library/react';
import { useClassNames } from '../hooks';

describe('useClassNames', () => {
  it('combina múltiples clases', () => {
    const { result } = renderHook(() => 
      useClassNames('class1', 'class2', 'class3')
    );
    expect(result.current).toBe('class1 class2 class3');
  });
  
  it('elimina valores falsy', () => {
    const { result } = renderHook(() => 
      useClassNames('class1', false, null, undefined, 'class2')
    );
    expect(result.current).toBe('class1 class2');
  });
  
  it('elimina espacios múltiples', () => {
    const { result } = renderHook(() => 
      useClassNames('class1   class2', '  class3  ')
    );
    expect(result.current).toBe('class1 class2 class3');
  });
});
```

---

## 🎯 Componentes Actualizados

Los siguientes componentes ya usan `useClassNames`:

- ✅ `Button.tsx`
- ✅ `Badge.tsx`
- 🔄 Otros componentes pueden adoptarlo según se necesite

---

## 💡 Alternativas

### Librería clsx

Si prefieres una solución externa:

```bash
npm install clsx
```

```tsx
import clsx from 'clsx';

const classes = clsx(
  'base-class',
  isActive && 'active-class',
  { 'conditional-class': someCondition }
);
```

**Pros:** Más features, ampliamente usado
**Cons:** Dependencia externa adicional

**Nuestra solución:** Sin dependencias, optimizada con `useMemo`, type-safe. ✅

---

## 📖 Referencias

- [React useMemo](https://react.dev/reference/react/useMemo)
- [JavaScript String.prototype.trim()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/trim)
- [JavaScript Regex replace()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/String/replace)

---

**¡Hook centralizado y listo para usar en toda la aplicación!** 🎨✨

