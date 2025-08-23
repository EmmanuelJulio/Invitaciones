# Stack Tecnológico - Sistema de Invitaciones de Graduación

## Resumen del Proyecto
Sistema web para gestionar invitaciones personalizadas de graduación con confirmación de asistencia, panel de administración y envío masivo de mensajes por WhatsApp/SMS.

**Capacidad estimada:** 100 invitados
**Arquitectura:** Backend separado + Frontend SPA con Domain Driven Design

---

## 🗄️ Base de Datos

### **Supabase (PostgreSQL)**
- **Por qué:** Gratuito hasta 500MB, fácil integración, API REST automática
- **Tabla principal:** `invitados`
  - `id`: UUID (primary key)
  - `nombre`: TEXT
  - `telefono`: TEXT
  - `mensaje`: TEXT (opcional)
  - `token`: TEXT (único para URLs personalizadas)
  - `estado`: ENUM ('pendiente', 'confirmado', 'rechazado')
  - `fecha_confirmacion`: TIMESTAMP
  - `created_at`: TIMESTAMP

---

## 🏗️ Arquitectura DDD - Backend Separado

### **Backend: Node.js + Express + TypeScript**

#### **Domain Layer (Núcleo del negocio)**
```
src/domain/
├── entities/
│   ├── Invitado.ts
│   └── ConfirmacionEvento.ts
├── value-objects/
│   ├── Token.ts
│   ├── EstadoInvitacion.ts
│   └── DatosContacto.ts
├── repositories/
│   └── InvitadoRepository.ts (interface)
├── services/
│   ├── ConfirmacionService.ts
│   └── GeneradorTokenService.ts
└── events/
    └── InvitacionConfirmada.ts
```

#### **Application Layer (Casos de uso)**
```
src/application/
├── use-cases/
│   ├── ConfirmarAsistencia.ts
│   ├── RechazarAsistencia.ts
│   ├── ObtenerInvitado.ts
│   ├── ListarInvitados.ts
│   └── CrearInvitacion.ts
├── dtos/
│   ├── ConfirmarAsistenciaDto.ts
│   └── InvitadoResponseDto.ts
└── ports/
    ├── NotificationService.ts
    └── ExportService.ts
```

#### **Infrastructure Layer (Detalles técnicos)**
```
src/infrastructure/
├── database/
│   ├── SupabaseClient.ts
│   └── InvitadoRepositoryImpl.ts
├── external-services/
│   ├── WhatsAppService.ts
│   └── TwilioService.ts
├── web/
│   ├── routes/
│   ├── middlewares/
│   └── controllers/
└── config/
    └── database.ts
```

#### **API Endpoints:**
- `GET /api/invitados/:token` - Obtener datos del invitado
- `POST /api/invitados/:token/confirmar` - Confirmar asistencia
- `POST /api/invitados/:token/rechazar` - Rechazar asistencia
- `GET /api/admin/invitados` - Listar todos (autenticado)
- `POST /api/admin/export` - Exportar CSV
- `POST /api/admin/enviar-invitaciones` - Envío masivo

---

## 🎨 Frontend Separado

### **React + TypeScript + Vite**

#### **Arquitectura por Features**
```
src/
├── features/
│   ├── confirmacion/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   ├── administracion/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── shared/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── types/
├── api/
│   └── client.ts (Axios config)
├── routes/
└── main.tsx
```

#### **Rutas:**
- `/confirmar/:token` - Landing de confirmación
- `/admin` - Panel de administración
- `/admin/dashboard` - Dashboard con estadísticas
- `/admin/export` - Exportación de datos

#### **State Management:**
- **Zustand** para estado global simple
- **React Query** para cache de API calls
- **React Hook Form** para formularios

---

## 📱 Envío de Mensajes

### **Opción 1: WhatsApp Business API (Meta)**
- **Herramienta:** Node.js script separado
- **Funcionalidades:**
  - Leer Excel de invitados
  - Generar tokens únicos
  - Crear URLs personalizadas
  - Enviar mensajes individuales

### **Opción 2: SMS (Twilio) - Backup**
- Más confiable pero con costo
- Fácil integración con Node.js

### **Script de envío:**
```
npm run enviar-invitaciones
```

---

## 🚀 Deployment Separado

### **Backend: Railway/Render**
- **Node.js API** con base de datos Supabase
- **Variables de entorno:**
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
ADMIN_PASSWORD=
WHATSAPP_TOKEN=
JWT_SECRET=
PORT=
```

### **Frontend: Vercel/Netlify**
- **React SPA** estático
- **Variables de entorno:**
```
VITE_API_BASE_URL=https://api-graduacion.railway.app
VITE_APP_NAME=Graduación 2024
```

### **Dominios:**
- Backend: `api-graduacion.railway.app`
- Frontend: `graduacion-2024.vercel.app`

### **CORS Configuration:**
- Backend configurado para aceptar requests del frontend
- Headers apropiados para seguridad

---

## 📊 Herramientas de Análisis

### **Panel de administración incluido:**
- Vista en tiempo real de confirmaciones
- Contador de confirmados/pendientes/rechazados
- Filtros por estado
- Exportación CSV

### **Google Analytics (opcional):**
- Seguimiento de visitas a la landing
- Tasa de confirmación

---

## 🔧 Desarrollo Local

### **Requisitos:**
- Node.js 18+
- npm/yarn
- Cuenta Supabase (gratuita)

### **Setup Backend:**
```bash
cd backend/
npm install
npm run dev  # Puerto 3001
```

### **Setup Frontend:**
```bash
cd frontend/
npm install
npm run dev  # Puerto 5173
```

### **Estructura de repositorios:**
```
graduacion-backend/
├── src/
│   ├── domain/          # Entidades y reglas de negocio
│   ├── application/     # Casos de uso
│   ├── infrastructure/  # Detalles técnicos
│   └── main.ts         # Punto de entrada
├── tests/
├── scripts/            # Script de envío masivo
└── package.json

graduacion-frontend/
├── src/
│   ├── features/       # Funcionalidades por dominio
│   ├── shared/         # Componentes compartidos
│   ├── api/           # Cliente API
│   └── main.tsx
├── public/
└── package.json
```

---

## 💰 Costos Estimados

- **Supabase:** $0 (plan gratuito)
- **Vercel:** $0 (plan gratuito)
- **WhatsApp API:** ~$0.05 por mensaje (100 mensajes = $5)
- **SMS Backup (Twilio):** ~$0.10 por mensaje

**Total estimado:** $5 - $10 USD

---

## ⏱️ Timeline Estimado

### **Backend (3 días):**
1. **Setup + Domain Layer:** 1 día
2. **Application Layer + API:** 1 día
3. **Infrastructure + Deploy:** 1 día

### **Frontend (2 días):**
1. **Landing + Confirmación:** 1 día
2. **Panel Admin + Deploy:** 1 día

### **Integración (1 día):**
1. **Testing completo + Script envío:** 1 día

**Total:** 6 días de desarrollo

---

## 🔒 Seguridad

- Tokens únicos y seguros (UUID)
- Validación de entrada en todos los endpoints
- Autenticación simple por contraseña para admin
- Rate limiting en API endpoints
- HTTPS automático con Vercel