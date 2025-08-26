import { apiClient } from '../../../api/client';
import * as XLSX from 'xlsx';
import type {
  InvitadoResponseDto,
  EstadisticasDto,
  CrearInvitadoDto,
} from '../../../shared/types/api';

export class AdminService {
  static async listarInvitados(): Promise<InvitadoResponseDto[]> {
    const response = await apiClient.get<InvitadoResponseDto[]>('/invitados');
    return response.data;
  }

  static async obtenerEstadisticas(): Promise<EstadisticasDto> {
    const response = await apiClient.get<EstadisticasDto>('/invitados/admin/estadisticas');
    return response.data;
  }

  static async crearInvitado(dto: CrearInvitadoDto): Promise<InvitadoResponseDto> {
    const response = await apiClient.post<InvitadoResponseDto>('/invitados', dto);
    return response.data;
  }

  static async crearInvitadosEnLote(invitados: CrearInvitadoDto[]): Promise<InvitadoResponseDto[]> {
    const response = await apiClient.post<InvitadoResponseDto[]>('/invitados/lote', {
      invitados,
    });
    return response.data;
  }

  static exportarCSV(invitados: InvitadoResponseDto[]): void {
    const headers = [
      'Nombre',
      'Teléfono',
      'Estado',
      'Mensaje',
      'Fecha Confirmación',
      'Fecha Creación',
      'Token'
    ];

    const csvContent = [
      headers.join(','),
      ...invitados.map(inv => [
        `"${inv.nombre}"`,
        `"${inv.telefono || 'Sin teléfono'}"`,
        inv.estado,
        `"${inv.mensaje || ''}"`,
        inv.fechaConfirmacion || '',
        new Date(inv.fechaCreacion).toLocaleDateString(),
        inv.token
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invitados_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  static exportarMensajesWhatsApp(invitados: InvitadoResponseDto[], baseUrl: string = window.location.origin): void {
    console.log('📊 Iniciando exportación de mensajes WhatsApp');
    console.log('Total invitados recibidos:', invitados.length);
    
    // Por ahora incluir TODOS los invitados para debug
    const invitadosParaExportar = invitados; // .filter(inv => inv.estado === 'pendiente');
    console.log('Invitados para exportar:', invitadosParaExportar.length);
    
    if (invitadosParaExportar.length === 0) {
      alert('No hay invitados para exportar');
      return;
    }

    // Crear datos para Excel
    const datosExcel = invitadosParaExportar.map(invitado => {
      const linkInvitacion = `${baseUrl}/confirmar/${invitado.token}`;
      
      // Crear mensaje de WhatsApp
      const mensajeWhatsApp = `🎓 ¡Invitación a mi Graduación!

Hola ${invitado.nombre}!

Te invito cordialmente a mi graduación de Ingeniería.

📅 Sábado 6 de Septiembre, 19:00hs
📍 Salón de Eventos Varela II
⏰ Aproximadamente 7 horas

👉 Confirma tu asistencia aquí: ${linkInvitacion}

En caso de no poder asistir, por favor avisar con 48 horas de anticipación al 11-3842-7868.

¡Espero verte ahí! 🎉`;

      let whatsappLink = '';
      let hipervincul = '';
      
      // Solo crear links de WhatsApp si el invitado tiene teléfono
      if (invitado.telefono && invitado.telefono.trim() !== '') {
        // Crear enlace directo de WhatsApp con mensaje pre-escrito
        const numeroLimpio = invitado.telefono.replace(/[^0-9]/g, ''); // Solo números
        const mensajeCodificado = encodeURIComponent(mensajeWhatsApp);
        whatsappLink = `https://wa.me/${numeroLimpio}?text=${mensajeCodificado}`;
        
        // Crear hipervínculo de Excel para WhatsApp
        hipervincul = `=HIPERVINCULO("${whatsappLink}", "📱 Enviar WhatsApp")`;
      } else {
        hipervincul = 'Sin teléfono';
      }

      return {
        'Nombre': invitado.nombre,
        'Teléfono': invitado.telefono || 'Sin teléfono',
        'Link Invitación': linkInvitacion,
        'Enviar por WhatsApp': hipervincul,
        'Mensaje Completo': mensajeWhatsApp
      };
    });

    console.log('Datos para Excel:', datosExcel);
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Crear hoja principal con datos
    const ws = XLSX.utils.json_to_sheet(datosExcel);
    console.log('Hoja creada:', ws);
    
    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 20 }, // Nombre
      { wch: 15 }, // Teléfono
      { wch: 50 }, // Link URL
      { wch: 20 }, // Link Clicable
      { wch: 80 }  // Mensaje
    ];
    ws['!cols'] = colWidths;

    // Agregar hoja al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Mensajes WhatsApp');

    // Crear hoja de instrucciones
    const instrucciones = [
      { 'INSTRUCCIONES DE USO': '📱 Cómo enviar los mensajes por WhatsApp Web' },
      { 'INSTRUCCIONES DE USO': '' },
      { 'INSTRUCCIONES DE USO': '1️⃣ Abre WhatsApp Web en tu navegador' },
      { 'INSTRUCCIONES DE USO': '2️⃣ Para cada invitado:' },
      { 'INSTRUCCIONES DE USO': '   • Busca el contacto por nombre o número' },
      { 'INSTRUCCIONES DE USO': '   • Copia el mensaje de la columna "Mensaje para WhatsApp"' },
      { 'INSTRUCCIONES DE USO': '   • Pégalo en WhatsApp y envía' },
      { 'INSTRUCCIONES DE USO': '' },
      { 'INSTRUCCIONES DE USO': '🔗 COLUMNAS DISPONIBLES:' },
      { 'INSTRUCCIONES DE USO': '• Link URL: URL completa para copiar manualmente' },
      { 'INSTRUCCIONES DE USO': '• Link Clicable: Hipervínculo de Excel (haz click para abrir)' },
      { 'INSTRUCCIONES DE USO': '• Mensaje para WhatsApp: Texto completo listo para enviar' },
      { 'INSTRUCCIONES DE USO': '' },
      { 'INSTRUCCIONES DE USO': '💡 TIPS:' },
      { 'INSTRUCCIONES DE USO': '• El hipervínculo se ve como enlace azul en Excel' },
      { 'INSTRUCCIONES DE USO': '• Puedes personalizar el mensaje antes de enviar' },
      { 'INSTRUCCIONES DE USO': '• Cada link es único para cada invitado' },
      { 'INSTRUCCIONES DE USO': '• Verifica que el número sea correcto antes de enviar' },
      { 'INSTRUCCIONES DE USO': '' },
      { 'INSTRUCCIONES DE USO': `📊 Total de invitaciones: ${invitadosParaExportar.length}` },
      { 'INSTRUCCIONES DE USO': `📅 Archivo generado: ${new Date().toLocaleDateString('es-ES')}` }
    ];

    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
    wsInstrucciones['!cols'] = [{ wch: 60 }];
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, 'Instrucciones');

    // Descargar archivo
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `mensajes_whatsapp_graduacion_${fecha}.xlsx`;
    console.log('Descargando archivo:', nombreArchivo);
    
    XLSX.writeFile(wb, nombreArchivo);
    console.log('✅ Archivo descargado exitosamente');
  }
}