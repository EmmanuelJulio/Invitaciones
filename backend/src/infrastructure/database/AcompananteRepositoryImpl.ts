import { AcompananteRepository } from '../../domain/repositories/AcompananteRepository';
import { Acompanante } from '../../domain/entities/Acompanante';
import { supabaseAdmin } from '../config/database';

export class AcompananteRepositoryImpl implements AcompananteRepository {

  async save(acompanante: Acompanante): Promise<Acompanante> {
    const { data, error } = await supabaseAdmin
      .from('acompanantes')
      .insert({
        id: acompanante.getId(),
        invitado_id: acompanante.getInvitadoId(),
        nombre_completo: acompanante.getNombreCompleto(),
        telefono: acompanante.getTelefono(),
        created_at: acompanante.getFechaCreacion().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error guardando acompañante: ${error.message}`);
    }

    return this.mapToDomain(data);
  }

  async findById(id: string): Promise<Acompanante | null> {
    const { data, error } = await supabaseAdmin
      .from('acompanantes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrado
      throw new Error(`Error buscando acompañante: ${error.message}`);
    }

    return data ? this.mapToDomain(data) : null;
  }

  async findByInvitadoId(invitadoId: string): Promise<Acompanante[]> {
    const { data, error } = await supabaseAdmin
      .from('acompanantes')
      .select('*')
      .eq('invitado_id', invitadoId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Error buscando acompañantes: ${error.message}`);
    }

    return data ? data.map((row: any) => this.mapToDomain(row)) : [];
  }

  async update(acompanante: Acompanante): Promise<Acompanante> {
    const { data, error } = await supabaseAdmin
      .from('acompanantes')
      .update({
        nombre_completo: acompanante.getNombreCompleto(),
        telefono: acompanante.getTelefono(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', acompanante.getId())
      .select()
      .single();

    if (error) {
      throw new Error(`Error actualizando acompañante: ${error.message}`);
    }

    return this.mapToDomain(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('acompanantes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error eliminando acompañante: ${error.message}`);
    }
  }

  async deleteByInvitadoId(invitadoId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('acompanantes')
      .delete()
      .eq('invitado_id', invitadoId);

    if (error) {
      throw new Error(`Error eliminando acompañantes del invitado: ${error.message}`);
    }
  }

  async saveMultiple(acompanantes: Acompanante[]): Promise<Acompanante[]> {
    if (acompanantes.length === 0) return [];

    const data = acompanantes.map(acompanante => ({
      id: acompanante.getId(),
      invitado_id: acompanante.getInvitadoId(),
      nombre_completo: acompanante.getNombreCompleto(),
      telefono: acompanante.getTelefono(),
      created_at: acompanante.getFechaCreacion().toISOString(),
    }));

    const { data: result, error } = await supabaseAdmin
      .from('acompanantes')
      .insert(data)
      .select();

    if (error) {
      throw new Error(`Error guardando múltiples acompañantes: ${error.message}`);
    }

    return result ? result.map((row: any) => this.mapToDomain(row)) : [];
  }

  async countByInvitadoId(invitadoId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('acompanantes')
      .select('*', { count: 'exact', head: true })
      .eq('invitado_id', invitadoId);

    if (error) {
      throw new Error(`Error contando acompañantes: ${error.message}`);
    }

    return count || 0;
  }

  private mapToDomain(data: any): Acompanante {
    return Acompanante.create(
      data.id,
      data.invitado_id,
      data.nombre_completo,
      data.telefono || undefined
    );
  }
}