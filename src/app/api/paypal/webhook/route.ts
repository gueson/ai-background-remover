import { NextRequest, NextResponse } from 'next/server';

// This endpoint is called by PayPal on subscription events.
// It simply forwards the raw body to our backend Express server
// where the actual verification and database update happens.

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://43.156.49.183:3001';

export async function POST(request: NextRequest) {
  try {
    // Read raw body (needed for PayPal signature verification on backend)
    const body = await request.text();

    // Forward to backend WITHOUT Content-Type header negotiation
    // The backend expects the raw body for signature verification
    const backendRes = await fetch(`${BACKEND_URL}/api/subscription/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paypal-webhook-source': 'nextjs',
      },
      body,
    });

    const responseData = await backendRes.json().catch(() => ({}));
    console.log(`[PayPal Webhook] Forwarded to backend: ${backendRes.status}`, responseData);

    return NextResponse.json(
      { received: true, forwarded: true },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('[PayPal Webhook] Error:', error);
    // Always return 200 to PayPal so they don't retry
    return NextResponse.json({ received: true, error: 'Internal error' }, { status: 200 });
  }
}
