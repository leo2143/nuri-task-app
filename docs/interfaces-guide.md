# Interfaces TypeScript - Nuri Task App

Este directorio contiene todas las interfaces TypeScript para los modelos de datos de la aplicación. Las interfaces están basadas en los esquemas de Mongoose del backend.

## 📁 Estructura de Archivos

```
src/interfaces/
├── index.ts                    # Barrel file - Exportaciones centralizadas
├── IUser.ts                    # Interface de Usuario
├── ITodo.ts                    # Interface de Tareas
├── IGoal.ts                    # Interface de Metas
├── IMetrics.ts                 # Interface de Métricas de Progreso
├── IMoodboard.ts               # Interface de Tablero de Inspiración
├── IAchievement.ts             # Interface de Logros (Plantillas Globales)
├── IUserAchievement.ts         # Interface de Progreso de Logros de Usuario
└── IApiResponse.ts             # Interfaces de Respuestas de API
```

## 📋 Interfaces Disponibles

### 1. **IUser** - Usuario

Define la estructura de un usuario en el sistema.

**Propiedades principales:**

- `name`, `email`, `password`
- `role`: `'user' | 'admin'`
- `isActive`: Estado del usuario

**Interfaces relacionadas:**

- `ICreateUser` - Para registrar usuarios
- `IUpdateUser` - Para actualizar datos
- `ILoginUser` - Para autenticación
- `IAuthUser` - Usuario sin password
- `IAuthResponse` - Respuesta de login con token

**Ejemplo:**

```typescript
import { IUser, ICreateUser } from "@/interfaces";

const newUser: ICreateUser = {
  name: "Juan Pérez",
  email: "juan@example.com",
  password: "securePassword123",
};
```

---

### 2. **ITodo** - Tarea

Representa una tarea individual del usuario.

**Propiedades principales:**

- `title`, `description`, `completed`
- `priority`: `'low' | 'medium' | 'high'`
- `dueDate`: Fecha límite
- `GoalId`: Referencia a meta (opcional)
- `comments`: Array de comentarios

**Interfaces relacionadas:**

- `ICreateTodo` - Crear tarea
- `IUpdateTodo` - Actualizar tarea
- `IAddTodoComment` - Agregar comentario

**Ejemplo:**

```typescript
import { ITodo, ICreateTodo } from "@/interfaces";

const newTask: ICreateTodo = {
  title: "Estudiar React",
  description: "Repasar hooks y context",
  priority: "high",
  userId: "123456",
  dueDate: new Date("2025-11-01"),
};
```

---

### 3. **IGoal** - Meta

Representa una meta SMART del usuario.

**Propiedades principales:**

- `title`, `description`
- `status`: `'active' | 'paused' | 'completed'`
- `priority`: `'low' | 'medium' | 'high'`
- `smart`: Criterios SMART completos
- `dueDate`: Fecha límite
- `metricsId`: Referencia a métricas

**Interfaces relacionadas:**

- `ICreateGoal` - Crear meta
- `IUpdateGoal` - Actualizar meta
- `ISmartCriteria` - Criterios SMART
- `IAddGoalComment` - Agregar comentario

**Ejemplo:**

```typescript
import { IGoal, ICreateGoal } from "@/interfaces";

const newGoal: ICreateGoal = {
  title: "Aprender TypeScript",
  description: "Dominar TypeScript avanzado",
  priority: "high",
  userId: "123456",
  smart: {
    specific: "Completar curso de TypeScript avanzado",
    measurable: "Aprobar 5 proyectos prácticos",
    achievable: "Dedicar 2 horas diarias",
    relevant: "Necesario para mi trabajo",
    timeBound: "En 3 meses",
  },
  dueDate: new Date("2025-12-31"),
};
```

---

### 4. **IMetrics** - Métricas de Progreso

Interface compleja que rastrea el progreso detallado de una meta.

**Categorías de métricas:**

#### 📊 Progreso Básico

- `currentProgress` (0-100)
- `totalCompletedTasks`, `totalTasks`, `missingTasks`
- `currentWeek`, `currentNotes`

#### 📈 Velocidad y Tendencias

- `averageWeeklyProgress`
- `progressTrend`: `'improving' | 'declining' | 'stable' | 'stagnant'`
- `taskCompletionRate`

#### 🏆 Hitos y Logros

- `milestones`: Array de hitos con progreso objetivo
- `currentStreak`, `bestStreak`: Rachas de progreso

#### ⚡ Calidad y Eficiencia

- `estimatedTimeInvested` (horas)
- `efficiency`: Progreso por hora
- `qualityScore` (0-5)

#### 🔮 Predicciones

- `projectedCompletionDate`: Fecha estimada
- `expectedProgress`: Progreso esperado según timeline
- `progressDeviation`: Adelanto/retraso

#### 🚧 Contexto

- `blockers`: Obstáculos con severidad
- `weeklyWins`: Logros semanales
- `taskBreakdown`: Tareas por prioridad

#### 🔔 Alertas

- `alerts`: Notificaciones del sistema
- `healthStatus`: `'excellent' | 'good' | 'at-risk' | 'critical'`

#### 📚 Historial

- `history`: Registro semanal completo con mood y logros

**Interfaces relacionadas:**

- `ICreateMetrics`, `IUpdateMetrics`
- `IMilestone`, `IBlocker`, `IWeeklyWin`, `IAlert`
- `IWeeklyHistory`, `ITaskBreakdown`

**Ejemplo:**

