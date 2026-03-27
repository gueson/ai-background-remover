import { Metadata } from 'next';
import { ForgotPasswordClient } from './ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'Forgot Password – RemoveBG',
  description: 'Reset your RemoveBG account password',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
