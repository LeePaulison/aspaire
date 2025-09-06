// app/settings/page.jsx  (or pages/settings.jsx)
'use client';

import { useSession } from 'next-auth/react';
import PreferencesForm from '@/components/prefs/preferencesForm';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  if (status === 'loading') return null;

  return (
    <div className="container py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your job feed and defaults.</p>
      </header>

      <section aria-labelledby="prefs-heading" className="space-y-4">
        <h2 id="prefs-heading" className="text-xl font-medium">Preferences</h2>
        <PreferencesForm />
      </section>
    </div>
  );
}
