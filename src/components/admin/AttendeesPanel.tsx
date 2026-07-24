import { useMemo, useState, type FormEvent } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  ATTENDEE_STATUS_LABEL,
  getAttendeeStatus,
  type AttendeeStatus,
  type RetreatApplication,
  type RetreatAttendee,
} from '../../lib/admin-types';

type TriFilter = 'all' | 'yes' | 'no';
type StatusFilter = 'all' | AttendeeStatus;

const filterInputClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30';
const filterSelectClass =
  'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white font-body text-sm focus:outline-none focus:border-white/30';

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

function StatusCell({ attendee }: { attendee: RetreatAttendee }) {
  const status = getAttendeeStatus(attendee);
  const label = ATTENDEE_STATUS_LABEL[status];

  if (status === 'expected') {
    return <span className="text-sm font-body text-white/55">{label}</span>;
  }

  const styles =
    status === 'fully_checked_in'
      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
      : 'border-amber-400/30 bg-amber-400/10 text-amber-100';

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-body ${styles}`}>
      {label}
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
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [checkedInFilter, setCheckedInFilter] = useState<TriFilter>('all');
  const [formFilter, setFormFilter] = useState<TriFilter>('all');

  const emailSet = useMemo(
    () =>
      new Set(
        attendees
          .map((row) => row.email?.trim().toLowerCase())
          .filter((email): email is string => Boolean(email)),
      ),
    [attendees],
  );

  const importableApplications = useMemo(
    () =>
      applications.filter((app) => {
        const email = app.email?.trim().toLowerCase();
        return email ? !emailSet.has(email) : true;
      }),
    [applications, emailSet],
  );

  const filtersActive =
    Boolean(nameFilter.trim()) ||
    Boolean(emailFilter.trim()) ||
    statusFilter !== 'all' ||
    checkedInFilter !== 'all' ||
    formFilter !== 'all';

  const filtered = useMemo(() => {
    const nameQ = nameFilter.trim().toLowerCase();
    const emailQ = emailFilter.trim().toLowerCase();

    const rows = attendees.filter((row) => {
      if (nameQ && !row.full_name.toLowerCase().includes(nameQ)) return false;
      if (emailQ && !(row.email || '').toLowerCase().includes(emailQ)) return false;

      const status = getAttendeeStatus(row);
      if (statusFilter !== 'all' && status !== statusFilter) return false;

      if (checkedInFilter === 'yes' && !row.checked_in_at) return false;
      if (checkedInFilter === 'no' && row.checked_in_at) return false;

      if (formFilter === 'yes' && !row.form_completed_at) return false;
      if (formFilter === 'no' && row.form_completed_at) return false;

      return true;
    });

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
  }, [attendees, nameFilter, emailFilter, statusFilter, checkedInFilter, formFilter]);

  function clearFilters() {
    setNameFilter('');
    setEmailFilter('');
    setStatusFilter('all');
    setCheckedInFilter('all');
    setFormFilter('all');
  }

  function setStatusFromCount(status: StatusFilter) {
    setStatusFilter((current) => (current === status ? 'all' : status));
  }

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
        email: email.trim() || null,
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
        <button
          type="button"
          onClick={() => setStatusFromCount('expected')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            statusFilter === 'expected'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/45 text-xs font-body uppercase tracking-wider">Expected</p>
          <p className="text-xl font-heading italic text-white mt-1">{counts.expected}</p>
        </button>
        <button
          type="button"
          onClick={() => setStatusFromCount('checked_in')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            statusFilter === 'checked_in'
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10'
          }`}
        >
          <p className="text-amber-100/70 text-xs font-body uppercase tracking-wider">Needs form</p>
          <p className="text-xl font-heading italic text-amber-100 mt-1">{counts.checkedIn}</p>
        </button>
        <button
          type="button"
          onClick={() => setStatusFromCount('fully_checked_in')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            statusFilter === 'fully_checked_in'
              ? 'border-emerald-400/40 bg-emerald-400/10'
              : 'border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10'
          }`}
        >
          <p className="text-emerald-200/70 text-xs font-body uppercase tracking-wider">Fully in</p>
          <p className="text-xl font-heading italic text-emerald-200 mt-1">{counts.fully}</p>
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-white/50 text-xs font-body uppercase tracking-wider">Filters</p>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-body text-white/60 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label htmlFor="filter-name" className="block text-white/45 text-xs font-body mb-1.5">
              Name
            </label>
            <input
              id="filter-name"
              type="search"
              placeholder="Filter by name"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className={filterInputClass}
            />
          </div>
          <div>
            <label htmlFor="filter-email" className="block text-white/45 text-xs font-body mb-1.5">
              Email
            </label>
            <input
              id="filter-email"
              type="search"
              placeholder="Filter by email"
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className={filterInputClass}
            />
          </div>
          <div>
            <label htmlFor="filter-status" className="block text-white/45 text-xs font-body mb-1.5">
              Status
            </label>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={filterSelectClass}
            >
              <option value="all">All statuses</option>
              <option value="expected">Expected</option>
              <option value="checked_in">Checked in — needs form</option>
              <option value="fully_checked_in">Fully checked in</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-checked-in" className="block text-white/45 text-xs font-body mb-1.5">
              Checked in
            </label>
            <select
              id="filter-checked-in"
              value={checkedInFilter}
              onChange={(e) => setCheckedInFilter(e.target.value as TriFilter)}
              className={filterSelectClass}
            >
              <option value="all">All</option>
              <option value="yes">Checked in</option>
              <option value="no">Not checked in</option>
            </select>
          </div>
          <div>
            <label htmlFor="filter-form" className="block text-white/45 text-xs font-body mb-1.5">
              Form
            </label>
            <select
              id="filter-form"
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value as TriFilter)}
              className={filterSelectClass}
            >
              <option value="all">All</option>
              <option value="yes">Form done</option>
              <option value="no">Form missing</option>
            </select>
          </div>
        </div>
        <p className="text-white/40 font-body text-xs">
          Showing {filtered.length} of {attendees.length}
          {dataLoading ? ' · Updating…' : ' · Auto-refreshes every 60s'}
        </p>
      </div>

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
          Refresh now
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
            type="email"
            placeholder="Email (optional)"
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
        {dataLoading && attendees.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">Loading attendees…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">
            {attendees.length === 0
              ? 'No attendees on the roster yet. Add confirmed guests above.'
              : 'No attendees match these filters.'}
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
                    <td className="px-4 py-3 text-sm text-white/75 font-body">{row.email || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusCell attendee={row} />
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
                  <StatusCell attendee={selected} />
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
                <dd className="text-white/90">{selected.email || 'No email on file'}</dd>
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
              {selected.email ? (
                <a
                  href={`/waiver?email=${encodeURIComponent(selected.email)}&from=checkin`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-body text-white/85"
                >
                  Open waiver form
                </a>
              ) : (
                <a
                  href="/waiver"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-sm font-body text-white/85"
                >
                  Open blank waiver
                </a>
              )}
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
