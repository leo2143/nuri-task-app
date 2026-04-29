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

---

## 📱 Enfoque Mobile-First

> **Importante:** Este proyecto está **diseñado principalmente para dispositivos móviles**. La experiencia principal y el flujo de interacción están optimizados para smartphones.

Si bien se ha trabajado para que la interfaz sea **funcional en desktop** para la entrega, el diseño, las interacciones y la experiencia de usuario están pensados específicamente para uso móvil. Algunas características pueden no estar completamente optimizadas para pantallas grandes.

**Recomendación:** Para la mejor experiencia, utiliza el modo de vista móvil en las herramientas de desarrollo del navegador o accede desde un dispositivo móvil.

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

## 🚧 TODO - Próximas Funcionalidades

### Optimización y Rendimiento

- [x] **Lazy Loading** - Code splitting implementado con `React.lazy()` y `Suspense`
- [ ] **Paginación** - Añadir paginación para listas de tareas y metas

### Nuevas Funcionalidades

- [ ] **Logros (Achievements)** - Sistema de logros y recompensas
- [ ] **Moodboards** - Tableros visuales de inspiración
- [ ] **Panel de Admin** - Gestión de usuarios y contenido
- [ ] **Gestión de Usuarios** - Perfil, configuración

### Mejoras de UX/UI

- [ ] **Mejoras en el diseño** - Refinamiento visual y animaciones
- [x] **Filtros avanzados** - Bottom sheet de filtros reutilizable con chips, fechas y toggles
- [ ] **Notificaciones** - Sistema de notificaciones en tiempo real
- [ ] **Tema oscuro** - Soporte para dark mode

## 🔍 Sistema de Filtros Avanzados

### Descripcion General

Se implemento un sistema de filtros reutilizable que permite a los usuarios refinar las listas de datos (tareas, metas, usuarios, logros) mediante un **bottom sheet** que se despliega desde la parte inferior de la pantalla al tocar el boton de filtro en la barra de busqueda.

Los filtros funcionan **en conjunto con la busqueda por texto**: si el usuario tiene filtros activos y escribe en la barra de busqueda, ambos criterios se combinan en una sola peticion al backend.

### Arquitectura y Decisiones de Diseno

#### Componentes creados

| Componente | Ubicacion | Responsabilidad |
|---|---|---|
| `BottomSheet` | `components/ui/BottomSheet.tsx` | Componente generico de panel deslizable desde abajo. Reutilizable para cualquier contenido (no solo filtros). Incluye overlay oscuro, animacion CSS, cierre con Escape, bloqueo de scroll del body. |
| `FilterBottomSheet` | `components/ui/FilterBottomSheet.tsx` | Componente especializado que renderiza filtros dentro de un `BottomSheet`. Soporta tres tipos de filtro: chips (seleccion unica), date (selector de fecha) y toggle (booleano). Maneja un estado interno temporal (draft) que solo se aplica al tocar "Aplicar". |

#### Componentes modificados

| Componente | Cambios | Razon |
|---|---|---|
| `InputFilter` | Se agrego `onFilterPress` y `activeFilterCount` como props. El boton de filtro ahora ejecuta el callback y muestra un badge con la cantidad de filtros activos. | Para conectar el boton existente (que no tenia funcionalidad) con el nuevo bottom sheet, y dar feedback visual al usuario sobre filtros aplicados. |
| `FilterableList` | Se agregaron props `filterConfig`, `activeFilters` y `onFiltersChange`. Maneja internamente el estado de apertura del bottom sheet. | Para centralizar la logica de filtros en el componente de lista reutilizable, evitando duplicar codigo en cada vista. |
| `useFilterableList` | Se agrego estado `activeFilters` y `setActiveFilters`. La firma de `buildFilters` ahora recibe un tercer parametro `activeFilters`. Los filtros activos se incluyen como dependencia del fetch para refetch automatico. | Para que los filtros del bottom sheet se integren con el mismo flujo de datos que ya manejaba la busqueda por texto y la paginacion. |

#### Interfaces creadas

- **`FilterConfig`** (`interfaces/IFilter.ts`): Union type que define la configuracion de cada filtro. Puede ser `ChipFilterConfig` (opciones seleccionables), `DateFilterConfig` (selector de fecha) o `ToggleFilterConfig` (booleano on/off).
- **`FilterValues`** (`interfaces/IFilter.ts`): `Record<string, string | boolean | undefined>` que representa los valores de filtros activos.

