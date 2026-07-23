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
