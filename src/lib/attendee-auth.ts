import { getSupabaseBrowserClient } from './supabase';

export type AttendeeProfile = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  checked_in_at?: string | null;
  form_completed_at?: string | null;
  profile_complete: boolean;
};

type RpcResult = ({ ok: true } & AttendeeProfile) | { ok: false; error: string };

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
  avatarUrl?: string;
}): Promise<RpcResult> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const { data, error } = await supabase.rpc('update_my_attendee_profile', {
    p_company: input.company,
    p_bio: input.bio,
    p_phone: input.phone ?? null,
    p_avatar_url: input.avatarUrl ?? null,
  });
  if (error) return { ok: false, error: error.message };
  return data as RpcResult;
}

export async function uploadAttendeeAvatar(file: File): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) return { ok: false, error: 'Auth is not configured.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Not signed in.' };

  if (!file.type.startsWith('image/')) {
    return { ok: false, error: 'Please choose an image file.' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { ok: false, error: 'Photo must be under 5MB.' };
  }

  const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${user.id}/avatar.${ext === 'jpeg' ? 'jpg' : ext}`;

  const { error: uploadError } = await supabase.storage.from('attendee-avatars').upload(path, file, {
    upsert: true,
    contentType: file.type,
    cacheControl: '3600',
  });

  if (uploadError) return { ok: false, error: uploadError.message };

  const { data } = supabase.storage.from('attendee-avatars').getPublicUrl(path);
  // bust cache after replace
  const url = `${data.publicUrl}?t=${Date.now()}`;
  return { ok: true, url };
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

export async function signInAttendee(
  email: string,
  password: string,
): Promise<{ ok: true; profile: AttendeeProfile } | { ok: false; error: string }> {
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
