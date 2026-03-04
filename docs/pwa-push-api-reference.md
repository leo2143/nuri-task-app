# PWA Push API - Referencia de Implementación

## Fuentes de documentación

- [MDN Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [vite-plugin-pwa - injectManifest](https://vite-pwa-org.netlify.app/guide/inject-manifest.html)
- [vite-plugin-pwa - Register Service Worker](https://vite-pwa-org.netlify.app/guide/register-service-worker.html)
- [vite-plugin-pwa - PWA Minimal Requirements](https://vite-pwa-org.netlify.app/guide/pwa-minimal-requirements.html)
- [web-push (npm)](https://www.npmjs.com/package/web-push)

## Flujo VAPID (Voluntary Application Server Identification)

VAPID es el estándar para identificar el servidor que envía notificaciones push.

1. El servidor genera un par de claves VAPID (pública y privada) una sola vez
2. La clave pública se comparte con el frontend
3. El frontend usa la clave pública al suscribirse via `PushManager.subscribe()`
4. El navegador genera un `PushSubscription` con un `endpoint` único y claves de encriptación
5. El frontend envía la suscripción al backend para almacenarla
6. Cuando el backend quiere enviar una notificación, usa `web-push` con la clave privada VAPID y los datos de la suscripción

## Interfaces clave de la Web Push API

### PushManager

Permite gestionar suscripciones push. Se accede via `ServiceWorkerRegistration.pushManager`.

Métodos principales:
- `subscribe(options)` - Crea una nueva suscripción push
- `getSubscription()` - Obtiene la suscripción activa (o null)
- `permissionState(options)` - Estado del permiso ('granted', 'denied', 'prompt')

### PushSubscription

Contiene los datos de la suscripción necesarios para enviar notificaciones.

Propiedades:
- `endpoint` - URL única del servicio push del navegador
- `expirationTime` - Tiempo de expiración (o null)
- `getKey(name)` - Obtiene claves de encriptación ('p256dh', 'auth')
- `toJSON()` - Serializa la suscripción para enviar al servidor

### PushEvent

Evento que recibe el Service Worker cuando llega una notificación push.

- `data` - Objeto `PushMessageData` con el contenido del mensaje
- Se escucha con `self.addEventListener('push', handler)`

### PushMessageData

Datos del mensaje push recibido.

- `json()` - Parsea el payload como JSON
- `text()` - Obtiene el payload como texto
- `arrayBuffer()` - Obtiene como ArrayBuffer

## Implementación en este proyecto

### Backend (nuri-task-api)

- Modelo: `models/pushSubscriptionModel.js` - Almacena suscripciones por usuario
- Servicio: `services/pushNotificationService.js` - Envía notificaciones via web-push
- Rutas: `controllers/push/routes.js` - Endpoints para subscribe/unsubscribe

### Frontend (nuri-task-app)

- Service Worker: `src/sw.ts` - Maneja eventos push y notificationclick (injectManifest)
- Servicio: `src/services/pushNotificationService.ts` - Gestiona suscripciones desde el cliente
- Hook: `src/hooks/useNotifications.ts` - Hook React para permisos y suscripción
- Config: `VITE_VAPID_PUBLIC_KEY` en variables de entorno
