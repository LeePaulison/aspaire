import { createUser } from '@/dal/user';
import { setPreferences } from '@/dal/preferences';

/**
 * Creates a new user and optionally sets preferences.
 * @param {Object} input - User creation input (matches GraphQL input).
 * @returns {Object} - The created user object.
 */
export async function createUserAction(input) {
  console.log('[Create User Action] Creating user with input:', input);
  const user = await createUser(input);

  // Optional preferences creation
  if (input.preferences) {
    await setPreferences({
      userId: user.id,
      ...input.preferences,
    });
  }

  return user;
}
