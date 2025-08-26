import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { DatosContacto } from '../../domain/value-objects/DatosContacto';

export interface ActualizarInvitadoDto {
  nombre?: string;
  telefono?: string;
  cantidadInvitaciones?: number;
  mensaje?: string;
}

export class ActualizarInvitado {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

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
      invitado.actualizarCantidadInvitaciones(datos.cantidadInvitaciones);
    }

    // Actualizar mensaje
    if (datos.mensaje !== undefined) {
      invitado.actualizarMensaje(datos.mensaje);
    }

    await this.invitadoRepository.update(invitado);
  }
}