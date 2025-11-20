# 🌸 Nuri Task App

## 💚 La Visión

**Nuri Task** no es una app más de listas. Es una aplicación creada para ayudarte a construir hábitos y cumplir tus metas de una forma **emocionalmente acompañada, sin presión y sin culpas**.

### ¿Qué hace diferente a Nuri?

Descubrimos que el verdadero problema no es la falta de disciplina, sino la **falta de motivación emocional**. Por eso **Nuri** —tu pequeño compañero— está diseñado para guiarte con calidez en cada paso.

**El propósito de Nuri es:**

🌱 **Acompañarte, no exigirte**
La idea no es que hagas más cosas, sino que te sientas mejor haciéndolas.

🎯 **Ayudarte a crear hábitos sostenibles**
Crear metas, dividirlas en pequeñas tareas manejables, marcar tus avances y recibir apoyo emocional.

💚 **Hacer el proceso amable y disfrutable**
Un espacio donde no te sientes solo, donde no se te juzga por fallar, y donde cada acción tiene un sentido.

✨ **Darte una experiencia más humana**
Celebramos tus progresos y te acompañamos en el camino, con mensajes cálidos y motivadores.

---

## 📖 Estado Actual del Proyecto

> **Nota:** Este proyecto está en **etapa inicial de desarrollo**. La visión completa de Nuri (con acompañamiento emocional, mensajes motivadores y experiencia personalizada) aún no está completamente implementada. Actualmente cuenta con las funcionalidades base técnicas.

### ¿Qué está implementado ahora?

El proyecto actualmente es una aplicación web fullstack (MERN Stack) con:

- ✅ **Sistema de autenticación** completo con JWT (registro, login, recuperación de contraseña)
- ✅ **Gestión de tareas (Todos)** - CRUD completo con prioridades, fechas de vencimiento y estados
- ✅ **Gestión de metas (Goals)** - CRUD completo con seguimiento de progreso y estados
- ✅ **Jerarquía de metas** - Relación entre metas principales y submetas
- ✅ **Vinculación tareas-metas** - Conectar acciones diarias con objetivos mayores
- ✅ **API REST completa** - Backend con validación de datos y endpoints documentados

### 🚀 Hacia dónde vamos

La visión completa de Nuri incluirá:

- Mensajes motivadores y acompañamiento emocional personalizado
- Sistema de logros que celebra tu progreso
- Moodboards visuales de inspiración
- Interfaz diseñada para generar bienestar, no presión
- Experiencia que prioriza cómo te sientes, no solo qué haces

## 🚀 Tecnologías Utilizadas

### Frontend

- **React 19** - Última versión con mejoras de rendimiento
- **TypeScript** - Type safety y mejor DX
- **Vite** - Build tool ultra rápido
- **React Router DOM v6** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Cliente HTTP con interceptores
- **Context API** - State management global

### Backend (API REST)

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Encriptación de contraseñas

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v18 o superior)
- **npm** o **yarn**
- **Backend API** corriendo en `http://localhost:8888` (o configurar otra URL)

## 📦 Instalación y Ejecución

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=
VITE_API_TIMEOUT=10000
```

**Nota:** El `VITE_API_BASE_URL` vacío usa el proxy configurado en `vite.config.ts` que apunta a `http://localhost:8888`.

### 3. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### 4. Comandos adicionales

```bash
# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 🔧 Configuración del Backend

El frontend está configurado para conectarse a un backend en `http://localhost:8888`.

**Importante:** Asegúrate de que el backend esté corriendo antes de iniciar el frontend.

Para cambiar la URL del backend:

- **Desarrollo:** Modifica `vite.config.ts` (proxy)
- **Producción:** Configura `VITE_API_BASE_URL` en las variables de entorno

