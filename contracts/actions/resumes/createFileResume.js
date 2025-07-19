import { createFileResume, getResumesByUserId } from '@/dal/resumes';

export async function createFileResumeAction(input) {
  const existing = await getResumesByUserId(input.userId);
  const conflict = existing.find((r) => r.s3Key === input.s3Key);

  if (conflict) {
    throw new Error(`Resume with same s3Key already exists for user ${input.userId}`);
  }

  if (input.sourceType !== 'UPLOAD') {
    throw new Error(`Invalid sourceType for file resume.`);
  }

  return await createFileResume(input);
}
