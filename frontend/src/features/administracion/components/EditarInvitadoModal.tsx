import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import type { InvitadoResponseDto } from '../../../shared/types/api';
import type { ActualizarInvitadoDto } from '../services/adminService';

interface EditarInvitadoModalProps {
  invitado: InvitadoResponseDto;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, datos: ActualizarInvitadoDto) => Promise<void>;
  loading: boolean;
}

export const EditarInvitadoModal: React.FC<EditarInvitadoModalProps> = ({
  invitado,
  isOpen,
  onClose,
  onSave,
  loading
}) => {
  const [formData, setFormData] = useState({
    nombre: invitado.nombre,
    telefono: invitado.telefono || '',
    cantidadInvitaciones: invitado.cantidadInvitaciones,
    mensaje: invitado.mensaje || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (formData.cantidadInvitaciones < 1) {
      newErrors.cantidadInvitaciones = 'La cantidad debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const datosActualizacion: ActualizarInvitadoDto = {};
    
    // Solo incluir campos que cambiaron
    if (formData.nombre !== invitado.nombre) {
      datosActualizacion.nombre = formData.nombre;
    }
    if (formData.telefono !== (invitado.telefono || '')) {
      datosActualizacion.telefono = formData.telefono || undefined;
    }
    if (formData.cantidadInvitaciones !== invitado.cantidadInvitaciones) {
      datosActualizacion.cantidadInvitaciones = formData.cantidadInvitaciones;
    }
    if (formData.mensaje !== (invitado.mensaje || '')) {
      datosActualizacion.mensaje = formData.mensaje;
    }

    // Si no hay cambios, cerrar modal
    if (Object.keys(datosActualizacion).length === 0) {
      onClose();
      return;
    }

    try {
      await onSave(invitado.id, datosActualizacion);
      onClose();
    } catch (error) {
      console.error('Error actualizando invitado:', error);
    }
  };

  const handleChange = (field: keyof typeof formData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al cambiar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Editar Invitado
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nombre ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono (opcional)
              </label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                placeholder="+1234567890"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Incluir código de país para WhatsApp
              </p>
            </div>

            {/* Cantidad de invitaciones */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad de invitaciones *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.cantidadInvitaciones}
                onChange={(e) => handleChange('cantidadInvitaciones', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cantidadInvitaciones ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.cantidadInvitaciones && (
                <p className="text-red-500 text-xs mt-1">{errors.cantidadInvitaciones}</p>
              )}
            </div>

            {/* Mensaje */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje personalizado (opcional)
              </label>
              <textarea
                value={formData.mensaje}
                onChange={(e) => handleChange('mensaje', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="Mensaje especial para este invitado..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Guardar cambios
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};