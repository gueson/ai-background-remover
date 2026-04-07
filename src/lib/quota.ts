/**
 * Quota management for anonymous and registered users
 * 
 * Anonymous users: controlled via localStorage (device-based)
 * Registered users: controlled via backend API (database-based)
 */

import { supabase } from './supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ANONYMOUS_DAILY_LIMIT = 5;
const REGISTERED_DAILY_LIMIT = 5;
const PRO_DAILY_LIMIT = 50;

// localStorage keys
const STORAGE_KEY = 'removebg_quota';
const DEVICE_ID_KEY = 'removebg_device_id';

// ─── Device ID for anonymous users ─────────────────────────────────────────
function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'anon_' + Math.random().toString(36).substring(2) + '_' + Date.now();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

// ─── Anonymous quota (localStorage) ─────────────────────────────────────────
interface AnonymousQuota {
  date: string; // YYYY-MM-DD
  count: number;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function getAnonymousQuota(): AnonymousQuota {
  if (typeof window === 'undefined') {
    return { date: getToday(), count: 0 };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { date: getToday(), count: 0 };
    }
    
    const quota: AnonymousQuota = JSON.parse(stored);
    const today = getToday();
    
    // Reset if it's a new day
    if (quota.date !== today) {
      return { date: today, count: 0 };
    }
    
    return quota;
  } catch {
    return { date: getToday(), count: 0 };
  }
}

function saveAnonymousQuota(quota: AnonymousQuota): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quota));
}

export function checkAnonymousQuota(): { allowed: boolean; remaining: number; used: number } {
  const quota = getAnonymousQuota();
  const remaining = Math.max(0, ANONYMOUS_DAILY_LIMIT - quota.count);
  return {
    allowed: quota.count < ANONYMOUS_DAILY_LIMIT,
    remaining,
    used: quota.count,
  };
}

export function recordAnonymousUsage(): void {
  const quota = getAnonymousQuota();
  quota.count += 1;
  saveAnonymousQuota(quota);
}

// ─── Auth state helpers ─────────────────────────────────────────────────────
async function isLoggedIn(): Promise<boolean> {
  if (!supabase) return false;
  
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
}

// ─── Registered user quota (backend API) ────────────────────────────────────
export interface QuotaInfo {
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  dailyLimit: number | null;
  used: number;
  remaining: number | null;
  allowed: boolean;
  isPro: boolean;
}

export async function checkRegisteredQuota(): Promise<QuotaInfo | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    // Prefer backend JWT, but fall back to Supabase token if missing
    const backendToken = localStorage.getItem('token');
    const supabaseToken = localStorage.getItem('supabase_access_token');
    const token = backendToken || supabaseToken;
    if (!token) return null;
    
    const response = await fetch(`${API_URL}/api/quota`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) return null;
    
    const result = await response.json();
    if (!result.success) return null;
    
    const data = result.data;
    return {
      plan: data.plan,
      dailyLimit: data.dailyLimit,
      used: data.used,
      remaining: data.remaining,
      allowed: (data.dailyLimit === null || data.used < data.dailyLimit),
      isPro: data.plan === 'PRO' || data.plan === 'ENTERPRISE',
    };
  } catch {
    return null;
  }
}

export async function recordRegisteredUsage(imageSize?: number): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const token = localStorage.getItem('supabase_access_token');
    if (!token) return false;
    
    const response = await fetch(`${API_URL}/api/quota/use`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageSize }),
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

// ─── Check if user is PRO ───────────────────────────────────────────────────
export async function isProUser(): Promise<boolean> {
  const quota = await checkRegisteredQuota();
  return quota?.isPro ?? false;
}

// ─── Get quota info for any user ───────────────────────────────────────────
export async function getQuotaInfo(): Promise<{
  type: 'anonymous' | 'registered';
  allowed: boolean;
  remaining: number | null;
  used: number;
  dailyLimit: number;
  isPro: boolean;
}> {
  // Check both backend token AND supabase token - either means user is logged in
  const hasBackendToken = typeof window !== 'undefined' && !!localStorage.getItem('token');
  const hasSupabaseToken = typeof window !== 'undefined' && !!localStorage.getItem('supabase_access_token');
  const isLoggedIn = hasBackendToken || hasSupabaseToken;
  
  if (!isLoggedIn) {
    // User is anonymous - use localStorage only
    const anonQuota = checkAnonymousQuota();
    return {
      type: 'anonymous',
      allowed: anonQuota.allowed,
      remaining: anonQuota.remaining,
      used: anonQuota.used,
      dailyLimit: ANONYMOUS_DAILY_LIMIT,
      isPro: false,
    };
  }
  
  // Has token - check registered user quota from backend
  const registeredQuota = await checkRegisteredQuota();
  if (registeredQuota) {
    return {
      type: 'registered',
      allowed: registeredQuota.allowed,
      remaining: registeredQuota.remaining,
      used: registeredQuota.used,
      dailyLimit: registeredQuota.dailyLimit ?? (registeredQuota.isPro ? PRO_DAILY_LIMIT : REGISTERED_DAILY_LIMIT),
      isPro: registeredQuota.isPro,
    };
  }
  
  // Token exists but backend rejected it - treat as anonymous
  const anonQuota = checkAnonymousQuota();
  return {
    type: 'anonymous',
    allowed: anonQuota.allowed,
    remaining: anonQuota.remaining,
    used: anonQuota.used,
    dailyLimit: ANONYMOUS_DAILY_LIMIT,
    isPro: false,
  };
}

// ─── Record usage for any user ─────────────────────────────────────────────
export async function recordUsage(imageSize?: number): Promise<void> {
  // Try registered user first
  const recorded = await recordRegisteredUsage(imageSize);
  if (recorded) return;
  
  // Fall back to anonymous
  recordAnonymousUsage();
}
