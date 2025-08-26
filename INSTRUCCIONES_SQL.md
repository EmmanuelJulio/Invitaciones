# ⚠️ IMPORTANTE: Ejecutar SQL antes de usar notificaciones

## 🚨 Acción Requerida

Antes de poder usar la función de marcar invitados como "notificados", **DEBES ejecutar el siguiente comando SQL en tu base de datos Supabase:**

### 1. Ve a tu proyecto en Supabase
1. Abre [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a la sección **SQL Editor** en el menú izquierdo

### 2. Ejecuta este comando SQL:
```sql
ALTER TABLE invitados 
ADD COLUMN notificado BOOLEAN DEFAULT FALSE;
```

### 3. Opcional (recomendado para mejor performance):
```sql
CREATE INDEX idx_invitados_notificado ON invitados(notificado);
COMMENT ON COLUMN invitados.notificado IS 'Indica si el invitado ya fue notificado via WhatsApp u otro medio';
```

## ✅ Después de ejecutar el SQL:

1. El checkbox de "Notificado" funcionará correctamente
2. Todos los invitados existentes tendrán `notificado = false` por defecto
3. Podrás marcar/desmarcar invitados como notificados
4. Los datos se guardarán en la base de datos

## 🔍 Para verificar que funcionó:

Después de ejecutar el SQL, intenta hacer clic en un checkbox de "Notificado" en la tabla de invitados. Deberías ver:
- ✅ El checkbox cambia de estado visualmente
- ✅ En la consola del navegador (F12): logs que confirman la actualización
- ✅ Al recargar la página, el estado se mantiene

## 💡 Tip de seguridad:

Este comando SQL es **100% seguro** para ejecutar en una base de datos con datos existentes. No eliminará ni modificará datos existentes, solo agregará la nueva columna.