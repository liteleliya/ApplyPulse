// Export all types from a central location
export type * from './database.types'

// Additional application types
export interface Application {
  id: string
  user_id: string
  company_name: string
  role_title: string
  status: ApplicationStatus
  job_url?: string
  referral_name?: string
  referral_contact?: string
  salary_range?: string
  location?: string
  work_type?: WorkType
  notes?: string
  tags: string[]
  applied_date?: string
  status_updated_at: string
  created_at: string
  updated_at: string
}

export interface Resume {
  id: string
  user_id: string
  title: string
  file_url: string
  file_name: string
  file_size?: number
  version_notes?: string
  created_at: string
  updated_at: string
}

export interface Interview {
  id: string
  application_id: string
  interview_date: string
  interview_type: InterviewType
  round_number: number
  interviewer_names: string[]
  meeting_link?: string
  preparation_notes?: string
  post_interview_notes?: string
  result: InterviewResult
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  full_name: string
  email: string
  target_roles: string[]
  preferred_locations: string[]
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

// Form types
export interface CreateApplicationInput {
  company_name: string
  role_title: string
  status?: ApplicationStatus
  job_url?: string
  referral_name?: string
  referral_contact?: string
  salary_range?: string
  location?: string
  work_type?: WorkType
  notes?: string
  tags?: string[]
  applied_date?: string
}

export interface UpdateApplicationInput extends Partial<CreateApplicationInput> {
  id: string
}

// Kanban types
export interface KanbanColumn {
  id: ApplicationStatus
  title: string
  applications: Application[]
}

// Analytics types
export interface FunnelStats {
  user_id: string
  total_applications: number
  wishlist_count: number
  applied_count: number
  assessment_count: number
  interview_count: number
  offer_count: number
  rejected_count: number
  accepted_count: number
  response_rate_percentage: number
}

// Email parser types (mock)
export interface EmailParseResult {
  company: string
  role: string
  appliedDate: Date
  jobUrl?: string
  confidence: number
  rawEmailId: string
}

import type { ApplicationStatus, WorkType, InterviewType, InterviewResult } from './database.types'
