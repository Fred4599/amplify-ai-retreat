import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient } from '../../lib/supabase';
import type {
  AdminTab,
  ParticipantWaiver,
  RetreatApplication,
  RetreatAttendee,
  WebinarRegistration,
} from '../../lib/admin-types';
import AttendeesPanel from './AttendeesPanel';

const ATTENDEES_AUTO_REFRESH_MS = 60_000;

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-white/40 text-xs uppercase tracking-wider font-body mb-1">{label}</dt>
      <dd className="text-white/90 font-body text-sm whitespace-pre-wrap break-words">{value}</dd>
    </div>
  );
}

export default function AdminDashboard() {
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [signingIn, setSigningIn] = useState(false);

  const [tab, setTab] = useState<AdminTab>('attendees');
  const [query, setQuery] = useState('');
  const [attendees, setAttendees] = useState<RetreatAttendee[]>([]);
  const [applications, setApplications] = useState<RetreatApplication[]>([]);
  const [webinars, setWebinars] = useState<WebinarRegistration[]>([]);
  const [waivers, setWaivers] = useState<ParticipantWaiver[]>([]);
  const [dataError, setDataError] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<RetreatApplication | null>(null);
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarRegistration | null>(null);
  const [selectedWaiver, setSelectedWaiver] = useState<ParticipantWaiver | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const silentRefreshRef = useRef(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!supabase || !session) return;

    let cancelled = false;
    const silent = silentRefreshRef.current;
    silentRefreshRef.current = false;

    async function load() {
      if (!silent) {
        setDataLoading(true);
        setDataError('');
      }

      const [attendeesResult, appsResult, webinarsResult, waiversResult] = await Promise.all([
        supabase!
          .from('retreat_attendees')
          .select('*')
          .order('full_name', { ascending: true }),
        supabase!
          .from('retreat_applications')
          .select('*')
          .order('submitted_at', { ascending: false }),
        supabase!
          .from('webinar_registrations')
          .select('*')
          .order('submitted_at', { ascending: false }),
        supabase!
          .from('participant_waivers')
          .select('*')
          .order('signed_at', { ascending: false }),
      ]);

      if (cancelled) return;

      if (attendeesResult.error || appsResult.error || webinarsResult.error || waiversResult.error) {
        setDataError(
          attendeesResult.error?.message ||
            appsResult.error?.message ||
            webinarsResult.error?.message ||
            waiversResult.error?.message ||
            'Could not load submissions. Confirm this email is on the admin allowlist.',
        );
        if (!silent) {
          setAttendees([]);
          setApplications([]);
          setWebinars([]);
          setWaivers([]);
        }
      } else {
        try {
          const waiverByEmail = new Map(
            ((waiversResult.data ?? []) as ParticipantWaiver[])
              .filter((row) => row.email)
              .map((row) => [row.email.trim().toLowerCase(), row.signed_at]),
          );
          const nextAttendees = ((attendeesResult.data ?? []) as RetreatAttendee[]).map((row) => {
            if (row.form_completed_at || !row.email) return row;
            const signedAt = waiverByEmail.get(row.email.trim().toLowerCase());
            if (!signedAt) return row;
            return { ...row, form_completed_at: signedAt };
          });
          setAttendees(nextAttendees);
          setApplications((appsResult.data ?? []) as RetreatApplication[]);
          setWebinars((webinarsResult.data ?? []) as WebinarRegistration[]);
          setWaivers((waiversResult.data ?? []) as ParticipantWaiver[]);
          if (silent) setDataError('');
        } catch (err) {
          setDataError(err instanceof Error ? err.message : 'Could not process attendee data.');
          if (!silent) {
            setAttendees([]);
            setApplications([]);
            setWebinars([]);
            setWaivers([]);
          }
        }
      }

      if (!silent) setDataLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [supabase, session?.user?.id, refreshKey]);

  useEffect(() => {
    if (!supabase || !session || tab !== 'attendees') return;

    const intervalId = window.setInterval(() => {
      silentRefreshRef.current = true;
      setRefreshKey((value) => value + 1);
    }, ATTENDEES_AUTO_REFRESH_MS);

    return () => window.clearInterval(intervalId);
  }, [supabase, session?.user?.id, tab]);

  const filteredApplications = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return applications;
    return applications.filter((row) =>
      [row.full_name, row.email, row.phone, row.company_website, row.source, row.bottleneck]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [applications, query]);

  const filteredWebinars = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return webinars;
    return webinars.filter((row) =>
      [row.full_name, row.email, row.phone, row.company]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [webinars, query]);

  const filteredWaivers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return waivers;
    return waivers.filter((row) =>
      [row.legal_name, row.preferred_name, row.email, row.phone, row.emergency_name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [waivers, query]);

  async function handleSignIn(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;

    setSigningIn(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    setSigningIn(false);
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSelectedApp(null);
    setSelectedWebinar(null);
    setSelectedWaiver(null);
  }

  if (!supabase) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center">
        <p className="text-white font-heading italic text-2xl mb-2">Admin unavailable</p>
        <p className="text-white/60 font-body text-sm">
          Set <code className="text-white/80">PUBLIC_SUPABASE_URL</code> and{' '}
          <code className="text-white/80">PUBLIC_SUPABASE_ANON_KEY</code> to enable this dashboard.
        </p>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center text-white/60 font-body text-sm">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] backdrop-blur-xl overflow-hidden">
        <div className="px-6 pt-8 pb-4 border-b border-white/10">
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Internal</p>
          <h1 className="text-3xl font-heading italic text-white tracking-tight">Admin sign in</h1>
          <p className="text-white/60 font-body text-sm mt-2">
            View retreat applications and webinar registrations.
          </p>
        </div>
        <form onSubmit={handleSignIn} className="px-6 py-6 flex flex-col gap-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-white/90 font-body mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-white/90 font-body mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
            />
          </div>
          {authError && (
            <p className="text-red-400/90 text-sm font-body" role="alert">
              {authError}
            </p>
          )}
          <button
            type="submit"
            disabled={signingIn}
            className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-8 py-3.5 font-medium text-sm"
          >
            {signingIn ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Internal</p>
          <h1 className="text-3xl sm:text-4xl font-heading italic text-white tracking-tight">
            Retreat admin
          </h1>
          <p className="text-white/55 font-body text-sm mt-1">{session.user.email}</p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="self-start sm:self-auto rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-5 py-2.5 text-sm font-body text-white/85 transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          type="button"
          onClick={() => {
            setTab('attendees');
            setSelectedApp(null);
            setSelectedWebinar(null);
            setSelectedWaiver(null);
          }}
          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
            tab === 'attendees'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/50 text-xs font-body uppercase tracking-wider">Attendees</p>
          <p className="text-2xl font-heading italic text-white mt-1">{attendees.length}</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('applications');
            setSelectedWebinar(null);
            setSelectedWaiver(null);
          }}
          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
            tab === 'applications'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/50 text-xs font-body uppercase tracking-wider">Applications</p>
          <p className="text-2xl font-heading italic text-white mt-1">{applications.length}</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('webinar');
            setSelectedApp(null);
            setSelectedWaiver(null);
          }}
          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
            tab === 'webinar'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/50 text-xs font-body uppercase tracking-wider">Webinar</p>
          <p className="text-2xl font-heading italic text-white mt-1">{webinars.length}</p>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('waivers');
            setSelectedApp(null);
            setSelectedWebinar(null);
          }}
          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
            tab === 'waivers'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/50 text-xs font-body uppercase tracking-wider">Waivers</p>
          <p className="text-2xl font-heading italic text-white mt-1">{waivers.length}</p>
        </button>
      </div>

      {tab !== 'attendees' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="search"
            placeholder="Search name, email, company…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <button
            type="button"
            onClick={() => setRefreshKey((value) => value + 1)}
            className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-body text-white/80 transition-colors"
          >
            Refresh
          </button>
        </div>
      )}

      {dataError && (
        <p className="text-red-400/90 text-sm font-body rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          {dataError}
        </p>
      )}

      {tab === 'attendees' ? (
        <AttendeesPanel
          supabase={supabase}
          attendees={attendees}
          applications={applications}
          dataLoading={dataLoading}
          onRefresh={() => setRefreshKey((value) => value + 1)}
          onAttendeesChange={setAttendees}
        />
      ) : (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {dataLoading ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">Loading submissions…</p>
        ) : tab === 'applications' ? (
          filteredApplications.length === 0 ? (
            <p className="p-8 text-center text-white/50 font-body text-sm">No applications yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left">
                <thead className="border-b border-white/10 text-white/45 text-xs uppercase tracking-wider font-body">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Company</th>
                    <th className="px-4 py-3 font-medium">Sales</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedApp(row)}
                      className="border-b border-white/5 hover:bg-white/[0.06] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-white font-body">{row.full_name}</td>
                      <td className="px-4 py-3 text-sm text-white/75 font-body">{row.email}</td>
                      <td className="px-4 py-3 text-sm text-white/75 font-body max-w-[180px] truncate">
                        {row.company_website || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-white/75 font-body">{row.annual_sales || '—'}</td>
                      <td className="px-4 py-3 text-sm text-white/55 font-body whitespace-nowrap">
                        {formatDate(row.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : tab === 'webinar' ? (
          filteredWebinars.length === 0 ? (
            <p className="p-8 text-center text-white/50 font-body text-sm">No webinar registrations yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-left">
                <thead className="border-b border-white/10 text-white/45 text-xs uppercase tracking-wider font-body">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWebinars.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedWebinar(row)}
                      className="border-b border-white/5 hover:bg-white/[0.06] cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm text-white font-body">{row.full_name}</td>
                      <td className="px-4 py-3 text-sm text-white/75 font-body">{row.email}</td>
                      <td className="px-4 py-3 text-sm text-white/55 font-body whitespace-nowrap">
                        {formatDate(row.submitted_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : filteredWaivers.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">No signed waivers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead className="border-b border-white/10 text-white/45 text-xs uppercase tracking-wider font-body">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Version</th>
                  <th className="px-4 py-3 font-medium">Signed</th>
                </tr>
              </thead>
              <tbody>
                {filteredWaivers.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedWaiver(row)}
                    className="border-b border-white/5 hover:bg-white/[0.06] cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-white font-body">{row.legal_name}</td>
                    <td className="px-4 py-3 text-sm text-white/75 font-body">{row.email}</td>
                    <td className="px-4 py-3 text-sm text-white/55 font-body">{row.agreement_version}</td>
                    <td className="px-4 py-3 text-sm text-white/55 font-body whitespace-nowrap">
                      {formatDate(row.signed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      )}

      {(selectedApp || selectedWebinar || selectedWaiver) && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-label="Close details"
            onClick={() => {
              setSelectedApp(null);
              setSelectedWebinar(null);
              setSelectedWaiver(null);
            }}
          />
          <div className="relative w-full sm:max-w-lg max-h-[90svh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-black/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">
                  {selectedApp ? 'Application' : selectedWebinar ? 'Webinar registration' : 'Signed waiver'}
                </p>
                <h2 className="text-2xl font-heading italic text-white">
                  {selectedApp?.full_name || selectedWebinar?.full_name || selectedWaiver?.legal_name}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedApp(null);
                  setSelectedWebinar(null);
                  setSelectedWaiver(null);
                }}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {selectedApp && (
              <dl className="space-y-4">
                <Field label="Email" value={selectedApp.email} />
                <Field label="Phone" value={selectedApp.phone} />
                <Field label="Company / website" value={selectedApp.company_website} />
                <Field label="Annual sales" value={selectedApp.annual_sales} />
                <Field label="Employees" value={selectedApp.employee_count} />
                <Field label="Business" value={selectedApp.business_description} />
                <Field label="Bottleneck" value={selectedApp.bottleneck} />
                <Field label="AI usage" value={selectedApp.ai_usage} />
                <Field label="Success outcome" value={selectedApp.success_outcome} />
                <Field label="Source" value={selectedApp.source} />
                <Field label="Submitted" value={formatDate(selectedApp.submitted_at)} />
              </dl>
            )}

            {selectedWebinar && (
              <dl className="space-y-4">
                <Field label="Email" value={selectedWebinar.email} />
                <Field label="Phone" value={selectedWebinar.phone} />
                <Field label="Company" value={selectedWebinar.company} />
                <Field label="Submitted" value={formatDate(selectedWebinar.submitted_at)} />
              </dl>
            )}

            {selectedWaiver && (
              <dl className="space-y-4">
                <Field label="Preferred name" value={selectedWaiver.preferred_name} />
                <Field label="Email" value={selectedWaiver.email} />
                <Field label="Phone" value={selectedWaiver.phone} />
                <Field label="Address" value={selectedWaiver.street_address} />
                <Field label="City / State / ZIP" value={selectedWaiver.city_state_zip} />
                <Field label="Risk initials (4–10)" value={selectedWaiver.initials_risk} />
                <Field label="Media initials (11–14)" value={selectedWaiver.initials_media} />
                <Field label="Collaboration initials (15)" value={selectedWaiver.initials_collaboration} />
                <Field label="Signature" value={selectedWaiver.signature_name} />
                <Field label="Printed legal name" value={selectedWaiver.printed_legal_name} />
                <Field label="Agreement version" value={selectedWaiver.agreement_version} />
                <Field label="Signed" value={formatDate(selectedWaiver.signed_at)} />
                <Field label="Emergency contact" value={selectedWaiver.emergency_name} />
                <Field label="Relationship" value={selectedWaiver.emergency_relationship} />
                <Field label="Emergency phone" value={selectedWaiver.emergency_phone} />
                <Field label="Alternate phone" value={selectedWaiver.emergency_phone_alt} />
                <Field label="Medical note" value={selectedWaiver.medical_note} />
              </dl>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
