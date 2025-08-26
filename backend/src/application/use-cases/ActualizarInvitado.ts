import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { DatosContacto } from '../../domain/value-objects/DatosContacto';

export interface ActualizarInvitadoDto {
  nombre?: string;
  telefono?: string;
  cantidadInvitaciones?: number;
  mensaje?: string;
}

export class ActualizarInvitado {
  constructor(
    private readonly invitadoRepository: InvitadoRepository,
    private readonly acompananteRepository: AcompananteRepository
  ) {}

  async execute(id: string, datos: ActualizarInvitadoDto): Promise<void> {
    const invitado = await this.invitadoRepository.findById(id);
    
    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    // Actualizar datos de contacto si se proporcionan
    if (datos.nombre !== undefined || datos.telefono !== undefined) {
      const nuevoNombre = datos.nombre ?? invitado.getNombre();
      const nuevoTelefono = datos.telefono ?? invitado.getTelefono();
      
      const nuevosDatosContacto = new DatosContacto(nuevoNombre, nuevoTelefono);
      invitado.actualizarDatosContacto(nuevosDatosContacto);
    }

    // Actualizar cantidad de invitaciones
    if (datos.cantidadInvitaciones !== undefined) {
      // Obtener cantidad actual de acompañantes para recalcular estado
      const acompanantes = await this.acompananteRepository.findByInvitadoId(invitado.getId());
      const cantidadAcompanantes = acompanantes.length;
      
      console.log(`📊 Actualizando invitado ${invitado.getNombre()}:`, {
        estadoAnterior: invitado.getEstadoValue(),
        cantidadAnterior: invitado.getCantidadInvitaciones(),
        cantidadNueva: datos.cantidadInvitaciones,
        acompananteActuales: cantidadAcompanantes
      });
      
      invitado.actualizarCantidadInvitaciones(datos.cantidadInvitaciones, cantidadAcompanantes);
      
      console.log(`✅ Estado después de actualizar: ${invitado.getEstadoValue()}`);
    }

    // Actualizar mensaje
    if (datos.mensaje !== undefined) {
      invitado.actualizarMensaje(datos.mensaje);
    }

    await this.invitadoRepository.update(invitado);
  }
}