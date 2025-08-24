import { getPreferencesByUserId, setPreferences } from '../dal/preferences.js';
import { getUserByAuth, createUserWithAuth } from '../dal/user.js';

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

export async function createUser(userInput) {
  console.log('[UserService] createUser called with:', {
    authProviderId: userInput?.authProviderId,
    authProvider: userInput?.authProvider,
    email: userInput?.email,
    name: userInput?.name
  });

  // Validate userInput
  if (!userInput || !userInput.authProviderId || !userInput.authProvider || !userInput.email || !userInput.name) {
    throw new Error('Invalid user input. authProviderId, authProvider, email, and name are required.');
  }

  // Check if user already exists
  let user = await getUserByAuth(userInput.authProviderId, userInput.authProvider, userInput.email, userInput.name);

  if (user) {
    console.log('[UserService] User already exists, returning existing user:', user.id);
    // Make sure preferences exist for existing user
    await getOrCreatePreferencesForUser(user.id);
    return user;
  }

  console.log('[UserService] Creating new user...');
  // Create new user - this handles ON CONFLICT in the database
  user = await createUserWithAuth(userInput);
  console.log('[UserService] New user created:', user.id);

  // Create default preferences for new user
  console.log('[UserService] Creating default preferences for user:', user.id);
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

  console.log('[UserService] User creation completed for:', user.id);
  return user;
}
