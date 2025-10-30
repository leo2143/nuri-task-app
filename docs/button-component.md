# Componente Button

Componente de botón reutilizable y personalizable con soporte para loading, variantes y tamaños.

## 📦 Ubicación

```
src/components/ui/Button.tsx
```

## 🚀 Uso Básico

```tsx
import Button from '../../components/ui/Button';

function MyComponent() {
  return (
    <Button type="button">
      Haz clic aquí
    </Button>
  );
}
```

## 🎨 Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Tipo del botón HTML |
| `onClick` | `(event) => void` | `undefined` | Función que se ejecuta al hacer clic |
| `disabled` | `boolean` | `false` | Deshabilita el botón |
| `loading` | `boolean` | `false` | Muestra spinner de carga |
| `variant` | `'primary' \| 'secondary' \| 'danger' \| 'success'` | `'primary'` | Variante de color |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `fullWidth` | `boolean` | `false` | El botón ocupa todo el ancho |
| `children` | `React.ReactNode` | - | Contenido del botón |
| `className` | `string` | `''` | Clases CSS adicionales |
| `ariaLabel` | `string` | `undefined` | Etiqueta ARIA para accesibilidad |

## 🎭 Variantes

### Primary (Por defecto)
```tsx
<Button variant="primary">
  Botón Principal
</Button>
```
- Color: Azul primario
- Uso: Acciones principales (guardar, enviar, confirmar)

### Secondary
```tsx
<Button variant="secondary">
  Botón Secundario
</Button>
```
- Color: Warmth (naranja claro)
- Uso: Acciones secundarias (cancelar, volver)

### Danger
```tsx
<Button variant="danger">
  Eliminar
</Button>
```
- Color: Rojo
- Uso: Acciones destructivas (eliminar, descartar)

### Success
```tsx
<Button variant="success">
  Completar
</Button>
```
- Color: Verde
- Uso: Acciones de éxito (completar, aprobar)

## 📏 Tamaños

### Small
```tsx
<Button size="sm">
  Pequeño
</Button>
```

### Medium (Por defecto)
```tsx
<Button size="md">
  Mediano
</Button>
```

### Large
```tsx
<Button size="lg">
  Grande
</Button>
```

## ⏳ Estado de Loading

```tsx
const [loading, setLoading] = useState(false);

<Button 
  loading={loading}
  disabled={loading}
>
  {loading ? 'Cargando' : 'Enviar'}
</Button>
```

Cuando `loading={true}`:
- Muestra un spinner animado
- Se deshabilita automáticamente
- Agrega "..." al texto si es un string

## 🎯 Ejemplos Completos

### Botón de Submit en Formulario

```tsx
<Button
  type="submit"
  loading={loading}
  disabled={loading}
  variant="primary"
  size="lg"
  fullWidth
>
  {loading ? 'Iniciando sesión' : 'Iniciar Sesión'}
</Button>
```

### Botón con onClick

```tsx
const handleDelete = () => {
  console.log('Eliminando...');
};

<Button
  type="button"
  onClick={handleDelete}
  variant="danger"
  size="md"
>
  Eliminar Tarea
</Button>
```

### Botón con Ancho Completo

```tsx
<Button
  type="button"
  variant="primary"
  size="lg"
  fullWidth
>
  Guardar Cambios
</Button>
```

### Botón Deshabilitado

```tsx
<Button
  type="button"
  disabled={!isFormValid}
  variant="primary"
>
  Continuar
</Button>
```

### Botón con Clases Personalizadas

```tsx
<Button
  type="button"
  variant="primary"
  className="mt-4 mb-2"
>
  Mi Botón
</Button>
```

## ♿ Accesibilidad

El componente incluye características de accesibilidad:

- `aria-busy` cuando está en estado loading
- `aria-label` personalizable para lectores de pantalla
- `disabled` impide interacción cuando está deshabilitado
- Focus visible con ring

```tsx
<Button
  type="button"
  ariaLabel="Eliminar usuario permanentemente"
  variant="danger"
>
  Eliminar
</Button>
```

## 🎨 Personalización de Estilos

Si necesitas agregar estilos personalizados, puedes usar la prop `className`:

```tsx
<Button
  type="button"
  variant="primary"
  className="shadow-2xl hover:shadow-3xl"
>
  Botón Personalizado
</Button>
```

## 📍 Componentes que lo usan

- `src/pages/user/Login.tsx` - Botón de login
- `src/pages/user/Register.tsx` - Botón de registro
- `src/pages/tasks/TaskList.tsx` - Botón agregar tarea
- `src/pages/tasks/TaskDetail.tsx` - Botones de editar/eliminar
- `src/pages/Home.tsx` - Botones de llamada a la acción

## 🔄 Comparación Antes/Después

### Antes (Sin componente)
```tsx
<button
  type="submit"
  disabled={loading}
  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold 
    py-3 px-6 rounded-lg shadow-lg hover:shadow-xl
    focus:outline-none focus:ring-4 focus:ring-primary/50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary
    transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
    font-body text-lg"
>
  {loading ? (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5">...</svg>
      Cargando...
    </span>
  ) : (
    'Enviar'
  )}
</button>
```

### Después (Con componente)
```tsx
<Button
  type="submit"
  loading={loading}
  variant="primary"
  size="lg"
  fullWidth
>
  {loading ? 'Cargando' : 'Enviar'}
</Button>
```

## ✅ Ventajas

1. **Código más limpio** - Reduce significativamente el código repetitivo
2. **Consistencia** - Mismos estilos en toda la aplicación
3. **Mantenibilidad** - Cambios centralizados
4. **Accesibilidad** - ARIA y semántica integradas
5. **TypeScript** - Props totalmente tipadas
6. **Responsive** - Funciona en todos los dispositivos

