import * as z from 'zod';

export const uploadResumeSchema = z.object({
  resumeFile: z.any().refine((file) => file instanceof File, { message: 'File is required' }),
  description: z.string().optional(),
});

export const pasteResumeSchema = z.object({
  resumeContent: z.string().min(10, 'Resume content is required'),
  description: z.string().optional(),
  partial: z.boolean().default(false),
});
