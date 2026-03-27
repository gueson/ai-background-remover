import { Metadata } from 'next';
import { ResetPasswordClient } from './ResetPasswordClient';

export const metadata: Metadata = {
  title: 'Set New Password – RemoveBG',
  description: 'Set your new RemoveBG account password',
};

export default function ResetPasswordPage() {
  return <ResetPasswordClient />;
}
