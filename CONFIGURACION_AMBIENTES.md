# 🔧 Configuración de Ambientes - Sistema de Invitaciones

## 📍 1. Configuración de CORS

### Ubicación del CORS
**Archivo**: `backend/src/main.ts` líneas 50-53

```typescript
// CORS
this.app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### Configurar CORS por Ambiente
```typescript
// Para múltiples dominios
this.app.use(cors({
  origin: [
    'http://localhost:5173',           // Desarrollo
    'https://tu-app.vercel.app',       // Producción
    'https://staging-tu-app.vercel.app' // Staging
  ],
  credentials: true
}));
```

### Por Variables de Entorno
```typescript
// Más flexible usando variables de entorno
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || ['http://localhost:5173'];

this.app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

## 🏗️ 2. Estructura de Ambientes Recomendada

### Archivos de Configuración por Ambiente

```
proyecto/
├── .env.example          # Plantilla con todas las variables
├── .env.development     # Valores seguros para desarrollo (puede ser commiteado)
├── .gitignore          # Excluye archivos .env sensibles
└── backend/
    ├── .env.example    # Plantilla específica del backend
    └── .env           # Variables reales (NUNCA commitear)
└── frontend/
    ├── .env.example   # Plantilla específica del frontend
    └── .env          # Variables reales (NUNCA commitear)
```

### Variables por Ambiente

#### 🟢 Desarrollo (.env.development)
```env
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001

# Supabase - Proyecto de desarrollo
SUPABASE_URL=https://dev-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_key_desarrollo_publica

# Secrets menos sensibles para dev
JWT_SECRET=development_jwt_secret_key
ADMIN_PASSWORD=admin123

# WhatsApp/Twilio deshabilitados en dev
# WHATSAPP_TOKEN=
# TWILIO_ACCOUNT_SID=
```

#### 🟡 Staging (.env.staging)
```env
NODE_ENV=staging
FRONTEND_URL=https://staging-invitaciones.vercel.app
BACKEND_URL=https://staging-api.railway.app

# Supabase - Proyecto de staging
SUPABASE_URL=https://staging-proyecto.supabase.co
SUPABASE_ANON_KEY=staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=staging_service_key

# Secrets reales pero de staging
JWT_SECRET=staging_jwt_secret_super_seguro
ADMIN_PASSWORD=staging_admin_password

# APIs de prueba
WHATSAPP_TOKEN=test_whatsapp_token
```

#### 🔴 Producción (.env.production)
```env
NODE_ENV=production
FRONTEND_URL=https://invitaciones.tudominio.com
BACKEND_URL=https://api-invitaciones.tudominio.com

# Supabase - Proyecto de producción
SUPABASE_URL=https://prod-proyecto.supabase.co
SUPABASE_ANON_KEY=prod_anon_key
SUPABASE_SERVICE_ROLE_KEY=prod_service_role_key

# Secrets súper seguros
JWT_SECRET=produccion_jwt_super_mega_seguro_32_chars
ADMIN_PASSWORD=admin_password_super_seguro

# APIs reales
WHATSAPP_TOKEN=prod_whatsapp_token
WHATSAPP_PHONE_NUMBER_ID=prod_phone_id
```

## 🔒 3. Manejo Seguro de Secretos

### Scripts en package.json
```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/main.ts",
    "dev:staging": "NODE_ENV=staging nodemon src/main.ts",
    "start:prod": "NODE_ENV=production node dist/main.js",
    "test": "NODE_ENV=test jest"
  }
}
```

### Usando dotenv-flow (Recomendado)
```bash
npm install dotenv-flow
```

```typescript
// backend/src/main.ts
import dotenv from 'dotenv-flow';

// Carga automáticamente .env.[NODE_ENV]
dotenv.config();
```

### Jerarquía de Archivos de Entorno
1. `.env.development.local` (más específico)
2. `.env.local`
3. `.env.development`
4. `.env`

