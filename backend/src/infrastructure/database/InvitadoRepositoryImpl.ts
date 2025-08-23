import { InvitadoRepository } from '../../domain/repositories/InvitadoRepository';
import { Invitado } from '../../domain/entities/Invitado';
import { Token } from '../../domain/value-objects/Token';
import { EstadoInvitacion } from '../../domain/value-objects/EstadoInvitacion';
import { DatosContacto } from '../../domain/value-objects/DatosContacto';
import { SupabaseClient } from './SupabaseClient';
import { DatabaseInvitado } from '../config/database';

export class InvitadoRepositoryImpl implements InvitadoRepository {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async save(invitado: Invitado): Promise<Invitado> {
    const dbData: Omit<DatabaseInvitado, 'created_at'> = {
      id: invitado.getId(),
      nombre: invitado.getNombre(),
      telefono: invitado.getTelefono(),
      mensaje: invitado.getMensaje(),
      token: invitado.getTokenValue(),
      estado: invitado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
      fecha_confirmacion: invitado.getFechaConfirmacion()?.toISOString()
    };

    const savedData = await this.supabaseClient.insert(dbData);
    return this.toDomainEntity(savedData);
  }

  async findByToken(token: Token): Promise<Invitado | null> {
    const dbData = await this.supabaseClient.findByToken(token.getValue());
    
    if (!dbData) {
      return null;
    }

    return this.toDomainEntity(dbData);
  }

  async findById(id: string): Promise<Invitado | null> {
    const dbData = await this.supabaseClient.findById(id);
    
    if (!dbData) {
      return null;
    }

    return this.toDomainEntity(dbData);
  }

  async findAll(): Promise<Invitado[]> {
    const dbData = await this.supabaseClient.findAll();
    return dbData.map(data => this.toDomainEntity(data));
  }

  async update(invitado: Invitado): Promise<Invitado> {
    const updateData: Partial<DatabaseInvitado> = {
      nombre: invitado.getNombre(),
      telefono: invitado.getTelefono(),
      mensaje: invitado.getMensaje(),
      estado: invitado.getEstadoValue() as 'pendiente' | 'confirmado' | 'rechazado',
      fecha_confirmacion: invitado.getFechaConfirmacion()?.toISOString()
    };

    const updatedData = await this.supabaseClient.update(invitado.getId(), updateData);
    return this.toDomainEntity(updatedData);
  }

  async delete(id: string): Promise<void> {
    await this.supabaseClient.delete(id);
  }

  async countByEstado(): Promise<{
    pendientes: number;
    confirmados: number;
    rechazados: number;
    total: number;
  }> {
    return await this.supabaseClient.countByEstado();
  }

  async findByTelefonoOrNombre(searchTerm: string): Promise<Invitado[]> {
    const dbData = await this.supabaseClient.findByTelefonoOrNombre(searchTerm);
    return dbData.map(data => this.toDomainEntity(data));
  }

  private toDomainEntity(dbData: DatabaseInvitado): Invitado {
    const token = Token.fromString(dbData.token);
    const datosContacto = new DatosContacto(dbData.nombre, dbData.telefono);
    const estado = EstadoInvitacion.fromString(dbData.estado);
    const fechaConfirmacion = dbData.fecha_confirmacion ? new Date(dbData.fecha_confirmacion) : undefined;
    const fechaCreacion = new Date(dbData.created_at);

    return new Invitado(
      dbData.id,
      token,
      datosContacto,
      estado,
      dbData.mensaje,
      fechaConfirmacion,
      fechaCreacion
    );
  }
}