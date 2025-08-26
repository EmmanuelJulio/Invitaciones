# 🚀 Guía Completa de Despliegue

## 🗂️ Arquitectura Final

```
Frontend (Vercel) ←→ Backend (Railway) ←→ Supabase (BD)
   Público              Privado           Base de Datos
```

## 🚂 **PASO 1: Deploy Backend en Railway**

### 1.1. Ir a Railway
- Ve a: https://railway.app/
- **Sign up** con GitHub
- Click **"New Project"** → **"Deploy from GitHub repo"**

### 1.2. Conectar repositorio
- Selecciona tu repositorio de GitHub
- Selecciona la carpeta: **`/backend`**
- Click **"Deploy Now"**

### 1.3. Configurar variables de entorno
En Railway Dashboard → Tu proyecto → **Variables**:

```env
NODE_ENV=production
PORT=3001
SUPABASE_URL=https://tu-proyecto-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=tu_secreto_jwt_muy_seguro_de_al_menos_32_caracteres
ADMIN_PASSWORD=tu_contraseña_admin_segura
FRONTEND_URL=https://tu-app.vercel.app
WHATSAPP_TOKEN=EAAxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

### 1.4. Obtener URL del backend
Railway te dará una URL como: `https://tu-backend-production.up.railway.app`

---

## 🌐 **PASO 2: Deploy Frontend en Vercel**

### 2.1. Ir a Vercel
- Ve a: https://vercel.com/
- **Sign up** con GitHub
- Click **"New Project"**

### 2.2. Importar repositorio
- Selecciona tu repositorio
- **Root Directory**: `frontend` ⚠️ **IMPORTANTE**
- **Framework Preset**: Vite
- Click **"Deploy"**

### 2.3. Configurar variables de entorno
En Vercel Dashboard → Settings → **Environment Variables**:

```env
VITE_API_BASE_URL=https://tu-backend-production.up.railway.app
VITE_GOOGLE_MAPS_API_KEY=AIzaSyD56ii6L0LjoAYNZrZ-PBTXtO4muimHX9s
VITE_APP_NAME=Graduación 2025
```

### 2.4. Redeploy
- Ve a **Deployments**
- Click **"Redeploy"** para aplicar las variables

---

## 🔧 **PASO 3: Configurar CORS en Backend**

Actualiza el backend para permitir requests desde Vercel:

**En `backend/src/main.ts`:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173', // desarrollo
    'https://tu-app.vercel.app' // producción
  ],
  credentials: true
}));
```

**Redeploy en Railway** después de este cambio.

---

## 📱 **PASO 4: Probar la aplicación**

### URLs finales:
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-backend-production.up.railway.app`
- **Admin**: `https://tu-app.vercel.app/admin`
- **Invitación**: `https://tu-app.vercel.app/invitacion/[token]`

### Pruebas:
1. **Backend**: `https://tu-backend-production.up.railway.app/api/health`
2. **Frontend**: Cargar página principal
3. **Admin**: Iniciar sesión en panel
4. **Invitación**: Probar con un token existente

---

## 🔐 **PASO 5: Configurar Google Maps**

### 5.1. Actualizar restricciones de API Key
En Google Cloud Console → Credentials → Tu API Key:

**HTTP referrers:**
```
https://tu-app.vercel.app/*
http://localhost:5173/* (para desarrollo)
```

---

## 🌍 **PASO 6: Configurar dominios personalizados (Opcional)**

### Frontend (Vercel):
- **Domains** → Add → `invitaciones-graduacion.com`

### Backend (Railway):
- **Settings** → **Domains** → Add custom domain

---

## ✅ **Checklist Final**

- [ ] Backend desplegado en Railway
- [ ] Variables de entorno configuradas en Railway
- [ ] Frontend desplegado en Vercel (carpeta `/frontend`)
- [ ] Variables de entorno configuradas en Vercel
- [ ] CORS actualizado en backend
- [ ] Google Maps API Key con dominios correctos
- [ ] Probar admin panel
- [ ] Probar invitación con token
- [ ] Verificar mapa funciona

---

## 🚨 **Troubleshooting**

### Error "Network Error" en frontend:
- Verifica `VITE_API_BASE_URL` en Vercel
- Verifica CORS en backend

### Backend no inicia en Railway:
- Revisa logs en Railway Dashboard
- Verifica variables de entorno
- Asegúrate que `npm run build` funciona localmente

### Mapa no carga:
- Verifica `VITE_GOOGLE_MAPS_API_KEY` en Vercel
- Actualiza restricciones de dominio en Google Cloud

### 401 Unauthorized en admin:
- Verifica `JWT_SECRET` y `ADMIN_PASSWORD` en Railway
- Limpia localStorage del navegador

---

## 📞 **URLs de ejemplo**

Reemplaza con tus URLs reales:

```bash
# Desarrollo
Frontend: http://localhost:5173
Backend:  http://localhost:3001

# Producción  
Frontend: https://invitaciones-graduacion.vercel.app
Backend:  https://backend-production-abc123.up.railway.app
```

¡Con esta configuración tendrás las invitaciones funcionando perfectamente en producción! 🎉