/** Curated from https://amplifyai.dev — Amplify AI client wins & case studies. */
export type CaseStudyCategory =
  | 'Finance & Law'
  | 'Business Services'
  | 'E-commerce & Operations'
  | 'HR & Administrative'
  | 'Construction & Services'
  | 'Healthcare & Specialty'
  | 'Marketing Agencies';

export type CaseStudy = {
  category: CaseStudyCategory;
  title: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  impact: string;
};

export const PROOF_STATS = [
  { value: '30+', label: 'Businesses implemented' },
  { value: '40%', label: 'Dead contacts recovered (VC)' },
  { value: '25+', label: 'Hours saved per week (peak)' },
  { value: '8', label: 'Industry categories' },
] as const;

export const CASE_STUDIES: CaseStudy[] = [
  {
    category: 'Finance & Law',
    title: 'Venture Capital Firm',
    metric: '40%',
    metricLabel: 'contacts recovered',
    challenge: 'Recovering value from dead lists of contacts.',
    solution:
      'Lead list enrichment platform with multi-step verification and cross-platform searching.',
    impact: 'Recovered 40% of previously unusable contacts, enabling a high-value acquisition.',
  },
  {
    category: 'E-commerce & Operations',
    title: 'E-commerce Operations',
    metric: '10+',
    metricLabel: 'hrs/week saved',
    challenge: 'Inefficient product and SKU inventory across spreadsheets and Shopify.',
    solution: 'Streamlined inventory management automation across disparate systems.',
    impact: 'Saved operations teams over 10 hours per week on inventory reconciliation.',
  },
  {
    category: 'HR & Administrative',
    title: 'Enterprise HR Department',
    metric: '20+',
    metricLabel: 'hrs/week saved',
    challenge: 'High volume of manual application screening.',
    solution: 'Custom-trained AI agent for application submission and initial screening.',
    impact: 'Saved the HR team over 20 hours per week in manual review time.',
  },
  {
    category: 'Construction & Services',
    title: 'Residential Contractors',
    metric: '1 hr',
    metricLabel: 'faster per quote',
    challenge: 'Slow in-field quoting and back-office bottlenecks.',
    solution: 'Custom configure-price-quote tool for faster, accurate in-field estimates.',
    impact:
      '1 hour faster per rep in the field; back-office agents saved 5 hours per transaction.',
  },
  {
    category: 'Healthcare & Specialty',
    title: 'Healthcare Practice',
    metric: 'Secure',
    metricLabel: 'client portal',
    challenge:
      'Needed a secure, unified platform for physician and client information plus feedback.',
    solution:
      'Built a bespoke secure portal with dedicated physician/client access and integrated feedback.',
    impact: 'Improved physician collaboration, client experience, and brand perception.',
  },
  {
    category: 'Business Services',
    title: 'Recruiting Agencies',
    metric: 'Auto',
    metricLabel: 'BD pipeline',
    challenge: 'Building and scaling new client acquisition funnels.',
    solution:
      'Automated system that scrapes job postings, identifies companies, and starts drip campaigns.',
    impact: 'Created a repeatable outbound pipeline for new client acquisition.',
  },
  {
    category: 'Marketing Agencies',
    title: 'Marketing Agencies',
    metric: 'End-to-end',
    metricLabel: 'outbound support',
    challenge: 'Needed reliable support for lead generation and outbound execution.',
    solution:
      'Delivered targeted lead list generation and automated outbound email sequence execution.',
    impact: 'Improved campaign throughput with consistent outbound operations support.',
  },
  {
    category: 'Finance & Law',
    title: 'Financial Advisors',
    metric: '10+',
    metricLabel: 'hrs/week saved',
    challenge: 'Time-intensive manual case creation in Salesforce after client calls.',
    solution:
      'Automated post-call workflows via email and Slack agents, with human-in-the-loop validation.',
    impact: 'Reduced case creation time by over 10 hours per advisor per week.',
  },
  {
    category: 'HR & Administrative',
    title: 'Automotive Repair Shop',
    metric: '25+',
    metricLabel: 'hrs/week saved',
    challenge: 'Repetitive customer inquiries consuming owner and staff time.',
    solution:
      'Custom SMS/iMessage AI agent mirroring the owner’s style for FAQs, lookups, and records.',
    impact: 'Reduced administrative burden by over 25 hours per week.',
  },
];

export const AMPLIFY_CASE_STUDIES_URL = 'https://amplifyai.dev/#work';
