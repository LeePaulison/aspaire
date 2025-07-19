import { getResumesByUserId } from '@/dal/resumes';

export async function getResumesByUserAction(userId, limit = 10, offset = 0) {
  return await getResumesByUserId(userId, limit, offset);
}
