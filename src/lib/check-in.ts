import { getSupabaseBrowserClient } from './supabase';

export type CheckInLookup = {
  found: boolean;
  id?: string;
  full_name?: string;
  email?: string;
  checked_in_at?: string | null;
  form_completed_at?: string | null;
  fully_checked_in?: boolean;
};

export type CheckInStartResult =
  | {
      ok: true;
      id: string;
      full_name: string;
      email: string;
      checked_in_at: string | null;
      form_completed_at: string | null;
      needs_form: boolean;
      fully_checked_in: boolean;
    }
  | { ok: false; error: string };

export async function lookupAttendeeForCheckIn(email: string): Promise<CheckInLookup> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { found: false };

  const { data, error } = await supabase.rpc('lookup_attendee_for_checkin', {
    p_email: email.trim(),
  });

  if (error || !data) return { found: false };
  return data as CheckInLookup;
}

export async function startAttendeeCheckIn(email: string): Promise<CheckInStartResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Check-in is not configured yet.' };

  const { data, error } = await supabase.rpc('start_attendee_checkin', {
    p_email: email.trim(),
  });

  if (error) return { ok: false, error: error.message };
  const result = data as CheckInStartResult;
  if (!result?.ok) {
    return { ok: false, error: (result as { error?: string })?.error || 'Check-in failed.' };
  }
  return result;
}

export async function completeAttendeeForm(email: string): Promise<void> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return;

  await supabase.rpc('complete_attendee_form', {
    p_email: email.trim(),
  });
}
