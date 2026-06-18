import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export interface FacultyProfile {
  id: string;
  phone_hash: string;
  name: string;
  college: string;
  subject: string;
  language: string;
  designation: string;
  is_verified: boolean;
  created_at: string;
  last_active: string;
  message_count: number;
}

export interface PendingOnboarding {
  id: string;
  phone_hash: string;
  step: number;
  temp_data: Record<string, string>;
  created_at: string;
}

export type ConversationFlow = 'awaiting_audit' | 'awaiting_assign' | 'awaiting_topic';

export interface ConversationState {
  phone_hash: string;
  current_flow: ConversationFlow;
  updated_at: string;
}

export interface MessageLog {
  id?: string;
  faculty_id: string;
  intent: string;
  input_text: string;
  response_text: string;
  created_at?: string;
}
