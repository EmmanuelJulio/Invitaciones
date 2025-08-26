# 🎨 Guía de Desarrollo Frontend - Sistema de Invitaciones

## 📍 Componentes Principales y Ubicaciones

### 🔑 Componentes de Autenticación
- **LoginForm**: `frontend/src/features/administracion/components/LoginForm.tsx`
  - Formulario de login con validación
  - Usa classes CSS: `gradient-bg`, `card`, `form-input`, `btn-primary`
  - Estados: loading, error handling

### 🏠 Componentes del Panel Admin
- **PanelAdmin**: `frontend/src/features/administracion/components/PanelAdmin.tsx`
  - Container principal del panel administrativo
  - Header con botones de acción y logout
  - Integra EstadisticasCard y TablaInvitados

- **EstadisticasCard**: `frontend/src/features/administracion/components/EstadisticasCard.tsx`
  - Métricas visuales del evento (total, confirmados, rechazados, pendientes)
  - Cards con iconos y colores diferenciados

- **TablaInvitados**: `frontend/src/features/administracion/components/TablaInvitados.tsx`
  - Tabla responsive con lista de invitados
  - Filtros y búsqueda
  - Badges de estado (`badge-pendiente`, `badge-confirmado`, `badge-rechazado`)

### 📋 Componentes de Confirmación (Público)
- **PaginaConfirmacion**: `frontend/src/features/confirmacion/components/PaginaConfirmacion.tsx`
  - Landing page para confirmar asistencia
  - Usa parámetro `:token` de la URL
  - Layout responsive con `container-responsive`

- **EventoInfo**: `frontend/src/features/confirmacion/components/EventoInfo.tsx`
  - Información del evento (fecha, lugar, duración, etc.)
  - Diseño elegante con tipografía Playfair Display

- **FormularioConfirmacion**: `frontend/src/features/confirmacion/components/FormularioConfirmacion.tsx`
  - Botones para confirmar/rechazar asistencia
  - Estados visuales según respuesta del invitado

### 🔧 Componentes Reutilizables
- **Button**: `frontend/src/shared/components/Button.tsx`
  - Variantes: `primary`, `secondary`, `danger`
  - Tamaños: `sm`, `md`, `lg`
  - Estados: `loading` con spinner integrado

- **LoadingSpinner**: `frontend/src/shared/components/LoadingSpinner.tsx`
  - Spinner animado reutilizable
  - Tamaños configurables

## 🎨 Archivos de Estilos y Configuración

### 📄 CSS Principal
**Archivo**: `frontend/src/index.css`

#### Fuentes:
- **Inter**: Texto general (sans-serif)
- **Playfair Display**: Títulos y encabezados (serif)

#### Clases CSS Principales:
```css
/* Botones */
.btn-primary     /* Naranja principal */
.btn-secondary   /* Gris/blanco */
.btn-danger      /* Rojo */

/* Layout */
.gradient-bg     /* Fondo degradado naranja-blanco */
.card           /* Contenedor blanco con sombra */
.container-responsive /* Container responsive */

/* Forms */
.form-input     /* Input estilizado */
.form-label     /* Label de formulario */

/* Estados */
.badge-pendiente    /* Badge amarillo */
.badge-confirmado   /* Badge verde */
.badge-rechazado    /* Badge rojo */

/* Loading */
.loading-spinner    /* Spinner animado */

/* Animaciones */
.fade-in        /* Entrada suave */
.scale-in       /* Entrada con escala */
```

#### Responsive Breakpoints:
- **Mobile**: < 640px
- **Tablet**: 641px - 768px  
- **Desktop**: > 1024px

### ⚙️ Configuración Tailwind
**Archivo**: `frontend/tailwind.config.js`

#### Colores Personalizados:
- **Primary**: Paleta naranja (orange-50 a orange-900)
- **Secondary**: Grises
- **Estados**: Verde (confirmado), Amarillo (pendiente), Rojo (rechazado)

#### Animaciones Personalizadas:
- `fade-in`: Entrada suave
- `scale-in`: Entrada con escala
- `pulse-slow`: Pulso lento

## 🚀 Setup Desarrollo Local

### 1. Prerrequisitos
```bash
# Verificar versiones
node --version  # >= 18.0.0
npm --version   # >= 8.0.0
```

### 2. Configuración Backend
```bash
# 1. Instalar dependencias
cd backend
npm install

# 2. Configurar variables de entorno
# Crear archivo .env en /backend/
```

