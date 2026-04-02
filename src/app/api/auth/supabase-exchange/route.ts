import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: Request) {
  try {
    const body = await request.text();

    const res = await fetch(`${BACKEND_URL}/api/auth/supabase-exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Failed to exchange token' }, { status: 500 });
  }
}
