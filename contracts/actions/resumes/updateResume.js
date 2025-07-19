import { getResumeById, updateResume } from '@/dal/resumes';

export async function updateResumeAction(id, input) {
  const existing = await getResumeById(id);
  if (!existing) {
    throw new Error(`Resume with ID ${id} not found.`);
  }

  return await updateResume(id, input);
}
