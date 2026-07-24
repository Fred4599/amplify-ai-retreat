import { completeAttendeeForm } from './check-in';
import { getSupabaseBrowserClient } from './supabase';

type DestinationResult = { ok: true } | { ok: false; error: string };

async function postWebhook(webhook: string, payload: Record<string, unknown>): Promise<DestinationResult> {
  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: 'Webhook submission failed' };
    return { ok: true };
  } catch {
    return { ok: false, error: 'Webhook submission failed' };
  }
}

export async function submitRetreatApplication(input: {
  webhook: string;
  payload: {
    fullName: string;
    email: string;
    phone: string;
    companyWebsite: string;
    annualSales: string;
    employeeCount: string;
    businessDescription: string;
    bottleneck: string;
    aiUsage: string;
    successOutcome: string;
    source: string;
    submittedAt: string;
  };
}): Promise<DestinationResult> {
  const { webhook, payload } = input;
  const supabase = getSupabaseBrowserClient();
  const destinations: Promise<DestinationResult>[] = [];

  if (supabase) {
    destinations.push(
      (async () => {
        const { error } = await supabase.from('retreat_applications').insert({
          full_name: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          company_website: payload.companyWebsite,
          annual_sales: payload.annualSales,
          employee_count: payload.employeeCount,
          business_description: payload.businessDescription,
          bottleneck: payload.bottleneck,
          ai_usage: payload.aiUsage,
          success_outcome: payload.successOutcome,
          source: payload.source,
          submitted_at: payload.submittedAt,
        });
        if (error) return { ok: false as const, error: error.message };
        return { ok: true as const };
      })(),
    );
  }

  if (webhook) {
    destinations.push(postWebhook(webhook, payload));
  }

  if (destinations.length === 0) {
    return { ok: false, error: 'Application form is not configured yet. Please try again later.' };
  }

  const results = await Promise.all(destinations);
  const failed = results.find((result) => !result.ok);
  return failed ?? { ok: true };
}

export async function submitWebinarRegistration(input: {
  webhook: string;
  payload: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    submittedAt: string;
  };
}): Promise<DestinationResult> {
  const { webhook, payload } = input;
  const supabase = getSupabaseBrowserClient();
  const destinations: Promise<DestinationResult>[] = [];

  if (supabase) {
    destinations.push(
      (async () => {
        const { error } = await supabase.from('webinar_registrations').insert({
          full_name: payload.fullName,
          email: payload.email,
          phone: payload.phone || null,
          company: payload.company || null,
          submitted_at: payload.submittedAt,
        });
        if (error) return { ok: false as const, error: error.message };
        return { ok: true as const };
      })(),
    );
  }

  if (webhook) {
    destinations.push(postWebhook(webhook, payload));
  }

  if (destinations.length === 0) {
    return { ok: false, error: 'Registration is not configured yet. Please try again later.' };
  }

  const results = await Promise.all(destinations);
  const failed = results.find((result) => !result.ok);
  return failed ?? { ok: true };
}

export async function submitParticipantWaiver(input: {
  payload: {
    legalName: string;
    preferredName: string;
    email: string;
    phone: string;
    streetAddress: string;
    cityStateZip: string;
    initialsRisk: string;
    initialsMedia: string;
    initialsCollaboration: string;
    signatureName: string;
    printedLegalName: string;
    signedAt: string;
    emergencyName: string;
    emergencyRelationship: string;
    emergencyPhone: string;
    emergencyPhoneAlt: string;
    medicalNote: string;
    agreementVersion: string;
    agreedFull: boolean;
  };
}): Promise<DestinationResult> {
  const { payload } = input;
  const supabase = getSupabaseBrowserClient();

  if (!supabase) {
    return { ok: false, error: 'Waiver form is not configured yet. Please try again later.' };
  }

  const { error } = await supabase.from('participant_waivers').insert({
    legal_name: payload.legalName,
    preferred_name: payload.preferredName || null,
    email: payload.email,
    phone: payload.phone,
    street_address: payload.streetAddress,
    city_state_zip: payload.cityStateZip,
    initials_risk: payload.initialsRisk,
    initials_media: payload.initialsMedia,
    initials_collaboration: payload.initialsCollaboration,
    signature_name: payload.signatureName,
    printed_legal_name: payload.printedLegalName,
    signed_at: payload.signedAt,
    emergency_name: payload.emergencyName,
    emergency_relationship: payload.emergencyRelationship,
    emergency_phone: payload.emergencyPhone,
    emergency_phone_alt: payload.emergencyPhoneAlt || null,
    medical_note: payload.medicalNote || null,
    agreement_version: payload.agreementVersion,
    agreed_full: payload.agreedFull,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });

  if (error) return { ok: false, error: error.message };

  // Mark roster form complete when this email matches a retreat attendee
  await completeAttendeeForm(payload.email);

  return { ok: true };
}
