import { getPreferencesByUserId, setPreferences } from '@/dal/preferences';
import { getUserByAuth, createUser } from '@/dal/user';

export async function getOrCreatePreferencesForUser(userId) {
  let preferences = await getPreferencesByUserId(userId);

  if (!preferences) {
    await setPreferences({
      userId,
      preferredLocations: [],
      remote: false,
      industries: [],
      salaryMin: 0,
      salaryMax: 0,
      notificationsEnabled: true,
      paginationLimit: 10,
      preferredTitles: [],
      preferredSkills: [],
      salaryCurrency: 'USD',
    });
    preferences = await getPreferencesByUserId(userId);
  }

  return preferences;
}

export async function createOrFetchUser(userInput) {
  // Validate userInput
  if (!userInput || !userInput.authProviderId || !userInput.authProvider || !userInput.email || !userInput.name) {
    throw new Error('Invalid user input. authProviderId, authProvider, email, and name are required.');
  }

  let user = await getUserByAuth(userInput.authProviderId, userInput.authProvider);

  if (!user) {
    user = await createUser(userInput);
    await setPreferences({
      userId: user.id,
      preferredLocations: [],
      remote: false,
      industries: [],
      salaryMin: 0,
      salaryMax: 0,
      notificationsEnabled: true,
      paginationLimit: 10,
      preferredTitles: [],
      preferredSkills: [],
      salaryCurrency: 'USD',
    });
  }

  return user;
}
