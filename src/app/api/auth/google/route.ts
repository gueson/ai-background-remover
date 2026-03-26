import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://43.156.49.183:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Proxy to backend (backend already handles code exchange with Google)
    const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Auth proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error: ' + error.message },
      { status: 500 }
    );
  }
}
