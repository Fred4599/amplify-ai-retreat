import { useEffect, useState } from 'react';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import { getMyAttendeeProfile, type AttendeeProfile } from '../../lib/attendee-auth';

type Tab = 'home' | 'ask' | 'updates' | 'questions' | 'connect';

const NAV: { id: Tab; label: string; soon?: boolean }[] = [
  { id: 'home', label: 'Home' },
  { id: 'ask', label: 'My Ask', soon: true },
  { id: 'updates', label: 'Updates', soon: true },
  { id: 'questions', label: 'Questions', soon: true },
  { id: 'connect', label: 'Connect', soon: true },
];

export default function DashboardApp() {
  const supabase = getSupabaseBrowserClient();
  const [profile, setProfile] = useState<AttendeeProfile | null>(null);
  const [tab, setTab] = useState<Tab>('home');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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
        <div>
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Attendee dashboard</p>
          <h1 className="text-3xl sm:text-4xl font-heading italic text-white tracking-tight">
            {profile.full_name.split(' ')[0]}
          </h1>
          <p className="text-white/55 font-body text-sm mt-1">
            {[profile.company, profile.email].filter(Boolean).join(' · ')}
          </p>
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
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { title: 'My Ask', body: 'Capture the challenge you’re here to solve.', tab: 'ask' as Tab },
              { title: 'Updates', body: 'Log wins and progress against your ask.', tab: 'updates' as Tab },
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
                <p className="text-white/35 font-body text-xs mt-3 uppercase tracking-wider">Coming next</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {tab !== 'home' && (
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-2">
            {NAV.find((item) => item.id === tab)?.label}
          </p>
          <h2 className="text-2xl font-heading italic text-white mb-3">Building this next</h2>
          <p className="text-white/60 font-body text-sm leading-relaxed max-w-md mx-auto">
            {tab === 'ask' &&
              'You’ll enter the challenge you’re hoping to solve — your Ask for the retreat.'}
            {tab === 'updates' &&
              'You’ll post wins and updates on how your Ask is progressing through the retreat.'}
            {tab === 'questions' &&
              'You’ll submit questions during sessions; admins will track and mark them answered.'}
            {tab === 'connect' &&
              'You’ll browse name, company, and bio for checked-in guests, then request email, phone, or both.'}
          </p>
        </div>
      )}
    </div>
  );
}
