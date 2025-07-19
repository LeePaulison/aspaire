import { setPreferences } from '@/dal/preferences';

/**
 * Sets or updates user preferences.
 * Delegates directly to DAL and returns the stored preferences.
 */
export async function setPreferencesAction(input) {
  return await setPreferences(input);
}
