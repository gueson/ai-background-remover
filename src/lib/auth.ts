const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: AuthUser;
  };
}

export interface MeResponse {
  success: boolean;
  data: {
    authenticated: boolean;
    user: AuthUser | null;
  };
}

export async function googleAuth(token: string, tokenType: 'id_token' | 'access_token' | 'code' = 'id_token'): Promise<AuthResponse> {
  const body = tokenType === 'code'
    ? { code: token }
    : tokenType === 'access_token'
    ? { access_token: token }
    : { token };

  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || 'Authentication failed');
  }

  return res.json();
}

export async function getMe(): Promise<MeResponse> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return { success: true, data: { authenticated: false, user: null } };

  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    localStorage.removeItem('token');
    return { success: true, data: { authenticated: false, user: null } };
  }

  return res.json();
}

export function saveToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
