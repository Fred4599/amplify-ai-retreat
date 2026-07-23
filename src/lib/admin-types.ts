export type RetreatApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  company_website: string | null;
  annual_sales: string | null;
  employee_count: string | null;
  business_description: string | null;
  bottleneck: string | null;
  ai_usage: string | null;
  success_outcome: string | null;
  source: string | null;
  submitted_at: string;
  created_at: string;
};

export type WebinarRegistration = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  submitted_at: string;
  created_at: string;
};

export type AdminTab = 'applications' | 'webinar';
