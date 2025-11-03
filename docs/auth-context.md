# 🔐 Context API de Autenticación

Documentación del sistema de autenticación global usando React Context API.

## 📋 Problema Resuelto

**Antes:** El Navbar no se actualizaba cuando el usuario iniciaba sesión porque leía directamente de `localStorage` sin reactividad.

**Después:** El Navbar se actualiza automáticamente cuando el usuario inicia o cierra sesión usando el contexto global.

---

## 📁 Archivos Creados/Modificados

```
src/
├── context/
│   ├── AuthContext.tsx       # ✅ Nuevo - Contexto de autenticación
│   └── index.ts              # ✅ Nuevo - Exportaciones
├── main.tsx                  # ✅ Modificado - Envuelve app con Provider
├── components/
│   └── Navbar.tsx            # ✅ Modificado - Usa useAuth hook
└── pages/
    └── user/
        └── Login.tsx         # ✅ Modificado - Usa context al login
```

---

## 🔧 Implementación

### 1. Context Provider (`src/context/AuthContext.tsx`)

```typescript
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { IAuthUser } from '../interfaces';

interface AuthContextType {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  login: (user: IAuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: IAuthUser) => void;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar desde localStorage al montar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = (userData: IAuthUser, token: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: IAuthUser) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
```

---

### 2. Envolver la App (`src/main.tsx`)

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { AuthProvider } from './context/AuthContext'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
```

---

### 3. Usar en Navbar (`src/components/Navbar.tsx`)

**Antes:**

```typescript
export default function Navbar() {
  const authToken = localStorage.getItem("authToken");
  const isAuthenticated = authToken !== null;

  let userName = "";
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      userName = user.name || user.email || "Usuario";
    }
  } catch (error) {
    console.error("Error:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    userService.logout();
  };
  // ...
}
```

**Después:**

```typescript
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name || user?.email || "Usuario";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  // ...
}
```

✅ **Ventajas:**

- Código más limpio (12 líneas menos)
- Reactividad automática
- No más parsing manual de JSON
- Tipado correcto con TypeScript

---

### 4. Usar en Login (`src/pages/user/Login.tsx`)

**Antes:**

```typescript
// Guardar en localStorage
localStorage.setItem("user", JSON.stringify(authResponse.user));

// Redirigir
navigate("/");
```

**Después:**

```typescript
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  // En onSubmit después de login exitoso:
  login(authResponse.user, authResponse.token);
  navigate("/");
}
```

✅ **Ventajas:**

- El Navbar se actualiza automáticamente
- Estado sincronizado en toda la app
- No duplicar lógica de guardado

---

## 🎯 API del Hook `useAuth()`

### Propiedades

```typescript
const { user, isAuthenticated, login, logout, updateUser } = useAuth();
```

#### `user: IAuthUser | null`

- Usuario autenticado actual
- `null` si no hay sesión
- Tipo `IAuthUser` (sin password)

**Propiedades de user:**

```typescript
{
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
```

#### `isAuthenticated: boolean`

- `true` si hay sesión activa
- `false` si no hay sesión

#### `login(user: IAuthUser, token: string): void`

- Inicia sesión del usuario
- Guarda en localStorage
- Actualiza estado global

**Ejemplo:**

```typescript
const { login } = useAuth();

const response = await userService.login(credentials);
login(response.user, response.token);
navigate("/");
```

#### `logout(): void`

- Cierra sesión
- Limpia localStorage
- Limpia estado global

**Ejemplo:**

```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  navigate("/login");
};
```

#### `updateUser(user: IAuthUser): void`

- Actualiza información del usuario
- Sincroniza localStorage
- Actualiza estado global

**Ejemplo:**

```typescript
const { user, updateUser } = useAuth();

const handleUpdateProfile = async (newName: string) => {
  const updatedUser = { ...user!, name: newName };
  await userService.updateUser(user!._id, { name: newName });
  updateUser(updatedUser);
};
```

---

## 📦 Uso en Componentes

### Componente Protegido

```typescript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>Contenido protegido</div>;
}
```

### Mostrar Nombre del Usuario

```typescript
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div>
      <h1>Perfil de {user?.name}</h1>
      <p>Email: {user?.email}</p>
      {user?.isAdmin && <p>Rol: Administrador</p>}
    </div>
  );
}
```

### Conditional Rendering

```typescript
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <h1>Bienvenido, {user?.name}!</h1>
      ) : (
        <h1>Bienvenido, invitado</h1>
      )}
    </div>
  );
}
```

---

## 🔒 Rutas Protegidas

### Crear un ProtectedRoute Component

```typescript
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = false
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

