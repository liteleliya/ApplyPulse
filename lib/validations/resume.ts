import { z } from 'zod'

export const createResumeSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  file_name: z.string().min(1, 'File name is required'),
  file_url: z.string().url('Invalid file URL'),
  file_size: z.number().positive().optional(),
  version_notes: z.string().optional(),
})

export const updateResumeSchema = createResumeSchema.partial().extend({
  id: z.string().uuid(),
})

export type CreateResumeFormData = z.infer<typeof createResumeSchema>
export type UpdateResumeFormData = z.infer<typeof updateResumeSchema>
