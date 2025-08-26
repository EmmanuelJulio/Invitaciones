import { useState } from 'react';
import { whatsAppService, type ResultadoEnvio } from '../services/whatsAppService';

export const useWhatsApp = () => {
  const [loading, setLoading] = useState(false);
  const [resultadosEnvio, setResultadosEnvio] = useState<ResultadoEnvio[]>([]);

  const enviarIndividual = async (invitadoId: string) => {
    setLoading(true);
    try {
      const resultado = await whatsAppService.enviarIndividual(invitadoId);
      
      if (resultado.success && resultado.data?.resultados) {
        // Actualizar resultados con el nuevo envío
        setResultadosEnvio(prev => {
          const filtered = prev.filter(r => r.invitadoId !== invitadoId);
          return [...filtered, ...resultado.data!.resultados];
        });
        
        // Mostrar mensaje de éxito o error
        const envio = resultado.data.resultados[0];
        if (envio.exitoso) {
          // Opcional: mostrar toast de éxito
          console.log('WhatsApp enviado exitosamente');
        } else {
          alert(`Error enviando WhatsApp: ${envio.error}`);
        }
      } else {
        alert(`Error enviando WhatsApp: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error enviando WhatsApp individual:', error);
      alert('Error enviando el mensaje de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const enviarMasivo = async (invitadosIds?: string[]) => {
    setLoading(true);
    try {
      const resultado = await whatsAppService.enviarMasivo(invitadosIds);
      
      if (resultado.success && resultado.data) {
        // Actualizar todos los resultados
        setResultadosEnvio(resultado.data.resultados);
        
        // Mostrar resumen
        const { totalEnviados, totalErrores } = resultado.data;
        alert(`Envío masivo completado:\n✅ Enviados: ${totalEnviados}\n❌ Errores: ${totalErrores}`);
      } else {
        alert(`Error en envío masivo: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error en envío masivo:', error);
      alert('Error ejecutando el envío masivo');
    } finally {
      setLoading(false);
    }
  };

  const reenviarFallidos = async () => {
    setLoading(true);
    try {
      const resultado = await whatsAppService.reenviarFallidos();
      
      if (resultado.success && resultado.data) {
        // Actualizar resultados con los reenvíos
        setResultadosEnvio(prev => {
          const nuevosResultados = [...prev];
          resultado.data!.resultados.forEach(nuevoResultado => {
            const index = nuevosResultados.findIndex(r => r.invitadoId === nuevoResultado.invitadoId);
            if (index >= 0) {
              nuevosResultados[index] = nuevoResultado;
            } else {
              nuevosResultados.push(nuevoResultado);
            }
          });
          return nuevosResultados;
        });
        
        // Mostrar resumen
        const { totalEnviados, totalErrores } = resultado.data;
        if (totalEnviados > 0) {
          alert(`Reenvío completado:\n✅ Enviados: ${totalEnviados}\n❌ Errores: ${totalErrores}`);
        } else {
          alert('No hay mensajes fallidos para reenviar');
        }
      } else {
        alert(`Error reenviando fallidos: ${resultado.error}`);
      }
    } catch (error) {
      console.error('Error reenviando fallidos:', error);
      alert('Error reenviando los mensajes fallidos');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadoEnvios = async () => {
    try {
      const resultados = await whatsAppService.obtenerEstadoEnvios();
      setResultadosEnvio(resultados);
    } catch (error) {
      console.error('Error cargando estado de envíos:', error);
    }
  };

  return {
    enviarIndividual,
    enviarMasivo,
    reenviarFallidos,
    cargarEstadoEnvios,
    loading,
    resultadosEnvio
  };
};