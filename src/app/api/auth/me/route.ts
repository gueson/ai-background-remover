import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://43.156.49.183:3001';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    console.error('Auth me proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy error: ' + error.message },
      { status: 500 }
    );
  }
}
