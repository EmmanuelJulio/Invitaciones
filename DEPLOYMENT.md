# Guía de Deployment - Sistema de Invitaciones

## 🚀 Deployment en Producción

### 1. Configurar Supabase

#### Crear proyecto en Supabase:
1. Ve a [supabase.com](https://supabase.com)
2. Crea una nueva organización y proyecto
3. Obtén las credenciales del proyecto

#### Crear tabla en Supabase:
```sql
-- Crear tabla de invitados
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

-- Crear índices para optimizar consultas
CREATE INDEX idx_invitados_token ON invitados(token);
CREATE INDEX idx_invitados_estado ON invitados(estado);
CREATE INDEX idx_invitados_created_at ON invitados(created_at);

-- Configurar Row Level Security (RLS)
ALTER TABLE invitados ENABLE ROW LEVEL SECURITY;

-- Política para lectura pública (solo por token)
CREATE POLICY "Allow public read by token" ON invitados
    FOR SELECT USING (true);

-- Política para escritura pública (solo updates por token)
CREATE POLICY "Allow public update by token" ON invitados
    FOR UPDATE USING (true);
```

### 2. Backend Deployment (Railway/Render)

#### Opción A: Railway
1. Conecta tu repositorio GitHub a Railway
2. Configura las variables de entorno:
   ```env
   NODE_ENV=production
   PORT=3001
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu_clave_anonima
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
   JWT_SECRET=tu_secreto_jwt_super_seguro
   ADMIN_PASSWORD=contraseña_admin_segura
   FRONTEND_URL=https://tu-frontend.vercel.app
   WHATSAPP_TOKEN=tu_token_whatsapp
   WHATSAPP_PHONE_NUMBER_ID=tu_phone_id
   ```
3. Railway detectará automáticamente Node.js y desplegará

#### Opción B: Render
1. Conecta tu repositorio GitHub a Render
2. Configura el servicio web:
   - **Build Command:** `cd backend && npm install && npm run build`
   - **Start Command:** `cd backend && npm start`
3. Agrega las mismas variables de entorno

### 3. Frontend Deployment (Vercel/Netlify)

#### Opción A: Vercel
1. Conecta tu repositorio GitHub a Vercel
2. Configura el proyecto:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. Variables de entorno:
   ```env
   VITE_API_BASE_URL=https://tu-backend.railway.app
   VITE_APP_NAME=Graduación 2024
   ```

#### Opción B: Netlify
1. Conecta tu repositorio GitHub a Netlify
2. Configura build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. Agrega las mismas variables de entorno

### 4. Configurar WhatsApp Business API

#### Pasos para obtener credenciales:
1. Ve a [developers.facebook.com](https://developers.facebook.com)
2. Crea una aplicación de negocio
3. Agrega el producto "WhatsApp Business API"
4. Configura el webhook URL: `https://tu-backend.railway.app/webhooks/whatsapp`
5. Obtén:
   - `WHATSAPP_TOKEN`: Token de acceso
   - `WHATSAPP_PHONE_NUMBER_ID`: ID del número de teléfono

### 5. Configurar Twilio (Backup SMS)

#### Pasos para obtener credenciales:
1. Crea cuenta en [twilio.com](https://twilio.com)
2. Ve al Console Dashboard
3. Obtén:
   - `TWILIO_ACCOUNT_SID`: Account SID
   - `TWILIO_AUTH_TOKEN`: Auth Token
   - `TWILIO_PHONE_NUMBER`: Número de teléfono Twilio

## 📱 Uso del Sistema

### 1. Preparar Lista de Invitados

Crear archivo Excel con las siguientes columnas:
- **nombre**: Nombre completo (requerido)
- **telefono**: Número con código de país (requerido)
- **mensaje**: Mensaje personalizado (opcional)

### 2. Enviar Invitaciones

```bash
# En el directorio backend
npm run enviar-invitaciones invitados.xlsx
```

### 3. Monitorear Respuestas

1. Ve al panel admin: `https://tu-frontend.vercel.app/admin`
2. Login con la contraseña configurada
3. Ve estadísticas y exporta datos en CSV

## 🔧 Scripts Útiles

### Backend:
```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Crear Excel de ejemplo
npm run crear-excel-ejemplo

# Enviar invitaciones
npm run enviar-invitaciones archivo.xlsx
```

### Frontend:
```bash
# Desarrollo local
npm run dev

# Construir para producción
npm run build

# Vista previa de build
npm run preview
```

## 🌐 URLs del Sistema

- **Frontend**: `https://tu-frontend.vercel.app`
- **Panel Admin**: `https://tu-frontend.vercel.app/admin`
- **API Backend**: `https://tu-backend.railway.app`
- **Confirmación**: `https://tu-frontend.vercel.app/confirmar/{token}`

## 🔒 Seguridad

### Credenciales importantes:
- Cambia `JWT_SECRET` por una clave segura de 32+ caracteres
- Usa contraseña admin fuerte
- Mantén las claves de Supabase seguras
- Configura CORS solo para tu dominio frontend

### Variables de entorno críticas:
```env
JWT_SECRET=cambiar_por_algo_super_seguro_de_32_caracteres
ADMIN_PASSWORD=contraseña_admin_muy_segura
SUPABASE_SERVICE_ROLE_KEY=clave_de_servicio_secreta
```

## 📊 Monitoreo

### Logs importantes:
- Railway/Render: Ver logs de aplicación
- Supabase: Dashboard de base de datos
- Vercel/Netlify: Logs de deployment

### Métricas clave:
- Total de invitaciones enviadas
- Tasa de confirmación
- Errores de envío de mensajes
- Tiempo de respuesta de API

## 🆘 Troubleshooting

### Errores comunes:

**1. Error de CORS:**
- Verificar `FRONTEND_URL` en backend
- Configurar dominios correctos

**2. WhatsApp no envía:**
- Verificar credenciales
- Comprobar límites de API
- Usar SMS como backup

**3. Base de datos no conecta:**
- Verificar credenciales Supabase
- Comprobar políticas RLS
- Verificar conexión de red

**4. Build falla:**
- Verificar versiones de Node.js
- Limpiar node_modules y reinstalar
- Comprobar sintaxis TypeScript

## 💰 Costos Estimados

- **Supabase**: Gratuito hasta 500MB
- **Railway/Render**: $0-5/mes (plan hobby)
- **Vercel/Netlify**: Gratuito
- **WhatsApp API**: ~$0.005 por mensaje
- **Twilio SMS**: ~$0.10 por mensaje
- **Total para 100 invitados**: ~$5-15/mes