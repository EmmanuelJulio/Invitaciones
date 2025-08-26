# 📱 Configuración WhatsApp Business API

## 🚀 **PASO 1: Crear aplicación en Meta for Developers**

### 1.1. Ir a Meta for Developers
- Ve a: https://developers.facebook.com/
- **Iniciar sesión** con tu cuenta de Facebook/Meta
- Click **"Mis aplicaciones"** → **"Crear aplicación"**

### 1.2. Configurar aplicación
- **Tipo de aplicación**: **"Empresa"**
- **Nombre de la aplicación**: "Graduación 2024" (o el que prefieras)
- **Email de contacto**: Tu email
- **Seleccionar cuenta comercial**: (si tienes) o crear nueva
- Click **"Crear aplicación"**

---

## 🏢 **PASO 2: Verificación Empresarial (Opcional pero recomendado)**

### 2.1. Verificar tu empresa
- Ve a **Meta Business Manager**: https://business.facebook.com/
- **Configuración** → **Seguridad** → **Verificación empresarial**
- Sube documentos que demuestren tu empresa/evento (opcional para graduación)

⚠️ **Nota**: Para graduación personal, puedes saltear esto inicialmente.

---

## 📞 **PASO 3: Configurar WhatsApp Business API**

### 3.1. Agregar producto WhatsApp
- En tu aplicación → **Panel izquierdo**
- Click **"+ Agregar producto"**
- Selecciona **"WhatsApp"** → **"Configurar"**

### 3.2. Configurar número de teléfono
- Click **"Empezar"** en WhatsApp Business API
- **"Agregar número de teléfono"**
- **Seleccionar país**: Argentina (+54)
- **Número**: Tu nuevo chip (sin +54, ejemplo: 11XXXXXXXX)
- **Método de verificación**: SMS
- **Verificar número**

### 3.3. Verificar con SMS
- WhatsApp enviará un código SMS a tu chip nuevo
- **Ingresa el código** en la interfaz
- **Confirmar**

---

## 🔑 **PASO 4: Obtener credenciales**

### 4.1. Obtener Access Token
- En WhatsApp → **Configuración de API**
- Encontrarás: **"Token de acceso temporal"**
- **Copia** este token (válido por 24 horas)

```
Ejemplo: EAABsbCS1iHgBAxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4.2. Obtener Phone Number ID
- En la misma página, encontrarás **"ID del número de teléfono"**
- **Copia** este ID numérico

```
Ejemplo: 123456789012345
```

### 4.3. Crear Token Permanente (Importante)
- Ve a **Configuración de la aplicación** → **Configuración básica**
- **Generar token de acceso de la aplicación**
- **Selecciona permisos**: `whatsapp_business_messaging`
- **Copia el token permanente**

---

## 🧪 **PASO 5: Probar la API**

### 5.1. Envío de prueba usando curl
```bash
curl -X POST \
  https://graph.facebook.com/v18.0/TU_PHONE_NUMBER_ID/messages \
  -H 'Authorization: Bearer TU_ACCESS_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "messaging_product": "whatsapp",
    "to": "549TU_NUMERO_PERSONAL",
    "type": "text",
    "text": {
      "body": "🎓 Prueba de API - ¡Funciona!"
    }
  }'
```

### 5.2. Si funciona, deberías recibir:
- ✅ WhatsApp en tu número personal
- ✅ Mensaje de "Prueba de API - ¡Funciona!"

---

## ⚙️ **PASO 6: Configurar en tu aplicación**

### 6.1. Actualizar variables de entorno

**Backend (.env):**
```env
WHATSAPP_TOKEN=EAABsbCS1iHgBAxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
```

**Railway (cuando deploys):**
- Agregar estas mismas variables en Railway Dashboard

### 6.2. Probar desde tu aplicación
1. **Ir al panel admin** de tu app
2. **Crear un invitado de prueba**
3. **Click "Enviar WhatsApp"**
4. **Verificar** que llegue el mensaje

---

## 📋 **PASO 7: Configuraciones adicionales**

### 7.1. Webhook (Para recibir respuestas)
- En WhatsApp API → **Webhook**
- **URL de callback**: `https://tu-backend.railway.app/api/webhooks/whatsapp`
- **Token de verificación**: Un string cualquiera
- **Campos de suscripción**: `messages`

### 7.2. Límites de mensajes
- **Nuevos números**: 250 mensajes/día inicialmente  
- **Después de algunos días**: Límite aumenta automáticamente
- **Para graduación**: 250+ es suficiente normalmente

---

## 🚨 **Troubleshooting**

### Error "Invalid phone number"
- Verifica formato: `549XXXXXXXXXX` (con código de país)
- Sin espacios, guiones o símbolos

### Error "Access token expired"
- Usa el **token permanente** de la aplicación
- No el temporal que expira en 24h

### Error "Rate limit exceeded"
- WhatsApp limita mensajes por minuto
- Tu aplicación debe implementar delays entre envíos

### Mensajes no llegan
- Verifica que el número receptor tenga WhatsApp
- Algunos números pueden estar bloqueados por Meta

---

## 📊 **Dashboard de Meta**

Para monitorear tu uso:
- Ve a **Meta Business Manager**
- **WhatsApp Manager** → **Insights**
- Verás: mensajes enviados, entregados, leídos

---

## 💰 **Facturación**

- **Primeros 1,000 mensajes/mes**: Gratis
- **Después**: ~$0.0055 USD por mensaje (Argentina)
- **Método de pago**: Tarjeta de crédito en Meta Business

---

## ✅ **Checklist Final**

- [ ] Aplicación creada en Meta for Developers
- [ ] Número verificado con SMS
- [ ] Access Token obtenido (permanente)
- [ ] Phone Number ID obtenido
- [ ] Prueba con curl exitosa
- [ ] Variables configuradas en backend
- [ ] Prueba desde panel admin exitosa
- [ ] Webhook configurado (opcional)

---

## 🔗 **Enlaces útiles**

- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Manager](https://business.facebook.com/)
- [WhatsApp API Testing](https://developers.facebook.com/tools/explorer/)

¡Una vez completado, podrás enviar invitaciones masivas automáticamente! 🎉