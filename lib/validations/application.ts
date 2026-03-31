import { z } from 'zod'

export const applicationStatusEnum = z.enum([
  'wishlist',
  'applied',
  'assessment',
  'interview',
  'offer',
  'rejected',
  'accepted',
])

export const workTypeEnum = z.enum(['remote', 'hybrid', 'onsite'])

export const createApplicationSchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  role_title: z.string().min(1, 'Role title is required'),
  status: applicationStatusEnum.default('wishlist'),
  job_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  referral_name: z.string().optional(),
  referral_contact: z.string().optional(),
  salary_range: z.string().optional(),
  location: z.string().optional(),
  work_type: workTypeEnum.optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).default([]),
  applied_date: z.string().optional(),
})

export const updateApplicationSchema = createApplicationSchema.partial().extend({
  id: z.string().uuid(),
})

export type CreateApplicationFormData = z.infer<typeof createApplicationSchema>
export type UpdateApplicationFormData = z.infer<typeof updateApplicationSchema>