### Usar en Routes

```typescript
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        )
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin>
            <AdminPanel />
          </ProtectedRoute>
        )
      }
    ]
  }
]);
```

---

## 🔄 Flujo Completo

### 1. Inicio de Aplicación

```
1. Usuario abre la app
2. AuthProvider monta
3. useEffect lee localStorage
4. Si hay token + user → setUser() → isAuthenticated = true
5. Navbar renderiza con nombre de usuario
```

### 2. Login

```
1. Usuario ingresa credenciales
2. Login.tsx llama userService.login()
3. Backend responde con user + token
4. Login.tsx llama context.login(user, token)
5. Context guarda en localStorage
6. Context actualiza estado (user, isAuthenticated)
7. Navbar se re-renderiza automáticamente ✅
8. Muestra nombre del usuario ✅
```

### 3. Logout

```
1. Usuario hace clic en "Cerrar Sesión"
2. Navbar.tsx llama context.logout()
3. Context limpia localStorage
4. Context actualiza estado (user = null, isAuthenticated = false)
5. Navbar se re-renderiza automáticamente ✅
6. Muestra "Iniciar Sesión" y "Registrarse" ✅
7. Navega a /login
```

### 4. Actualización de Perfil

```
1. Usuario actualiza su nombre
2. Componente llama context.updateUser(newUserData)
3. Context guarda en localStorage
4. Context actualiza estado
5. Navbar se re-renderiza automáticamente ✅
6. Muestra nuevo nombre ✅
```

---

## 🎨 Comparación Antes/Después

### Navbar

| Aspecto              | Antes                | Después               |
| -------------------- | -------------------- | --------------------- |
| **Líneas de código** | ~25                  | ~13                   |
| **Reactividad**      | ❌ No                | ✅ Sí                 |
| **Parsing manual**   | ✅ Sí                | ❌ No                 |
| **Error handling**   | Manual con try/catch | Automático en Context |
| **TypeScript**       | Parcial              | ✅ Completo           |
| **Re-render**        | ❌ Manual            | ✅ Automático         |

### Login

| Aspecto                      | Antes            | Después                |
| ---------------------------- | ---------------- | ---------------------- |
| **Guardado en localStorage** | Manual           | Automático vía Context |
| **Actualización UI**         | ❌ No automática | ✅ Automática          |
| **Código duplicado**         | ✅ Sí            | ❌ No                  |

---

## ✅ Ventajas del Context API

1. **✅ Reactividad Automática**
   - Cambios se propagan a todos los componentes
   - No más lecturas manuales de localStorage

2. **✅ Estado Global**
   - Un solo lugar para el estado de autenticación
   - Consistencia garantizada

3. **✅ Código Más Limpio**
   - Menos boilerplate
   - Menos duplicación

4. **✅ TypeScript**
   - Tipado fuerte en toda la app
   - Autocomplete en el IDE

5. **✅ Fácil de Extender**
   - Agregar nuevas funciones al contexto
   - Agregar nuevos estados (ej: loading)

6. **✅ Testing**
   - Fácil de mockear el contexto
   - Tests más simples

---

## 🧪 Testing

### Mock del Context

```typescript
import { AuthContext } from '../context/AuthContext';

const mockAuthValue = {
  user: {
    _id: '1',
    name: 'Test User',
    email: 'test@test.com',
    isAdmin: false
  },
  isAuthenticated: true,
  login: jest.fn(),
  logout: jest.fn(),
  updateUser: jest.fn()
};

<AuthContext.Provider value={mockAuthValue}>
  <ComponentToTest />
</AuthContext.Provider>
```

---

## 🚀 Próximos Pasos (Opcional)

### 1. Loading State

```typescript
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Verificar localStorage
  setLoading(false);
}, []);

if (loading) return <Loading />;
```

### 2. Persistencia Avanzada

```typescript
// Sincronizar con sessionStorage también
// Verificar expiración de token
// Refresh token automático
```

### 3. Error Handling

```typescript
const [error, setError] = useState<string | null>(null);

try {
  // ...
} catch (err) {
  setError("Error al cargar sesión");
}
```

---

## 📚 Referencias

- [React Context API](https://react.dev/reference/react/useContext)
- [React Patterns - Auth Context](https://react.dev/learn/managing-state#sharing-state-between-components)
- [TypeScript + React Context](https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/context)

---

**¡Autenticación global implementada con éxito!** 🎉✅
