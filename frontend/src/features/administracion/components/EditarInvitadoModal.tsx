import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../../shared/components/Button';
import type { InvitadoResponseDto } from '../../../shared/types/api';
import type { ActualizarInvitadoDto } from '../services/adminService';

interface EditarInvitadoModalProps {
  invitado?: InvitadoResponseDto; // Opcional para crear nuevos
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string | null, datos: ActualizarInvitadoDto) => Promise<void>;
  loading: boolean;
  modo?: 'editar' | 'crear';
}

export const EditarInvitadoModal: React.FC<EditarInvitadoModalProps> = ({
  invitado,
  isOpen,
  onClose,
  onSave,
  loading,
  modo = 'editar'
}) => {
  const [formData, setFormData] = useState({
    nombre: invitado?.nombre || '',
    telefono: invitado?.telefono || '',
    cantidadInvitaciones: invitado?.cantidadInvitaciones || 1,
    mensaje: invitado?.mensaje || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus y pre-cargar datos cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      // Pre-cargar datos del invitado actual o valores por defecto para nuevo
      setFormData({
        nombre: invitado?.nombre || '',
        telefono: invitado?.telefono || '',
        cantidadInvitaciones: invitado?.cantidadInvitaciones || 1,
        mensaje: invitado?.mensaje || ''
      });
      
      // Focus en el modal y primer campo
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
        if (firstInputRef.current) {
          firstInputRef.current.focus();
          firstInputRef.current.select();
        }
      }, 100);
      
      // Limpiar errores
      setErrors({});
    }
  }, [isOpen, invitado]);

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
    
    if (modo === 'crear') {
      // Para crear, incluir todos los campos
      datosActualizacion.nombre = formData.nombre;
      datosActualizacion.telefono = formData.telefono || undefined;
      datosActualizacion.cantidadInvitaciones = formData.cantidadInvitaciones;
      datosActualizacion.mensaje = formData.mensaje || undefined;
    } else {
      // Para editar, solo incluir campos que cambiaron
      if (formData.nombre !== invitado?.nombre) {
        datosActualizacion.nombre = formData.nombre;
      }
      if (formData.telefono !== (invitado?.telefono || '')) {
        datosActualizacion.telefono = formData.telefono || undefined;
      }
      if (formData.cantidadInvitaciones !== invitado?.cantidadInvitaciones) {
        datosActualizacion.cantidadInvitaciones = formData.cantidadInvitaciones;
      }
      if (formData.mensaje !== (invitado?.mensaje || '')) {
        datosActualizacion.mensaje = formData.mensaje;
      }

      // Si no hay cambios en modo editar, cerrar modal
      if (Object.keys(datosActualizacion).length === 0) {
        onClose();
        return;
      }
    }

    try {
      await onSave(invitado?.id || null, datosActualizacion);
      onClose();
    } catch (error) {
      console.error(`Error ${modo === 'crear' ? 'creando' : 'actualizando'} invitado:`, error);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 pt-4 sm:pt-8 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto focus:outline-none mt-2 sm:mt-0"
        tabIndex={-1}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {modo === 'crear' ? 'Crear Nuevo Invitado' : 'Editar Invitado'}
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
                ref={firstInputRef}
                type="text"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
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
              <div className="number-input-container">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.cantidadInvitaciones}
                  onChange={(e) => handleChange('cantidadInvitaciones', parseInt(e.target.value) || 1)}
                  className={`w-full px-3 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white ${
                    errors.cantidadInvitaciones ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                  style={{WebkitAppearance: 'none', MozAppearance: 'textfield'}}
                />
                <div className="number-input-buttons">
                  <button
                    type="button"
                    className="number-input-btn"
                    onClick={() => {
                      const newValue = Math.min(10, formData.cantidadInvitaciones + 1);
                      handleChange('cantidadInvitaciones', newValue);
                    }}
                    disabled={loading || formData.cantidadInvitaciones >= 10}
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className="number-input-btn"
                    onClick={() => {
                      const newValue = Math.max(1, formData.cantidadInvitaciones - 1);
                      handleChange('cantidadInvitaciones', newValue);
                    }}
                    disabled={loading || formData.cantidadInvitaciones <= 1}
                  >
                    ▼
                  </button>
                </div>
              </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-400"
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
                {modo === 'crear' ? 'Crear Invitado' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};