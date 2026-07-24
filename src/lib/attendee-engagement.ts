import { getSupabaseBrowserClient } from './supabase';

export type AttendeeAsk = {
  id: string;
  attendee_id: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export type AttendeeUpdate = {
  id: string;
  attendee_id: string;
  body: string;
  created_at: string;
};

export type AttendeeQuestion = {
  id: string;
  attendee_id: string;
  body: string;
  answered_at: string | null;
  created_at: string;
};

async function myAttendeeId(): Promise<string | null> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc('get_my_attendee_profile');
  if (error || !data?.ok) return null;
  return data.id as string;
}

export async function getMyAsk(): Promise<AttendeeAsk | null> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) return null;

  const { data, error } = await supabase
    .from('attendee_asks')
    .select('*')
    .eq('attendee_id', attendeeId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as AttendeeAsk | null) ?? null;
}

export async function saveMyAsk(body: string): Promise<AttendeeAsk> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) throw new Error('Not signed in.');

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Enter your ask.');

  const { data: existing } = await supabase
    .from('attendee_asks')
    .select('id')
    .eq('attendee_id', attendeeId)
    .maybeSingle();

  if (existing?.id) {
    const { data, error } = await supabase
      .from('attendee_asks')
      .update({ body: trimmed, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data as AttendeeAsk;
  }

  const { data, error } = await supabase
    .from('attendee_asks')
    .insert({ attendee_id: attendeeId, body: trimmed })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data as AttendeeAsk;
}

export async function listMyUpdates(): Promise<AttendeeUpdate[]> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) return [];

  const { data, error } = await supabase
    .from('attendee_updates')
    .select('*')
    .eq('attendee_id', attendeeId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as AttendeeUpdate[]) ?? [];
}

export async function addMyUpdate(body: string): Promise<AttendeeUpdate> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) throw new Error('Not signed in.');

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Enter an update.');

  const { data, error } = await supabase
    .from('attendee_updates')
    .insert({ attendee_id: attendeeId, body: trimmed })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as AttendeeUpdate;
}

export async function listMyQuestions(): Promise<AttendeeQuestion[]> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) return [];

  const { data, error } = await supabase
    .from('attendee_questions')
    .select('*')
    .eq('attendee_id', attendeeId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as AttendeeQuestion[]) ?? [];
}

export async function submitMyQuestion(body: string): Promise<AttendeeQuestion> {
  const supabase = getSupabaseBrowserClient();
  const attendeeId = await myAttendeeId();
  if (!supabase || !attendeeId) throw new Error('Not signed in.');

  const trimmed = body.trim();
  if (!trimmed) throw new Error('Enter a question.');

  const { data, error } = await supabase
    .from('attendee_questions')
    .insert({ attendee_id: attendeeId, body: trimmed })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return data as AttendeeQuestion;
}
