import { Metadata } from 'next';
import { SettingsClient } from './SettingsClient';

export const metadata: Metadata = {
  title: 'Account Settings – RemoveBG',
  description: 'Manage your RemoveBG account settings',
};

export default function SettingsPage() {
  return <SettingsClient />;
}
