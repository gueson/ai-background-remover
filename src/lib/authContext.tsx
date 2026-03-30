'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';

interface AuthUser {
  id: string;
  email: string | undefined;
  name: string | undefined;
  avatar: string | undefined;
  provider: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      console.log('AuthContext: supabase not initialized');
      setLoading(false);
      return;
    }

    const supabaseClient = supabase;
    console.log('AuthContext: initializing with supabase');

    // Get initial session
    const getSession = async () => {
      console.log('AuthContext: getting session...');
      const { data: { session } } = await supabaseClient.auth.getSession();
      console.log('AuthContext: session:', !!session, session?.user?.email);
      
      if (session?.user) {
        const u = session.user;
        const prov = u.app_metadata?.provider || 'email';
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.name,
          avatar: u.user_metadata?.avatar_url,
          provider: prov.toUpperCase(),
        });
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = session.user;
        const prov = u.app_metadata?.provider || 'email';
        setUser({
          id: u.id,
          email: u.email,
          name: u.user_metadata?.full_name || u.user_metadata?.name,
          avatar: u.user_metadata?.avatar_url,
          provider: prov.toUpperCase(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    // Notify other components FIRST - before signOut triggers onAuthStateChange
    // This gives UploadArea a chance to check localStorage BEFORE Supabase's callback fires
    window.dispatchEvent(new Event('auth:logout'));
    
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('supabase_access_token');
    localStorage.removeItem('supabase_refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
