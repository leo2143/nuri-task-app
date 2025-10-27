# Nuri Task App 📝

Una aplicación moderna de gestión de tareas construida con React 19, TypeScript, Vite, React Router DOM y Tailwind CSS.

## 🚀 Tech Stack

- **React 19** - Última versión con mejoras de rendimiento
- **TypeScript** - Type safety y mejor DX
- **Vite** - Build tool ultra rápido
- **React Router DOM v6** - Enrutamiento del lado del cliente
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Cliente HTTP con interceptores
- **Context API** - State management global

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview
```

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_BASE_URL=
VITE_API_TIMEOUT=10000
```

**Nota:** El `VITE_API_BASE_URL` vacío usa el proxy configurado en `vite.config.ts` para desarrollo local.

### Backend API

El proyecto está configurado para conectarse a un backend en `http://localhost:8888`. Puedes cambiar esto en:
- `vite.config.ts` (para desarrollo)
- Variables de entorno en Vercel (para producción)

## 🌐 Despliegue en Vercel

Este proyecto está optimizado para Vercel. Lee la guía completa: [docs/vercel-deployment.md](./docs/vercel-deployment.md)

### Quick Start

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno:**
   - `VITE_API_BASE_URL` = URL de tu backend en producción
   - `VITE_API_TIMEOUT` = `10000`
3. **Deploy** 🚀

El archivo `vercel.json` ya está configurado para manejar las rutas de React Router correctamente.

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

## 🎨 Características

- ✅ **Autenticación completa** con JWT
- ✅ **Gestión de estado global** con Context API
- ✅ **Interceptores de Axios** para tokens automáticos
- ✅ **Rutas protegidas** con redirección
- ✅ **UI moderna** con Tailwind CSS
- ✅ **Fully responsive** - Mobile, tablet, desktop
- ✅ **Accesibilidad** - ARIA labels, keyboard navigation
- ✅ **Type-safe** - TypeScript en todo el proyecto
- ✅ **Optimizado para producción** - Code splitting, lazy loading

## 🛠️ Desarrollo

### Comandos útiles

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit

# Limpiar cache de Vite
rm -rf node_modules/.vite
```

## 📚 Documentación Adicional

- [Color Palette](./docs/color-palette.md)
- [Environment Variables](./docs/environment-variables.md)
- [Interfaces Guide](./docs/interfaces-guide.md)
- [Vercel Deployment](./docs/vercel-deployment.md)

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
