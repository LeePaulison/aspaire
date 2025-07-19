import { getUserByAuth, createUser } from '@/dal/user';
import { setPreferences } from '@/dal/preferences';

export async function getOrCreateUserByAuthAction({ authProviderId, authProvider, email, name }) {
  console.log('[Get or Create User by Auth Action] authProviderId:', authProviderId, 'authProvider:', authProvider);
  let user = await getUserByAuth(authProviderId, authProvider);

  if (!user) {
    user = await createUser({
      authProviderId,
      authProvider,
      email,
      name,
    });

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
