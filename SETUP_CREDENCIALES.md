# 🔑 Setup de Credenciales para Desarrollo Local

## 📍 Archivos donde Introducir Credenciales

### 🎯 1. Backend - Archivo Principal
**Ubicación**: `backend/.env`

```env
# =============================================================================
# CREDENCIALES REALES PARA DESARROLLO LOCAL
# =============================================================================

# -----------------------------------------------------------------------------
# SUPABASE (REQUERIDO)
# -----------------------------------------------------------------------------
SUPABASE_URL=https://tu-proyecto-real.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1LXByb3llY3RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzc4NTU2NDksImV4cCI6MTk5MzQzMTY0OX0.TU_ANON_KEY_REAL
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1LXByb3llY3RvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3Nzg1NTY0OSwiZXhwIjoxOTkzNDMxNjQ5fQ.TU_SERVICE_ROLE_KEY_REAL

# -----------------------------------------------------------------------------
# AUTENTICACIÓN (REQUERIDO)
# -----------------------------------------------------------------------------
JWT_SECRET=mi_secreto_jwt_super_seguro_de_desarrollo_32_caracteres
ADMIN_PASSWORD=miPasswordAdminSeguro123

# -----------------------------------------------------------------------------
# DESARROLLO LOCAL (REQUERIDO)
# -----------------------------------------------------------------------------
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173

# -----------------------------------------------------------------------------
# WHATSAPP (OPCIONAL - Comentar para desarrollo sin SMS)
# -----------------------------------------------------------------------------
# WHATSAPP_TOKEN=tu_token_whatsapp_real
# WHATSAPP_PHONE_NUMBER_ID=tu_phone_id_real

# -----------------------------------------------------------------------------
# TWILIO (OPCIONAL - Comentar para desarrollo sin SMS)  
# -----------------------------------------------------------------------------
# TWILIO_ACCOUNT_SID=tu_account_sid_real
# TWILIO_AUTH_TOKEN=tu_auth_token_real
# TWILIO_PHONE_NUMBER=+1234567890
```

### 🎯 2. Frontend - Archivo Principal  
**Ubicación**: `frontend/.env`

```env
# =============================================================================
# FRONTEND - CREDENCIALES PARA DESARROLLO LOCAL
# =============================================================================

# Backend API - Debe coincidir con el backend local
VITE_API_BASE_URL=http://localhost:3001

# Nombre de la aplicación
VITE_APP_NAME=Graduación 2024
```

## 🔗 Dónde Obtener las Credenciales

### 🟢 1. Supabase (Base de Datos)
**URL**: https://app.supabase.com/

1. **Crear/Acceder proyecto**: 
   - Ve a https://app.supabase.com/
   - Crea nuevo proyecto o accede al existente

2. **Obtener credenciales**:
   - Ve a `Settings` → `API`
   - Copia:
     - **Project URL** → `SUPABASE_URL`
     - **anon/public key** → `SUPABASE_ANON_KEY`  
     - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (¡SECRETO!)

3. **Configurar tabla**:
   - Ve a SQL Editor
   - Ejecuta:
   ```sql
   CREATE TABLE invitados (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     nombre TEXT NOT NULL,
     telefono TEXT NOT NULL,
     mensaje TEXT,
     token TEXT NOT NULL UNIQUE,
     estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmado', 'rechazado')),
     fecha_confirmacion TIMESTAMP WITH TIME ZONE,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   
   CREATE INDEX idx_invitados_token ON invitados(token);
   CREATE INDEX idx_invitados_estado ON invitados(estado);
   ```

### 🟡 2. WhatsApp Business API (OPCIONAL para desarrollo)
**URL**: https://developers.facebook.com/

1. **Crear App Business**:
   - Ve a https://developers.facebook.com/apps/
   - Crear nueva app → Business

2. **Agregar WhatsApp Product**:
   - En el dashboard, agrega "WhatsApp Business API"

