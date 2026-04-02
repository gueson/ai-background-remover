import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    // Forward to backend — backend will validate the Supabase token
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const backendRes = await fetch(`${backendUrl}/api/subscription`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

