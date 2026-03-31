'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Interview, Application } from '@/types'

export interface InterviewWithApplication extends Interview {
  applications?: {
    id: string
    company_name: string
    role_title: string
  }
}

export function useInterviews() {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          applications (
            id,
            company_name,
            role_title
          )
        `)
        .order('interview_date', { ascending: true })

      if (error) throw error
      return data as InterviewWithApplication[]
    },
  })
}

export function useUpcomingInterviews() {
  return useQuery({
    queryKey: ['upcoming-interviews'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const now = new Date().toISOString()

      const { data, error } = await supabase
        .from('interviews')
        .select(`
          *,
          applications (
            id,
            company_name,
            role_title
          )
        `)
        .gte('interview_date', now)
        .order('interview_date', { ascending: true })
        .limit(5)

      if (error) throw error
      return data as InterviewWithApplication[]
    },
  })
}

export function useApplicationInterviews(applicationId: string) {
  return useQuery({
    queryKey: ['application-interviews', applicationId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('application_id', applicationId)
        .order('interview_date', { ascending: true })

      if (error) throw error
      return data as Interview[]
    },
    enabled: !!applicationId,
  })
}

export function useCreateInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: {
      application_id: string
      interview_date: string
      interview_type: string
      round_number?: number
      interviewer_names?: string[]
      meeting_link?: string
      preparation_notes?: string
    }) => {
      const supabase: any = createClient()

      const { data, error } = await supabase
        .from('interviews')
        .insert({
          ...input,
          round_number: input.round_number || 1,
          interviewer_names: input.interviewer_names || [],
          result: 'pending',
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-interviews'] })
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] })
    },
  })
}

export function useUpdateInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { id: string;[key: string]: any }) => {
      const { id, ...updates } = payload
      const supabase: any = createClient()

      const { data, error } = await supabase
        .from('interviews')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-interviews'] })
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] })
    },
  })
}

export function useDeleteInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()

      const { error } = await supabase
        .from('interviews')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interviews'] })
      queryClient.invalidateQueries({ queryKey: ['upcoming-interviews'] })
      queryClient.invalidateQueries({ queryKey: ['application-interviews'] })
    },
  })
}
