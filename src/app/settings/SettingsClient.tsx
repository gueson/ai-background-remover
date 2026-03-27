'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Header } from '@/components/Header';

export function SettingsClient() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'subscription'>('profile');

  // Profile state
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Delete account
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteMsg, setDeleteMsg] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      if (!supabase) {
        router.push('/login');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const u = session.user;
      setUser(u);
      setName(u.user_metadata?.full_name || u.user_metadata?.name || '');
      setAvatarUrl(u.user_metadata?.avatar_url || '');
      setLoading(false);
    };
    loadUser();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setProfileSaving(true);
    setProfileMsg('');

    const { error } = await supabase.auth.updateUser({
      data: { full_name: name },
    });

    if (error) {
      setProfileMsg('Failed to update profile: ' + error.message);
    } else {
      // Update local state
      const newMetadata = { ...user.user_metadata, full_name: name };
      setUser({ ...user, user_metadata: newMetadata });
      setProfileMsg('Profile updated successfully!');
    }
    setProfileSaving(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (!supabase) return;
    setPasswordSaving(true);

    // Re-authenticate first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      setPasswordError('Current password is incorrect.');
      setPasswordSaving(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordError('Failed to update password: ' + error.message);
    } else {
      setPasswordMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setPasswordSaving(false);
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== user.email) {
      setDeleteMsg('Please type your email correctly to confirm deletion.');
      return;
    }
    if (!supabase) return;
    setDeleteSaving(true);
    setDeleteMsg('');

    try {
      // Call backend to delete user data (placeholder)
      await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
      });

      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      await supabase.auth.signOut();
      router.push('/');
    } catch (err: any) {
      setDeleteMsg('Failed to delete account: ' + err.message);
      setDeleteSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Header />
        </div>
        <main className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        </main>
      </div>
    );
  }

  const tabs = [
    { key: 'profile', label: 'Profile' },
    { key: 'password', label: 'Password' },
    { key: 'subscription', label: 'Subscription' },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Header />
      </div>

      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              {profileMsg && !profileMsg.includes('Failed') && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{profileMsg}</p>
                </div>
              )}
              {profileMsg && profileMsg.includes('Failed') && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{profileMsg}</p>
                </div>
              )}

              <form onSubmit={handleProfileUpdate} className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                      {name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    <p>Avatar is synced from your {user?.app_metadata?.provider || 'account'}</p>
                    <p className="text-xs mt-1">Update your avatar on {user?.app_metadata?.provider === 'google' ? 'Google' : user?.app_metadata?.provider === 'github' ? 'GitHub' : 'your identity provider'}</p>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your display name"
                  />
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                </div>

                {/* Provider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account type</label>
                  <div className="px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-600 text-sm capitalize">
                    {user?.app_metadata?.provider || 'email'} account
                  </div>
                </div>

                <Button type="submit" disabled={profileSaving}>
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.app_metadata?.provider !== 'email' && user?.app_metadata?.provider !== undefined && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700">
                    Your account is linked to {user?.app_metadata?.provider}. Password is managed by your identity provider.
                  </p>
                </div>
              )}

              {(user?.app_metadata?.provider === 'email' || !user?.app_metadata?.provider) && (
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{passwordError}</p>
                    </div>
                  )}
                  {passwordMsg && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600">{passwordMsg}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Enter current password"
                      autoComplete="current-password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="Re-enter new password"
                      autoComplete="new-password"
                    />
                  </div>

                  <Button type="submit" disabled={passwordSaving}>
                    {passwordSaving ? 'Updating...' : 'Update Password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        )}

        {/* Subscription Tab */}
        {activeTab === 'subscription' && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">Current Plan</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Free</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">$0 / forever</p>
                      <p className="text-xs text-gray-400 mt-1">10 images / month</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Upgrade to Pro</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Get unlimited image processing, HD quality output, priority processing, and API access.
                  </p>
                  <Link href="/pricing">
                    <Button>View Plans</Button>
                  </Link>
                </div>

                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-700 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>

                  {deleteMsg && (
                    <div className="mb-3 p-2 bg-red-100 border border-red-300 rounded text-sm text-red-700">
                      {deleteMsg}
                    </div>
                  )}

                  <div className="space-y-2">
                    <input
                      type="text"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      placeholder={`Type "${user?.email}" to confirm`}
                      className="w-full px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                    />
                    <Button
                      variant="outline"
                      className="w-full border-red-300 text-red-600 hover:bg-red-100"
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirm !== user?.email || deleteSaving}
                    >
                      {deleteSaving ? 'Deleting...' : 'Delete My Account'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
