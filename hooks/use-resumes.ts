'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Resume } from '@/types'

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Resume[]
    },
  })
}

export function useUploadResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ file, title, versionNotes }: { file: File; title: string; versionNotes?: string }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${file.name}`

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      // Create database record
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title,
          file_name: file.name,
          file_url: urlData.publicUrl,
          file_size: file.size,
          version_notes: versionNotes,
        } as any)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}

export function useUpdateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, title, versionNotes }: { id: string; title: string; versionNotes?: string }) => {
      const supabase: any = createClient()

      const { data, error } = await supabase
        .from('resumes')
        .update({ title, version_notes: versionNotes })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()

      // Get the resume to find the file path
      const { data: resume } = await supabase
        .from('resumes')
        .select('file_url')
        .eq('id', id)
        .single() as any

      if (resume && resume.file_url) {
        // Extract file path from URL and delete from storage
        const urlParts = (resume.file_url as string).split('/resumes/')
        if (urlParts[1]) {
          await supabase.storage.from('resumes').remove([urlParts[1]])
        }
      }

      // Delete database record
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
    },
  })
}

// Hook to get all resume mappings for the current user (for Kanban display)
export function useAllApplicationResumes() {
  return useQuery({
    queryKey: ['all-application-resumes'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('resume_application_mapping')
        .select(`
          application_id,
          resume_id,
          resumes (id, title)
        `)

      if (error) throw error
      
      // Group by application_id
      const grouped: Record<string, { id: string; title: string }[]> = {}
      data?.forEach((mapping: any) => {
        if (!grouped[mapping.application_id]) {
          grouped[mapping.application_id] = []
        }
        if (mapping.resumes) {
          grouped[mapping.application_id].push({
            id: mapping.resumes.id,
            title: mapping.resumes.title,
          })
        }
      })
      return grouped
    },
  })
}

// Hook to get resumes linked to a specific application
export function useApplicationResumes(applicationId: string) {
  return useQuery({
    queryKey: ['application-resumes', applicationId],
    queryFn: async () => {
      const supabase = createClient()

      const { data, error } = await supabase
        .from('resume_application_mapping')
        .select(`
          resume_id,
          resumes (*)
        `)
        .eq('application_id', applicationId)

      if (error) throw error
      return data?.map((r: any) => r.resumes) as Resume[]
    },
    enabled: !!applicationId,
  })
}

// Hook to link/unlink resumes to applications
export function useLinkResumeToApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ resumeId, applicationId }: { resumeId: string; applicationId: string }) => {
      const supabase: any = createClient()

      const { error } = await supabase
        .from('resume_application_mapping')
        .insert({
          resume_id: resumeId,
          application_id: applicationId,
        })

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application-resumes', variables.applicationId] })
    },
  })
}

export function useUnlinkResumeFromApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ resumeId, applicationId }: { resumeId: string; applicationId: string }) => {
      const supabase: any = createClient()

      const { error } = await supabase
        .from('resume_application_mapping')
        .delete()
        .eq('resume_id', resumeId)
        .eq('application_id', applicationId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['application-resumes', variables.applicationId] })
    },
  })
}
