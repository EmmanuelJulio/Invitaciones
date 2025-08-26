import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import type { AcompananteCreacionDto } from '../../../shared/types/api';

interface GestionAcompanantesProps {
  cantidadMaxima: number;
  acompanantesIniciales?: AcompananteCreacionDto[];
  onAcompanantesChange: (acompanantes: AcompananteCreacionDto[]) => void;
  disabled?: boolean;
}

export const GestionAcompanantes: React.FC<GestionAcompanantesProps> = ({
  cantidadMaxima,
  acompanantesIniciales = [],
  onAcompanantesChange,
  disabled = false
}) => {
  const [acompanantes, setAcompanantes] = useState<AcompananteCreacionDto[]>(acompanantesIniciales);

  const agregarAcompanante = () => {
    if (acompanantes.length < cantidadMaxima) {
      const nuevosAcompanantes = [...acompanantes, { nombreCompleto: '', telefono: '' }];
      setAcompanantes(nuevosAcompanantes);
      onAcompanantesChange(nuevosAcompanantes);
    }
  };

  const eliminarAcompanante = (index: number) => {
    const nuevosAcompanantes = acompanantes.filter((_, i) => i !== index);
    setAcompanantes(nuevosAcompanantes);
    onAcompanantesChange(nuevosAcompanantes);
  };

  const actualizarAcompanante = (index: number, campo: keyof AcompananteCreacionDto, valor: string) => {
    const nuevosAcompanantes = [...acompanantes];
    nuevosAcompanantes[index] = { ...nuevosAcompanantes[index], [campo]: valor };
    setAcompanantes(nuevosAcompanantes);
    onAcompanantesChange(nuevosAcompanantes);
  };

  if (cantidadMaxima <= 1) {
    return null; // No mostrar si solo tiene derecho a 1 invitación (él mismo)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-medium text-white">Acompañantes</h4>
          <p className="text-sm text-gray-200">
            Puedes traer hasta {cantidadMaxima - 1} acompañante{cantidadMaxima - 1 > 1 ? 's' : ''} más
          </p>
        </div>
        
        {acompanantes.length < cantidadMaxima - 1 && !disabled && (
          <Button
            variant="secondary"
            size="sm"
            onClick={agregarAcompanante}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar Acompañante
          </Button>
        )}
      </div>

      {acompanantes.length > 0 && (
        <div className="space-y-4">
          <div className="text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
            💡 <strong>Tip:</strong> Los datos de acompañantes son opcionales, pero nos ayudan con la organización del evento.
          </div>

          {acompanantes.map((acompanante, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white/20">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium text-white">
                  Acompañante {index + 1}
                </h5>
                {!disabled && (
                  <button
                    onClick={() => eliminarAcompanante(index)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Eliminar acompañante"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Nombre Completo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Ej: Juan Pérez"
                    value={acompanante.nombreCompleto}
                    onChange={(e) => actualizarAcompanante(index, 'nombreCompleto', e.target.value)}
                    disabled={disabled}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white placeholder-gray-500"
                    placeholder="Ej: +593 99 123 4567"
                    value={acompanante.telefono || ''}
                    onChange={(e) => actualizarAcompanante(index, 'telefono', e.target.value)}
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="text-xs text-gray-500 bg-white/20 rounded p-2">
            <strong>Resumen:</strong> Vienes con {acompanantes.length} acompañante{acompanantes.length !== 1 ? 's' : ''} 
            (Total: {acompanantes.length + 1} persona{acompanantes.length + 1 !== 1 ? 's' : ''})
          </div>
        </div>
      )}

      {cantidadMaxima > 1 && acompanantes.length === 0 && (
        <div className="text-center py-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h5 className="text-lg font-semibold text-gray-800 mb-2">🤔 ¿Vienes Acompañado?</h5>
          <p className="text-gray-200 max-w-md mx-auto leading-relaxed">
            Si planeas venir con acompañantes, puedes agregar sus datos para que podamos organizarnos mejor para el evento.
          </p>
          <div className="mt-4 text-sm text-blue-600 bg-blue-50 rounded-lg p-3 inline-block">
            ℹ️ <strong>Opcional:</strong> Puedes confirmar ahora y agregar acompañantes después
          </div>
        </div>
      )}
    </div>
  );
};