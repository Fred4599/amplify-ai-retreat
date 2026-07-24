import { useEffect, useMemo, useState } from 'react';
import {
  getConnectBoard,
  requestContact,
  respondContactRequest,
  type ConnectBoard,
  type ConnectInboxItem,
  type ConnectPerson,
} from '../../lib/attendee-connect';

type Section = 'directory' | 'inbox';

const CONNECT_AUTO_REFRESH_MS = 60_000;

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

function Avatar({ url, name }: { url: string | null; name: string }) {
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="h-14 w-14 rounded-full overflow-hidden border border-white/15 bg-white/5 shrink-0 flex items-center justify-center">
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-white/50 font-body text-sm">{initial}</span>
      )}
    </div>
  );
}

function statusLabel(person: ConnectPerson) {
  if (person.is_me) return 'You';
  if (person.request_status === 'pending') return 'Requested';
  if (person.request_status === 'approved') return 'Connected';
  if (person.request_status === 'declined') return 'Declined';
  return null;
}

export default function ConnectPanel() {
  const [board, setBoard] = useState<ConnectBoard | null>(null);
  const [section, setSection] = useState<Section>('directory');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState('');
  /** Per inbox request: also receive their contact on the channels you share. Default on. */
  const [shareBackById, setShareBackById] = useState<Record<string, boolean>>({});

  function shareBackFor(id: string) {
    return shareBackById[id] !== false;
  }

  async function reload(silent = false) {
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      const next = await getConnectBoard();
      setBoard(next);
      if (!silent) setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load Connect.');
      if (!silent) setBoard(null);
    }
    if (!silent) setLoading(false);
  }

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      void reload(true);
    }, CONNECT_AUTO_REFRESH_MS);
    return () => window.clearInterval(intervalId);
  }, []);

  const people = useMemo(() => {
    const rows = board?.people ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return rows.filter((row) => !row.is_me);
    return rows.filter(
      (row) =>
        !row.is_me &&
        [row.full_name, row.company, row.bio]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q),
    );
  }, [board?.people, query]);

  const inbox = board?.inbox ?? [];

  async function handleRequest(person: ConnectPerson) {
    setBusyId(person.id);
    setActionError('');
    try {
      await requestContact(person.id);
      await reload(true);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not send request.');
    }
    setBusyId(null);
  }

  async function handleRespond(
    item: ConnectInboxItem,
    approve: boolean,
    share?: { email?: boolean; phone?: boolean },
  ) {
    setBusyId(item.id);
    setActionError('');
    try {
      await respondContactRequest({
        requestId: item.id,
        approve,
        shareEmail: share?.email,
        sharePhone: share?.phone,
        shareBack: approve ? shareBackFor(item.id) : false,
      });
      await reload(true);
      if (approve) setSection('directory');
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not respond.');
    }
    setBusyId(null);
  }

  if (loading && !board) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center text-white/50 font-body text-sm">
        Loading Connect…
      </div>
    );
  }

  if (error && !board) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center space-y-3">
        <p className="text-white font-heading italic text-2xl">Connect unavailable</p>
        <p className="text-white/60 font-body text-sm">{error}</p>
        <button
          type="button"
          onClick={() => void reload()}
          className="inline-block bg-white text-black hover:bg-white/90 transition-colors rounded-full px-8 py-3 font-medium text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 space-y-6">
      <div>
        <p className="text-white/50 text-xs font-body uppercase tracking-wider mb-2">Connect</p>
        <h2 className="text-2xl font-heading italic text-white mb-2">Meet the room</h2>
        <p className="text-white/55 font-body text-sm leading-relaxed">
          Browse checked-in guests by name, company, and bio. Request contact — they choose email, phone, or
          both, and can share back so the exchange goes both ways.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSection('directory')}
          className={`rounded-full border px-4 py-2 text-sm font-body transition-colors ${
            section === 'directory'
              ? 'border-white/30 bg-white/10 text-white'
              : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]'
          }`}
        >
          Directory
        </button>
        <button
          type="button"
          onClick={() => setSection('inbox')}
          className={`rounded-full border px-4 py-2 text-sm font-body transition-colors ${
            section === 'inbox'
              ? 'border-white/30 bg-white/10 text-white'
              : 'border-white/10 bg-white/[0.04] text-white/70 hover:bg-white/[0.07]'
          }`}
        >
          Inbox{inbox.length > 0 ? ` (${inbox.length})` : ''}
        </button>
        <button
          type="button"
          onClick={() => void reload(true)}
          className="rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] px-4 py-2 text-sm font-body text-white/70 transition-colors"
        >
          Refresh
        </button>
      </div>

      {actionError && (
        <p className="text-red-400/90 text-sm font-body rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          {actionError}
        </p>
      )}

      {section === 'directory' && (
        <div className="space-y-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, company, bio…"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />

          {people.length === 0 ? (
            <p className="text-white/45 font-body text-sm">
              {query.trim()
                ? 'No attendees match that search.'
                : 'No other checked-in attendees with accounts yet.'}
            </p>
          ) : (
            <div className="space-y-3">
              {people.map((person) => {
                const label = statusLabel(person);
                const canRequest =
                  !person.request_status || person.request_status === 'declined';
                const busy = busyId === person.id;

                return (
                  <article
                    key={person.id}
                    className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 space-y-3"
                  >
                    <div className="flex items-start gap-3">
                      <Avatar url={person.avatar_url} name={person.full_name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-white font-body text-sm font-medium truncate">
                            {person.full_name}
                          </h3>
                          {label && (
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-body ${
                                person.request_status === 'approved'
                                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
                                  : person.request_status === 'pending'
                                    ? 'border-amber-400/30 bg-amber-400/10 text-amber-100'
                                    : 'border-white/15 bg-white/5 text-white/60'
                              }`}
                            >
                              {label}
                            </span>
                          )}
                        </div>
                        {person.company && (
                          <p className="text-white/55 font-body text-xs mt-1 truncate">{person.company}</p>
                        )}
                      </div>
                    </div>

                    {person.bio && (
                      <p className="text-white/75 font-body text-sm leading-relaxed whitespace-pre-wrap">
                        {person.bio}
                      </p>
                    )}

                    {person.request_status === 'approved' && (
                      <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 space-y-1.5">
                        <p className="text-white/45 text-xs font-body uppercase tracking-wider">Shared with you</p>
                        {person.shared_email ? (
                          <a
                            href={`mailto:${person.shared_email}`}
                            className="block text-white/90 font-body text-sm hover:underline break-all"
                          >
                            {person.shared_email}
                          </a>
                        ) : null}
                        {person.shared_phone ? (
                          <a
                            href={`tel:${person.shared_phone}`}
                            className="block text-white/90 font-body text-sm hover:underline"
                          >
                            {person.shared_phone}
                          </a>
                        ) : null}
                        {!person.shared_email && !person.shared_phone && (
                          <p className="text-white/50 font-body text-sm">No contact details shared.</p>
                        )}
                      </div>
                    )}

                    {canRequest && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleRequest(person)}
                        className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-5 py-2.5 font-medium text-sm"
                      >
                        {busy
                          ? 'Sending…'
                          : person.request_status === 'declined'
                            ? 'Request again'
                            : 'Request contact'}
                      </button>
                    )}

                    {person.request_status === 'pending' && (
                      <p className="text-white/45 font-body text-xs">Waiting for them to approve.</p>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {section === 'inbox' && (
        <div className="space-y-3">
          {inbox.length === 0 ? (
            <p className="text-white/45 font-body text-sm">No pending contact requests.</p>
          ) : (
            inbox.map((item) => {
              const busy = busyId === item.id;
              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar url={item.requester_avatar_url} name={item.requester_name} />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-white font-body text-sm font-medium truncate">
                        {item.requester_name}
                      </h3>
                      {item.requester_company && (
                        <p className="text-white/55 font-body text-xs mt-1 truncate">
                          {item.requester_company}
                        </p>
                      )}
                      <p className="text-white/40 font-body text-xs mt-1">{formatDate(item.created_at)}</p>
                    </div>
                  </div>

                  {item.requester_bio && (
                    <p className="text-white/75 font-body text-sm leading-relaxed whitespace-pre-wrap">
                      {item.requester_bio}
                    </p>
                  )}

                  <p className="text-white/55 font-body text-xs">
                    Choose what they can see from your profile. Turn on Also share back to get the same from them.
                  </p>

                  <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareBackFor(item.id)}
                      disabled={busy}
                      onChange={(e) =>
                        setShareBackById((prev) => ({ ...prev, [item.id]: e.target.checked }))
                      }
                      className="mt-0.5 accent-white"
                    />
                    <span className="min-w-0">
                      <span className="block text-white font-body text-sm">Also share back</span>
                      <span className="block text-white/50 font-body text-xs mt-0.5 leading-relaxed">
                        When you approve, you’ll get their contact on the same channels (email / phone / both).
                      </span>
                    </span>
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleRespond(item, true, { email: true })}
                      className="bg-white text-black hover:bg-white/90 disabled:opacity-60 transition-colors rounded-full px-4 py-2 font-medium text-sm"
                    >
                      Share email
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleRespond(item, true, { phone: true })}
                      className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-60 px-4 py-2 text-sm font-body text-white/85 transition-colors"
                    >
                      Share phone
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleRespond(item, true, { email: true, phone: true })}
                      className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 disabled:opacity-60 px-4 py-2 text-sm font-body text-white/85 transition-colors"
                    >
                      Share both
                    </button>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleRespond(item, false)}
                      className="rounded-full border border-white/10 px-4 py-2 text-sm font-body text-white/55 hover:text-white/80 hover:bg-white/5 disabled:opacity-60 transition-colors"
                    >
                      Deny
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
