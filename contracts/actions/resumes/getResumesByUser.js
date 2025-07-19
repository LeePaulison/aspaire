import { getResumesByUserId } from '@/dal/resumes';

export async function getResumesByUserAction(userId, limit = 10, offset = 0) {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID for resume query.');
  }

  return await getResumesByUserId(userId, limit, offset);
}
