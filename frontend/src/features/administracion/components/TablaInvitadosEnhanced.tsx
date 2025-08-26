import React, { useState } from 'react';
import type { InvitadoResponseDto } from '../../../shared/types/api';
import { Button } from '../../../shared/components/Button';

interface TablaInvitadosEnhancedProps {
  invitados: InvitadoResponseDto[];
  onExportar: () => void;
  onExportarMensajesWhatsApp: () => void;
}

export const TablaInvitadosEnhanced: React.FC<TablaInvitadosEnhancedProps> = ({ 
  invitados, 
  onExportar,
  onExportarMensajesWhatsApp
}) => {
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'confirmado' | 'confirmado_incompleto' | 'rechazado'>('todos');
  const [busqueda, setBusqueda] = useState('');
  

  const invitadosFiltrados = invitados.filter(invitado => {
    const matchEstado = filtroEstado === 'todos' || invitado.estado === filtroEstado;
    const matchBusqueda = busqueda === '' || 
      invitado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      invitado.telefono.includes(busqueda);
    
    return matchEstado && matchBusqueda;
  });

  const getEstadoBadge = (estado: string) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      confirmado: 'bg-green-100 text-green-900 border-green-300',
      confirmado_incompleto: 'bg-blue-100 text-blue-900 border-blue-300',
      rechazado: 'bg-red-100 text-red-900 border-red-300',
    };

    const labels = {
      pendiente: 'Pendiente',
      confirmado: 'Confirmado',
      confirmado_incompleto: 'Incompleto',
      rechazado: 'Rechazado',
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[estado as keyof typeof styles]}`}>
        {labels[estado as keyof typeof labels]}
      </span>
    );
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleVerURL = (token: string) => {
    const url = `${window.location.origin}/confirmar/${token}`;
    window.open(url, '_blank');
  };

  const handleCopiarURL = (token: string) => {
    const url = `${window.location.origin}/confirmar/${token}`;
    navigator.clipboard.writeText(url);
    // Opcional: mostrar toast de confirmación
    alert('URL copiada al portapapeles');
  };


  return (
    <div className="card">
      {/* Header con botones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Lista de Invitados</h3>
          <p className="text-sm text-gray-500">
            {invitadosFiltrados.length} de {invitados.length} invitados
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={onExportar}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </Button>

          <Button
            variant="primary"
            onClick={onExportarMensajesWhatsApp}
            className="flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            📱 Exportar Mensajes WhatsApp
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            className="form-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="form-input"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
          >
            <option value="todos">Todos los estados</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmado">Confirmados</option>
            <option value="confirmado_incompleto">Incompletos</option>
            <option value="rechazado">Rechazados</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Invitado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Invitaciones
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Fecha Confirmación
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invitadosFiltrados.map((invitado) => {
              return (
                <tr key={invitado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-gray-900">
                        {invitado.nombre}
                      </div>
                      <div className="text-sm text-gray-600">
                        {invitado.telefono || 'Sin teléfono'}
                      </div>
                      
                      {/* Mostrar acompañantes si los tiene */}
                      {invitado.acompanantes && invitado.acompanantes.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                            Acompañantes:
                          </div>
                          {invitado.acompanantes.map((acompanante, index) => (
                            <div key={acompanante.id} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <div className="text-xs text-gray-600">
                                <span className="font-medium">{acompanante.nombreCompleto}</span>
                                {acompanante.telefono && (
                                  <span className="text-gray-500 ml-1">({acompanante.telefono})</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(invitado.estado)}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {/* Total permitido */}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {invitado.cantidadInvitaciones || 1} permitidas
                      </span>
                      
                      {/* Total confirmado (si está confirmado) */}
                      {(invitado.estado === 'confirmado' || invitado.estado === 'confirmado_incompleto') && (
                        <div className="space-y-1">
                          {(() => {
                            const totalConfirmadas = 1 + (invitado.acompanantes?.length || 0); // Titular + acompañantes
                            const faltantes = (invitado.cantidadInvitaciones || 1) - totalConfirmadas;
                            
                            return (
                              <>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  invitado.estado === 'confirmado' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-orange-100 text-orange-800'
                                }`}>
                                  {totalConfirmadas} confirmadas
                                </span>
                                
                                {faltantes > 0 && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {faltantes} pendientes
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {invitado.fechaConfirmacion ? formatFecha(invitado.fechaConfirmacion) : '-'}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {/* Botón Ver URL */}
                      <button
                        onClick={() => handleVerURL(invitado.token)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Ver página de confirmación"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      
                      {/* Botón Copiar URL */}
                      <button
                        onClick={() => handleCopiarURL(invitado.token)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Copiar URL"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {invitadosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No se encontraron invitados con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
};