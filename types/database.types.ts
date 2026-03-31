// Database types for ApplyPulse
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'assessment'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'accepted'

export type WorkType = 'remote' | 'hybrid' | 'onsite'

export type InterviewType = 'phone' | 'video' | 'onsite' | 'take_home'

export type InterviewResult = 'pending' | 'passed' | 'failed' | 'no_show'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          target_roles: string[]
          preferred_locations: string[]
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          target_roles?: string[]
          preferred_locations?: string[]
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          target_roles?: string[]
          preferred_locations?: string[]
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          user_id: string
          company_name: string
          role_title: string
          status: ApplicationStatus
          job_url: string | null
          referral_name: string | null
          referral_contact: string | null
          salary_range: string | null
          location: string | null
          work_type: WorkType | null
          notes: string | null
          tags: string[]
          applied_date: string | null
          status_updated_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          role_title: string
          status?: ApplicationStatus
          job_url?: string | null
          referral_name?: string | null
          referral_contact?: string | null
          salary_range?: string | null
          location?: string | null
          work_type?: WorkType | null
          notes?: string | null
          tags?: string[]
          applied_date?: string | null
          status_updated_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          role_title?: string
          status?: ApplicationStatus
          job_url?: string | null
          referral_name?: string | null
          referral_contact?: string | null
          salary_range?: string | null
          location?: string | null
          work_type?: WorkType | null
          notes?: string | null
          tags?: string[]
          applied_date?: string | null
          status_updated_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          file_url: string
          file_name: string
          file_size: number | null
          version_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          file_url: string
          file_name: string
          file_size?: number | null
          version_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          file_url?: string
          file_name?: string
          file_size?: number | null
          version_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      interviews: {
        Row: {
          id: string
          application_id: string
          interview_date: string
          interview_type: InterviewType
          round_number: number
          interviewer_names: string[]
          preparation_notes: string | null
          post_interview_notes: string | null
          result: InterviewResult
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id: string
          interview_date: string
          interview_type: InterviewType
          round_number?: number
          interviewer_names?: string[]
          preparation_notes?: string | null
          post_interview_notes?: string | null
          result?: InterviewResult
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string
          interview_date?: string
          interview_type?: InterviewType
          round_number?: number
          interviewer_names?: string[]
          preparation_notes?: string | null
          post_interview_notes?: string | null
          result?: InterviewResult
          created_at?: string
          updated_at?: string
        }
      }
      resume_application_mapping: {
        Row: {
          id: string
          resume_id: string
          application_id: string
          created_at: string
        }
        Insert: {
          id?: string
          resume_id: string
          application_id: string
          created_at?: string
        }
        Update: {
          id?: string
          resume_id?: string
          application_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      application_funnel_stats: {
        Row: {
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
      }
    }
    Functions: {
      get_upcoming_interviews: {
        Args: {
          days_ahead?: number
        }
        Returns: {
          interview_id: string
          application_id: string
          company_name: string
          role_title: string
          interview_date: string
          interview_type: InterviewType
          round_number: number
        }[]
      }
    }
  }
}
