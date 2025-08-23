import { supabasePublic, supabaseAdmin, DatabaseInvitado } from '../config/database';

export class SupabaseClient {
  private readonly TABLE_NAME = 'invitados';

  async insert(data: Omit<DatabaseInvitado, 'created_at'>): Promise<DatabaseInvitado> {
    const { data: result, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(`Error inserting invitado: ${error.message}`);
    }

    return result;
  }

  async findByToken(token: string): Promise<DatabaseInvitado | null> {
    const { data, error } = await supabasePublic
      .from(this.TABLE_NAME)
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No encontrado
      }
      throw new Error(`Error finding invitado by token: ${error.message}`);
    }

    return data;
  }

  async findById(id: string): Promise<DatabaseInvitado | null> {
    const { data, error } = await supabasePublic
      .from(this.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new Error(`Error finding invitado by id: ${error.message}`);
    }

    return data;
  }

  async findAll(): Promise<DatabaseInvitado[]> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error finding all invitados: ${error.message}`);
    }

    return data || [];
  }

  async update(id: string, data: Partial<DatabaseInvitado>): Promise<DatabaseInvitado> {
    const { data: result, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Error updating invitado: ${error.message}`);
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Error deleting invitado: ${error.message}`);
    }
  }

  async countByEstado(): Promise<{
    pendientes: number;
    confirmados: number;
    rechazados: number;
    total: number;
  }> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('estado');

    if (error) {
      throw new Error(`Error counting by estado: ${error.message}`);
    }

    const counts = {
      pendientes: 0,
      confirmados: 0,
      rechazados: 0,
      total: data?.length || 0
    };

    data?.forEach((row) => {
      switch (row.estado) {
        case 'pendiente':
          counts.pendientes++;
          break;
        case 'confirmado':
          counts.confirmados++;
          break;
        case 'rechazado':
          counts.rechazados++;
          break;
      }
    });

    return counts;
  }

  async findByTelefonoOrNombre(searchTerm: string): Promise<DatabaseInvitado[]> {
    const { data, error } = await supabaseAdmin
      .from(this.TABLE_NAME)
      .select('*')
      .or(`nombre.ilike.%${searchTerm}%,telefono.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error searching invitados: ${error.message}`);
    }

    return data || [];
  }
}