'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useAuth } from "@/lib/authContext";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center py-6">
      <div className="text-2xl font-bold text-gray-900">
        <Link href="/">RemoveBG</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/features">
          <Button variant="ghost" size="sm">Features</Button>
        </Link>
        <Link href="/pricing">
          <Button variant="ghost" size="sm">Pricing</Button>
        </Link>
        <Link href="/login">
          <Button variant="ghost" size="sm">API</Button>
        </Link>
        
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        ) : user ? (
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'User'} 
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                {user.name?.[0] || user.email?.[0] || 'U'}
              </div>
            )}
            <span className="text-sm text-gray-700 hidden md:block">
              {user.name || user.email}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Link href="/login">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
