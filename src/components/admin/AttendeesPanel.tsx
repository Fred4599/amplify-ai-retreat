import { useMemo, useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ATTENDEE_STATUS_LABEL,
  getAttendeeStatus,
  type RetreatApplication,
  type RetreatAttendee,
} from '../../lib/admin-types';

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

function StatusPill({ attendee }: { attendee: RetreatAttendee }) {
  const status = getAttendeeStatus(attendee);
  const styles =
    status === 'fully_checked_in'
      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
      : status === 'checked_in'
        ? 'border-amber-400/30 bg-amber-400/10 text-amber-100'
        : 'border-white/15 bg-white/5 text-white/70';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-body ${styles}`}>
      {ATTENDEE_STATUS_LABEL[status]}
    </span>
  );
}

type Props = {
  supabase: SupabaseClient;
  attendees: RetreatAttendee[];
  applications: RetreatApplication[];
  dataLoading: boolean;
  onRefresh: () => void;
  onAttendeesChange: (rows: RetreatAttendee[]) => void;
};

export default function AttendeesPanel({
  supabase,
  attendees,
  applications,
  dataLoading,
  onRefresh,
  onAttendeesChange,
}: Props) {
  const [selected, setSelected] = useState<RetreatAttendee | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');
  const [localQuery, setLocalQuery] = useState('');

  const emailSet = useMemo(
    () => new Set(attendees.map((row) => row.email.trim().toLowerCase())),
    [attendees],
  );

  const importableApplications = useMemo(
    () => applications.filter((app) => !emailSet.has(app.email.trim().toLowerCase())),
    [applications, emailSet],
  );

  const filtered = useMemo(() => {
    const q = localQuery.trim().toLowerCase();
    const rows = !q
      ? attendees
      : attendees.filter((row) =>
          [row.full_name, row.email, row.phone, row.company, row.notes]
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(q),
        );

    return [...rows].sort((a, b) => {
      const rank = (row: RetreatAttendee) => {
        const status = getAttendeeStatus(row);
        if (status === 'checked_in') return 0;
        if (status === 'expected') return 1;
        return 2;
      };
      const diff = rank(a) - rank(b);
      if (diff !== 0) return diff;
      return a.full_name.localeCompare(b.full_name);
    });
  }, [attendees, localQuery]);

  const counts = useMemo(() => {
    let expected = 0;
    let checkedIn = 0;
    let fully = 0;
    for (const row of attendees) {
      const status = getAttendeeStatus(row);
      if (status === 'fully_checked_in') fully += 1;
      else if (status === 'checked_in') checkedIn += 1;
      else expected += 1;
    }
    return { expected, checkedIn, fully };
  }, [attendees]);

  async function handleAdd(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError('');

    const { data, error } = await supabase
      .from('retreat_attendees')
      .insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        company: company.trim() || null,
        notes: notes.trim() || null,
      })
      .select('*')
      .single();

    setSaving(false);

    if (error) {
      setFormError(error.message.includes('retreat_attendees_email_lower_idx')
        ? 'That email is already on the attendee list.'
        : error.message);
      return;
    }

    onAttendeesChange([data as RetreatAttendee, ...attendees]);
    setFullName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setNotes('');
    setShowAdd(false);
  }

  async function importApplication(app: RetreatApplication) {
    setBusyId(app.id);
    setFormError('');

    const { data, error } = await supabase
      .from('retreat_attendees')
      .insert({
        full_name: app.full_name,
        email: app.email,
        phone: app.phone || null,
        company: app.company_website || null,
        application_id: app.id,
        notes: app.success_outcome || app.bottleneck || null,
      })
      .select('*')
      .single();

    setBusyId(null);

    if (error) {
      setFormError(error.message);
      return;
    }

    onAttendeesChange([data as RetreatAttendee, ...attendees]);
  }

  async function patchAttendee(id: string, patch: Partial<RetreatAttendee>) {
    setBusyId(id);
    setFormError('');

    const { data, error } = await supabase
      .from('retreat_attendees')
      .update(patch)
      .eq('id', id)
      .select('*')
      .single();

    setBusyId(null);

    if (error) {
      setFormError(error.message);
      return;
    }

    const next = data as RetreatAttendee;
    onAttendeesChange(attendees.map((row) => (row.id === id ? next : row)));
    if (selected?.id === id) setSelected(next);
  }

  async function removeAttendee(id: string) {
    if (!confirm('Remove this person from the attendee roster?')) return;
    setBusyId(id);
    const { error } = await supabase.from('retreat_attendees').delete().eq('id', id);
    setBusyId(null);
    if (error) {
      setFormError(error.message);
      return;
    }
    onAttendeesChange(attendees.filter((row) => row.id !== id));
    setSelected(null);
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
          <p className="text-white/45 text-xs font-body uppercase tracking-wider">Expected</p>
          <p className="text-xl font-heading italic text-white mt-1">{counts.expected}</p>
        </div>
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 px-4 py-3">
          <p className="text-amber-100/70 text-xs font-body uppercase tracking-wider">Needs form</p>
          <p className="text-xl font-heading italic text-amber-100 mt-1">{counts.checkedIn}</p>
        </div>
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3">
          <p className="text-emerald-200/70 text-xs font-body uppercase tracking-wider">Fully in</p>
          <p className="text-xl font-heading italic text-emerald-200 mt-1">{counts.fully}</p>
        </div>
      </div>

      <input
        type="search"
        placeholder="Search attendees…"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
      />

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAdd((value) => !value)}
          className="rounded-full border border-white/15 bg-white text-black hover:bg-white/90 px-4 py-2 text-sm font-body font-medium transition-colors"
        >
          {showAdd ? 'Cancel' : 'Add attendee'}
        </button>
        <a
          href="/check-in"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-body text-white/85 transition-colors"
        >
          Open check-in page
        </a>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-body text-white/85 transition-colors"
        >
          Refresh
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 grid gap-3 sm:grid-cols-2"
        >
          <div className="sm:col-span-2">
            <p className="text-white font-heading italic text-lg">Add confirmed attendee</p>
            <p className="text-white/50 font-body text-xs mt-1">
              Only people on this list can check in at the event.
            </p>
          </div>
          <input
            required
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <input
            placeholder="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <input
            placeholder="Notes (ask, cabin, etc.)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="sm:col-span-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-2 rounded-full bg-white text-black hover:bg-white/90 disabled:opacity-60 px-5 py-3 text-sm font-medium"
          >
            {saving ? 'Saving…' : 'Save attendee'}
          </button>
        </form>
      )}

      {importableApplications.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-white/80 font-body text-sm mb-3">
            Promote from applications ({importableApplications.length} not on roster)
          </p>
          <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
            {importableApplications.slice(0, 12).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-body truncate">{app.full_name}</p>
                  <p className="text-white/50 text-xs font-body truncate">{app.email}</p>
                </div>
                <button
                  type="button"
                  disabled={busyId === app.id}
                  onClick={() => importApplication(app)}
                  className="shrink-0 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-body text-white/85 disabled:opacity-50"
                >
                  {busyId === app.id ? 'Adding…' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {formError && (
        <p className="text-red-400/90 text-sm font-body rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          {formError}
        </p>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {dataLoading ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">Loading attendees…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">
            No attendees on the roster yet. Add confirmed guests above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="border-b border-white/10 text-white/45 text-xs uppercase tracking-wider font-body">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Checked in</th>
                  <th className="px-4 py-3 font-medium">Form</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/[0.04]">
                    <td className="px-4 py-3 text-sm text-white font-body">
                      <button type="button" onClick={() => setSelected(row)} className="text-left hover:underline">
                        {row.full_name}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/75 font-body">{row.email}</td>
                    <td className="px-4 py-3">
                      <StatusPill attendee={row} />
                    </td>
                    <td className="px-4 py-3 text-sm text-white/55 font-body whitespace-nowrap">
                      {row.checked_in_at ? formatDate(row.checked_in_at) : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/55 font-body whitespace-nowrap">
                      {row.form_completed_at ? formatDate(row.form_completed_at) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {!row.checked_in_at ? (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => patchAttendee(row.id, { checked_in_at: new Date().toISOString() })}
                            className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-body text-white/85 disabled:opacity-50"
                          >
                            Check in
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() => patchAttendee(row.id, { checked_in_at: null })}
                            className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-body text-white/55 disabled:opacity-50"
                          >
                            Undo check-in
                          </button>
                        )}
                        {!row.form_completed_at && (
                          <button
                            type="button"
                            disabled={busyId === row.id}
                            onClick={() =>
                              patchAttendee(row.id, {
                                form_completed_at: new Date().toISOString(),
                                checked_in_at: row.checked_in_at ?? new Date().toISOString(),
                              })
                            }
                            className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-body text-white/85 disabled:opacity-50"
                          >
                            Mark form done
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
          <button
            type="button"
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            aria-label="Close details"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full sm:max-w-lg max-h-[90svh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-white/10 bg-black/95 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-white/50 text-xs font-body uppercase tracking-widest mb-1">Attendee</p>
                <h2 className="text-2xl font-heading italic text-white">{selected.full_name}</h2>
                <div className="mt-3">
                  <StatusPill attendee={selected} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 hover:bg-white/10 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <dl className="space-y-4 text-sm font-body">
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Email</dt>
                <dd className="text-white/90">{selected.email}</dd>
              </div>
              {selected.phone && (
                <div>
                  <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Phone</dt>
                  <dd className="text-white/90">{selected.phone}</dd>
                </div>
              )}
              {selected.company && (
                <div>
                  <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Company</dt>
                  <dd className="text-white/90">{selected.company}</dd>
                </div>
              )}
              {selected.notes && (
                <div>
                  <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Notes</dt>
                  <dd className="text-white/90 whitespace-pre-wrap">{selected.notes}</dd>
                </div>
              )}
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Checked in</dt>
                <dd className="text-white/90">{selected.checked_in_at ? formatDate(selected.checked_in_at) : 'Not yet'}</dd>
              </div>
              <div>
                <dt className="text-white/40 text-xs uppercase tracking-wider mb-1">Form completed</dt>
                <dd className="text-white/90">
                  {selected.form_completed_at ? formatDate(selected.form_completed_at) : 'Not yet'}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <a
                href={`/waiver?email=${encodeURIComponent(selected.email)}&from=checkin`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-body text-white/85"
              >
                Open waiver form
              </a>
              <button
                type="button"
                disabled={busyId === selected.id}
                onClick={() => removeAttendee(selected.id)}
                className="rounded-full border border-red-400/30 bg-red-400/10 hover:bg-red-400/15 px-4 py-2 text-sm font-body text-red-200 disabled:opacity-50"
              >
                Remove from roster
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
