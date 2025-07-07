import { getPreferencesByUserId, setPreferences } from '@/dal/preferences';
import { getUserById, createUser } from '@/dal/user';

export async function getOrCreatePreferencesForUser(userId) {
  let preferences = await getPreferencesByUserId(userId);

  if (!preferences) {
    await setPreferences({
      user_id: userId,
      preferred_locations: [],
      remote: false,
      industries: [],
      salary_min: 0,
      salary_max: 0,
      notifications_enabled: true,
    });
    preferences = await getPreferencesByUserId(userId);
  }

  return preferences;
}

export async function createOrFetchUser(userInput) {
  let user = await getUserById(userInput.id);

  if (!user) {
    user = await createUser(userInput);
    await setPreferences({
      user_id: user.id,
      preferred_locations: [],
      remote: false,
      industries: [],
      salary_min: 0,
      salary_max: 0,
      notifications_enabled: true,
    });
  }

  return user;
}
