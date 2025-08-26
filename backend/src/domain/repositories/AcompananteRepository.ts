import { Acompanante } from '../entities/Acompanante';

export interface AcompananteRepository {
  save(acompanante: Acompanante): Promise<Acompanante>;
  findById(id: string): Promise<Acompanante | null>;
  findByInvitadoId(invitadoId: string): Promise<Acompanante[]>;
  update(acompanante: Acompanante): Promise<Acompanante>;
  delete(id: string): Promise<void>;
  deleteByInvitadoId(invitadoId: string): Promise<void>;
  saveMultiple(acompanantes: Acompanante[]): Promise<Acompanante[]>;
  countByInvitadoId(invitadoId: string): Promise<number>;
}