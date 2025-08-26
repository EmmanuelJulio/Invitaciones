import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';

export class EliminarInvitado {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(id: string): Promise<void> {
    const invitado = await this.invitadoRepository.findById(id);
    
    if (!invitado) {
      throw new Error('Invitado no encontrado');
    }

    await this.invitadoRepository.delete(id);
  }
}