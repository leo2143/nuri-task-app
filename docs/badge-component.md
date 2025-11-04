# Badge Component

## Descripción
Componente reutilizable para mostrar etiquetas (badges) como prioridades, estados, etc.

## Ubicación
`src/components/ui/Badge.tsx`

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `"priority" \| "status" \| "default"` | `"default"` | Variante del badge |
| `priority` | `"high" \| "medium" \| "low"` | `undefined` | Nivel de prioridad (requerido si variant="priority") |
| `label` | `string` | `undefined` | Etiqueta personalizada del badge |
| `className` | `string` | `""` | Clases CSS adicionales |
| `children` | `React.ReactNode` | `undefined` | Contenido personalizado del badge |

## Uso

### Badge de Prioridad

```tsx
import { Badge } from "../../components/ui";

// Prioridad Alta (rojo)
<Badge variant="priority" priority="high" />
// Muestra: "Prioridad Alta"

// Prioridad Media (amarillo)
<Badge variant="priority" priority="medium" />
// Muestra: "Prioridad Media"

// Prioridad Baja (verde)
<Badge variant="priority" priority="low" />
// Muestra: "Prioridad Baja"

// Con label personalizado
<Badge variant="priority" priority="high" label="Urgencia" />
// Muestra: "Urgencia Alta"
```

### Badge Personalizado

```tsx
// Con children (contenido personalizado)
<Badge>
  Personalizado
</Badge>

// Con label simple
<Badge label="Nuevo" />

// Con clases adicionales
<Badge 
  variant="priority" 
  priority="high" 
  className="animate-pulse"
/>
```

## Estilos por Prioridad

- **high**: `bg-red-100 text-red-800 border-red-300` (Rojo)
- **medium**: `bg-yellow-100 text-yellow-800 border-yellow-300` (Amarillo)
- **low**: `bg-green-100 text-green-800 border-green-300` (Verde)

## Ejemplos de Uso en la Aplicación

### TaskDetail.tsx
```tsx
<Badge variant="priority" priority={task.priority} />
```

## Características

- ✅ **Reutilizable**: Puede ser usado en cualquier parte de la aplicación
- ✅ **Flexible**: Soporta contenido personalizado y variantes
- ✅ **Accesible**: Usa HTML semántico (`<span>`)
- ✅ **Type-safe**: TypeScript con tipos estrictos
- ✅ **Responsive**: Estilos adaptables
- ✅ **Extensible**: Fácil de agregar nuevas variantes

## Extensibilidad

Para agregar nuevas variantes o tipos de prioridad:

1. Actualiza el tipo `BadgeVariant` o `Priority`
2. Agrega los estilos correspondientes en las funciones helper
3. TypeScript asegurará type-safety

```typescript
// Ejemplo: Agregar prioridad "urgent"
type Priority = "high" | "medium" | "low" | "urgent";

// Agregar estilos en getPriorityStyles
case "urgent":
  return "bg-purple-100 text-purple-800 border-purple-300";
```

## Buenas Prácticas

- Usa `variant="priority"` con la prop `priority` para badges de prioridad
- Usa `children` para contenido completamente personalizado
- Usa `label` para etiquetas simples de texto
- Usa `className` solo para ajustes menores, no para sobrescribir completamente los estilos

## Integración con el Sistema de Diseño

Este componente sigue las reglas del proyecto:
- ✅ HTML semántico (`<span>`)
- ✅ Tailwind CSS para estilos
- ✅ TypeScript para type-safety
- ✅ Props intuitivas y bien documentadas
- ✅ Accesibilidad considerada

