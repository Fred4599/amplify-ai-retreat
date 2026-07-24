import { getSupabaseBrowserClient } from './supabase';

export type ConnectPerson = {
  id: string;
  full_name: string;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_me: boolean;
  request_id: string | null;
  request_status: 'pending' | 'approved' | 'declined' | null;
  share_email: boolean | null;
  share_phone: boolean | null;
  responded_at: string | null;
  shared_email: string | null;
  shared_phone: string | null;
};

export type ConnectInboxItem = {
  id: string;
  status: 'pending';
  created_at: string;
  requester_id: string;
  requester_name: string;
  requester_company: string | null;
  requester_bio: string | null;
  requester_avatar_url: string | null;
  requester_has_email?: boolean;
  requester_has_phone?: boolean;
};

export type ConnectBoard = {
  me_id: string;
  people: ConnectPerson[];
  inbox: ConnectInboxItem[];
};

type RpcOk<T> = { ok: true } & T;
type RpcErr = { ok: false; error: string };

function asBoard(data: unknown): ConnectBoard {
  const row = data as RpcOk<ConnectBoard>;
  return {
    me_id: row.me_id,
    people: (row.people ?? []) as ConnectPerson[],
    inbox: (row.inbox ?? []) as ConnectInboxItem[],
  };
}

export async function getConnectBoard(): Promise<ConnectBoard> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Connect is not configured.');

  const { data, error } = await supabase.rpc('get_connect_board');
  if (error) throw new Error(error.message);

  const result = data as RpcOk<ConnectBoard> | RpcErr;
  if (!result?.ok) throw new Error(result?.error || 'Could not load Connect.');
  return asBoard(result);
}

export async function requestContact(recipientId: string): Promise<{
  id: string;
  status: string;
  recipient_id: string;
}> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Connect is not configured.');

  const { data, error } = await supabase.rpc('request_contact', {
    p_recipient_id: recipientId,
  });
  if (error) throw new Error(error.message);

  const result = data as RpcOk<{ id: string; status: string; recipient_id: string }> | RpcErr;
  if (!result?.ok) throw new Error(result?.error || 'Could not send request.');
  return result;
}

export async function respondContactRequest(input: {
  requestId: string;
  approve: boolean;
  shareEmail?: boolean;
  sharePhone?: boolean;
  shareBack?: boolean;
}): Promise<{ id: string; status: string }> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) throw new Error('Connect is not configured.');

  const { data, error } = await supabase.rpc('respond_contact_request', {
    p_request_id: input.requestId,
    p_approve: input.approve,
    p_share_email: input.shareEmail ?? false,
    p_share_phone: input.sharePhone ?? false,
    p_share_back: input.shareBack ?? false,
  });
  if (error) throw new Error(error.message);

  const result = data as RpcOk<{ id: string; status: string }> | RpcErr;
  if (!result?.ok) throw new Error(result?.error || 'Could not respond to request.');
  return result;
}
