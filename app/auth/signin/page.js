'use client';
// React imports
import { Suspense } from 'react';
// Component imports
import SignInInner from '@/components/signInInner';

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInInner />
    </Suspense>
  );
}
