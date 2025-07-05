'use client';
// React imports
import { Suspense } from 'react';
// Next Router imports
import { useSearchParams } from 'next/navigation';
// Component imports
import SignInInner from '@/components/signInInner';

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInInner callbackUrl={callbackUrl} />
    </Suspense>
  );
}
