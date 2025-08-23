import { Invitado } from '../entities/Invitado';
import { Token } from '../value-objects/Token';

export interface InvitadoRepository {
  save(invitado: Invitado): Promise<Invitado>;
  findByToken(token: Token): Promise<Invitado | null>;
  findById(id: string): Promise<Invitado | null>;
  findAll(): Promise<Invitado[]>;
  update(invitado: Invitado): Promise<Invitado>;
  delete(id: string): Promise<void>;
  
  // Métodos específicos para estadísticas
  countByEstado(): Promise<{
    pendientes: number;
    confirmados: number;
    rechazados: number;
    total: number;
  }>;
  
  // Método para búsqueda
  findByTelefonoOrNombre(searchTerm: string): Promise<Invitado[]>;
}