'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Application, CreateApplicationInput, UpdateApplicationInput } from '@/types'

export function useApplications() {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Application[]
    },
  })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateApplicationInput) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('applications')
        .insert({
          ...input,
          user_id: user.id,
        } as any)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      const { id, ...updates } = payload
      const supabase: any = createClient()
      
      const { data, error } = await supabase
        .from('applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    // Optimistic update to prevent UI lag during drag
    onMutate: async (payload) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['applications'] })

      // Snapshot the previous value
      const previousApplications = queryClient.getQueryData<Application[]>(['applications'])

      // Optimistically update to the new value
      if (previousApplications) {
        queryClient.setQueryData<Application[]>(
          ['applications'],
          previousApplications.map((app) =>
            app.id === payload.id ? { ...app, ...payload } : app
          )
        )
      }

      // Return a context object with the snapshot
      return { previousApplications }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, payload, context: any) => {
      if (context?.previousApplications) {
        queryClient.setQueryData(['applications'], context.previousApplications)
      }
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}
