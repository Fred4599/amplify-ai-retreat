import { useMemo, useState, type FormEvent } from 'react';
import { lookupAttendeeForCheckIn, startAttendeeCheckIn } from '../../lib/check-in';

type Step = 'lookup' | 'ready' | 'done';

export default function CheckInFlow() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<Step>('lookup');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsForm, setNeedsForm] = useState(true);
  const [fullyCheckedIn, setFullyCheckedIn] = useState(false);

  const waiverHref = useMemo(() => {
    const params = new URLSearchParams({
      email: email.trim(),
      from: 'checkin',
    });
    return `/waiver?${params.toString()}`;
  }, [email]);

  async function handleLookup(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');

    const lookup = await lookupAttendeeForCheckIn(email);
    if (!lookup.found) {
      setLoading(false);
      setError('We couldn’t find that email on the attendee list. Check with retreat staff.');
      return;
    }

    setName(lookup.full_name || '');
    setFullyCheckedIn(Boolean(lookup.fully_checked_in));
    setNeedsForm(!lookup.form_completed_at);

    if (lookup.fully_checked_in) {
      setStep('done');
      setLoading(false);
      return;
    }

    const started = await startAttendeeCheckIn(email);
    setLoading(false);

    if (!started.ok) {
      setError(started.error);
      return;
    }

    setName(started.full_name);
    setNeedsForm(started.needs_form);
    setFullyCheckedIn(started.fully_checked_in);
    setStep(started.fully_checked_in ? 'done' : 'ready');
  }

  if (step === 'done') {
    return (
      <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/5 px-6 py-10 text-center">
        <p className="text-emerald-200/80 text-xs font-body uppercase tracking-widest mb-2">You’re in</p>
        <h2 className="text-3xl font-heading italic text-white mb-3">Fully checked in</h2>
        <p className="text-white/65 font-body text-sm leading-relaxed max-w-sm mx-auto">
          {name ? `${name}, you’re` : 'You’re'} checked in and your waiver is on file. Enjoy the retreat.
        </p>
      </div>
    );
  }

  if (step === 'ready') {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-white/10">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Step 1 complete</p>
          <h2 className="text-3xl font-heading italic text-white tracking-tight">Welcome, {name}</h2>
          <p className="text-white/60 font-body text-sm mt-2 leading-relaxed">
            You’re checked in. {needsForm ? 'Next: sign the participant waiver to finish.' : 'Your form is already on file.'}
          </p>
        </div>
        <div className="px-6 py-6 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm font-body">
              <span className="text-white/60">Checked in</span>
              <span className="text-emerald-200">Done</span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm font-body">
              <span className="text-white/60">Waiver form</span>
              <span className={needsForm ? 'text-amber-100' : 'text-emerald-200'}>
                {needsForm ? 'Required next' : 'Done'}
              </span>
            </div>
          </div>

          {needsForm ? (
            <a
              href={waiverHref}
              className="block text-center bg-white text-black hover:bg-white/90 transition-colors rounded-full px-8 py-3.5 font-medium text-sm"
            >
              Continue to waiver
            </a>
          ) : (
            <button
              type="button"
              onClick={() => setStep('done')}
              className="w-full bg-white text-black hover:bg-white/90 transition-colors rounded-full px-8 py-3.5 font-medium text-sm"
            >
              Finish check-in
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setStep('lookup');
              setError('');
            }}
            className="w-full rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-3 text-sm font-body text-white/80 transition-colors"
          >
            Check in someone else
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
      <div className="px-6 pt-8 pb-4 border-b border-white/10">
        <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Amplify AI Retreat</p>
        <h1 className="text-3xl sm:text-4xl font-heading italic text-white tracking-tight">Check in</h1>
        <p className="text-white/60 font-body text-sm mt-2 leading-relaxed">
          Enter the email on your registration. You’ll check in, then complete the waiver if you haven’t already.
        </p>
      </div>
      <form onSubmit={handleLookup} className="px-6 py-6 flex flex-col gap-4">
        <div>
          <label htmlFor="checkin-email" className="block text-sm font-medium text-white/90 font-body mb-1.5">
            Email
          </label>
          <input
            id="checkin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
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
          {loading ? 'Looking up…' : 'Start check-in'}
        </button>
        <ol className="text-white/45 font-body text-xs leading-relaxed space-y-1 list-decimal list-inside">
          <li>Check in with your email</li>
          <li>Sign the participant waiver</li>
          <li>You’re fully checked in</li>
        </ol>
      </form>
    </div>
  );
}
