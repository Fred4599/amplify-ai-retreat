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

export type ParticipantWaiver = {
  id: string;
  legal_name: string;
  preferred_name: string | null;
  email: string;
  phone: string;
  street_address: string;
  city_state_zip: string;
  initials_risk: string;
  initials_media: string;
  initials_collaboration: string;
  signature_name: string;
  printed_legal_name: string;
  signed_at: string;
  emergency_name: string;
  emergency_relationship: string;
  emergency_phone: string;
  emergency_phone_alt: string | null;
  medical_note: string | null;
  agreement_version: string;
  agreed_full: boolean;
  created_at: string;
};

export type AdminTab = 'applications' | 'webinar' | 'waivers';