## 📁 Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
│   ├── Alert.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   ├── Loading.tsx
│   └── Navbar.tsx
├── config/          # Configuración de axios y env
│   ├── axios.ts
│   └── env.ts
├── context/         # React Context para state global
│   └── AuthContext.tsx
├── interfaces/      # TypeScript interfaces
├── pages/           # Componentes de páginas
│   ├── Home.tsx
│   ├── tasks/
│   └── user/
├── routes/          # Configuración de React Router
│   └── router.tsx
├── services/        # Servicios API
│   └── userService.ts
└── main.tsx         # Entry point
```

## 🎨 Funcionalidades Implementadas

### Autenticación y Usuarios

- ✅ **Registro de usuarios** con validación de datos
- ✅ **Login** con JWT y persistencia de sesión
- ✅ **Recuperación de contraseña** (forgot password con token)
- ✅ **Reset de contraseña** con validación de token
- ✅ **Rutas protegidas** con redirección automática

### Gestión de Tareas (Todos)

- ✅ **Crear tareas** con título, descripción, prioridad y fecha de vencimiento
- ✅ **Listar tareas** del usuario autenticado
- ✅ **Ver detalles** de cada tarea
- ✅ **Editar tareas** existentes
- ✅ **Eliminar tareas**
- ✅ **Marcar como completada/incompleta** (checkbox interactivo)
- ✅ **Vincular tareas a metas** (relación opcional)

### Gestión de Metas (Goals)

- ✅ **Crear metas** con objetivos SMART (específicos, medibles, alcanzables)
- ✅ **Listar metas** con estados (activo, pausado, completado)
- ✅ **Ver detalles** de cada meta
- ✅ **Editar metas** existentes
- ✅ **Eliminar metas**
- ✅ **Jerarquía de submetas** - Asociar metas como submetas de otras
- ✅ **Catálogo de metas** para selección en formularios

### Características Técnicas

- ✅ **Arquitectura modular** con separación de concerns
- ✅ **Validación de datos** en frontend y backend
- ✅ **Interceptores de Axios** para tokens automáticos
- ✅ **Gestión de estado global** con Context API
- ✅ **Manejo de errores** centralizado
- ✅ **UI moderna y responsive** con Tailwind CSS
- ✅ **Accesibilidad** (ARIA labels, keyboard navigation)
- ✅ **Type-safe** con TypeScript en todo el proyecto

## 🚧 TODO - Próximas Funcionalidades

### Optimización y Rendimiento

- [ ] **Lazy Loading** - Implementar code splitting con `React.lazy()` y `Suspense`
- [ ] **Paginación** - Añadir paginación para listas de tareas y metas

### Nuevas Funcionalidades

- [ ] **Logros (Achievements)** - Sistema de logros y recompensas
- [ ] **Moodboards** - Tableros visuales de inspiración
- [ ] **Panel de Admin** - Gestión de usuarios y contenido
- [ ] **Gestión de Usuarios** - Perfil, configuración

### Mejoras de UX/UI

- [ ] **Mejoras en el diseño** - Refinamiento visual y animaciones
- [ ] **Filtros avanzados** - Búsqueda y filtrado mejorado
- [ ] **Notificaciones** - Sistema de notificaciones en tiempo real
- [ ] **Tema oscuro** - Soporte para dark mode

## 🔌 API Endpoints

Endpoints del backend consumidos por las vistas del frontend.

### 👤 Autenticación y Usuarios

| Método | Endpoint                               | Descripción                          | Usado en             |
| ------ | -------------------------------------- | ------------------------------------ | -------------------- |
| `POST` | `/api/users/login`                     | Iniciar sesión                       | `Login.tsx`          |
| `POST` | `/api/users`                           | Registrar nuevo usuario              | `Register.tsx`       |
| `POST` | `/api/users/forgot-password`           | Solicitar recuperación de contraseña | `ForgotPassword.tsx` |
| `GET`  | `/api/users/verify-reset-token/:token` | Verificar token de recuperación      | `ResetPassword.tsx`  |
| `POST` | `/api/users/reset-password`            | Resetear contraseña con token        | `ResetPassword.tsx`  |

---

### ✅ Tareas (Todos)

Requieren autenticación con JWT.

| Método   | Endpoint               | Descripción                   | Usado en                                   |
| -------- | ---------------------- | ----------------------------- | ------------------------------------------ |
| `GET`    | `/api/todos`           | Listar tareas del usuario     | `TaskList.tsx`                             |
| `GET`    | `/api/todos/:id`       | Obtener detalles de una tarea | `TaskDetail.tsx`, `taskForm.tsx` (edición) |
| `POST`   | `/api/todos`           | Crear nueva tarea             | `taskForm.tsx`                             |
| `PUT`    | `/api/todos/:id`       | Actualizar tarea              | `taskForm.tsx`                             |
| `PATCH`  | `/api/todos/:id/state` | Cambiar estado completado     | `TaskList.tsx` (checkbox)                  |
| `DELETE` | `/api/todos/:id`       | Eliminar tarea                | `TaskDetail.tsx`                           |

---

### 🎯 Metas (Goals)

Requieren autenticación con JWT.

| Método   | Endpoint                  | Descripción                      | Usado en                                   |
| -------- | ------------------------- | -------------------------------- | ------------------------------------------ |
| `GET`    | `/api/goals`              | Listar metas del usuario         | `GoalList.tsx`                             |
| `GET`    | `/api/goals/catalogs`     | Catálogo de metas (id + title)   | `taskForm.tsx`, `GoalSubGoalForm.tsx`      |
| `GET`    | `/api/goals/:id`          | Obtener detalles de una meta     | `GoalDetail.tsx`, `GoalForm.tsx` (edición) |
| `POST`   | `/api/goals`              | Crear nueva meta                 | `GoalForm.tsx`                             |
| `PATCH`  | `/api/goals/:id`          | Actualizar meta                  | `GoalForm.tsx`                             |
| `PATCH`  | `/api/goals/:id/subgoals` | Asociar submeta a una meta padre | `GoalSubGoalForm.tsx`                      |
| `DELETE` | `/api/goals/:id`          | Eliminar meta                    | `GoalDetail.tsx`                           |

### 🔐 Autenticación

Los endpoints protegidos requieren un token JWT:

```http
Authorization: Bearer <token>
```

El token se obtiene en el login y se añade automáticamente a las peticiones mediante interceptores de Axios (`src/config/axios.ts`).

---

## 👨‍💻 Autor

Orellana leonardo y Figueredo Sofia.
