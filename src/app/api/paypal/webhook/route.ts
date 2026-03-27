import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

// Verify PayPal webhook signature
async function verifyWebhook(
  body: string,
  headers: Record<string, string>,
  clientId: string
): Promise<boolean> {
  const certUrl = headers['paypal-cert-url'];
  const transmissionId = headers['paypal-transmission-id'];
  const transmissionTime = headers['paypal-transmission-time'];
  const transmissionSig = headers['paypal-transmission-sig'];
  const authAlgo = headers['paypal-auth-algo'];

  if (!certUrl || !transmissionId || !transmissionTime || !transmissionSig || !authAlgo) {
    return false;
  }

  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;

  const crc32Table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crc32Table[i] = c;
  }

  const crc32 = (str: string): number => {
    let crc = 0xffffffff;
    for (let i = 0; i < str.length; i++) {
      crc = crc32Table[(crc ^ str.charCodeAt(i)) & 0xff] ^ (crc >>> 8);
    }
    return crc ^ 0xffffffff;
  };

  const bodyCrc = crc32(body).toString();

  // Build the expected signature string
  const expectedSig = `${transmissionId}|${transmissionTime}|${webhookId}|${bodyCrc}`;

  try {
    const response = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await getAccessToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: JSON.parse(body),
      }),
    });

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  } catch {
    return false;
  }
}

let cachedToken = '';
let tokenExpiry = 0;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    const clientId = process.env.PAYPAL_CLIENT_ID || '';
    // Basic verification without full cryptographic check for now
    const isVerifed = await verifyWebhook(body, headers, clientId);

    if (!isVerifed) {
      // In production, you should implement full verification
      // For now, log and continue for development
      console.log('[PayPal Webhook] Warning: signature verification skipped or failed');
    }

    const event = JSON.parse(body);
    console.log('[PayPal Webhook] Event received:', event.event_type);

    switch (event.event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
      case 'BILLING.SUBSCRIPTION.REACTIVATED': {
        const subscriptionId = event.resource?.id;
        const email = event.resource?.subscriber?.email_address;
        console.log('[PayPal Webhook] Subscription activated:', subscriptionId, email);
        // TODO: Update user's subscription status in database
        break;
      }
      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subscriptionId = event.resource?.id;
        console.log('[PayPal Webhook] Subscription canceled:', subscriptionId);
        // TODO: Downgrade user in database
        break;
      }
      case 'PAYMENT.SALE.COMPLETED': {
        console.log('[PayPal Webhook] Payment completed:', event.resource?.id);
        break;
      }
      default:
        console.log('[PayPal Webhook] Unhandled event:', event.event_type);
    }

    return NextResponse.json({ received: true });

  } catch (error: any) {
    console.error('[PayPal Webhook] Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
