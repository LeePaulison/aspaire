// components/prefs/PreferencesForm.js
'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SET_PREFERENCES } from '@/graphql/mutations/preferences';
import { DEFAULT_PREFS } from '@/lib/defaults/preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { usePreferencesStore } from '@/store/preferencesStore';

export default function PreferencesForm() {
  const prefs = usePreferencesStore((s) => s.preferences);
  const savePreferences = usePreferencesStore((s) => s.savePreferences);

  const [setPreferences, { loading: isSaving }] = useMutation(SET_PREFERENCES, {
    onCompleted: (data) => {
      if (data?.setPreferences) {
        savePreferences(data.setPreferences);
      }
    },
    onError: (error) => {
      console.error('Error updating preferences:', error);
    },
  });

  console.log('[PreferencesForm] prefs:', prefs);

  const [form, setForm] = useState(() => ({
    preferredLocations: (prefs.preferredLocations || []).join(', '),
    preferredTitles: (prefs.preferredTitles || []).join(', '),
    preferredSkills: (prefs.preferredSkills || []).join(', '),
    remote: !!prefs.remote,
    paginationLimit: prefs.paginationLimit ?? DEFAULT_PREFS.paginationLimit,
  }));

  const submit = (e) => {
    e.preventDefault();
    const toArray = (s) =>
      String(s || '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);

    updatePreferences({
      variables: {
        input: {
          preferredLocations: toArray(form.preferredLocations),
          preferredTitles: toArray(form.preferredTitles),
          preferredSkills: toArray(form.preferredSkills),
          remote: !!form.remote,
          paginationLimit: Math.max(5, Math.min(parseInt(form.paginationLimit || 20, 10), 50)),
        },
      },
    });

  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="preferredLocations">Preferred Locations (comma-separated)</Label>
        <Input
          id="preferredLocations"
          value={form.preferredLocations}
          onChange={(e) => setForm((f) => ({ ...f, preferredLocations: e.target.value }))}
          placeholder="Orlando, Remote, Florida"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="preferredTitles">Preferred Titles (comma-separated)</Label>
        <Input
          id="preferredTitles"
          value={form.preferredTitles}
          onChange={(e) => setForm((f) => ({ ...f, preferredTitles: e.target.value }))}
          placeholder="Frontend Engineer, React Developer"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="preferredSkills">Preferred Skills (comma-separated)</Label>
        <Input
          id="preferredSkills"
          value={form.preferredSkills}
          onChange={(e) => setForm((f) => ({ ...f, preferredSkills: e.target.value }))}
          placeholder="React, GraphQL, Accessibility"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="remote"
          checked={form.remote}
          onCheckedChange={(v) => setForm((f) => ({ ...f, remote: !!v }))}
        />
        <Label htmlFor="remote">Include Remote roles</Label>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="paginationLimit">Results per page</Label>
        <Input
          id="paginationLimit"
          type="number"
          min={5}
          max={50}
          value={form.paginationLimit}
          onChange={(e) => setForm((f) => ({ ...f, paginationLimit: e.target.value }))}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save Preferences'}
      </Button>
    </form>
  );
}