#### Por que un bottom sheet y no un dropdown o sidebar

Se eligio un bottom sheet porque:
1. La app es **mobile-first** y el bottom sheet es el patron nativo mas natural en moviles.
2. Permite mostrar multiples secciones de filtros con scroll sin ocupar espacio permanente en la interfaz.
3. Es consistente con el patron de interaccion de la imagen de referencia proporcionada.

#### Por que filtros configurables por vista

Cada vista define su propio array de `FilterConfig[]` porque:
1. Los filtros varian por entidad (tareas tienen prioridad, metas tienen estado, usuarios tienen rol admin, etc.).
2. El backend ya soporta diferentes query params por endpoint.
3. Mantiene la flexibilidad: agregar o quitar filtros en una vista solo requiere modificar el array de configuracion, sin tocar los componentes compartidos.

#### Por que estado draft en el bottom sheet

El `FilterBottomSheet` mantiene un estado temporal (`draft`) que se sincroniza con los filtros activos al abrir y solo se aplica al tocar "Aplicar". Esto evita peticiones intermedias al backend mientras el usuario esta seleccionando filtros. La sincronizacion del draft se realiza mediante un `useEffect` que detecta el cambio de `isOpen` a `true`, en lugar de hacerlo durante el render, para evitar warnings de React por llamar `setState` durante la fase de render de otro componente.

#### Manejo de estado vacio y mensajes de resultados

Cuando se aplican filtros (con o sin texto de busqueda) y no se encuentran resultados, la interfaz muestra:
1. Un mensaje contextual que indica la cantidad de resultados junto con los criterios aplicados (ej: "Mostrando 0 resultados para 'texto' con 2 filtros").
2. El componente `StateMessage` con variante `notFoundList` para comunicar visualmente que no hay datos.

Esto se logra limpiando los datos acumulados (`accumulatedData`) en `useFilterableList` cuando la respuesta de la API es vacia o falla, en lugar de mantener los datos de la consulta anterior. De esta forma, `isEmpty` se evalua correctamente como `true` y el estado vacio se renderiza. Previamente, los datos viejos persistian despues de un cambio de filtros sin resultados, causando que la lista siguiera mostrando datos obsoletos en vez del mensaje de "no encontrado".

### Filtros implementados por vista

| Vista | Filtros disponibles | Query params enviados al backend |
|---|---|---|
| **Tareas** (`TaskList`) | Prioridad (baja/media/alta), Fecha desde, Fecha hasta | `priority`, `dueDateFrom`, `dueDateTo` |
| **Metas** (`GoalList`) | Estado (activa/pausada/completada), Prioridad (baja/media/alta), Fecha desde, Fecha hasta | `status`, `priority`, `dueDateFrom`, `dueDateTo` |
| **Admin Usuarios** (`AdminUser`) | Administrador (toggle), Suscrito (toggle), Creado desde, Creado hasta | `isAdmin`, `isSubscribed`, `createdFrom`, `createdTo` |
| **Admin Logros** (`AdminAchievement`) | Tipo (tarea/meta/metrica/racha), Activo (toggle) | `type`, `isActive` |

### Interfaces de filtros actualizadas

Se agregaron campos `dueDateFrom` y `dueDateTo` a `ITodoFilters` e `IGoalFilters` para alinear las interfaces del frontend con los query params que el backend ya soportaba pero no se estaban utilizando. Los servicios `todoService` y `goalService` tambien fueron actualizados para enviar estos parametros.

---

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

el proyecto tambien se encuentra ya desplegado y funcional en vercel
https://nuri-task-app.vercel.app/login
https://nuri-task-api.vercel.app

---

## 📚 Referencias y Documentación

Recursos utilizados durante el desarrollo del proyecto:

### Optimización y Rendimiento

- **React Lazy Loading** - [https://react.dev/reference/react/lazy](https://react.dev/reference/react/lazy)
  - Documentación oficial de React para implementar code splitting con `lazy()` y `Suspense`

## 👨‍💻 Autor

Orellana leonardo y Figueredo Sofia.
