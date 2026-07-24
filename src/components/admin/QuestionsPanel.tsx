import { useMemo, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminQuestion } from '../../lib/admin-types';

type AnsweredFilter = 'all' | 'open' | 'answered';

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

type Props = {
  supabase: SupabaseClient;
  questions: AdminQuestion[];
  dataLoading: boolean;
  onRefresh: () => void;
  onQuestionsChange: (rows: AdminQuestion[]) => void;
};

export default function QuestionsPanel({
  supabase,
  questions,
  dataLoading,
  onRefresh,
  onQuestionsChange,
}: Props) {
  const [query, setQuery] = useState('');
  const [answeredFilter, setAnsweredFilter] = useState<AnsweredFilter>('open');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const counts = useMemo(() => {
    let open = 0;
    let answered = 0;
    for (const row of questions) {
      if (row.answered_at) answered += 1;
      else open += 1;
    }
    return { open, answered, total: questions.length };
  }, [questions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questions
      .filter((row) => {
        if (answeredFilter === 'open' && row.answered_at) return false;
        if (answeredFilter === 'answered' && !row.answered_at) return false;
        if (!q) return true;
        return [row.body, row.attendee_name, row.attendee_email, row.attendee_company]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => {
        if (!!a.answered_at !== !!b.answered_at) return a.answered_at ? 1 : -1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [questions, query, answeredFilter]);

  async function setAnswered(row: AdminQuestion, answered: boolean) {
    setBusyId(row.id);
    setError('');

    const { data, error: updateError } = await supabase
      .from('attendee_questions')
      .update({ answered_at: answered ? new Date().toISOString() : null })
      .eq('id', row.id)
      .select('id, answered_at')
      .single();

    setBusyId(null);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    onQuestionsChange(
      questions.map((item) =>
        item.id === row.id ? { ...item, answered_at: data.answered_at } : item,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => setAnsweredFilter('open')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            answeredFilter === 'open'
              ? 'border-amber-400/40 bg-amber-400/10'
              : 'border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10'
          }`}
        >
          <p className="text-amber-100/70 text-xs font-body uppercase tracking-wider">Open</p>
          <p className="text-xl font-heading italic text-amber-100 mt-1">{counts.open}</p>
        </button>
        <button
          type="button"
          onClick={() => setAnsweredFilter('answered')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            answeredFilter === 'answered'
              ? 'border-emerald-400/40 bg-emerald-400/10'
              : 'border-emerald-400/20 bg-emerald-400/5 hover:bg-emerald-400/10'
          }`}
        >
          <p className="text-emerald-200/70 text-xs font-body uppercase tracking-wider">Answered</p>
          <p className="text-xl font-heading italic text-emerald-200 mt-1">{counts.answered}</p>
        </button>
        <button
          type="button"
          onClick={() => setAnsweredFilter('all')}
          className={`rounded-2xl border px-4 py-3 text-left transition-colors ${
            answeredFilter === 'all'
              ? 'border-white/30 bg-white/10'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.07]'
          }`}
        >
          <p className="text-white/45 text-xs font-body uppercase tracking-wider">All</p>
          <p className="text-xl font-heading italic text-white mt-1">{counts.total}</p>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="search"
          placeholder="Search questions, name, email…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 font-body text-sm focus:outline-none focus:border-white/30"
        />
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-3 text-sm font-body text-white/80 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-red-400/90 text-sm font-body rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-3xl border border-white/10 bg-white/[0.04] overflow-hidden">
        {dataLoading && questions.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">Loading questions…</p>
        ) : filtered.length === 0 ? (
          <p className="p-8 text-center text-white/50 font-body text-sm">
            {questions.length === 0 ? 'No questions submitted yet.' : 'No questions match these filters.'}
          </p>
        ) : (
          <ul className="divide-y divide-white/5">
            {filtered.map((row) => {
              const isAnswered = Boolean(row.answered_at);
              return (
                <li key={row.id} className="px-4 py-4 sm:px-5">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {isAnswered ? (
                          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-xs font-body text-emerald-200">
                            Answered
                          </span>
                        ) : (
                          <span className="text-sm font-body text-amber-100/90">Open</span>
                        )}
                        <span className="text-white/40 font-body text-xs">{formatDate(row.created_at)}</span>
                      </div>
                      <p className="text-white font-body text-sm leading-relaxed whitespace-pre-wrap">
                        {row.body}
                      </p>
                      <p className="text-white/55 font-body text-xs">
                        {[row.attendee_name, row.attendee_company, row.attendee_email]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>
                    <div className="shrink-0 flex flex-wrap gap-2">
                      {isAnswered ? (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => setAnswered(row, false)}
                          className="rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-body text-white/75 disabled:opacity-50"
                        >
                          {busyId === row.id ? 'Updating…' : 'Mark open'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          onClick={() => setAnswered(row, true)}
                          className="rounded-full border border-emerald-400/30 bg-emerald-400/10 hover:bg-emerald-400/15 px-3 py-1.5 text-xs font-body text-emerald-100 disabled:opacity-50"
                        >
                          {busyId === row.id ? 'Updating…' : 'Mark answered'}
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
