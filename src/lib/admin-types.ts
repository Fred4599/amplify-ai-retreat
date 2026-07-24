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

export type RetreatAttendee = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  bio: string | null;
  avatar_url: string | null;
  notes: string | null;
  application_id: string | null;
  user_id: string | null;
  checked_in_at: string | null;
  form_completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AttendeeStatus = 'expected' | 'checked_in' | 'fully_checked_in';

export function getAttendeeStatus(row: {
  checked_in_at: string | null;
  form_completed_at: string | null;
}): AttendeeStatus {
  if (row.checked_in_at && row.form_completed_at) return 'fully_checked_in';
  if (row.checked_in_at) return 'checked_in';
  return 'expected';
}

export const ATTENDEE_STATUS_LABEL: Record<AttendeeStatus, string> = {
  expected: 'Expected',
  checked_in: 'Checked in — needs form',
  fully_checked_in: 'Fully checked in',
};

export type AdminQuestion = {
  id: string;
  attendee_id: string;
  body: string;
  answered_at: string | null;
  created_at: string;
  attendee_name: string;
  attendee_email: string | null;
  attendee_company: string | null;
};

export type AdminTab = 'attendees' | 'questions' | 'applications' | 'webinar' | 'waivers';
