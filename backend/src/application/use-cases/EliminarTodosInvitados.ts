import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';

export class EliminarTodosInvitados {
  constructor(private readonly invitadoRepository: InvitadoRepository) {}

  async execute(): Promise<{ eliminados: number }> {
    const invitados = await this.invitadoRepository.findAll();
    
    for (const invitado of invitados) {
      await this.invitadoRepository.delete(invitado.getId());
    }

    return { eliminados: invitados.length };
  }
}