**Archivo `.env` para Backend**:
```env
# Servidor
NODE_ENV=development
PORT=3001

# Base de datos Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Autenticación
JWT_SECRET=tu_secreto_jwt_muy_seguro_de_32_caracteres
ADMIN_PASSWORD=tu_contraseña_admin

# Frontend
FRONTEND_URL=http://localhost:5173

# WhatsApp (Opcional para desarrollo)
WHATSAPP_TOKEN=tu_token_whatsapp
WHATSAPP_PHONE_NUMBER_ID=tu_phone_id

# Twilio SMS Backup (Opcional)
TWILIO_ACCOUNT_SID=tu_account_sid
TWILIO_AUTH_TOKEN=tu_auth_token
TWILIO_PHONE_NUMBER=tu_numero_twilio
```

### 3. Configuración Frontend
```bash
# 1. Instalar dependencias
cd frontend
npm install

# 2. Configurar variables de entorno
# Crear archivo .env en /frontend/
```

**Archivo `.env` para Frontend**:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Graduación 2024
```

### 4. Configurar Base de Datos Supabase
```sql
-- Ejecutar en Supabase SQL Editor
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

-- Índices
CREATE INDEX idx_invitados_token ON invitados(token);
CREATE INDEX idx_invitados_estado ON invitados(estado);

-- RLS (opcional para desarrollo)
ALTER TABLE invitados ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for development" ON invitados FOR ALL USING (true);
```

### 5. Ejecutar en Desarrollo
```bash
# Terminal 1 - Backend (Puerto 3001)
cd backend
npm run dev

# Terminal 2 - Frontend (Puerto 5173)
cd frontend
npm run dev
```

### 6. URLs de Desarrollo
- **Frontend**: http://localhost:5173
- **Panel Admin**: http://localhost:5173/admin
- **API Backend**: http://localhost:3001
- **Demo Confirmación**: http://localhost:5173/demo

## 🔧 Modificación de Estilos

### Cambiar Colores Principales
1. **Editar** `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      // Cambiar estos valores
      primary: colors.blue,    // En lugar de orange
      secondary: colors.gray,
    }
  }
}
```

2. **Actualizar CSS** en `frontend/src/index.css`:
```css
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700; /* Cambiar orange por blue */
}

.gradient-bg {
  @apply bg-gradient-to-br from-blue-50 via-white to-slate-50;
}
```

### Cambiar Fuentes
1. **Editar** `frontend/src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap');

@layer base {
  html {
    font-family: 'Roboto', system-ui, sans-serif; /* Cambiar Inter por Roboto */
  }
}
```

### Modificar Componentes Visuales
```bash
# Componentes clave para personalización:
frontend/src/features/confirmacion/components/EventoInfo.tsx      # Info del evento
frontend/src/features/administracion/components/EstadisticasCard.tsx  # Cards de métricas
frontend/src/shared/components/Button.tsx                        # Botones globales
```

## 🚀 Deploy a Producción

### Backend (Railway/Render)
```bash
# Build command
cd backend && npm install && npm run build

# Start command
cd backend && npm start

# Variables de entorno de producción
NODE_ENV=production
FRONTEND_URL=https://tu-dominio-frontend.vercel.app
# ... resto de variables
```

### Frontend (Vercel/Netlify)
```bash
# Configuración Vercel
Root Directory: frontend
Build Command: npm run build
Output Directory: dist

# Variables de entorno
VITE_API_BASE_URL=https://tu-api-backend.railway.app
```

### Comandos Útiles
```bash
# Backend
npm run dev          # Desarrollo
npm run build        # Build producción
npm run enviar-invitaciones archivo.xlsx  # Enviar invitaciones

# Frontend  
npm run dev          # Desarrollo
npm run build        # Build producción
npm run preview      # Preview de build
npm run lint         # Linting
```

## 🎯 Flujo de Trabajo Recomendado

1. **Desarrollo Local**: Usar archivos .env locales sin WhatsApp
2. **Testing**: Usar `/demo` para probar la UI de confirmación
3. **Staging**: Deploy con datos de prueba
4. **Producción**: Configurar todas las APIs (WhatsApp, Twilio)

## 📱 Testing Sin WhatsApp

Para desarrollo sin credenciales de WhatsApp:
1. El sistema detecta automáticamente si faltan credenciales
2. Los logs muestran mensajes de "WhatsApp credentials not configured"
3. Usa el panel admin para crear invitaciones de prueba
4. Accede directamente a `/confirmar/[token]` para probar

## 🎨 Personalización Visual

### Elementos Más Importantes a Personalizar:
1. **Colores**: `tailwind.config.js` + `index.css`
2. **Logo/Branding**: `EventoInfo.tsx` 
3. **Mensajes**: `WhatsAppService.ts` (backend)
4. **Información del Evento**: `ConfirmacionEvento.ts` (backend)
5. **Tipografía**: `index.css` imports de Google Fonts

Este sistema está listo para desarrollo local y puede ser personalizado fácilmente modificando los archivos CSS y componentes React mencionados.