```typescript
import { IMetrics, IAddHistoryEntry } from "@/interfaces";

const historyEntry: IAddHistoryEntry = {
  week: "Semana 5",
  totalCompletedTasks: 8,
  totalTasks: 10,
  missingTasks: 2,
  progress: 60,
  timeInvested: 15,
  notes: "Buen progreso esta semana",
  mood: "motivated",
  achievements: ["Completé el módulo 3"],
};
```

---

### 5. **IMoodboard** - Tablero de Inspiración

Tablero visual con imágenes y frases motivacionales.

**Propiedades principales:**

- `title`: Título del moodboard
- `images`: Array de imágenes con URL, alt y posición
- `phrases`: Array de frases inspiradoras

**Interfaces relacionadas:**

- `ICreateMoodboard`, `IUpdateMoodboard`
- `IMoodboardImage`, `IMoodboardPhrase`

**Ejemplo:**

```typescript
import { ICreateMoodboard } from "@/interfaces";

const moodboard: ICreateMoodboard = {
  title: "Mi Inspiración 2025",
  userId: "123456",
  images: [
    {
      imageUrl: "https://example.com/image1.jpg",
      imageAlt: "Montaña al amanecer",
      imagePositionNumber: 1,
    },
  ],
  phrases: [
    { phrase: "Nunca te rindas" },
    { phrase: "Cada día es una nueva oportunidad" },
  ],
};
```

---

### 6. **IAchievement** - Logros Globales (Plantillas)

Plantillas de logros que aplican a todos los usuarios. Solo administradores pueden gestionarlas.

**Propiedades principales:**

- `title`, `description`
- `targetCount`: Meta para desbloquear
- `reward`: Recompensa
- `type`: `'task' | 'goal' | 'metric' | 'streak' | 'comment'`
- `isActive`: Si está activo

**Interfaces relacionadas:**

- `ICreateAchievement`, `IUpdateAchievement` (solo admin)

**Ejemplo:**

```typescript
import { ICreateAchievement } from "@/interfaces";

const achievement: ICreateAchievement = {
  title: "Primeros Pasos",
  description: "Completa tu primera tarea",
  targetCount: 1,
  type: "task",
  reward: "Estrella de Bronce",
};
```

---

### 7. **IUserAchievement** - Progreso Individual de Logros

Rastrea el progreso de cada usuario en cada logro.

**Propiedades principales:**

- `userId`, `achievementId`
- `currentCount`: Progreso actual
- `status`: `'locked' | 'unlocked' | 'completed'`
- `unlockedAt`, `completedAt`: Fechas de desbloqueo/completado

**Interfaces relacionadas:**

- `ICreateUserAchievement`, `IUpdateUserAchievement`

**Ejemplo:**

```typescript
import { IUserAchievement } from "@/interfaces";

const userProgress: IUserAchievement = {
  userId: "123456",
  achievementId: "789abc",
  currentCount: 3,
  status: "unlocked",
  unlockedAt: new Date(),
};
```

---

### 8. **IApiResponse** - Respuestas de API

Define la estructura estándar de todas las respuestas de la API.

**Interfaces disponibles:**

- `ISuccessResponse<T>` - Respuesta exitosa con datos
- `IErrorResponse` - Error genérico
- `INotFoundResponse` - Recurso no encontrado (404)
- `ICreatedResponse<T>` - Recurso creado (201)
- `IValidationErrorResponse` - Error de validación (400)
- `ApiResponse<T>` - Tipo unión de todas las anteriores

**Ejemplo:**

```typescript
import { ISuccessResponse, ITodo } from '@/interfaces';

const response: ISuccessResponse<ITodo[]> = {
  message: 'Tareas obtenidas exitosamente',
  status: 200,
  data: [...],
  count: 10,
  success: true
};
```

---

## 🎯 Mejores Prácticas

### 1. **Importación Centralizada**

Siempre importa desde el barrel file `index.ts`:

```typescript
// ✅ Correcto
import { ITodo, IGoal, IUser } from "@/interfaces";

// ❌ Incorrecto
import { ITodo } from "@/interfaces/ITodo";
import { IGoal } from "@/interfaces/IGoal";
```

### 2. **Tipado Estricto**

Usa las interfaces apropiadas según el contexto:

```typescript
// Al crear
const createData: ICreateTodo = { ... };

// Al actualizar
const updateData: IUpdateTodo = { ... };

// Al mostrar
const todo: ITodo = { ... };
```

### 3. **Tipos de Unión**

Aprovecha los tipos exportados:

```typescript
import { TodoPriority, GoalStatus } from "@/interfaces";

const priority: TodoPriority = "high"; // Type-safe
const status: GoalStatus = "active"; // Type-safe
```

### 4. **Generics en Respuestas**

Usa genéricos para tipar respuestas de API:

```typescript
import { ISuccessResponse, ITodo } from "@/interfaces";

async function getTodos(): Promise<ISuccessResponse<ITodo[]>> {
  // ...
}
```

---

## 🔄 Sincronización con el Backend

Estas interfaces están sincronizadas con los modelos de Mongoose del backend:

- `userAchievementModel.js` → `IUserAchievement.ts`
- `todoModel.js` → `ITodo.ts`
- `goalsModel.js` → `IGoal.ts`
- `metricsModel.js` → `IMetrics.ts`
- `moodboardModel.js` → `IMoodboard.ts`
- `achievementModel.js` → `IAchievement.ts`
- `responseModel.js` → `IApiResponse.ts`

**⚠️ Importante**: Al modificar los modelos del backend, actualiza las interfaces correspondientes.

---

## 📚 Recursos Adicionales

- [TypeScript Handbook - Interfaces](https://www.typescriptlang.org/docs/handbook/interfaces.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- Mongoose Schemas: Ver archivos `*Model.js` en el backend

---

**Última actualización**: 2025-10-25
