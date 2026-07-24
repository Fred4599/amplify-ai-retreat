import { getSupabaseBrowserClient } from './supabase';

export type AttendeeProfile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  bio: string | null;
  checked_in_at?: string | null;
  form_completed_at?: string | null;
  profile_complete: boolean;
};

type RpcResult = { ok: true } & AttendeeProfile | { ok: false; error: string };

export async function claimAttendeeAccount(): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { data, error } = await supabase.rpc('claim_attendee_account');
  if (error) return { ok: false, error: error.message };
  return data as RpcResult;
}

export async function getMyAttendeeProfile(): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { data, error } = await supabase.rpc('get_my_attendee_profile');
  if (error) return { ok: false, error: error.message };
  return data as RpcResult;
}

export async function updateMyAttendeeProfile(input: {
  company: string;
  bio: string;
  phone?: string;
}): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { data, error } = await supabase.rpc('update_my_attendee_profile', {
    p_company: input.company,
    p_bio: input.bio,
    p_phone: input.phone ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return data as RpcResult;
}

export async function signUpAttendee(email: string, password: string): Promise<
  | { ok: true; needsEmailConfirm: boolean }
  | { ok: false; error: string }
> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) return { ok: false, error: error.message };

  if (!data.session) {
    return { ok: true, needsEmailConfirm: true };
  }

  const claimed = await claimAttendeeAccount();
  if (!claimed.ok) {
    await supabase.auth.signOut();
    return { ok: false, error: claimed.error };
  }

  return { ok: true, needsEmailConfirm: false };
}

export async function signInAttendee(email: string, password: string): Promise<
  | { ok: true; profile: AttendeeProfile }
  | { ok: false; error: string }
> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) return { ok: false, error: error.message };

  let profile = await getMyAttendeeProfile();
  if (!profile.ok) {
    const claimed = await claimAttendeeAccount();
    if (!claimed.ok) {
      await supabase.auth.signOut();
      return { ok: false, error: claimed.error };
    }
    profile = claimed;
  }

  if (!profile.ok) return { ok: false, error: profile.error };
  return { ok: true, profile };
}