3. **Obtener credenciales**:
   - **Token de acceso** → `WHATSAPP_TOKEN`
   - **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`

### 🟡 3. Twilio SMS (OPCIONAL - Backup)
**URL**: https://console.twilio.com/

1. **Crear cuenta**: https://www.twilio.com/try-twilio

2. **Obtener credenciales**:
   - Ve al Console Dashboard
   - Copia:
     - **Account SID** → `TWILIO_ACCOUNT_SID`
     - **Auth Token** → `TWILIO_AUTH_TOKEN`

3. **Obtener número**:
   - Ve a Phone Numbers → Manage → Buy a number
   - Copia el número → `TWILIO_PHONE_NUMBER`

## 🚀 Comandos para Iniciar Desarrollo

### 1. Setup Inicial (Solo primera vez)
```bash
# Copiar archivos de credenciales (ya hecho)
cd backend && cp .env.example .env
cd ../frontend && cp .env.example .env

# Instalar dependencias
cd backend && npm install
cd ../frontend && npm install
```

### 2. Introducir Credenciales
1. Edita `backend/.env` con tus credenciales reales
2. Edita `frontend/.env` (normalmente solo URL del backend)

### 3. Iniciar Desarrollo
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

### 4. Verificar Funcionamiento
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Panel Admin**: http://localhost:5173/admin
- **Health Check**: http://localhost:3001/health

## ✅ Orden de Prioridad para Desarrollo

### Mínimo Requerido (Para empezar a desarrollar):
1. ✅ **Supabase** (Base de datos)
2. ✅ **JWT_SECRET** (Cualquier string seguro)
3. ✅ **ADMIN_PASSWORD** (Tu contraseña de admin)

### Opcional (Para testing completo):
4. 🟡 **WhatsApp API** (Para envío de mensajes)
5. 🟡 **Twilio** (Para SMS backup)

## 🔒 Seguridad - Lo que NO se Commitea

### ❌ Archivos que NO van al repositorio:
- `backend/.env` (con credenciales reales)
- `frontend/.env` (con URLs reales)

### ✅ Archivos que SÍ van al repositorio:
- `backend/.env.example` (plantilla)
- `frontend/.env.example` (plantilla)  
- `.env.development` (valores no sensibles)

## 🎯 Para Evitar Deploys Constantes

Con esta configuración:
1. **Desarrollas local** con credenciales reales en `.env`
2. **Commiteas cambios** sin exponer secrets
3. **Deploys en producción** usan variables de entorno del hosting
4. **No necesitas deployar** para probar cambios de UI/lógica

## 📋 Checklist de Verificación

### Backend funcionando:
- [ ] Servidor inicia en puerto 3001
- [ ] Health check responde: http://localhost:3001/health
- [ ] Base de datos conecta (no errores en consola)
- [ ] CORS configurado (frontend puede hacer requests)

### Frontend funcionando:
- [ ] Aplicación carga en http://localhost:5173
- [ ] Panel admin accesible: http://localhost:5173/admin
- [ ] Login funciona con ADMIN_PASSWORD
- [ ] API calls funcionan (no errores 404/CORS)

### Para producción (mismo .env + hosting):
- [ ] Variables en Railway/Render (backend)
- [ ] Variables en Vercel/Netlify (frontend)
- [ ] URLs de producción actualizadas
- [ ] WhatsApp/Twilio configurados (si los usas)

## 🛠️ Comandos Útiles

```bash
# Ver logs del backend
cd backend && npm run dev

# Build frontend para testing
cd frontend && npm run build && npm run preview

# Probar envío de invitaciones (sin WhatsApp)
cd backend && npm run crear-excel-ejemplo
cd backend && npm run enviar-invitaciones invitados-ejemplo.xlsx

# Verificar variables de entorno
cd backend && node -e "console.log(process.env.SUPABASE_URL)"
```

Con esto tendrás todo configurado para desarrollar localmente sin necesidad de deployar constantemente. Las credenciales están seguras y separadas del código.