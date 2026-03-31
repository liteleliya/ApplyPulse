'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateApplicationFormData, createApplicationSchema } from '@/lib/validations/application'
import { useUpdateApplication, useDeleteApplication } from '@/hooks/use-applications'
import { useResumes, useLinkResumeToApplication, useUnlinkResumeFromApplication, useApplicationResumes } from '@/hooks/use-resumes'
import { Application, Resume } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, X, Plus, FileText, Link, ExternalLink } from 'lucide-react'

interface EditApplicationDialogProps {
  application: Application | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditApplicationDialog({ application, open, onOpenChange }: EditApplicationDialogProps) {
  const updateApplication = useUpdateApplication()
  const deleteApplication = useDeleteApplication()
  const { data: allResumes } = useResumes()
  const { data: linkedResumes } = useApplicationResumes(application?.id || '')
  const linkResume = useLinkResumeToApplication()
  const unlinkResume = useUnlinkResumeFromApplication()
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<any>({
    resolver: zodResolver(createApplicationSchema),
  })

  // Populate form when application changes
  useEffect(() => {
    if (application) {
      setValue('company_name', application.company_name)
      setValue('role_title', application.role_title)
      setValue('status', application.status)
      setValue('work_type', application.work_type)
      setValue('location', application.location || '')
      setValue('salary_range', application.salary_range || '')
      setValue('job_url', application.job_url || '')
      setValue('referral_name', application.referral_name || '')
      setValue('referral_contact', application.referral_contact || '')
      setValue('applied_date', application.applied_date || '')
      setValue('notes', application.notes || '')
      setTags(application.tags || [])
    }
  }, [application, setValue])

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleLinkResume = async (resumeId: string) => {
    if (!application) return
    try {
      await linkResume.mutateAsync({ resumeId, applicationId: application.id })
    } catch (error) {
      console.error('Failed to link resume:', error)
    }
  }

  const handleUnlinkResume = async (resumeId: string) => {
    if (!application) return
    try {
      await unlinkResume.mutateAsync({ resumeId, applicationId: application.id })
    } catch (error) {
      console.error('Failed to unlink resume:', error)
    }
  }

  const linkedResumeIds = linkedResumes?.map(r => r.id) || []
  const availableResumes = allResumes?.filter(r => !linkedResumeIds.includes(r.id)) || []

  const onSubmit = async (data: CreateApplicationFormData) => {
    if (!application) return

    setIsSubmitting(true)
    try {
      await updateApplication.mutateAsync({
        id: application.id,
        ...data,
        tags,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to update application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!application) return

    try {
      await deleteApplication.mutateAsync(application.id)
      setShowDeleteConfirm(false)
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to delete application:', error)
    }
  }

  if (!application) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5F5F0] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b-2 border-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-black text-black uppercase tracking-tight">
                    EDIT APPLICATION
                  </DialogTitle>
                  <DialogDescription className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mt-0.5">
                    {application.company_name} - {application.role_title}
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Company & Role */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="text-xs font-bold uppercase tracking-wider text-black">
                  Company Name <span className="text-[#FF4D00]">*</span>
                </Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Google"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
                {errors.company_name && (
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D00]">
                    {String(errors.company_name.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role_title" className="text-xs font-bold uppercase tracking-wider text-black">
                  Role / Position <span className="text-[#FF4D00]">*</span>
                </Label>
                <Input
                  id="role_title"
                  {...register('role_title')}
                  placeholder="Software Engineer"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
                {errors.role_title && (
                  <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D00]">
                    {String(errors.role_title.message)}
                  </p>
                )}
              </div>
            </div>

            {/* Status & Work Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-black">Status</Label>
                <Select
                  defaultValue={application.status}
                  onValueChange={(value) => setValue('status', value as any)}
                >
                  <SelectTrigger className="h-11 border-2 border-black bg-white font-mono text-sm focus:ring-0 focus:outline-none focus:border-[#FF4D00]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <SelectItem value="wishlist" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">WISHLIST</SelectItem>
                    <SelectItem value="applied" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">APPLIED</SelectItem>
                    <SelectItem value="assessment" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">ASSESSMENT</SelectItem>
                    <SelectItem value="interview" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">INTERVIEW</SelectItem>
                    <SelectItem value="offer" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">OFFER</SelectItem>
                    <SelectItem value="rejected" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">REJECTED</SelectItem>
                    <SelectItem value="accepted" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">ACCEPTED</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="work_type" className="text-xs font-bold uppercase tracking-wider text-black">Work Type</Label>
                <Select
                  defaultValue={application.work_type || undefined}
                  onValueChange={(value) => setValue('work_type', value as any)}
                >
                  <SelectTrigger className="h-11 border-2 border-black bg-white font-mono text-sm focus:ring-0 focus:outline-none focus:border-[#FF4D00]">
                    <SelectValue placeholder="SELECT..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <SelectItem value="remote" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">REMOTE</SelectItem>
                    <SelectItem value="hybrid" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">HYBRID</SelectItem>
                    <SelectItem value="onsite" className="font-mono text-sm hover:bg-gray-100 cursor-pointer">ONSITE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location & Salary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-black">Location</Label>
                <Input
                  id="location"
                  {...register('location')}
                  placeholder="San Francisco, CA"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary_range" className="text-xs font-bold uppercase tracking-wider text-black">Salary Range</Label>
                <Input
                  id="salary_range"
                  {...register('salary_range')}
                  placeholder="$120k - $150k"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
              </div>
            </div>

            {/* Job URL */}
            <div className="space-y-2">
              <Label htmlFor="job_url" className="text-xs font-bold uppercase tracking-wider text-black">Job URL</Label>
              <Input
                id="job_url"
                {...register('job_url')}
                placeholder="https://careers.company.com/job/123"
                type="url"
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
              {errors.job_url && (
                <p className="text-[10px] font-mono uppercase tracking-wider text-[#FF4D00]">
                  {String(errors.job_url.message)}
                </p>
              )}
            </div>

            {/* Referral Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referral_name" className="text-xs font-bold uppercase tracking-wider text-black">Referral Name</Label>
                <Input
                  id="referral_name"
                  {...register('referral_name')}
                  placeholder="John Doe"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="referral_contact" className="text-xs font-bold uppercase tracking-wider text-black">Referral Contact</Label>
                <Input
                  id="referral_contact"
                  {...register('referral_contact')}
                  placeholder="john@example.com"
                  className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
                />
              </div>
            </div>

            {/* Applied Date */}
            <div className="space-y-2">
              <Label htmlFor="applied_date" className="text-xs font-bold uppercase tracking-wider text-black">Applied Date</Label>
              <Input
                id="applied_date"
                {...register('applied_date')}
                type="date"
                className="h-11 border-2 border-black bg-white font-mono text-sm focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-black">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional notes about this application..."
                rows={3}
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors resize-none"
              />
            </div>

            {/* Tags Management */}
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-black">Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest font-bold">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-[#FF4D00]"
                      onClick={() => removeTag(tag)}
                    />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add a tag..."
                  className="flex-1 h-10 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
                />
                <button 
                  type="button" 
                  onClick={addTag}
                  className="h-10 w-10 border-2 border-black bg-[#FF4D00] text-white flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Resume Linking */}
            <div className="space-y-2 border-t-2 border-black pt-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Linked Resumes
              </Label>
              
              {linkedResumes && linkedResumes.length > 0 ? (
                <div className="space-y-2">
                  {linkedResumes.map(resume => (
                    <div key={resume.id} className="flex items-center justify-between p-3 border-2 border-black bg-white">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-[#FF4D00]" />
                        <span className="text-sm font-mono font-bold text-black">{resume.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => window.open(resume.file_url, '_blank')}
                          className="h-8 w-8 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100"
                        >
                          <ExternalLink className="h-3 w-3 text-black" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUnlinkResume(resume.id)}
                          className="h-8 w-8 border-2 border-red-500 bg-red-100 flex items-center justify-center hover:bg-red-200"
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono uppercase tracking-widest text-gray-500">No resumes linked</p>
              )}

              {availableResumes.length > 0 && (
                <Select onValueChange={handleLinkResume}>
                  <SelectTrigger className="h-10 border-2 border-black bg-white font-mono text-sm">
                    <SelectValue placeholder="LINK A RESUME..." />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {availableResumes.map(resume => (
                      <SelectItem key={resume.id} value={resume.id} className="font-mono text-sm hover:bg-gray-100">
                        <div className="flex items-center gap-2">
                          <Link className="h-3 w-3" />
                          {resume.title}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <DialogFooter className="pt-4 border-t-2 border-black flex justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isSubmitting}
                className="h-11 px-4 bg-red-600 text-white border-2 border-red-800 font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(127,29,29,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                DELETE
              </button>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-white text-black border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 px-6 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-2 border-red-500 bg-[#F5F5F0] shadow-[8px_8px_0px_0px_rgba(239,68,68,0.5)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black uppercase tracking-tight text-black">⚠ DELETE APPLICATION?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono uppercase tracking-wider text-gray-600">
              This will permanently delete {application.company_name} - {application.role_title}. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100">
              CANCEL
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="h-10 px-4 bg-red-600 text-white border-2 border-red-800 font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(127,29,29,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              DELETE
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
