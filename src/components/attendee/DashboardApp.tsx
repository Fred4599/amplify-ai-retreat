import { useEffect, useState, type FormEvent } from 'react';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import { getMyAttendeeProfile, type AttendeeProfile } from '../../lib/attendee-auth';
import {
  addMyUpdate,
  getMyAsk,
  listMyUpdates,
  saveMyAsk,
  type AttendeeAsk,
  type AttendeeUpdate,
} from '../../lib/attendee-engagement';

type Tab = 'home' | 'ask' | 'updates' | 'questions' | 'connect';

const NAV: { id: Tab; label: string; soon?: boolean }[] = [
  { id: 'home', label: 'Home' },
  { id: 'ask', label: 'My Ask' },
  { id: 'updates', label: 'Updates' },
  { id: 'questions', label: 'Questions', soon: true },
  { id: 'connect', label: 'Connect', soon: true },
];

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30';

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function DashboardApp() {
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState<AttendeeProfile | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [ask, setAsk] = useState<AttendeeAsk | null>(null);
  const [askDraft, setAskDraft] = useState('');
  const [askSaving, setAskSaving] = useState(false);
  const [askMessage, setAskMessage] = useState('');

  const [updates, setUpdates] = useState<AttendeeUpdate[]>([]);
  const [updateDraft, setUpdateDraft] = useState('');
  const [updateSaving, setUpdateSaving] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Dashboard is not configured.');
      return;
    }

    let cancelled = false;

    async function boot() {
      const { data } = await supabase!.auth.getSession();
      if (cancelled) return;

      if (!data.session) {
        window.location.href = '/join';
        return;
      }

      const result = await getMyAttendeeProfile();
      if (cancelled) return;

      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }

      if (!result.profile_complete) {
        window.location.href = `/join?email=${encodeURIComponent(result.email || '')}`;
        return;
      }

      setProfile(result);

      try {
        const [askRow, updateRows] = await Promise.all([getMyAsk(), listMyUpdates()]);
        if (cancelled) return;
        setAsk(askRow);
        setAskDraft(askRow?.body || '');
        setUpdates(updateRows);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Could not load dashboard data.');
        }
      }

      setLoading(false);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = '/join';
  }

  async function handleSaveAsk(event: FormEvent) {
    event.preventDefault();
    setAskSaving(true);
    setAskMessage('');
    try {
      const saved = await saveMyAsk(askDraft);
      setAsk(saved);
      setAskDraft(saved.body);
      setAskMessage('Ask saved.');
    } catch (err) {
      setAskMessage(err instanceof Error ? err.message : 'Could not save ask.');
    }
    setAskSaving(false);
  }

  async function handleAddUpdate(event: FormEvent) {
    event.preventDefault();
    setUpdateSaving(true);
    setUpdateError('');
    try {
      const created = await addMyUpdate(updateDraft);
      setUpdates((rows) => [created, ...rows]);
      setUpdateDraft('');
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Could not post update.');
    }
    setUpdateSaving(false);
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-white/60 font-body text-sm">
        Loading your dashboard…
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center space-y-4">
        <p className="text-white font-heading italic text-2xl">Can’t open dashboard</p>
        <p className="text-white/60 font-body text-sm">{error || 'Unknown error'}</p>
        <a
          href="/join"
          className="inline-block bg-white text-black hover:bg-white/90 transition-colors rounded-full px-8 py-3 font-medium text-sm"
        >
          Go to sign in
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-14 w-14 rounded-full overflow-hidden border border-white/15 bg-white/5 shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Attendee dashboard</p>
            <h1 className="text-3xl sm:text-4xl font-heading italic text-white tracking-tight truncate">
              {profile.full_name.split(' ')[0]}
            </h1>
            <p className="text-white/55 font-body text-sm mt-1 truncate">
              {[profile.company, profile.email].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="self-start sm:self-auto rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-body text-white/85 transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-body transition-colors ${
              tab === item.id
                ? 'border-white/30 bg-white/10 text-white'
                : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'home' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-5">
          <div>
            <p className="text-white/45 text-xs font-body uppercase tracking-wider mb-2">About you</p>
            <p className="text-white/85 font-body text-sm leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
          {ask?.body && (
            <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
              <p className="text-white/45 text-xs font-body uppercase tracking-wider mb-2">Your ask</p>
              <p className="text-white/90 font-body text-sm leading-relaxed whitespace-pre-wrap">{ask.body}</p>
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'My Ask', body: ask ? 'Update the challenge you’re here to solve.' : 'Capture the challenge you’re here to solve.', tab: 'ask' as Tab },
              { title: 'Updates', body: `${updates.length} update${updates.length === 1 ? '' : 's'} so far.`, tab: 'updates' as Tab },
              { title: 'Questions', body: 'Drop a question mid-session so it doesn’t get missed.', tab: 'questions' as Tab },
              { title: 'Connect', body: 'Browse checked-in attendees and request contact.', tab: 'connect' as Tab },
            ].map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => setTab(card.tab)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-left hover:bg-black/40 transition-colors"
              >
                <p className="text-white font-body text-sm font-medium">{card.title}</p>
                <p className="text-white/50 font-body text-xs mt-1 leading-relaxed">{card.body}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab === 'ask' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-2">My Ask</p>
          <h2 className="text-2xl font-heading italic text-white mb-2">What challenge are you here to solve?</h2>
          <p className="text-white/55 font-body text-sm mb-5 leading-relaxed">
            Keep it specific. This becomes the thread for your updates and wins through the retreat.
          </p>
          <form onSubmit={handleSaveAsk} className="space-y-4">
            <textarea
              required
              rows={5}
              value={askDraft}
              onChange={(e) => setAskDraft(e.target.value)}
              placeholder="e.g. Build an AI workflow that cuts proposal time in half for my team"
              className={`${inputClass} resize-y min-h-[140px]`}
            />
            {askMessage && (
              <p className={`text-sm font-body ${askMessage === 'Ask saved.' ? 'text-emerald-200' : 'text-red-400/90'}`}>
                {askMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={askSaving}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3 font-medium text-sm"
            >
              {askSaving ? 'Saving…' : ask ? 'Update ask' : 'Save ask'}
            </button>
          </form>
        </div>
      )}

      {tab === 'updates' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
          <div>
            <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-2">Updates</p>
            <h2 className="text-2xl font-heading italic text-white mb-2">Wins & progress</h2>
            <p className="text-white/55 font-body text-sm leading-relaxed">
              Log what you’re receiving against your ask — breakthroughs, decisions, and next steps.
            </p>
          </div>

          <form onSubmit={handleAddUpdate} className="space-y-3">
            <textarea
              required
              rows={3}
              value={updateDraft}
              onChange={(e) => setUpdateDraft(e.target.value)}
              placeholder="What moved forward today?"
              className={`${inputClass} resize-y min-h-[100px]`}
            />
            {updateError && <p className="text-red-400/90 text-sm font-body">{updateError}</p>}
            <button
              type="submit"
              disabled={updateSaving}
              className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3 font-medium text-sm"
            >
              {updateSaving ? 'Posting…' : 'Post update'}
            </button>
          </form>

          <div className="space-y-3">
            {updates.length === 0 ? (
              <p className="text-white/45 font-body text-sm">No updates yet. Post your first win above.</p>
            ) : (
              updates.map((row) => (
                <article key={row.id} className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
                  <p className="text-white/40 font-body text-xs mb-2">{formatDate(row.created_at)}</p>
                  <p className="text-white/90 font-body text-sm leading-relaxed whitespace-pre-wrap">{row.body}</p>
                </article>
              ))
            )}
          </div>
        </div>
      )}

      {(tab === 'questions' || tab === 'connect') && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-2">
            {NAV.find((item) => item.id === tab)?.label}
          </p>
          <h2 className="text-2xl font-heading italic text-white mb-3">Building this next</h2>
          <p className="text-white/60 font-body text-sm leading-relaxed max-w-md mx-auto">
            {tab === 'questions' &&
              'You’ll submit questions during sessions; admins will track and mark them answered.'}
            {tab === 'connect' &&
              'You’ll browse photo, name, company, and bio for checked-in guests, then request email, phone, or both.'}
          </p>
        </div>
      )}
    </div>
  );
}
