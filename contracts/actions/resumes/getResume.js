import { getResumeById } from '@/dal/resumes';

export async function getResumeByIdAction(id) {
  return await getResumeById(id);
}
