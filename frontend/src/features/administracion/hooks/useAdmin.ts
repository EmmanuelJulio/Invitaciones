import { useState, useEffect } from 'react';
import { AdminService } from '../services/adminService';
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
    filtrarInvitados,
  };
};