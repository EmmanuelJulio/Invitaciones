# Backend - Sistema de Invitaciones de Graduación

## Arquitectura

Este backend está implementado siguiendo los principios de **Domain Driven Design (DDD)** con una arquitectura en capas:

### Estructura de Carpetas

```
src/
├── domain/              # Reglas de negocio
│   ├── entities/        # Entidades del dominio
│   ├── value-objects/   # Objetos de valor
│   ├── repositories/    # Interfaces de repositorios
│   ├── services/        # Servicios de dominio
│   └── events/          # Eventos de dominio
├── application/         # Casos de uso
│   ├── use-cases/       # Casos de uso específicos
│   ├── dtos/           # Data Transfer Objects
│   └── ports/          # Interfaces para servicios externos
├── infrastructure/     # Detalles técnicos
│   ├── database/       # Implementación de repositorios
│   ├── external-services/ # Servicios externos (WhatsApp, SMS)
│   ├── web/           # Controladores, rutas, middlewares
│   └── config/        # Configuración
└── main.ts            # Punto de entrada
```

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura las variables:

```env
# Base de datos Supabase
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima
SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio

# Autenticación
JWT_SECRET=tu_secreto_jwt_seguro
ADMIN_PASSWORD=tu_contraseña_admin

# WhatsApp (opcional)
WHATSAPP_TOKEN=tu_token_whatsapp
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Supabase

Crea una tabla `invitados` en Supabase:

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

-- Índices para optimizar consultas
CREATE INDEX idx_invitados_token ON invitados(token);
CREATE INDEX idx_invitados_estado ON invitados(estado);
CREATE INDEX idx_invitados_created_at ON invitados(created_at);
```

## Comandos

```bash
# Desarrollo
npm run dev

# Construir
npm run build

# Producción
npm start
```

## API Endpoints

### Públicos (Confirmación)
- `GET /api/invitados/:token` - Obtener datos del invitado
- `POST /api/invitados/:token/confirmar` - Confirmar asistencia
- `POST /api/invitados/:token/rechazar` - Rechazar asistencia

### Administrativos (Requieren autenticación)
- `POST /api/auth/login` - Login administrativo
- `GET /api/auth/validate` - Validar token
- `GET /api/invitados` - Listar todos los invitados
- `GET /api/invitados/admin/estadisticas` - Obtener estadísticas
- `POST /api/invitados` - Crear invitado individual
- `POST /api/invitados/lote` - Crear invitados en lote

### Health Check
- `GET /health` - Estado del servidor
- `GET /` - Información de la API

## Uso

### Autenticación Administrativa

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin123' })
});

const { token } = await response.json();

// Usar token en requests administrativos
const invitados = await fetch('/api/invitados', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### Confirmar Asistencia

```javascript
// Obtener información del invitado
const invitado = await fetch(`/api/invitados/${token}`);

// Confirmar asistencia
const confirmacion = await fetch(`/api/invitados/${token}/confirmar`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    confirmado: true,
    mensaje: 'Mensaje opcional'
  })
});
```

## Desarrollo

El proyecto sigue principios de **Clean Architecture** y **DDD**:

1. **Domain Layer**: Contiene la lógica de negocio pura
2. **Application Layer**: Orquesta las operaciones de negocio
3. **Infrastructure Layer**: Maneja detalles técnicos como base de datos y APIs externas

Cada capa depende solo de las capas interiores, manteniendo el código desacoplado y testeable.