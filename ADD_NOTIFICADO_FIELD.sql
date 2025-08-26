-- SQL para agregar el campo 'notificado' a la tabla de invitados
-- Este comando es seguro para ejecutar en una base de datos con datos existentes
-- El campo se agregará con valor por defecto FALSE para todos los registros existentes

ALTER TABLE invitados 
ADD COLUMN notificado BOOLEAN DEFAULT FALSE;

-- Opcional: Crear índice para mejorar performance en consultas por estado de notificación
CREATE INDEX idx_invitados_notificado ON invitados(notificado);

-- Opcional: Agregar comentario a la columna
COMMENT ON COLUMN invitados.notificado IS 'Indica si el invitado ya fue notificado via WhatsApp u otro medio';