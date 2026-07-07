/** Attendee-facing retreat content — keep in sync with src/agenda/ PDFs. */

export const WELCOME_RECEPTION = {
  date: 'July 28, 2026',
  summary:
    'Join us the evening of July 28 for a welcome reception at The Hive — your first chance to meet the room.',
} as const;

export type ScheduleBlock = {
  period: string;
  sub?: string;
  items: string[];
};

export type RetreatDay = {
  day: number;
  date: string;
  title: string;
  tagline: string;
  blocks: ScheduleBlock[];
};

export const RETREAT_DAYS: RetreatDay[] = [
  {
    day: 1,
    date: 'Wed, July 29',
    title: 'Diagnose & Design',
    tagline: 'Get clear on your problem. Open curiosity. Build something real.',
    blocks: [
      {
        period: 'Morning',
        items: [
          'Welcome & connect — meet the cohort, name your problem',
          'Unlock curiosity — mindset for breakthroughs',
          'Brainstorm with AI — ideas into plans',
        ],
      },
      {
        period: 'Afternoon',
        items: [
          'Build your first AI tool — guided, hands-on',
          'Share wins & get unstuck — celebrate progress',
        ],
      },
      {
        period: 'Evening',
        sub: 'Off-site',
        items: [
          'Catered dinner — great food, real conversation',
          'Curiosity games — let loose in the spirit of curiosity',
        ],
      },
    ],
  },
  {
    day: 2,
    date: 'Thu, July 30',
    title: 'Build & Breakthrough',
    tagline: 'AI as your partner in the morning. AI as your employee in the afternoon.',
    blocks: [
      {
        period: 'Morning',
        sub: 'Partner',
        items: [
          'Progress check-in — wins from last night',
          'Collaborate with AI — work side-by-side',
          'Practice in the room — AI as work partner',
        ],
      },
      {
        period: 'Afternoon',
        sub: 'Employee',
        items: [
          'Train AI workflows — tasks on your behalf',
          'Business strategy — SOPs, make it stick',
          'Celebrate wins — toward your solution',
        ],
      },
      {
        period: 'Evening',
        sub: 'Off-site',
        items: ['Group dinner — relaxed, real connection'],
      },
    ],
  },
  {
    day: 3,
    date: 'Fri, July 31',
    title: 'Deploy & Connect',
    tagline: 'See what everyone built. Close the loop. Cap it with an adventure.',
    blocks: [
      {
        period: 'Morning',
        items: [
          'Show & Share — see what the room built',
          'AI agents — when systems work for you',
          'Send-off — wins + take-home playbook',
        ],
      },
      {
        period: 'Afternoon',
        sub: 'Off-site',
        items: ['River float — unplug and close it right'],
      },
      {
        period: 'Evening',
        items: ['On your own — head home or explore'],
      },
    ],
  },
];

export const RETREAT_OUTCOMES = [
  { value: 'A Solution', label: 'Progress on your real problem' },
  { value: 'Something Built', label: 'A tool or workflow you created' },
  { value: 'Skills That Stick', label: 'Partner today, employee tomorrow' },
  { value: 'People', label: '50 entrepreneurs worth knowing' },
  { value: 'Playbook', label: 'Tools and next steps' },
  { value: 'Experiences', label: 'Evenings you\'ll remember' },
] as const;

export const WHATS_INCLUDED = [
  'Daily breakfast & lunch',
  '3 days of working sessions',
  'Evening dinner & curiosity games',
  'Group dinner',
  'River float',
  'Take-home playbook',
  '3 expert guides in the room',
  'Optional open build time nightly',
] as const;

export const AGENDA_DOWNLOADS = {
  full: '/downloads/Amplify-AI-Retreat-Agenda.pdf',
  oneSheet: '/downloads/Amplify-AI-Retreat-What-to-Expect.pdf',
  oneSheetJetsAndCapital: '/downloads/Amplify-AI-Retreat-What-to-Expect-Jets-and-Capital.pdf',
} as const;
