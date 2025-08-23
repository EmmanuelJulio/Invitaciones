# 🎓 Sistema de Invitaciones de Graduación

Sistema completo para gestionar invitaciones personalizadas de graduación con confirmación de asistencia, panel administrativo y envío masivo por WhatsApp/SMS.

## ✨ Características

- 📱 **Landing page responsive** para confirmación de asistencia
- 📊 **Panel administrativo** con estadísticas en tiempo real
- 📞 **Envío masivo** por WhatsApp Business API y SMS (backup)
- 🔒 **Autenticación segura** para administradores
- 📈 **Exportación CSV** de datos de confirmaciones
- 🎨 **Diseño elegante** con Tailwind CSS
- ⚡ **Arquitectura moderna** con DDD y TypeScript

## 🏗️ Arquitectura

### Backend (DDD + TypeScript)
- **Domain Layer**: Entidades de negocio (Invitado, Token, Estado)
- **Application Layer**: Casos de uso (Confirmar, Crear, Listar)
- **Infrastructure Layer**: Base de datos, APIs externas, web

### Frontend (React + TypeScript)
- **Feature-based**: Confirmación y Administración separadas
- **State Management**: React Query + Zustand
- **Styling**: Tailwind CSS con componentes reutilizables

### Base de Datos
- **Supabase (PostgreSQL)**: Escalable y con API REST automática
- **Row Level Security**: Políticas de acceso granular

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta Supabase (gratuita)
- WhatsApp Business API (opcional)

### 1. Clonar repositorio
```bash
git clone [URL_DEL_REPO]
cd invitaciones
```

### 2. Configurar Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
PORT=3001
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu_clave_anonima
JWT_SECRET=tu_secreto_jwt_seguro
ADMIN_PASSWORD=tu_contraseña_admin
FRONTEND_URL=http://localhost:5173
```

### 3. Configurar Frontend
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edita `.env`:
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=Graduación 2024
```

### 4. Configurar Base de Datos

Ejecuta en Supabase SQL Editor:
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

## 🔥 Desarrollo Local

### Iniciar Backend
```bash
cd backend
npm run dev
```

### Iniciar Frontend
```bash
cd frontend
npm run dev
```

### URLs de Desarrollo
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Panel Admin: http://localhost:5173/admin

## 📱 Uso del Sistema

### 1. Crear Lista de Invitados

```bash
cd backend
npm run crear-excel-ejemplo
```

Esto crea `invitados-ejemplo.xlsx` con el formato correcto:
- **nombre**: Nombre completo del invitado
- **telefono**: Número con código de país (+57...)
- **mensaje**: Mensaje personalizado (opcional)

### 2. Enviar Invitaciones

```bash
npm run enviar-invitaciones invitados-ejemplo.xlsx
```

El script:
1. ✅ Lee el archivo Excel
2. ✅ Crea invitaciones en la base de datos
3. ✅ Genera tokens únicos para cada invitado
4. ✅ Envía mensajes personalizados por WhatsApp/SMS

### 3. Gestionar Respuestas

1. Ve al panel admin: http://localhost:5173/admin
2. Usa la contraseña configurada en `.env`
3. Ve estadísticas en tiempo real
4. Exporta datos en CSV para análisis

## 📊 Funcionalidades del Panel Admin

- **Dashboard**: Estadísticas generales y progreso
- **Lista de invitados**: Filtros por estado y búsqueda
- **Exportación**: Datos completos en formato CSV
- **Tiempo real**: Actualizaciones automáticas

## 🎨 Personalización

### Información del Evento
Edita `src/domain/entities/ConfirmacionEvento.ts`:
```typescript
static graduacion2024(): ConfirmacionEvento {
  return new ConfirmacionEvento(
    'Tu Evento 2024', // Título
    new Date('2024-12-15T18:00:00'), // Fecha
    'Tu Ubicación', // Lugar
    'Aproximadamente 4 horas', // Duración
    'Elegante Sport', // Código vestimenta
    'Tu nota especial aquí' // Nota importante
  );
}
```

### Colores y Estilos
Edita `frontend/tailwind.config.js` para cambiar la paleta de colores.

### Mensajes de WhatsApp
Personaliza en `src/infrastructure/external-services/WhatsAppService.ts`:
```typescript
generateInvitationMessage(data: MensajeInvitacion): string {
  return `¡Tu mensaje personalizado aquí! 🎓
  
Evento: ${data.evento.titulo}
Fecha: ${data.evento.fecha}
Lugar: ${data.evento.ubicacion}

Confirma aquí: ${data.urlConfirmacion}`;
}
```

## 🚀 Deployment

Consulta [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones completas de producción.

### Quick Deploy
1. **Backend**: Deploy en Railway/Render
2. **Frontend**: Deploy en Vercel/Netlify
3. **Base de datos**: Configurar Supabase
4. **WhatsApp**: Configurar Business API

## 📱 API Endpoints

### Públicos (Confirmación)
- `GET /api/invitados/:token` - Obtener invitado
- `POST /api/invitados/:token/confirmar` - Confirmar asistencia

### Administrativos
- `POST /api/auth/login` - Login admin
- `GET /api/invitados` - Listar invitados
- `GET /api/invitados/admin/estadisticas` - Estadísticas
- `POST /api/invitados/lote` - Crear invitados en lote

## 🔒 Seguridad

- ✅ **JWT Authentication** para panel admin
- ✅ **Row Level Security** en Supabase
- ✅ **CORS configurado** para dominios específicos
- ✅ **Validación de datos** en backend y frontend
- ✅ **Rate limiting** implícito en APIs externas
- ✅ **Tokens únicos** para cada invitación

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## 📈 Monitoreo

### Métricas importantes:
- Total de invitaciones enviadas
- Tasa de confirmación (% confirmados/total)
- Tiempo de respuesta promedio
- Errores de envío de mensajes

### Logs útiles:
- Estado de envío de WhatsApp/SMS
- Confirmaciones recibidas
- Errores de API
- Accesos al panel admin

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para problemas y preguntas:
1. Revisa la documentación
2. Consulta [DEPLOYMENT.md](./DEPLOYMENT.md)
3. Abre un Issue en GitHub
4. Revisa los logs de la aplicación

## 🙏 Agradecimientos

- [Supabase](https://supabase.com) - Base de datos y backend
- [Vercel](https://vercel.com) - Hosting del frontend
- [Railway](https://railway.app) - Hosting del backend
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS
- [React Query](https://tanstack.com/query) - Gestión de estado servidor

---

**¡Hecho con ❤️ para celebrar logros importantes!** 🎓