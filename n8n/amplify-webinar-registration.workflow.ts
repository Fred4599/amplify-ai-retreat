import {
  workflow,
  trigger,
  node,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const GHL_WEBINAR_WEBHOOK_URL =
  'https://services.leadconnectorhq.com/hooks/v5lGksarcLOTF0GAk4gk/webhook-trigger/c7523212-73ee-41b7-864a-c29060049c54';

const webinarWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Webinar Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'amplify-webinar-registration',
      authentication: 'none',
      responseMode: 'responseNode',
      options: {
        allowedOrigins: '*',
      },
    },
  },
  output: [
    {
      body: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phone: '555-123-4567',
        company: 'Acme Co',
        submittedAt: '2026-06-12T00:00:00.000Z',
      },
    },
  ],
});

const formatRegistration = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Format Registration',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          {
            id: 'fullName',
            name: 'fullName',
            value: expr('{{ $json.body?.fullName ?? $json.fullName ?? "" }}'),
            type: 'string',
          },
          {
            id: 'email',
            name: 'email',
            value: expr('{{ $json.body?.email ?? $json.email ?? "" }}'),
            type: 'string',
          },
          {
            id: 'phone',
            name: 'phone',
            value: expr('{{ $json.body?.phone ?? $json.phone ?? "" }}'),
            type: 'string',
          },
          {
            id: 'company',
            name: 'company',
            value: expr('{{ $json.body?.company ?? $json.company ?? "" }}'),
            type: 'string',
          },
          {
            id: 'submittedAt',
            name: 'submittedAt',
            value: expr('{{ $json.body?.submittedAt ?? $json.submittedAt ?? "" }}'),
            type: 'string',
          },
          {
            id: 'firstName',
            name: 'firstName',
            value: expr(
              '{{ ($json.body?.fullName ?? $json.fullName ?? "").trim().split(/\\s+/)[0] ?? "" }}',
            ),
            type: 'string',
          },
          {
            id: 'lastName',
            name: 'lastName',
            value: expr(
              '{{ ($json.body?.fullName ?? $json.fullName ?? "").trim().split(/\\s+/).slice(1).join(" ") ?? "" }}',
            ),
            type: 'string',
          },
          {
            id: 'source',
            name: 'source',
            value: 'Amplify AI — Webinar (July 20, 2026)',
            type: 'string',
          },
          {
            id: 'registrationNotes',
            name: 'registrationNotes',
            value: expr(
              '{{ "Webinar: The AI Advantage: Save Time, Cut Costs & Grow Revenue\\nDate: Monday, July 20, 2026 at 6:30 p.m. MT\\nCompany: " + ($json.body?.company ?? $json.company ?? "—") + "\\nSubmitted: " + ($json.body?.submittedAt ?? $json.submittedAt ?? "—") }}',
            ),
            type: 'string',
          },
          {
            id: 'emailSubject',
            name: 'emailSubject',
            value: expr(
              '{{ "New Webinar Registration — " + ($json.body?.fullName ?? $json.fullName ?? "Unknown") }}',
            ),
            type: 'string',
          },
        ],
      },
    },
  },
  output: [
    {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '555-123-4567',
      company: 'Acme Co',
      submittedAt: '2026-06-12T00:00:00.000Z',
      firstName: 'Jane',
      lastName: 'Doe',
      source: 'Amplify AI — Webinar (July 20, 2026)',
      registrationNotes: 'Webinar: The AI Advantage: Save Time, Cut Costs & Grow Revenue\nDate: Monday, July 20, 2026 at 6:30 p.m. MT\nCompany: Acme Co',
      emailSubject: 'New Webinar Registration — Jane Doe',
    },
  ],
});

const sendToGhl = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.4,
  config: {
    name: 'Send to GHL Webhook',
    parameters: {
      method: 'POST',
      url: GHL_WEBINAR_WEBHOOK_URL,
      sendHeaders: true,
      specifyHeaders: 'keypair',
      headerParameters: {
        parameters: [{ name: 'Content-Type', value: 'application/json' }],
      },
      sendBody: true,
      contentType: 'json',
      specifyBody: 'json',
      jsonBody: expr(
        '{{ { firstName: $json.firstName, lastName: $json.lastName, email: $json.email, phone: $json.phone, source: $json.source, company: $json.company, submittedAt: $json.submittedAt, registrationNotes: $json.registrationNotes } }}',
      ),
      options: {
        response: {
          response: {
            neverError: true,
          },
        },
      },
    },
    onError: 'continueRegularOutput',
  },
  output: [{ statusCode: 200 }],
});

const sendRegistrationEmail = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Registration Email',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo:
        'braydon@selfconstructconsulting.com, tony@keepelevated.com, billb@keepelevated.com',
      subject: expr('{{ $json.emailSubject }}'),
      emailType: 'html',
      message: expr(
        '{{ "<div style=\\"font-family: Barlow, Arial, sans-serif; color:#111; line-height:1.6; max-width:640px;\\">" + "<h2 style=\\"margin:0 0 20px; font-style:italic;\\">Webinar Registration — The AI Advantage</h2>" + "<p style=\\"margin:0 0 16px; color:#444;\\"><strong>Event:</strong> Monday, July 20, 2026 at 6:30 p.m. MT</p>" + "<p style=\\"margin:0 0 16px; color:#444;\\"><strong>Submitted:</strong> " + ($json.submittedAt || "—") + "</p>" + "<p><strong>Full Name:</strong><br>" + ($json.fullName || "—") + "</p>" + "<p><strong>Email:</strong><br><a href=\\"mailto:" + ($json.email || "") + "\\">" + ($json.email || "—") + "</a></p>" + "<p><strong>Phone:</strong><br>" + ($json.phone || "—") + "</p>" + "<p><strong>Company:</strong><br>" + ($json.company || "—") + "</p>" + "</div>" }}',
      ),
      options: {
        replyTo: expr('{{ $json.email }}'),
        appendAttribution: false,
      },
    },
    credentials: {
      gmailOAuth2: newCredential('Gmail account'),
    },
    onError: 'continueRegularOutput',
  },
  output: [{ id: 'msg123', threadId: 'thread123' }],
});

const respondSuccess = node({
  type: 'n8n-nodes-base.respondToWebhook',
  version: 1.5,
  config: {
    name: 'Respond Success',
    parameters: {
      respondWith: 'json',
      responseBody: expr('{{ { "success": true } }}'),
      options: {
        responseCode: 200,
        responseHeaders: {
          entries: [
            { name: 'Access-Control-Allow-Origin', value: '*' },
            { name: 'Access-Control-Allow-Methods', value: 'POST, OPTIONS' },
            { name: 'Access-Control-Allow-Headers', value: 'Content-Type' },
          ],
        },
      },
    },
  },
});

export default workflow(
  'amplify-webinar-registration',
  'Amplify AI — Webinar Registration (GHL + Email)',
)
  .add(webinarWebhook)
  .to(formatRegistration.to(sendRegistrationEmail).to(respondSuccess))
  .add(formatRegistration.to(sendToGhl));
