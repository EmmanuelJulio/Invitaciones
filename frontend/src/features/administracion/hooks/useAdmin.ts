import { useState, useEffect } from 'react';
import { AdminService, type ActualizarInvitadoDto } from '../services/adminService';
import type { InvitadoResponseDto, EstadisticasDto } from '../../../shared/types/api';

export const useAdmin = () => {
  const [invitados, setInvitados] = useState<InvitadoResponseDto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarInvitados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [invitadosData, estadisticasData] = await Promise.all([
        AdminService.listarInvitados(),
        AdminService.obtenerEstadisticas(),
      ]);
      
      // Debug: verificar si los datos incluyen el campo notificado
      console.log('🔍 Datos recibidos del API:', invitadosData);
      const noelia = invitadosData.find(inv => inv.nombre.includes('Noelia'));
      if (noelia) {
        console.log('👤 Noelia en datos API:', {
          nombre: noelia.nombre,
          notificado: noelia.notificado,
          hasNotificadoField: noelia.hasOwnProperty('notificado'),
          allKeys: Object.keys(noelia)
        });
      }
      
      setInvitados(invitadosData);
      setEstadisticas(estadisticasData);
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const exportarCSV = () => {
    try {
      AdminService.exportarCSV(invitados);
    } catch (err) {
      console.error('Error exportando CSV:', err);
      setError('Error al exportar CSV');
    }
  };

  const exportarMensajesWhatsApp = () => {
    try {
      AdminService.exportarMensajesWhatsApp(invitados);
    } catch (err) {
      console.error('Error exportando mensajes WhatsApp:', err);
      setError('Error al exportar mensajes de WhatsApp');
    }
  };

  const eliminarInvitado = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await AdminService.eliminarInvitado(id);
      // Recargar datos después de eliminar
      await cargarInvitados();
    } catch (err) {
      console.error('Error eliminando invitado:', err);
      setError('Error al eliminar invitado');
      throw err; // Re-throw para manejo en componente
    } finally {
      setLoading(false);
    }
  };

  const eliminarTodosInvitados = async () => {
    try {
      setLoading(true);
      setError(null);
      const resultado = await AdminService.eliminarTodosInvitados();
      console.log(`Eliminados ${resultado.eliminados} invitados`);
      // Recargar datos después de eliminar
      await cargarInvitados();
    } catch (err) {
      console.error('Error eliminando todos los invitados:', err);
      setError('Error al eliminar todos los invitados');
      throw err; // Re-throw para manejo en componente
    } finally {
      setLoading(false);
    }
  };

  const actualizarInvitado = async (id: string, datos: ActualizarInvitadoDto) => {
    try {
      setLoading(true);
      setError(null);
      await AdminService.actualizarInvitado(id, datos);
      // Recargar datos después de actualizar
      await cargarInvitados();
    } catch (err) {
      console.error('Error actualizando invitado:', err);
      setError('Error al actualizar invitado');
      throw err; // Re-throw para manejo en componente
    } finally {
      setLoading(false);
    }
  };

  const crearInvitado = async (datos: ActualizarInvitadoDto) => {
    try {
      setLoading(true);
      setError(null);
      // Convertir ActualizarInvitadoDto a CrearInvitadoDto
      const crearDto = {
        nombre: datos.nombre!,
        telefono: datos.telefono,
        cantidadInvitaciones: datos.cantidadInvitaciones || 1,
        mensaje: datos.mensaje
      };
      await AdminService.crearInvitado(crearDto);
      // Recargar datos después de crear
      await cargarInvitados();
    } catch (err) {
      console.error('Error creando invitado:', err);
      setError('Error al crear invitado');
      throw err; // Re-throw para manejo en componente
    } finally {
      setLoading(false);
    }
  };

  const actualizarNotificado = async (id: string, notificado: boolean) => {
    try {
      console.log('useAdmin: actualizando notificado', { id, notificado });
      setError(null);
      
      // Actualización optimista - actualizar estado local inmediatamente
      setInvitados(prevInvitados => 
        prevInvitados.map(inv => 
          inv.id === id ? { ...inv, notificado } : inv
        )
      );
      
      // Realizar la actualización en el servidor
      await AdminService.actualizarNotificado(id, notificado);
      console.log('useAdmin: actualización exitosa');
      
    } catch (err) {
      console.error('Error actualizando notificado:', err);
      
      // Revertir cambio optimista si falla
      setInvitados(prevInvitados => 
        prevInvitados.map(inv => 
          inv.id === id ? { ...inv, notificado: !notificado } : inv
        )
      );
      
      setError('Error al actualizar estado de notificación');
      throw err; // Re-throw para manejo en componente
    }
  };

  const filtrarInvitados = (filtro: 'todos' | 'pendiente' | 'confirmado' | 'rechazado') => {
    if (filtro === 'todos') {
      return invitados;
    }
    return invitados.filter(inv => inv.estado === filtro);
  };

  useEffect(() => {
    cargarInvitados();
  }, []);

  return {
    invitados,
    estadisticas,
    loading,
    error,
    cargarInvitados,
    exportarCSV,
    exportarMensajesWhatsApp,
    eliminarInvitado,
    eliminarTodosInvitados,
    actualizarInvitado,
    crearInvitado,
    actualizarNotificado,
    filtrarInvitados,
  };
};