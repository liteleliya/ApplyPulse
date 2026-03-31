import { z } from 'zod'

export const interviewTypeEnum = z.enum(['phone', 'video', 'onsite', 'take_home'])
export const interviewResultEnum = z.enum(['pending', 'passed', 'failed', 'no_show'])

export const createInterviewSchema = z.object({
  application_id: z.string().uuid(),
  interview_date: z.string().datetime(),
  interview_type: interviewTypeEnum,
  round_number: z.number().int().positive().default(1),
  interviewer_names: z.array(z.string()).default([]),
  preparation_notes: z.string().optional(),
  post_interview_notes: z.string().optional(),
  result: interviewResultEnum.default('pending'),
})

export const updateInterviewSchema = createInterviewSchema.partial().extend({
  id: z.string().uuid(),
})

export type CreateInterviewFormData = z.infer<typeof createInterviewSchema>
export type UpdateInterviewFormData = z.infer<typeof updateInterviewSchema>
