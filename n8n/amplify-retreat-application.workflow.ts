import {
  workflow,
  trigger,
  node,
  expr,
  newCredential,
} from '@n8n/workflow-sdk';

const applicationWebhook = trigger({
  type: 'n8n-nodes-base.webhook',
  version: 2.1,
  config: {
    name: 'Application Webhook',
    parameters: {
      httpMethod: 'POST',
      path: 'amplify-retreat-application',
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
        companyWebsite: 'Acme Co — acme.com',
        businessDescription: 'We build SaaS for contractors.',
        bottleneck: 'Lead follow-up takes too long.',
        aiUsage: 'Experimenting a little',
        successOutcome: 'A working AI follow-up workflow.',
        submittedAt: '2026-05-28T00:00:00.000Z',
      },
    },
  ],
});

const formatApplication = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Format Application',
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
            id: 'companyWebsite',
            name: 'companyWebsite',
            value: expr('{{ $json.body?.companyWebsite ?? $json.companyWebsite ?? "" }}'),
            type: 'string',
          },
          {
            id: 'businessDescription',
            name: 'businessDescription',
            value: expr(
              '{{ $json.body?.businessDescription ?? $json.businessDescription ?? "" }}',
            ),
            type: 'string',
          },
          {
            id: 'bottleneck',
            name: 'bottleneck',
            value: expr('{{ $json.body?.bottleneck ?? $json.bottleneck ?? "" }}'),
            type: 'string',
          },
          {
            id: 'aiUsage',
            name: 'aiUsage',
            value: expr('{{ $json.body?.aiUsage ?? $json.aiUsage ?? "" }}'),
            type: 'string',
          },
          {
            id: 'successOutcome',
            name: 'successOutcome',
            value: expr('{{ $json.body?.successOutcome ?? $json.successOutcome ?? "" }}'),
            type: 'string',
          },
          {
            id: 'submittedAt',
            name: 'submittedAt',
            value: expr('{{ $json.body?.submittedAt ?? $json.submittedAt ?? "" }}'),
            type: 'string',
          },
          {
            id: 'emailSubject',
            name: 'emailSubject',
            value: expr(
              '{{ "New Amplify AI Retreat Application — " + ($json.body?.fullName ?? $json.fullName ?? "Unknown") }}',
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
      companyWebsite: 'Acme Co — acme.com',
      businessDescription: 'We build SaaS for contractors.',
      bottleneck: 'Lead follow-up takes too long.',
      aiUsage: 'Experimenting a little',
      successOutcome: 'A working AI follow-up workflow.',
      submittedAt: '2026-05-28T00:00:00.000Z',
      emailSubject: 'New Amplify AI Retreat Application — Jane Doe',
    },
  ],
});

const sendApplicationEmail = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: {
    name: 'Send Application Email',
    parameters: {
      resource: 'message',
      operation: 'send',
      sendTo: 'braydon@selfconstructconsulting.com',
      subject: expr('{{ $json.emailSubject }}'),
      emailType: 'html',
      message: expr(
        '{{ "<div style=\\"font-family: Barlow, Arial, sans-serif; color:#111; line-height:1.6; max-width:640px;\\">" + "<h2 style=\\"margin:0 0 20px; font-style:italic;\\">Amplify AI Retreat Application</h2>" + "<p style=\\"margin:0 0 16px; color:#444;\\"><strong>Submitted:</strong> " + ($json.submittedAt || "—") + "</p>" + "<p><strong>Full Name:</strong><br>" + ($json.fullName || "—") + "</p>" + "<p><strong>Email:</strong><br><a href=\\"mailto:" + ($json.email || "") + "\\">" + ($json.email || "—") + "</a></p>" + "<p><strong>Phone:</strong><br>" + ($json.phone || "—") + "</p>" + "<p><strong>Company + Website:</strong><br>" + ($json.companyWebsite || "—") + "</p>" + "<p><strong>Business:</strong><br>" + ($json.businessDescription || "—").replace(/\\n/g, "<br>") + "</p>" + "<p><strong>Biggest Bottleneck:</strong><br>" + ($json.bottleneck || "—").replace(/\\n/g, "<br>") + "</p>" + "<p><strong>Current AI Usage:</strong><br>" + ($json.aiUsage || "—") + "</p>" + "<p><strong>Success Outcome:</strong><br>" + ($json.successOutcome || "—").replace(/\\n/g, "<br>") + "</p>" + "</div>" }}',
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
  'amplify-retreat-application',
  'Amplify AI Retreat — Application Email',
)
  .add(applicationWebhook)
  .to(formatApplication)
  .to(sendApplicationEmail)
  .to(respondSuccess);
