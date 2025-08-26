import React, { useState } from 'react';
import { Button } from '../../../shared/components/Button';
import type { InvitadoExcel } from '../types/excel';

interface VistaPreviaProps {
  invitados: InvitadoExcel[];
  errores: string[];
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
  loading: boolean;
}

export const VistaPrevia: React.FC<VistaPreviaProps> = ({
  invitados,
  errores,
  onConfirmar,
  onCancelar,
  loading
}) => {
  const [invitadosEditados, setInvitadosEditados] = useState<InvitadoExcel[]>(invitados);
  const [modoEdicion, setModoEdicion] = useState<string | null>(null);

  const handleEditarInvitado = (index: number, campo: keyof InvitadoExcel, valor: string | number) => {
    const nuevosInvitados = [...invitadosEditados];
    if (campo === 'cantidadInvitaciones') {
      nuevosInvitados[index][campo] = Number(valor);
    } else {
      (nuevosInvitados[index] as any)[campo] = valor;
    }
    setInvitadosEditados(nuevosInvitados);
  };

  const handleEliminarInvitado = (index: number) => {
    const nuevosInvitados = invitadosEditados.filter((_, i) => i !== index);
    setInvitadosEditados(nuevosInvitados);
  };

  const iniciarEdicion = (index: number, campo: string) => {
    setModoEdicion(`${index}-${campo}`);
  };

  const terminarEdicion = () => {
    setModoEdicion(null);
  };

  return (
    <div className="card">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900">
              Vista Previa de Invitados
            </h3>
            <p className="text-gray-600">
              Revisa y edita los datos antes de guardarlos. Puedes hacer click en cualquier campo para editarlo.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={onCancelar}>
              Cancelar
            </Button>
            <Button 
              variant="primary" 
              onClick={onConfirmar}
              loading={loading}
              disabled={invitadosEditados.length === 0}
            >
              Confirmar y Guardar ({invitadosEditados.length})
            </Button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">Procesados</p>
                <p className="text-lg font-semibold text-green-900">{invitadosEditados.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">Total Asistentes</p>
                <p className="text-lg font-semibold text-blue-900">
                  {invitadosEditados.reduce((sum, inv) => sum + inv.cantidadInvitaciones, 0)}
                </p>
              </div>
            </div>
          </div>

          {errores.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">Errores</p>
                  <p className="text-lg font-semibold text-red-900">{errores.length}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Errores */}
      {errores.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-800 mb-3">
            Errores encontrados en el archivo:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errores.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tabla de invitados */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invitaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mensaje
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitadosEditados.map((invitado, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                
                {/* Nombre - Editable */}
                <td className="px-6 py-4">
                  {modoEdicion === `${index}-nombre` ? (
                    <input
                      type="text"
                      value={invitado.nombre}
                      onChange={(e) => handleEditarInvitado(index, 'nombre', e.target.value)}
                      onBlur={terminarEdicion}
                      onKeyDown={(e) => e.key === 'Enter' && terminarEdicion()}
                      className="form-input text-sm"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => iniciarEdicion(index, 'nombre')}
                    >
                      {invitado.nombre}
                    </div>
                  )}
                </td>

                {/* Teléfono - Editable */}
                <td className="px-6 py-4">
                  {modoEdicion === `${index}-telefono` ? (
                    <input
                      type="text"
                      value={invitado.telefono || ''}
                      onChange={(e) => handleEditarInvitado(index, 'telefono', e.target.value)}
                      onBlur={terminarEdicion}
                      onKeyDown={(e) => e.key === 'Enter' && terminarEdicion()}
                      className="form-input text-sm"
                      placeholder="Opcional - para WhatsApp"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => iniciarEdicion(index, 'telefono')}
                    >
                      {invitado.telefono || 'Sin teléfono'}
                    </div>
                  )}
                </td>

                {/* Cantidad Invitaciones - Editable */}
                <td className="px-6 py-4">
                  {modoEdicion === `${index}-cantidadInvitaciones` ? (
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={invitado.cantidadInvitaciones}
                      onChange={(e) => handleEditarInvitado(index, 'cantidadInvitaciones', e.target.value)}
                      onBlur={terminarEdicion}
                      onKeyDown={(e) => e.key === 'Enter' && terminarEdicion()}
                      className="form-input text-sm w-20"
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="text-sm cursor-pointer hover:bg-gray-100 p-1 rounded"
                      onClick={() => iniciarEdicion(index, 'cantidadInvitaciones')}
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {invitado.cantidadInvitaciones} {invitado.cantidadInvitaciones === 1 ? 'persona' : 'personas'}
                      </span>
                    </div>
                  )}
                </td>

                {/* Mensaje - Editable */}
                <td className="px-6 py-4">
                  {modoEdicion === `${index}-mensaje` ? (
                    <textarea
                      value={invitado.mensaje || ''}
                      onChange={(e) => handleEditarInvitado(index, 'mensaje', e.target.value)}
                      onBlur={terminarEdicion}
                      className="form-input text-sm"
                      rows={2}
                      autoFocus
                    />
                  ) : (
                    <div 
                      className="text-sm text-gray-500 cursor-pointer hover:bg-gray-100 p-1 rounded max-w-xs truncate"
                      onClick={() => iniciarEdicion(index, 'mensaje')}
                      title={invitado.mensaje}
                    >
                      {invitado.mensaje || 'Click para agregar mensaje'}
                    </div>
                  )}
                </td>

                {/* Acciones */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEliminarInvitado(index)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Eliminar invitado"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invitadosEditados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay invitados para mostrar. Todos fueron eliminados o hubo errores en el procesamiento.
        </div>
      )}
    </div>
  );
};