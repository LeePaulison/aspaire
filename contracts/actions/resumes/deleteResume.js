import { getResumeById, deleteResume } from '@/dal/resumes';

export async function deleteResumeAction(id) {
  const existing = await getResumeById(id);
  if (!existing) {
    throw new Error(`Resume with ID ${id} not found.`);
  }

  await deleteResume(id);
  return { success: true, message: `Resume ${id} deleted.` };
}
