import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import {
  getMyAttendeeProfile,
  signInAttendee,
  signUpAttendee,
  updateMyAttendeeProfile,
  type AttendeeProfile,
} from '../../lib/attendee-auth';

type Mode = 'create' | 'signin';
type Step = 'auth' | 'profile' | 'confirm_email';

const inputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30';

export default function JoinFlow() {
  const supabase = getSupabaseBrowserClient();
  const initialEmail = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return new URLSearchParams(window.location.search).get('email')?.trim() || '';
  }, []);

  const [mode, setMode] = useState<Mode>('create');
  const [step, setStep] = useState<Step>('auth');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setBooting(false);
      return;
    }

    let cancelled = false;

    async function boot() {
      const { data } = await supabase!.auth.getSession();
      if (cancelled) return;

      if (!data.session) {
        setBooting(false);
        return;
      }

      const profile = await getMyAttendeeProfile();
      if (cancelled) return;

      if (profile.ok) {
        applyProfile(profile);
        setStep(profile.profile_complete ? 'auth' : 'profile');
        if (profile.profile_complete) {
          window.location.href = '/dashboard';
          return;
        }
      }
      setBooting(false);
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  function applyProfile(profile: AttendeeProfile) {
    setName(profile.full_name);
    setEmail(profile.email || email);
    setCompany(profile.company || '');
    setBio(profile.bio || '');
    setPhone(profile.phone || '');
  }

  async function handleAuth(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError('');

    if (mode === 'create') {
      if (password.length < 8) {
        setLoading(false);
        setError('Password must be at least 8 characters.');
        return;
      }

      const result = await signUpAttendee(email, password);
      setLoading(false);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (result.needsEmailConfirm) {
        setStep('confirm_email');
        return;
      }

      const profile = await getMyAttendeeProfile();
      if (profile.ok) {
        applyProfile(profile);
        if (profile.profile_complete) {
          window.location.href = '/dashboard';
          return;
        }
      }
      setStep('profile');
      return;
    }

    const result = await signInAttendee(email, password);
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    applyProfile(result.profile);
    if (result.profile.profile_complete) {
      window.location.href = '/dashboard';
      return;
    }
    setStep('profile');
  }

  async function handleProfile(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await updateMyAttendeeProfile({ company, bio, phone });
    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    window.location.href = '/dashboard';
  }

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">
        <p className="text-white font-heading italic text-2xl mb-2">Join unavailable</p>
        <p className="text-white/60 font-body text-sm">Supabase is not configured for this site.</p>
      </div>
    );
  }

  if (booting) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-white/60 font-body text-sm">
        Loading…
      </div>
    );
  }

  if (step === 'confirm_email') {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-10 text-center">
        <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-2">Confirm email</p>
        <h2 className="text-3xl font-heading italic text-white mb-3">Check your inbox</h2>
        <p className="text-white/65 font-body text-sm leading-relaxed max-w-sm mx-auto">
          We sent a confirmation link to <span className="text-white">{email}</span>. Confirm, then come
          back here to sign in and finish your profile.
        </p>
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setStep('auth');
          }}
          className="mt-8 inline-block bg-white text-black hover:bg-white/90 transition-colors rounded-full px-8 py-3 font-medium text-sm"
        >
          I confirmed — sign in
        </button>
      </div>
    );
  }

  if (step === 'profile') {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-white/10">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Almost done</p>
          <h1 className="text-3xl font-heading italic text-white tracking-tight">
            {name ? `Welcome, ${name.split(' ')[0]}` : 'Your profile'}
          </h1>
          <p className="text-white/60 font-body text-sm mt-2 leading-relaxed">
            Add your company and a short bio so other checked-in attendees can find you in Connect.
          </p>
        </div>
        <form onSubmit={handleProfile} className="px-6 py-6 flex flex-col gap-4">
          <div>
            <label htmlFor="join-company" className="block text-sm font-medium text-white/90 font-body mb-1.5">
              Company
            </label>
            <input
              id="join-company"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or business name"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="join-bio" className="block text-sm font-medium text-white/90 font-body mb-1.5">
              Short bio
            </label>
            <textarea
              id="join-bio"
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Who you are and what you do"
              className={`${inputClass} resize-y min-h-[110px]`}
            />
          </div>
          <div>
            <label htmlFor="join-phone" className="block text-sm font-medium text-white/90 font-body mb-1.5">
              Phone <span className="text-white/40">(optional — for Connect approvals)</span>
            </label>
            <input
              id="join-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 555-5555"
              className={inputClass}
            />
          </div>
          {error && (
            <p className="text-red-400/90 text-sm font-body" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3.5 font-medium text-sm"
          >
            {loading ? 'Saving…' : 'Enter dashboard'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
      <div className="px-6 pt-8 pb-4 border-b border-white/10">
        <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Attendee account</p>
        <h1 className="text-3xl sm:text-4xl font-heading italic text-white tracking-tight">
          {mode === 'create' ? 'Create your account' : 'Sign in'}
        </h1>
        <p className="text-white/60 font-body text-sm mt-2 leading-relaxed">
          {mode === 'create'
            ? 'Use the same email you checked in with, then set a password for your retreat dashboard.'
            : 'Sign in to your Amplify AI Retreat dashboard.'}
        </p>
      </div>
      <form onSubmit={handleAuth} className="px-6 py-6 flex flex-col gap-4">
        <div>
          <label htmlFor="join-email" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Email
          </label>
          <input
            id="join-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="join-password" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Password
          </label>
          <input
            id="join-password"
            type="password"
            required
            autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            className={inputClass}
          />
        </div>
        {error && (
          <p className="text-red-400/90 text-sm font-body" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3.5 font-medium text-sm"
        >
          {loading ? 'Working…' : mode === 'create' ? 'Create account' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'create' ? 'signin' : 'create');
            setError('');
          }}
          className="text-sm font-body text-white/60 hover:text-white transition-colors"
        >
          {mode === 'create' ? 'Already have an account? Sign in' : 'Need an account? Create one'}
        </button>
      </form>
    </div>
  );
}
