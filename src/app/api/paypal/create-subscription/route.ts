import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const PAYPAL_API_BASE = process.env.PAYPAL_ENV === 'production'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com';

async function getPayPalAccessToken(clientId: string, clientSecret: string): Promise<string> {
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
  if (!res.ok) throw new Error(data.error_description || 'Failed to get PayPal token');
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: 'PayPal is not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(clientId, clientSecret);

    // Get user's Supabase session from Authorization header
    const authHeader = request.headers.get('authorization');
    let userEmail = null;
    if (authHeader && supabase) {
      const result = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
      userEmail = result.data.user?.email || null;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ai-background-remover-tools.vercel.app';

    // Create PayPal subscription
    const createRes = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'PayPal-Request-Id': `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
      body: JSON.stringify({
        plan_id: planId,
        subscriber: userEmail ? { email_address: userEmail } : undefined,
        application_context: {
          brand_name: 'RemoveBG',
          landing_page: 'BILLING',
          user_action: 'SUBSCRIBE_NOW',
          return_url: `${appUrl}/pricing?success=true&plan=pro`,
          cancel_url: `${appUrl}/pricing?canceled=true`,
        },
      }),
    });

    const subscriptionData = await createRes.json();

    if (!createRes.ok) {
      console.error('PayPal create subscription error:', subscriptionData);
      return NextResponse.json(
        { error: subscriptionData.message || 'Failed to create PayPal subscription' },
        { status: createRes.status }
      );
    }

    // Find the approval URL
    const approvalUrl = subscriptionData.links?.find(
      (link: any) => link.rel === 'approve'
    )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        { error: 'Could not get PayPal approval URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      subscriptionId: subscriptionData.id,
      approvalUrl,
    });

  } catch (error: any) {
    console.error('PayPal subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
