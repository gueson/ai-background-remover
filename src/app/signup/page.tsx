import { Metadata } from 'next';
import { SignupClient } from './SignupClient';

export const metadata: Metadata = {
  title: 'Sign Up – RemoveBG',
  description: 'Create your RemoveBG account',
};

export default function SignupPage() {
  return <SignupClient />;
}
