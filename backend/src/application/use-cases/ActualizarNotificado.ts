import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';

export class ActualizarNotificado {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(invitadoId: string, notificado: boolean): Promise<void> {
    const invitado = await this.invitadoRepository.findById(invitadoId);
    
    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    invitado.actualizarNotificado(notificado);
    await this.invitadoRepository.update(invitado);
  }
}