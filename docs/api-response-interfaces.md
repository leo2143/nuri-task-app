# 📡 Interfaces de Respuestas de API

Documentación completa de las interfaces TypeScript para las respuestas del backend.

## 📋 Tabla de Contenidos

1. [Interfaces Disponibles](#interfaces-disponibles)
2. [Nuevas Interfaces](#nuevas-interfaces)
3. [Ejemplos de Uso](#ejemplos-de-uso)
4. [Manejo de Errores](#manejo-de-errores)
5. [Type Guards](#type-guards)

---

## 📦 Interfaces Disponibles

### Respuestas Exitosas

#### `ISuccessResponse<T>`
Respuesta exitosa con datos (200 OK)

```typescript
interface ISuccessResponse<T = unknown> {
  message: string | null;
  status: number;
  success: true;
  data: T | null;
  count: number | null;
}
```

#### `ICreatedResponse<T>`
Recurso creado exitosamente (201 Created)

```typescript
interface ICreatedResponse<T = unknown> {
  message: string | null;
  status: 201;
  success: true;
  data: T;
}
```

---

### Respuestas de Error

#### `IErrorResponse`
Error genérico

```typescript
interface IErrorResponse {
  message: string | null;
  status: number;
  success: false;
}
```

#### `INotFoundResponse`
Recurso no encontrado (404 Not Found)

```typescript
interface INotFoundResponse {
  message: string | null;
  status: 404;
  success: false;
}
```

#### `IValidationErrorResponse`
Errores de validación (400 Bad Request)

```typescript
interface IValidationErrorResponse {
  message: string | null;
  status: 400;
  success: false;
  errors: Record<string, string[]> | null;
}
```

---

## 🆕 Nuevas Interfaces

### `IConflictResponse`
Conflicto - Recurso ya existe (409 Conflict)

```typescript
interface IConflictResponse {
  message: string | null;
  status: 409;
  success: false;
  conflict: {
    field: string | null;  // Campo que está en conflicto
    value: unknown;        // Valor que causó el conflicto
  };
}
```

**Casos de uso:**
- Email ya registrado
- Username duplicado
- Código único ya existe
- Recurso duplicado

**Ejemplo del backend:**
```javascript
// Backend (JavaScript)
return new ConflictResponseModel(
  'El email ya está registrado',
  'email',
  'usuario@ejemplo.com'
);
```

**Respuesta esperada:**
```json
{
  "message": "El email ya está registrado",
  "status": 409,
  "success": false,
  "conflict": {
    "field": "email",
    "value": "usuario@ejemplo.com"
  }
}
```

---

### `IBadRequestResponse`
Solicitud incorrecta (400 Bad Request)

```typescript
interface IBadRequestResponse {
  message: string | null;
  status: 400;
  success: false;
  details: unknown;  // Detalles adicionales del error
}
```

**Casos de uso:**
- Parámetros faltantes
- Formato incorrecto
- Datos inválidos
- ID malformado

**Ejemplo del backend:**
```javascript
// Backend (JavaScript)
return new BadRequestResponseModel(
  'El ID proporcionado no es válido',
  { providedId: 'abc123', expectedFormat: 'ObjectId' }
);
```

**Respuesta esperada:**
```json
{
  "message": "El ID proporcionado no es válido",
  "status": 400,
  "success": false,
  "details": {
    "providedId": "abc123",
    "expectedFormat": "ObjectId"
  }
}
```

---

## 💻 Ejemplos de Uso

### Ejemplo 1: Registro con Email Duplicado (409)

```typescript
import { userService } from '../services/userService';
import type { IConflictResponse } from '../interfaces';

async function handleRegister(email: string, password: string) {
  try {
    const response = await userService.register({ 
      name: 'Juan',
      email, 
      password 
    });
    
    console.log('Usuario creado:', response);
    
  } catch (error) {
    // Axios envuelve la respuesta en error.response
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: IConflictResponse 
        } 
      };
      
      if (axiosError.response?.status === 409) {
        const conflictData = axiosError.response.data;
        
        console.log('Error:', conflictData?.message);
        console.log('Campo:', conflictData?.conflict.field); // 'email'
        console.log('Valor:', conflictData?.conflict.value); // 'usuario@ejemplo.com'
        
        // Mostrar mensaje específico
        if (conflictData?.conflict.field === 'email') {
          alert('Este email ya está registrado. ¿Olvidaste tu contraseña?');
        }
      }
    }
  }
}
```

---

### Ejemplo 2: Parámetro Inválido (400)

```typescript
import type { IBadRequestResponse } from '../interfaces';

async function getTodoById(id: string) {
  try {
    const response = await todoService.getTodoById(id);
    return response;
    
  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: { 
          status?: number; 
          data?: IBadRequestResponse 
        } 
      };
      
      if (axiosError.response?.status === 400) {
        const badRequestData = axiosError.response.data;
        
        console.log('Error:', badRequestData?.message);
        console.log('Detalles:', badRequestData?.details);
        
        // Ejemplo: { providedId: 'abc', expectedFormat: 'ObjectId' }
        if (typeof badRequestData?.details === 'object') {
          const details = badRequestData.details as Record<string, unknown>;
          console.log('ID proporcionado:', details.providedId);
          console.log('Formato esperado:', details.expectedFormat);
        }
      }
    }
    
    throw error;
  }
}
```

---

### Ejemplo 3: Manejo Completo de Errores en Register

```typescript
import { useState } from 'react';
import { userService } from '../services/userService';
import type { 
  IConflictResponse, 
  IBadRequestResponse, 
  IValidationErrorResponse 
} from '../interfaces';

export default function Register() {
  const [error, setError] = useState('');
  
  const handleSubmit = async (formData: RegisterData) => {
    try {
      const response = await userService.register(formData);
      console.log('Registro exitoso:', response);
      
    } catch (error: unknown) {
      let errorMessage = 'Error al registrar usuario';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            status?: number; 
            data?: IConflictResponse | IBadRequestResponse | IValidationErrorResponse 
          } 
        };
        
        const status = axiosError.response?.status;
        const data = axiosError.response?.data;
        
        // Conflicto (409) - Email duplicado
        if (status === 409 && data && 'conflict' in data) {
          const conflictData = data as IConflictResponse;
          if (conflictData.conflict.field === 'email') {
            errorMessage = 'Este email ya está registrado. ¿Deseas iniciar sesión?';
          } else {
            errorMessage = conflictData.message || 'El recurso ya existe';
          }
        }
        
        // Solicitud incorrecta (400)
        else if (status === 400 && data) {
          // Puede ser IBadRequestResponse o IValidationErrorResponse
          if ('errors' in data) {
            // Es un error de validación
            const validationData = data as IValidationErrorResponse;
            const firstError = Object.values(validationData.errors || {})[0];
            errorMessage = firstError?.[0] || 'Error de validación';
          } else if ('details' in data) {
            // Es un BadRequest genérico
            const badRequestData = data as IBadRequestResponse;
            errorMessage = badRequestData.message || 'Solicitud incorrecta';
          }
        }
        
        // Otros errores
        else if (data?.message) {
          errorMessage = data.message;
        }
      }
      
      setError(errorMessage);
    }
  };
  
  // ... resto del componente
}
```

---

## 🛡️ Type Guards

Para facilitar la verificación de tipos, puedes crear type guards:

```typescript
// src/utils/typeGuards.ts

import type {
  IConflictResponse,
  IBadRequestResponse,
  IValidationErrorResponse,
  ISuccessResponse
} from '../interfaces';

export function isConflictResponse(data: unknown): data is IConflictResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IConflictResponse).status === 409 &&
    'conflict' in data
  );
}

export function isBadRequestResponse(data: unknown): data is IBadRequestResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IBadRequestResponse).status === 400 &&
    'details' in data
  );
}

export function isValidationErrorResponse(data: unknown): data is IValidationErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'status' in data &&
    (data as IValidationErrorResponse).status === 400 &&
    'errors' in data
  );
}

export function isSuccessResponse<T>(data: unknown): data is ISuccessResponse<T> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as ISuccessResponse<T>).success === true
  );
}
```

**Uso de Type Guards:**

```typescript
import { isConflictResponse, isBadRequestResponse } from '../utils/typeGuards';

try {
  const response = await userService.register(data);
} catch (error) {
  const errorData = (error as any)?.response?.data;
  
  if (isConflictResponse(errorData)) {
    // TypeScript sabe que errorData es IConflictResponse
    console.log('Campo conflictivo:', errorData.conflict.field);
    console.log('Valor:', errorData.conflict.value);
  } 
  else if (isBadRequestResponse(errorData)) {
    // TypeScript sabe que errorData es IBadRequestResponse
    console.log('Detalles:', errorData.details);
  }
}
```

---

## 📊 Tabla Resumen de Códigos de Estado

| Código | Interface | Uso |
|--------|-----------|-----|
| 200 | `ISuccessResponse<T>` | Operación exitosa con datos |
| 201 | `ICreatedResponse<T>` | Recurso creado exitosamente |
| 400 | `IBadRequestResponse` | Solicitud incorrecta (genérico) |
| 400 | `IValidationErrorResponse` | Errores de validación específicos |
| 404 | `INotFoundResponse` | Recurso no encontrado |
| **409** | **`IConflictResponse`** | **Conflicto (recurso duplicado)** ⭐ |
| 5xx | `IErrorResponse` | Error del servidor |

---

## 🔧 Configuración de Axios

Para manejar errores globalmente con Axios:

```typescript
// src/config/axios.ts

import axios from 'axios';
import type { IConflictResponse, IBadRequestResponse } from '../interfaces';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor de respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const data = error.response?.data;
    
    // Logging de errores específicos
    if (status === 409 && data) {
      const conflictData = data as IConflictResponse;
      console.log('⚠️ Conflicto detectado:', conflictData.conflict);
    } 
    else if (status === 400 && data && 'details' in data) {
      const badRequestData = data as IBadRequestResponse;
      console.log('❌ Solicitud incorrecta:', badRequestData.details);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## ✅ Mejores Prácticas

1. **Siempre tipar las respuestas:**
   ```typescript
   const response = await apiClient.get<ISuccessResponse<IUser>>('/users/1');
   ```

2. **Usar type guards para verificar tipos:**
   ```typescript
   if (isConflictResponse(errorData)) {
     // Manejo específico de conflictos
   }
   ```

3. **Manejo específico por código de estado:**
   ```typescript
   if (status === 409) {
     // Email duplicado
   } else if (status === 400) {
     // Solicitud incorrecta
   }
   ```

4. **Mensajes de error claros para el usuario:**
   ```typescript
   if (conflictData?.conflict.field === 'email') {
     setError('Este email ya está en uso. Intenta con otro.');
   }
   ```

5. **Logging de detalles para debugging:**
   ```typescript
   console.error('Error details:', badRequestData?.details);
   ```

---

## 🎯 Casos de Uso Comunes

### Email Duplicado en Registro

```typescript
// Error 409 con campo 'email'
{
  "message": "El email ya está registrado",
  "status": 409,
  "success": false,
  "conflict": {
    "field": "email",
    "value": "usuario@ejemplo.com"
  }
}
```

### Username Duplicado

```typescript
// Error 409 con campo 'username'
{
  "message": "El nombre de usuario ya está en uso",
  "status": 409,
  "success": false,
  "conflict": {
    "field": "username",
    "value": "juanperez"
  }
}
```

### ID Inválido

```typescript
// Error 400 con detalles del ID
{
  "message": "ID no válido",
  "status": 400,
  "success": false,
  "details": {
    "providedId": "abc123",
    "expectedFormat": "ObjectId (24 caracteres hexadecimales)"
  }
}
```

### Parámetro Faltante

```typescript
// Error 400 con parámetros faltantes
{
  "message": "Parámetros requeridos faltantes",
  "status": 400,
  "success": false,
  "details": {
    "missingParams": ["email", "password"],
    "received": ["name"]
  }
}
```

---

## 📚 Referencias

- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [TypeScript Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Type Guards](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
- [Axios Error Handling](https://axios-http.com/docs/handling_errors)

---

**¡Interfaces de respuesta actualizadas y documentadas!** 🎉✅

