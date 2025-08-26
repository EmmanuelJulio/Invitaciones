import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided');
}

// Cliente para operaciones públicas
export const supabasePublic = createClient(supabaseUrl, supabaseKey);

// Cliente para operaciones administrativas (bypass RLS)
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseKey
);

export interface DatabaseInvitado {
  id: string;
  nombre: string;
  telefono?: string;
  mensaje?: string;
  token: string;
  estado: 'pendiente' | 'confirmado' | 'confirmado_incompleto' | 'rechazado';
  fecha_confirmacion?: string;
  created_at: string;
  cantidad_invitaciones: number;
  fecha_limite_edicion: string;
  whatsapp_enviado: boolean;
  fecha_envio_whatsapp?: string;
  intentos_envio: number;
  notificado?: boolean;
}

export interface DatabaseAcompanante {
  id: string;
  invitado_id: string;
  nombre_completo: string;
  telefono?: string;
  created_at: string;
  updated_at: string;
}