import React, { useState } from 'react';
import type { InvitadoResponseDto } from '../../../shared/types/api';
import { Button } from '../../../shared/components/Button';
import { EditarInvitadoModal } from './EditarInvitadoModal';
import type { ActualizarInvitadoDto } from '../services/adminService';

interface TablaInvitadosEnhancedProps {
  invitados: InvitadoResponseDto[];
  onExportar: () => void;
  onExportarMensajesWhatsApp: () => void;
  onEliminarInvitado: (id: string) => Promise<void>;
  onEliminarTodos: () => Promise<void>;
  onActualizarInvitado: (id: string, datos: ActualizarInvitadoDto) => Promise<void>;
  onCrearInvitado: (datos: ActualizarInvitadoDto) => Promise<void>;
  loading?: boolean;
}

export const TablaInvitadosEnhanced: React.FC<TablaInvitadosEnhancedProps> = ({ 
  invitados, 
  onExportar,
  onExportarMensajesWhatsApp,
  onEliminarInvitado,
  onEliminarTodos,
  onActualizarInvitado,
  onCrearInvitado,
  loading = false
}) => {
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'confirmado' | 'confirmado_incompleto' | 'rechazado'>('todos');
  const [busqueda, setBusqueda] = useState('');
  const [invitadoEditando, setInvitadoEditando] = useState<InvitadoResponseDto | null>(null);
  const [modoModal, setModoModal] = useState<'editar' | 'crear'>('editar');
  const [confirmandoEliminacion, setConfirmandoEliminacion] = useState<{
    tipo: 'individual' | 'todos';
    invitado?: InvitadoResponseDto;
  } | null>(null);
  

  const invitadosFiltrados = invitados.filter(invitado => {
    const matchEstado = filtroEstado === 'todos' || invitado.estado === filtroEstado;
    const matchBusqueda = busqueda === '' || 
      invitado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (invitado.telefono && invitado.telefono.includes(busqueda));
    
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

  const handleCopiarURL = (token: string, nombreInvitado?: string) => {
    const url = `${window.location.origin}/confirmar/${token}`;
    const mensaje = `🎓 ¡Invitación a mi Graduación!

Hola ${nombreInvitado || 'Invitado'}!

Te invito cordialmente a mi graduación de Ingeniería.

📅 Sábado 6 de Septiembre, 19:00hs
📍 Salón de Eventos Varela II
⏰ Aproximadamente 7 horas

👉 Confirma tu asistencia aquí: ${url}

En caso de no poder asistir, por favor avisar con 48 horas de anticipación al 11-3842-7868.

¡Espero verte ahí! 🎉`;
    navigator.clipboard.writeText(mensaje);
    // Opcional: mostrar toast de confirmación
    alert('Mensaje de WhatsApp copiado al portapapeles');
  };

  const handleEditarInvitado = (invitado: InvitadoResponseDto) => {
    setInvitadoEditando(invitado);
    setModoModal('editar');
  };

  const handleCrearInvitado = () => {
    setInvitadoEditando(null);
    setModoModal('crear');
  };

  const handleEliminarInvitado = (invitado: InvitadoResponseDto) => {
    setConfirmandoEliminacion({
      tipo: 'individual',
      invitado
    });
  };

  const handleEliminarTodos = () => {
    setConfirmandoEliminacion({
      tipo: 'todos'
    });
  };

  const confirmarEliminacion = async () => {
    if (!confirmandoEliminacion) return;

    try {
      if (confirmandoEliminacion.tipo === 'individual' && confirmandoEliminacion.invitado) {
        await onEliminarInvitado(confirmandoEliminacion.invitado.id);
      } else if (confirmandoEliminacion.tipo === 'todos') {
        await onEliminarTodos();
      }
      setConfirmandoEliminacion(null);
    } catch (error) {
      console.error('Error eliminando:', error);
      alert('Error al eliminar. Por favor intente nuevamente.');
    }
  };

  const handleGuardarModal = async (id: string | null, datos: ActualizarInvitadoDto) => {
    if (modoModal === 'crear') {
      await onCrearInvitado(datos);
    } else if (id) {
      await onActualizarInvitado(id, datos);
    }
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
          {/* Botón Crear Invitado - Visible en todas las pantallas */}
          <Button
            variant="primary"
            onClick={handleCrearInvitado}
            className="flex items-center order-first"
            disabled={loading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="hidden sm:inline">Crear Invitado</span>
            <span className="sm:hidden">Crear</span>
          </Button>

          {/* Botones ocultos en móvil */}
          <Button
            variant="secondary"
            onClick={onExportar}
            className="hidden sm:flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar CSV
          </Button>

          <Button
            variant="primary"
            onClick={onExportarMensajesWhatsApp}
            className="hidden sm:flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            📱 Exportar Mensajes WhatsApp
          </Button>

          {invitados.length > 0 && (
            <Button
              variant="danger"
              onClick={handleEliminarTodos}
              className="hidden sm:flex items-center"
              disabled={loading}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Eliminar Todos
            </Button>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre o teléfono..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
            style={{color: '#111827 !important', backgroundColor: '#ffffff !important'}}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            style={{color: '#111827 !important', backgroundColor: '#ffffff !important'}}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value as any)}
          >
            <option value="todos" style={{color: '#111827', backgroundColor: '#ffffff'}}>Todos los estados</option>
            <option value="pendiente" style={{color: '#111827', backgroundColor: '#ffffff'}}>Pendientes</option>
            <option value="confirmado" style={{color: '#111827', backgroundColor: '#ffffff'}}>Confirmados</option>
            <option value="confirmado_incompleto" style={{color: '#111827', backgroundColor: '#ffffff'}}>Incompletos</option>
            <option value="rechazado" style={{color: '#111827', backgroundColor: '#ffffff'}}>Rechazados</option>
          </select>
        </div>
      </div>

      {/* Tabla - Oculta en móvil */}
      <div className="hidden md:block overflow-x-auto">
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
                          {invitado.acompanantes.map((acompanante) => (
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
                        onClick={() => handleCopiarURL(invitado.token, invitado.nombre)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Copiar mensaje WhatsApp"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      {/* Botón Editar */}
                      <button
                        onClick={() => handleEditarInvitado(invitado)}
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        title="Editar invitado"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>

                      {/* Botón Eliminar */}
                      <button
                        onClick={() => handleEliminarInvitado(invitado)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Eliminar invitado"
                        disabled={loading}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
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

      {/* Vista móvil - Cards */}
      <div className="md:hidden space-y-4">
        {invitadosFiltrados.map((invitado) => (
          <div key={invitado.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            {/* Header con nombre y estado */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {invitado.nombre}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {invitado.telefono || 'Sin teléfono'}
                </p>
              </div>
              <div className="ml-2 flex-shrink-0">
                {getEstadoBadge(invitado.estado)}
              </div>
            </div>

            {/* Información de invitaciones */}
            <div className="mb-3 flex flex-wrap gap-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {invitado.cantidadInvitaciones || 1} permitidas
              </span>
              
              {(invitado.estado === 'confirmado' || invitado.estado === 'confirmado_incompleto') && (
                <>
                  {(() => {
                    const totalConfirmadas = 1 + (invitado.acompanantes?.length || 0);
                    const faltantes = (invitado.cantidadInvitaciones || 1) - totalConfirmadas;
                    
                    return (
                      <>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invitado.estado === 'confirmado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {totalConfirmadas} confirmadas
                        </span>
                        
                        {faltantes > 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {faltantes} pendientes
                          </span>
                        )}
                      </>
                    );
                  })()}
                </>
              )}
            </div>

            {/* Acompañantes */}
            {invitado.acompanantes && invitado.acompanantes.length > 0 && (
              <div className="mb-3">
                <div className="text-xs font-medium text-gray-700 uppercase tracking-wide mb-1">
                  Acompañantes:
                </div>
                <div className="space-y-1">
                  {invitado.acompanantes.map((acompanante) => (
                    <div key={acompanante.id} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <div className="text-xs text-gray-600 min-w-0">
                        <span className="font-medium">{acompanante.nombreCompleto}</span>
                        {acompanante.telefono && (
                          <span className="text-gray-500 ml-1">({acompanante.telefono})</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex space-x-3">
                {/* Ver URL */}
                <button
                  onClick={() => handleVerURL(invitado.token)}
                  className="text-blue-600 hover:text-blue-900 transition-colors"
                  title="Ver página"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
                
                {/* Copiar */}
                <button
                  onClick={() => handleCopiarURL(invitado.token, invitado.nombre)}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  title="Copiar mensaje WhatsApp"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>

                {/* Editar */}
                <button
                  onClick={() => handleEditarInvitado(invitado)}
                  className="text-indigo-600 hover:text-indigo-900 transition-colors"
                  title="Editar"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                {/* Eliminar */}
                <button
                  onClick={() => handleEliminarInvitado(invitado)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                  title="Eliminar"
                  disabled={loading}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              {/* Fecha (solo si está confirmado) */}
              {invitado.fechaConfirmacion && (
                <div className="text-xs text-gray-500">
                  {formatFecha(invitado.fechaConfirmacion)}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Empty state para móvil */}
        {invitadosFiltrados.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500">No se encontraron invitados</p>
          </div>
        )}
      </div>

      {/* Modal de Edición/Creación */}
      {(invitadoEditando || modoModal === 'crear') && (
        <EditarInvitadoModal
          invitado={invitadoEditando || undefined}
          isOpen={!!(invitadoEditando || modoModal === 'crear')}
          onClose={() => {
            setInvitadoEditando(null);
            setModoModal('editar');
          }}
          onSave={handleGuardarModal}
          loading={loading}
          modo={modoModal}
        />
      )}

      {/* Modal de Confirmación de Eliminación */}
      {confirmandoEliminacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-2 sm:p-4 pt-4 sm:pt-8 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-4 sm:p-6 mt-2 sm:mt-0">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {confirmandoEliminacion.tipo === 'individual' ? 'Eliminar Invitado' : 'Eliminar Todos los Invitados'}
                </h3>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {confirmandoEliminacion.tipo === 'individual' 
                  ? `¿Estás seguro de que quieres eliminar al invitado "${confirmandoEliminacion.invitado?.nombre}"? Esta acción no se puede deshacer.`
                  : `¿Estás seguro de que quieres eliminar TODOS los invitados (${invitados.length} invitados)? Esta acción no se puede deshacer.`
                }
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmandoEliminacion(null)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={confirmarEliminacion}
                loading={loading}
              >
                {confirmandoEliminacion.tipo === 'individual' ? 'Eliminar' : 'Eliminar Todos'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};