## 🚀 4. Deploy con Ambientes

### Backend (Railway/Render)

#### Variables de Entorno en Railway:
```bash
# Producción
NODE_ENV=production
FRONTEND_URL=${{RAILWAY_STATIC_URL}}
JWT_SECRET=${{secrets.JWT_SECRET}}
ADMIN_PASSWORD=${{secrets.ADMIN_PASSWORD}}
SUPABASE_URL=${{secrets.SUPABASE_URL}}
# ... resto de variables sensibles
```

#### Variables de Entorno en Render:
- Ve a tu servicio → Environment
- Agrega variables una por una
- Usa "Secret Files" para archivos .env completos

### Frontend (Vercel/Netlify)

#### En Vercel:
```bash
# Settings → Environment Variables
VITE_API_BASE_URL=https://tu-backend.railway.app
VITE_APP_NAME=Graduación 2024
```

#### Por Ambiente en Vercel:
- **Development**: Variables para ramas `dev/*`
- **Preview**: Variables para pull requests
- **Production**: Variables para rama `main`

## 🔧 5. Scripts de Desarrollo Mejorados

### package.json Backend:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development nodemon src/main.ts",
    "dev:watch": "NODE_ENV=development nodemon --watch 'src/**/*.ts' --exec 'ts-node' src/main.ts",
    "staging": "NODE_ENV=staging ts-node src/main.ts",
    "build": "tsc",
    "start": "NODE_ENV=production node dist/main.js",
    "enviar:dev": "NODE_ENV=development ts-node scripts/enviar-invitaciones.ts",
    "enviar:staging": "NODE_ENV=staging ts-node scripts/enviar-invitaciones.ts",
    "enviar:prod": "NODE_ENV=production ts-node scripts/enviar-invitaciones.ts"
  }
}
```

### package.json Frontend:
```json
{
  "scripts": {
    "dev": "vite --mode development",
    "staging": "vite --mode staging",
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging", 
    "build:prod": "vite build --mode production"
  }
}
```

## 🛡️ 6. Mejores Prácticas de Seguridad

### ✅ DO (Hacer):
- Usar archivos `.env.example` como plantilla
- Commitear archivos `.env.development` con valores no sensibles
- Rotar secrets regularmente en producción
- Usar servicios de secrets management (AWS Secrets, Railway secrets)
- Validar variables de entorno al inicio de la app

### ❌ DON'T (No hacer):
- NUNCA commitear archivos `.env` con datos reales
- No hardcodear secrets en el código
- No usar mismos secrets entre ambientes
- No exponer service_role_key en frontend

## 🔍 7. Validación de Variables

### Crear validador de entorno:
```typescript
// backend/src/config/validateEnv.ts
export function validateEnvironment() {
  const required = [
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY', 
    'JWT_SECRET',
    'ADMIN_PASSWORD'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    process.exit(1);
  }
  
  console.log('✅ Environment variables validated');
}

// En main.ts
validateEnvironment();
```

## 📋 8. Comandos Útiles

### Setup Inicial:
```bash
# Copiar archivos de ejemplo
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Instalar dependencias
npm run install:all  # Si tienes script para instalar todo
```

### Para Desarrollo:
```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev

# Ambos a la vez (si tienes concurrently)
npm run dev:all
```

### Para Testing:
```bash
NODE_ENV=test npm test
```

### Para Staging:
```bash
NODE_ENV=staging npm run start
```

Con esta configuración tendrás:
- Separación clara entre ambientes
- Secrets seguros fuera del repositorio  
- CORS configurado por ambiente
- Scripts específicos para cada entorno
- Validación de variables requeridas

## 🎯 Flujo de Trabajo Recomendado

1. **Desarrollo**: Usar `.env.development` (puede commitearse)
2. **Testing**: Variables específicas para tests
3. **Staging**: Deploy automático con variables de staging
4. **Producción**: Deploy manual/automático con secrets seguros