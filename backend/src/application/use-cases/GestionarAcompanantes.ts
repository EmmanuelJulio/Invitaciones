import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Acompanante } from '../../domain/entities/Acompanante';
import { Token } from '../../domain/value-objects/Token';
import { v4 as uuidv4 } from 'uuid';

export interface CrearAcompananteDto {
  invitadoToken: string;
  nombreCompleto: string;
  telefono?: string;
}

export interface ActualizarAcompananteDto {
  id: string;
  invitadoToken: string;
  nombreCompleto: string;
  telefono?: string;
}

export class GestionarAcompanantes {
  constructor(
    private readonly acompananteRepository: AcompananteRepository,
    private readonly invitadoRepository: InvitadoRepository
  ) {}

  async crearAcompanante(dto: CrearAcompananteDto): Promise<Acompanante> {
    // Buscar invitado por token
    const token = Token.fromString(dto.invitadoToken);
    const invitado = await this.invitadoRepository.findByToken(token);

    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    // Verificar que puede editar acompañantes
    if (!invitado.puedeEditarAcompanantes()) {
      throw new Error('Ya no se pueden editar los acompañantes. Contacta a Emma: 1138427868');
    }

    // Verificar que no exceda el límite
    const acompananteActuales = await this.acompananteRepository.findByInvitadoId(invitado.getId());
    const maximoAcompanantes = invitado.getMaximoAcompanantes();

    if (acompananteActuales.length >= maximoAcompanantes) {
      throw new Error(`Solo puedes agregar ${maximoAcompanantes} acompañante(s)`);
    }

    // Crear el acompañante
    const acompanante = Acompanante.create(
      uuidv4(),
      invitado.getId(),
      dto.nombreCompleto,
      dto.telefono
    );

    const guardado = await this.acompananteRepository.save(acompanante);

    // Verificar si ahora está completo y actualizar estado del invitado
    await this.verificarYCompletarInvitacion(invitado.getId());

    return guardado;
  }

  async actualizarAcompanante(dto: ActualizarAcompananteDto): Promise<Acompanante> {
    // Buscar invitado por token
    const token = Token.fromString(dto.invitadoToken);
    const invitado = await this.invitadoRepository.findByToken(token);

    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    // Verificar que puede editar acompañantes
    if (!invitado.puedeEditarAcompanantes()) {
      throw new Error('Ya no se pueden editar los acompañantes. Contacta a Emma: 1138427868');
    }

    // Buscar el acompañante
    const acompanante = await this.acompananteRepository.findById(dto.id);
    if (!acompanante) {
      throw new Error('Acompañante no encontrado');
    }

    // Verificar que pertenece al invitado
    if (acompanante.getInvitadoId() !== invitado.getId()) {
      throw new Error('No tienes permisos para editar este acompañante');
    }

    // Actualizar datos
    acompanante.actualizarDatos(dto.nombreCompleto, dto.telefono);

    return await this.acompananteRepository.update(acompanante);
  }

  async eliminarAcompanante(acompananteId: string, invitadoToken: string): Promise<void> {
    // Buscar invitado por token
    const token = Token.fromString(invitadoToken);
    const invitado = await this.invitadoRepository.findByToken(token);

    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    // Verificar que puede editar acompañantes
    if (!invitado.puedeEditarAcompanantes()) {
      throw new Error('Ya no se pueden editar los acompañantes. Contacta a Emma: 1138427868');
    }

    // Buscar el acompañante
    const acompanante = await this.acompananteRepository.findById(acompananteId);
    if (!acompanante) {
      throw new Error('Acompañante no encontrado');
    }

    // Verificar que pertenece al invitado
    if (acompanante.getInvitadoId() !== invitado.getId()) {
      throw new Error('No tienes permisos para eliminar este acompañante');
    }

    await this.acompananteRepository.delete(acompananteId);

    // Verificar si ahora está incompleto y actualizar estado del invitado
    await this.verificarYCompletarInvitacion(invitado.getId());
  }

  async listarAcompanantes(invitadoToken: string): Promise<Acompanante[]> {
    const token = Token.fromString(invitadoToken);
    const invitado = await this.invitadoRepository.findByToken(token);

    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    return await this.acompananteRepository.findByInvitadoId(invitado.getId());
  }

  private async verificarYCompletarInvitacion(invitadoId: string): Promise<void> {
    const invitado = await this.invitadoRepository.findById(invitadoId);
    if (!invitado) return;

    const acompanantes = await this.acompananteRepository.findByInvitadoId(invitadoId);
    const maximoAcompanantes = invitado.getMaximoAcompanantes();
    
    // Si tiene la cantidad correcta de acompañantes y está confirmado_incompleto
    if (acompanantes.length === maximoAcompanantes && invitado.isConfirmadoIncompleto()) {
      invitado.confirmarAsistenciaCompleta();
      await this.invitadoRepository.update(invitado);
    }
    // Si no tiene todos los acompañantes y está confirmado completo
    else if (acompanantes.length < maximoAcompanantes && invitado.isConfirmado()) {
      // Cambiar a confirmado_incompleto (necesitaríamos un método para esto)
      // Por ahora lo dejamos así, se puede agregar después si es necesario
    }
  }
}