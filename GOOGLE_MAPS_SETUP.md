# Configuración de Google Maps API

Para mostrar el mapa embebido en las invitaciones, necesitas configurar una API key de Google Maps.

## 🗝️ Cómo obtener la API Key

### 1. **Ir a Google Cloud Console**
   - Visita: https://console.cloud.google.com/

### 2. **Crear o seleccionar un proyecto**
   - Si no tienes proyecto, crea uno nuevo
   - Selecciona tu proyecto desde el dropdown

### 3. **Habilitar la API de Maps JavaScript**
   - Ve a: **APIs & Services** → **Library**
   - Busca: **"Maps JavaScript API"**
   - Click en **"Enable"**

### 4. **Crear credenciales**
   - Ve a: **APIs & Services** → **Credentials**
   - Click en **"+ CREATE CREDENTIALS"**
   - Selecciona **"API Key"**
   - Copia la API key generada

### 5. **Configurar restricciones (Recomendado)**
   - En la página de credenciales, click en tu API key
   - En **"Application restrictions"**:
     - Selecciona **"HTTP referrers (websites)"**
     - Agrega: `http://localhost:*/*` (para desarrollo)
     - Agrega tu dominio de producción cuando deploys
   - En **"API restrictions"**:
     - Selecciona **"Restrict key"**
     - Marca **"Maps JavaScript API"**
   - Click **"Save"**

## 📁 Configuración en el proyecto

### 1. **Crear archivo .env**
```bash
# En frontend/
cp .env.example .env
```

### 2. **Agregar tu API key**
```env
# frontend/.env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. **Reiniciar servidor de desarrollo**
```bash
npm run dev
```

## 💰 Costos

Google Maps ofrece:
- **$200 USD de crédito mensual gratis**
- **28,000 cargas de mapas gratis al mes**
- Para invitaciones es más que suficiente

## 🔧 Fallback sin API Key

Si no configuras la API key, el mapa mostrará:
- Mensaje "Mapa no disponible"
- Botón para abrir Google Maps en nueva pestaña
- La funcionalidad básica sigue funcionando

## 📱 Funcionalidades del mapa

Con la API key configurada tendrás:
- **Mapa embebido** con la ubicación exacta
- **Vista satelital/calles** interactiva
- **Zoom** y navegación
- **Marcador** en la ubicación del evento

## 🛠️ Troubleshooting

### Error "API key not valid"
- Verifica que la API key esté copiada correctamente
- Revisa las restricciones de dominio
- Asegúrate que Maps JavaScript API esté habilitada

### Error "RefererNotAllowedMapError"
- Agrega tu dominio a las restricciones HTTP referrers
- Para desarrollo local: `http://localhost:*/*`

### Mapa no carga
- Revisa la consola del navegador para errores
- Verifica que tengas créditos en Google Cloud
- Asegúrate que el proyecto esté activo

## 🔗 Enlaces útiles

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Guía de precios](https://cloud.google.com/maps-platform/pricing)
- [Console de Google Cloud](https://console.cloud.google.com/)