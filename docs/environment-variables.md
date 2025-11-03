# Guía de Configuración de Variables de Entorno en Vite

## ❌ Problema Original

```typescript
// ❌ INCORRECTO - No funciona en Vite
process.env.NODE_ENV + "/api/users";
```

**Problemas:**

1. `process.env` NO existe en Vite (es de Node.js/Webpack)
2. `NODE_ENV` no es una URL, es el entorno: `'development'` o `'production'`
3. Concatenar el entorno con la ruta no tiene sentido

---

## ✅ Solución Correcta para Vite

### 1. **Variables de Entorno en Vite**

En Vite, todas las variables que quieras exponer al frontend **DEBEN** empezar con `VITE_`:

```bash
# ✅ Correcto
VITE_API_BASE_URL=http://localhost:3000

# ❌ Incorrecto (no será accesible)
API_BASE_URL=http://localhost:3000
```

### 2. **Crear Archivos `.env`**

Crea estos archivos en la raíz del proyecto:

#### `.env.development` (para desarrollo local)

```bash
# URL base del API en desarrollo
VITE_API_BASE_URL=http://localhost:3000

# Timeout para peticiones (opcional)
VITE_API_TIMEOUT=10000
```

#### `.env.production` (para producción)

```bash
# URL base del API en producción
VITE_API_BASE_URL=https://tu-api-produccion.com

# Timeout para peticiones
VITE_API_TIMEOUT=30000
```

#### `.env.example` (template para el equipo)

```bash
# Copia este archivo como .env.development y configura tus valores
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=10000
```

### 3. **Actualizar `.gitignore`**

Asegúrate de que `.gitignore` incluya:

```gitignore
# Variables de entorno
.env
.env.local
.env.development.local
.env.production.local

# NO ignorar .env.example (se debe subir a git)
```

---

## 📁 Estructura de Archivos Creada

```
src/
├── config/
│   ├── env.ts          # Exporta variables de entorno
│   └── axios.ts        # Cliente HTTP configurado
└── services/
    └── userService.ts  # Servicio de usuarios
```

---

## 🔧 Cómo Usar las Variables de Entorno

### En el código TypeScript:

```typescript
// ✅ Forma correcta en Vite
import { API_BASE_URL, IS_DEVELOPMENT, NODE_ENV } from "@/config/env";

console.log(API_BASE_URL); // 'http://localhost:3000'
console.log(IS_DEVELOPMENT); // true
console.log(NODE_ENV); // 'development'

// También puedes acceder directamente:
console.log(import.meta.env.VITE_API_BASE_URL); // 'http://localhost:3000'
console.log(import.meta.env.MODE); // 'development'
console.log(import.meta.env.PROD); // false
console.log(import.meta.env.DEV); // true
```

---

## 📝 Variables de Entorno Disponibles en Vite

### Variables Predefinidas (siempre disponibles):

| Variable                   | Tipo      | Descripción                      |
| -------------------------- | --------- | -------------------------------- |
| `import.meta.env.MODE`     | `string`  | `'development'` o `'production'` |
| `import.meta.env.BASE_URL` | `string`  | Base URL configurada             |
| `import.meta.env.PROD`     | `boolean` | `true` en producción             |
| `import.meta.env.DEV`      | `boolean` | `true` en desarrollo             |
| `import.meta.env.SSR`      | `boolean` | `true` en server-side rendering  |

### Variables Personalizadas (deben empezar con `VITE_`):

```typescript
VITE_API_BASE_URL; // Tu URL del API
VITE_API_TIMEOUT; // Timeout personalizado
VITE_ENABLE_ANALYTICS; // Features flags
VITE_APP_VERSION; // Versión de la app
```

---

## 🎯 Ejemplo de Uso Completo

### 1. Crear archivo `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Usar en tu servicio:

```typescript
import apiClient from "../config/axios";

export const userService = {
  getUsers: async () => {
    // La URL base ya está configurada en axios.ts
    // Solo necesitas la ruta relativa
    const response = await apiClient.get("/api/users");
    return response.data;
  },
};
```

### 3. Llamar el servicio desde un componente:

```typescript
import { userService } from "@/services/userService";

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUsers();
  }, []);

  // Renderizar usuarios...
}
```

---

## 🔐 Seguridad

### ⚠️ IMPORTANTE:

**NUNCA** pongas información sensible en variables `VITE_*`:

❌ **NO hagas esto:**

```bash
VITE_API_KEY=supersecreta123        # ❌ Se expone al cliente
VITE_DATABASE_PASSWORD=password123  # ❌ Se expone al cliente
```

✅ **Haz esto:**

- Las claves sensibles deben estar **solo en el backend**
- El frontend debe autenticarse con tokens JWT
- Los tokens se guardan en localStorage/cookies

---

## 🚀 Comandos

### Desarrollo:

```bash
npm run dev
# Usa automáticamente .env.development
```

### Producción:

```bash
npm run build
# Usa automáticamente .env.production
```

### Preview (probar build de producción):

```bash
npm run preview
# Usa .env.production
```

---

## 🛠️ TypeScript IntelliSense

Para tener autocompletado de tus variables `VITE_*`, crea `src/vite-env.d.ts`:

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIMEOUT: string;
  // Agrega más variables aquí...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 📦 Instalación de Dependencias

Si no está instalado, ejecuta:

```bash
npm install axios
```

---

## ✅ Resumen

| Antes (❌ Incorrecto)  | Después (✅ Correcto)               |
| ---------------------- | ----------------------------------- |
| `process.env.NODE_ENV` | `import.meta.env.MODE`              |
| Sin configuración      | `import.meta.env.VITE_API_BASE_URL` |
| URL hardcodeada        | URL desde archivo `.env`            |
| Sin tipos              | TypeScript con tipos completos      |

---

**Última actualización**: 2025-10-25
