# 🔐 Flujo de Recuperación de Contraseña - Frontend

Documentación completa del flujo de recuperación de contraseña implementado en la aplicación Nuri Task App.

## 📋 Tabla de Contenidos

1. [Archivos Creados](#archivos-creados)
2. [Flujo Completo de Usuario](#flujo-completo-de-usuario)
3. [Servicios API](#servicios-api)
4. [Componentes y Páginas](#componentes-y-páginas)
5. [Rutas](#rutas)
6. [Casos de Uso](#casos-de-uso)
7. [Manejo de Errores](#manejo-de-errores)
8. [Testing](#testing)

---

## 📁 Archivos Creados

```
src/
├── services/
│   └── userService.ts                    # ✅ Actualizado (3 nuevos métodos)
├── pages/
│   └── user/
│       ├── ForgotPassword.tsx            # ✅ Nueva página
│       └── ResetPassword.tsx             # ✅ Nueva página
└── routes/
    └── router.tsx                        # ✅ Actualizado (2 nuevas rutas)
```

---

## 🔄 Flujo Completo de Usuario

### Paso 1: Usuario Olvidó su Contraseña

1. Usuario hace clic en "¿Olvidaste tu contraseña?" desde el login
2. Navega a `/forgot-password`
3. Ingresa su email
4. Sistema envía email con link de recuperación
5. Usuario ve mensaje de confirmación

### Paso 2: Usuario Recibe Email

1. Usuario abre su correo
2. Encuentra email de "Recuperación de Contraseña"
3. Hace clic en el enlace: `http://frontend.com/reset-password?token=abc123...`

### Paso 3: Usuario Resetea Contraseña

1. Sistema verifica automáticamente el token
2. Si es válido, muestra formulario de nueva contraseña
3. Usuario ingresa nueva contraseña (2 veces)
4. Sistema actualiza la contraseña
5. Usuario es redirigido al login
6. Usuario puede iniciar sesión con la nueva contraseña

---

## 🔌 Servicios API

### 1. `forgotPassword(email: string)`

Solicita recuperación de contraseña enviando un email con el token.

```typescript
import { userService } from "../../services/userService";

try {
  const response = await userService.forgotPassword("user@ejemplo.com");
  console.log(response.message);
  // En desarrollo, muestra el token
  if (response.devToken) {
    console.log("Token:", response.devToken);
  }
} catch (error) {
  console.error("Error:", error);
}
```

**Backend Endpoint:** `POST /api/users/forgot-password`

**Request Body:**

```json
{
  "email": "user@ejemplo.com"
}
```

**Response (Success):**

```json
{
  "success": true,
  "status": 200,
  "message": "Email de recuperación enviado",
  "data": {
    "message": "Si el email existe, recibirás un correo...",
    "devToken": "abc123..." // Solo en desarrollo
  }
}
```

---

### 2. `verifyResetToken(token: string)`

Verifica si un token de recuperación es válido antes de mostrar el formulario.

```typescript
try {
  const response = await userService.verifyResetToken("abc123...");
  if (response.valid) {
    console.log("Token válido para:", response.email);
  }
} catch (error) {
  console.error("Token inválido");
}
```

**Backend Endpoint:** `GET /api/users/verify-reset-token/:token`

**Response (Success):**

```json
{
  "success": true,
  "status": 200,
  "message": "Token verificado correctamente",
  "data": {
    "valid": true,
    "email": "user@ejemplo.com",
    "message": "Token válido"
  }
}
```

---

### 3. `resetPassword(token: string, newPassword: string)`

Resetea la contraseña usando el token válido.

```typescript
try {
  const response = await userService.resetPassword("abc123...", "newPass123");
  console.log("Contraseña actualizada para:", response.email);
} catch (error) {
  console.error("Error reseteando contraseña");
}
```

**Backend Endpoint:** `POST /api/users/reset-password`

**Request Body:**

```json
{
  "token": "abc123...",
  "newPassword": "newPassword123"
}
```

**Response (Success):**

```json
{
  "success": true,
  "status": 200,
  "message": "Contraseña reseteada correctamente",
  "data": {
    "message": "Contraseña actualizada exitosamente",
    "email": "user@ejemplo.com"
  }
}
```

---

## 📄 Componentes y Páginas

### ForgotPassword Component

**Ruta:** `/forgot-password`

**Características:**

- ✅ Formulario con input de email
- ✅ Validación de email
- ✅ Estado de loading con spinner
- ✅ Mensajes de error con componente Alert
- ✅ Mensaje de éxito con instrucciones
- ✅ Link para volver al login
- ✅ Usa componentes reutilizables (Input, Button)
- ✅ Usa custom hook useField
- ✅ Diseño responsive con ilustración
- ✅ Token de desarrollo en consola (solo dev)

**Estados:**

```typescript
- loading: boolean      // Muestra spinner mientras envía
- error: boolean       // Si hubo error
- msgError: string     // Mensaje de error
- success: boolean     // Email enviado exitosamente
- successMessage: string // Mensaje de éxito
```

---

### ResetPassword Component

**Ruta:** `/reset-password?token=abc123...`

**Características:**

- ✅ Verifica token automáticamente al cargar
- ✅ Muestra loading mientras verifica
- ✅ Formulario con 2 campos de contraseña
- ✅ Validación de contraseñas (coinciden, mínimo 6 caracteres)
- ✅ Muestra email del usuario
- ✅ Mensaje de éxito con redirección automática
- ✅ Manejo de tokens inválidos/expirados
- ✅ Usa componentes reutilizables (Input, Button)
- ✅ Usa custom hook useField
- ✅ Diseño responsive

**Estados:**

```typescript
- verifying: boolean    // Verificando token
- tokenValid: boolean   // Token es válido
- userEmail: string     // Email del usuario
- loading: boolean      // Enviando nueva contraseña
- error: boolean        // Si hubo error
- msgError: string      // Mensaje de error
- success: boolean      // Contraseña actualizada
```

**Flujo de Verificación:**

1. Componente carga → Extrae token de URL
2. `useEffect` ejecuta `verifyResetToken()`
3. Si válido → Muestra formulario
4. Si inválido → Muestra error con opciones

---

## 🛣️ Rutas

```typescript
// src/routes/router.tsx

{
  path: 'forgot-password',
  element: <ForgotPassword />
},
{
  path: 'reset-password',
  element: <ResetPassword />
}
```

**URLs:**

- Solicitar recuperación: `http://localhost:5173/forgot-password`
- Resetear contraseña: `http://localhost:5173/reset-password?token=abc123...`

---

## 💼 Casos de Uso

### Caso 1: Recuperación Exitosa

1. ✅ Usuario ingresa email válido
2. ✅ Backend envía email
3. ✅ Usuario hace clic en link del email
4. ✅ Token es verificado
5. ✅ Usuario cambia contraseña
6. ✅ Redirigido a login
7. ✅ Login exitoso con nueva contraseña

### Caso 2: Email No Existe

1. ✅ Usuario ingresa email que no está registrado
2. ✅ Sistema NO revela que el email no existe (seguridad)
3. ✅ Muestra mensaje genérico: "Si el email existe..."
4. ✅ No se envía email

### Caso 3: Token Expirado

1. ❌ Usuario usa link después de 1 hora
2. ✅ Sistema detecta token expirado
3. ✅ Muestra error: "Token expirado"
4. ✅ Ofrece opciones: Solicitar nuevo link o volver al login

### Caso 4: Token Ya Usado

1. ❌ Usuario intenta usar el mismo link dos veces
2. ✅ Sistema detecta que el token ya fue usado
3. ✅ Muestra error: "Token ya usado"
4. ✅ Ofrece solicitar nuevo link

### Caso 5: Contraseñas No Coinciden

1. ❌ Usuario ingresa contraseñas diferentes
2. ✅ Validación frontend detecta error
3. ✅ Muestra error: "Las contraseñas no coinciden"
4. ✅ No se envía petición al backend

---

## 🚨 Manejo de Errores

### Errores de Frontend

```typescript
// Email vacío
"El email es obligatorio";

// Email inválido
"El email no es válido";

// Contraseña vacía
"La contraseña es obligatoria";

// Contraseña muy corta
"La contraseña debe tener al menos 6 caracteres";

// Contraseñas no coinciden
"Las contraseñas no coinciden";

// Token no proporcionado
"Token no proporcionado. Por favor, usa el enlace del email.";
```

### Errores de Backend

```typescript
// Demasiados intentos (429)
"Demasiados intentos. Por favor, espera unos minutos e intenta de nuevo.";

// Token inválido (400)
"Token inválido o expirado";

// Token ya usado (400)
"Token inválido, expirado o ya usado";

// Error de servidor (500)
"Error al solicitar recuperación de contraseña";
```

### Componente Alert Reutilizable

```tsx
{
  error && (
    <div className="animate-shake">
      <Alert msg={msgError} />
    </div>
  );
}
```

---

## 🎨 Características de UI/UX

### Diseño Consistente

- ✅ Mismo layout que Login/Register (2 columnas)
- ✅ Ilustración SVG animada
- ✅ Gradiente de fondo
- ✅ Cards con sombras y blur
- ✅ Animaciones de hover y focus

### Feedback Visual

- ✅ Loading spinner de pantalla completa
- ✅ Animación "shake" en errores
- ✅ Checkmark verde en éxito
- ✅ Icons SVG semánticos

### Accesibilidad

- ✅ Labels correctamente asociados
- ✅ ARIA attributes (aria-required, aria-invalid)
- ✅ Focus visible en todos los elementos
- ✅ Mensajes de error con role="alert"
- ✅ Navegación por teclado

### Responsive

- ✅ Mobile-first approach
- ✅ Grid adaptativo (1 col móvil, 2 cols desktop)
- ✅ Ilustración oculta en móvil
- ✅ Botones de ancho completo en móvil

---

## 🧪 Testing

### Manual Testing Checklist

#### Forgot Password

- [ ] Email vacío muestra error
- [ ] Email inválido muestra error
- [ ] Email válido envía exitosamente
- [ ] Mensaje de éxito se muestra
- [ ] Link "Volver al login" funciona
- [ ] Loading spinner aparece durante envío
- [ ] Token aparece en consola (solo dev)

#### Reset Password

- [ ] Sin token en URL muestra error
- [ ] Token inválido muestra error con opciones
- [ ] Token válido muestra formulario
- [ ] Email del usuario se muestra
- [ ] Contraseñas vacías muestran error
- [ ] Contraseñas cortas muestran error
- [ ] Contraseñas no coinciden muestra error
- [ ] Reset exitoso muestra mensaje y redirige
- [ ] Redirección automática después de 3 segundos
- [ ] Link "Ir al login ahora" funciona

### Casos de Prueba

```bash
# Test 1: Email no existe
POST /api/users/forgot-password
{ "email": "noexiste@ejemplo.com" }
# Debe mostrar mensaje genérico (no revela)

# Test 2: Email existe
POST /api/users/forgot-password
{ "email": "usuario@ejemplo.com" }
# Debe enviar email y mostrar éxito

# Test 3: Token válido
GET /api/users/verify-reset-token/abc123
# Debe retornar valid: true y email

# Test 4: Token inválido
GET /api/users/verify-reset-token/invalido
# Debe retornar error 400

# Test 5: Reset con token válido
POST /api/users/reset-password
{ "token": "abc123", "newPassword": "newpass123" }
# Debe actualizar contraseña

# Test 6: Reset con token usado
POST /api/users/reset-password
{ "token": "abc123", "newPassword": "newpass123" }
# Debe retornar error (token ya usado)
```

---

## 🔐 Seguridad

### Medidas Implementadas

1. **No revelar existencia de emails**
   - Mensaje genérico en forgot password
   - Previene enumeración de usuarios

2. **Tokens hasheados en BD**
   - El token nunca se guarda en texto plano

3. **Tokens de un solo uso**
   - Después de usarse, se elimina de la BD

4. **Expiración de tokens**
   - Tokens expiran en 1 hora

5. **Validación de contraseñas**
   - Mínimo 6 caracteres (configurable)
   - Validación en frontend y backend

6. **HTTPS en producción**
   - Links de recuperación deben usar HTTPS

7. **Rate limiting**
   - Backend limita intentos por IP

---

## 📧 Email Template

El backend envía un email HTML con:

- ✅ Logo de la aplicación
- ✅ Mensaje claro y conciso
- ✅ Botón grande con el link
- ✅ Link alternativo en texto plano
- ✅ Información de expiración (1 hora)
- ✅ Mensaje de seguridad
- ✅ Footer con información de contacto

---

## 🚀 Deployment

### Variables de Entorno

Asegúrate de configurar en el backend:

```env
# Backend (.env)
EMAIL_SERVICE=gmail
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu_app_password
EMAIL_FROM_NAME=Nuri Task API
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Frontend

```env
# Frontend (.env)
VITE_API_BASE_URL=https://tu-api.herokuapp.com
```

### Testing en Producción

1. Deploya backend con variables de email configuradas
2. Deploya frontend
3. Prueba flujo completo end-to-end
4. Verifica que los emails lleguen
5. Verifica que los links funcionen

---

## 📚 Referencias

- [React Router - useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
- [React - useEffect](https://react.dev/reference/react/useEffect)
- [Nodemailer Documentation](https://nodemailer.com/)
- [OWASP - Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)

---

## ✅ Checklist Final

- [x] Servicios API creados
- [x] Página ForgotPassword creada
- [x] Página ResetPassword creada
- [x] Rutas configuradas
- [x] Validaciones implementadas
- [x] Manejo de errores robusto
- [x] UI/UX consistente
- [x] Accesibilidad implementada
- [x] Responsive design
- [x] Componentes reutilizables (Input, Button)
- [x] Custom hooks (useField)
- [x] TypeScript typings
- [x] Loading states
- [x] Success states
- [x] Error states
- [x] Documentación completa

---

**¡Flujo de recuperación de contraseña completamente implementado y listo para usar!** 🎉
