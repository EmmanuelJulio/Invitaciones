-- 🔍 CONSULTAS SQL PARA SUPABASE
-- Copia y pega estas consultas en el SQL Editor de Supabase

-- ==========================================
-- 1️⃣ BUSCAR A NOELIA VERON ESPECÍFICAMENTE
-- ==========================================

-- Buscar exactamente "Noelia Veron"
SELECT * FROM invitados 
WHERE nombre = 'Noelia Veron';

-- Buscar que contenga "Noelia" y "Veron" (más flexible)
SELECT * FROM invitados 
WHERE nombre ILIKE '%noelia%' AND nombre ILIKE '%veron%';

-- ==========================================
-- 2️⃣ VERIFICAR CAMPO NOTIFICADO
-- ==========================================

-- Ver todos los invitados con su estado de notificación
SELECT 
  nombre,
  telefono,
  estado,
  notificado,
  created_at
FROM invitados 
ORDER BY created_at DESC;

-- Ver solo los notificados
SELECT * FROM invitados 
WHERE notificado = true;

-- Ver solo los NO notificados
SELECT * FROM invitados 
WHERE notificado = false OR notificado IS NULL;

-- ==========================================
-- 3️⃣ ESTADÍSTICAS DE NOTIFICACIÓN
-- ==========================================

-- Contar cuántos están notificados vs no notificados
SELECT 
  notificado,
  COUNT(*) as cantidad
FROM invitados 
GROUP BY notificado;

-- ==========================================
-- 4️⃣ ACTUALIZAR NOTIFICADO (SI NECESITAS)
-- ==========================================

-- Marcar a Noelia como NO notificada (para testing)
UPDATE invitados 
SET notificado = false 
WHERE nombre = 'Noelia Veron';

-- Marcar a Noelia como notificada
UPDATE invitados 
SET notificado = true 
WHERE nombre = 'Noelia Veron';

-- ==========================================
-- 5️⃣ VERIFICAR ESTRUCTURA DE TABLA
-- ==========================================

-- Ver todas las columnas de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'invitados'
ORDER BY ordinal_position;

-- ==========================================
-- 6️⃣ BUSQUEDA GENERAL POR NOMBRE/TELÉFONO
-- ==========================================

-- Buscar por cualquier parte del nombre
SELECT * FROM invitados 
WHERE nombre ILIKE '%noelia%';

-- Buscar por teléfono
SELECT * FROM invitados 
WHERE telefono LIKE '%1234%';

-- Buscar por nombre O teléfono
SELECT * FROM invitados 
WHERE nombre ILIKE '%noelia%' OR telefono LIKE '%1234%';

-- ==========================================
-- 7️⃣ VER DATOS COMPLETOS DE NOELIA
-- ==========================================

SELECT 
  id,
  nombre,
  telefono,
  estado,
  mensaje,
  notificado,
  whatsapp_enviado,
  cantidad_invitaciones,
  fecha_confirmacion,
  created_at,
  token
FROM invitados 
WHERE nombre ILIKE '%noelia%veron%';