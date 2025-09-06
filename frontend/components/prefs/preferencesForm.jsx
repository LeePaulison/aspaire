'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SET_PREFERENCES } from '@/graphql/mutations/preferences';
import { DEFAULT_PREFS } from '@/lib/defaults/preferences';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
const { useUserStore } = require('@/store/userStore');
import { usePreferencesStore } from '@/store/preferencesStore';

export default function PreferencesForm() {
  const user = useUserStore((s) => s.user);
  const prefs = usePreferencesStore((s) => s.preferences);
  const savePreferences = usePreferencesStore((s) => s.setPreferences);

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

  console.log('[PreferencesForm] current preferences:', prefs);

  const [form, setForm] = useState(() => ({
    preferredLocations: (prefs.preferredLocations || DEFAULT_PREFS.preferredLocations).join(', '),
    preferredTitles: (prefs.preferredTitles || DEFAULT_PREFS.preferredTitles).join(', '),
    preferredSkills: (prefs.preferredSkills || DEFAULT_PREFS.preferredSkills).join(', '),
    industries: (prefs.industries || DEFAULT_PREFS.industries).join(', '),
    remote: !!prefs.remote,
    salaryMin: prefs.salaryMin ?? '',
    salaryMax: prefs.salaryMax ?? '',
    salaryCurrency: prefs.salaryCurrency || '',
    notificationsEnabled: !!prefs.notificationsEnabled,
    paginationLimit: prefs.paginationLimit ?? DEFAULT_PREFS.paginationLimit,
  }));

  const toArray = (s) =>
    String(s || '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean);

  const submit = (e) => {
    e.preventDefault();
    setPreferences({
      variables: {
        input: {
          userId: user.id,
          preferredLocations: toArray(form.preferredLocations),
          preferredTitles: toArray(form.preferredTitles),
          preferredSkills: toArray(form.preferredSkills),
          industries: toArray(form.industries),
          remote: !!form.remote,
          salaryMin: parseFloat(form.salaryMin) || 0,
          salaryMax: parseFloat(form.salaryMax) || 0,
          salaryCurrency: form.salaryCurrency || 'USD',
          notificationsEnabled: !!form.notificationsEnabled,
          paginationLimit: Math.max(5, Math.min(parseInt(form.paginationLimit || 20, 10), 50)),
        },
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="preferredLocations">Preferred Locations</Label>
        <Input
          id="preferredLocations"
          value={form.preferredLocations}
          onChange={(e) => setForm((f) => ({ ...f, preferredLocations: e.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="preferredTitles">Preferred Titles</Label>
        <Input
          id="preferredTitles"
          value={form.preferredTitles}
          onChange={(e) => setForm((f) => ({ ...f, preferredTitles: e.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="preferredSkills">Preferred Skills</Label>
        <Input
          id="preferredSkills"
          value={form.preferredSkills}
          onChange={(e) => setForm((f) => ({ ...f, preferredSkills: e.target.value }))}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="industries">Industries</Label>
        <Input
          id="industries"
          value={form.industries}
          onChange={(e) => setForm((f) => ({ ...f, industries: e.target.value }))}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="remote"
          checked={form.remote}
          onCheckedChange={(v) => setForm((f) => ({ ...f, remote: !!v }))}
        />
        <Label htmlFor="remote">Include Remote Roles</Label>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm">
        <div className="grid gap-2">
          <Label htmlFor="salaryMin">Minimum Salary</Label>
          <Input
            id="salaryMin"
            type="number"
            value={form.salaryMin}
            onChange={(e) => setForm((f) => ({ ...f, salaryMin: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="salaryMax">Maximum Salary</Label>
          <Input
            id="salaryMax"
            type="number"
            value={form.salaryMax}
            onChange={(e) => setForm((f) => ({ ...f, salaryMax: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="salaryCurrency">Currency</Label>
        <Input
          id="salaryCurrency"
          value={form.salaryCurrency}
          onChange={(e) => setForm((f) => ({ ...f, salaryCurrency: e.target.value }))}
          placeholder="e.g., USD"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="notificationsEnabled"
          checked={form.notificationsEnabled}
          onCheckedChange={(v) => setForm((f) => ({ ...f, notificationsEnabled: !!v }))}
        />
        <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
      </div>

      <div className="grid gap-2 max-w-xs">
        <Label htmlFor="paginationLimit">Results per Page</Label>
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
