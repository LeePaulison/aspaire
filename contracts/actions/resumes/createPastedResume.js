import { createPastedResume } from '@/dal/resumes';

export async function createPastedResumeAction(input) {
  if (input.sourceType !== 'PASTE') {
    throw new Error(`Invalid sourceType for pasted resume.`);
  }

  return await createPastedResume(input);
}
