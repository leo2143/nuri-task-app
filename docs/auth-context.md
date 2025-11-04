# 🔐 Context API de Autenticación

Documentación del sistema de autenticación global usando React Context API.

## 📋 Problema Resuelto

**Antes:** El Navbar no se actualizaba cuando el usuario iniciaba sesión porque leía directamente de `localStorage` sin reactividad.

**Después:** El Navbar se actualiza automáticamente cuando el usuario inicia o cierra sesión usando el contexto global.

---

## 📁 Estructura de Archivos

```
src/
├── context/
│   ├── AuthContext.tsx  # Contexto y Provider (solo componente)
│   └── index.ts         # Exporta AuthProvider y tipos
└── hooks/
    ├── useAuth.ts       # Hook personalizado para usar el contexto
    └── index.ts         # Exporta todos los hooks
```

## ⚡ ¿Por qué están separados?

El hook `useAuth` está en un archivo separado del `AuthProvider` para cumplir con las **reglas de Fast Refresh** de React.

### Problema Anterior (❌)

```tsx
// AuthContext.tsx exportaba ambos
export function AuthProvider() {
  /* ... */
} // Componente
export function useAuth() {
  /* ... */
} // Hook

// ⚠️ Warning: Fast refresh only works when a file only exports components
```

### Solución Actual (✅)

```tsx
// src/context/AuthContext.tsx - Solo componente
export function AuthProvider() {
  /* ... */
}
export { AuthContext }; // Para que el hook lo use
export type { AuthContextType }; // Tipos

// src/hooks/useAuth.ts - Solo hook
export function useAuth() {
  /* ... */
}
```

**Resultado:** ✅ Sin warnings, Fast Refresh funciona perfectamente.

---

## 🔧 Implementación

### 1. Context Provider (`src/context/AuthContext.tsx`)

```typescript
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { IAuthUser } from "../interfaces";

export interface AuthContextType {
  user: IAuthUser | null;
  isAuthenticated: boolean;
  login: (user: IAuthUser, token: string) => void;
  logout: () => void;
  updateUser: (user: IAuthUser) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Exportar el contexto para que pueda ser usado por el hook
export { AuthContext };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IAuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Inicializar desde localStorage al montar
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = (userData: IAuthUser, token: string) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (userData: IAuthUser) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 2. Custom Hook (`src/hooks/useAuth.ts`)

```typescript
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Custom hook para acceder al contexto de autenticación
 * @throws {Error} Si se usa fuera del AuthProvider
 * @returns {AuthContextType} El contexto de autenticación
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
```

---

## 📦 Uso

### Importar el Provider

```tsx
import { AuthProvider } from "../context";
```

### Importar el Hook

```tsx
import { useAuth } from "../hooks";
// O específicamente:
import { useAuth } from "../hooks/useAuth";
```

### Envolver la App (`src/main.tsx`)

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'
import { AuthProvider } from './context'
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
import { useAuth } from "../hooks";

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
import { useAuth } from "../hooks";

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
import { useAuth } from "../hooks";

const { user, updateUser } = useAuth();

const handleUpdateProfile = async (newName: string) => {
  const updatedUser = { ...user!, name: newName };
  await userService.updateUser(user!._id, { name: newName });
  updateUser(updatedUser);
};
```

---

## 📦 Uso en Componentes

### Navbar

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
import { useAuth } from "../hooks";

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

### Login Page

```typescript
import { useAuth } from "../../hooks";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent) => {
    // ... validación ...

    const authResponse = await userService.login(loginData);

    // ✅ Usa el contexto en lugar de localStorage directamente
    login(authResponse.user, authResponse.token);

    navigate("/");
  };
}
```

### Componente Protegido

```typescript
import { useAuth } from '../hooks';
import { Navigate } from 'react-router-dom';

export default function ProtectedPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <div>Contenido protegido</div>;
}
```

### Mostrar Datos del Usuario

```typescript
import { useAuth } from '../hooks';

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

5. **✅ Fast Refresh Compatible**
   - Sin warnings de ESLint
   - Hot Module Replacement funciona correctamente

6. **✅ Fácil de Extender**
   - Agregar nuevas funciones al contexto
   - Agregar nuevos estados (ej: loading)

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

## 📚 Referencias

- [React Context API](https://react.dev/reference/react/useContext)
- [React Fast Refresh](https://github.com/facebook/react/tree/main/packages/react-refresh)
- [ESLint react-refresh plugin](https://github.com/ArnaudBarre/eslint-plugin-react-refresh)

---

**¡Autenticación global implementada con Fast Refresh compatible!** 🎉✅
