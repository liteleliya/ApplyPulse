'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateApplicationFormData, createApplicationSchema } from '@/lib/validations/application'
import { useCreateApplication } from '@/hooks/use-applications'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, X } from 'lucide-react'

interface AddApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddApplicationDialog({ open, onOpenChange }: AddApplicationDialogProps) {
  const createApplication = useCreateApplication()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<any>({
    resolver: zodResolver(createApplicationSchema),
    defaultValues: {
      status: 'wishlist',
      tags: [],
    },
  })

  const onSubmit = async (data: CreateApplicationFormData) => {
    setIsSubmitting(true)
    try {
      await createApplication.mutateAsync(data)
      reset()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#F5F5F0] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b-2 border-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-black text-black uppercase tracking-tight">
                  NEW APPLICATION
                </DialogTitle>
                <DialogDescription className="text-[11px] font-mono text-gray-600 uppercase tracking-wider mt-0.5">
                  Track a new job opportunity
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
              <Label htmlFor="status" className="text-xs font-bold uppercase tracking-wider text-black">
                Status
              </Label>
              <Select
                defaultValue="wishlist"
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
              <Label htmlFor="work_type" className="text-xs font-bold uppercase tracking-wider text-black">
                Work Type
              </Label>
              <Select onValueChange={(value) => setValue('work_type', value as any)}>
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
              <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-black">
                Location
              </Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="San Francisco, CA"
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary_range" className="text-xs font-bold uppercase tracking-wider text-black">
                Salary Range
              </Label>
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
            <Label htmlFor="job_url" className="text-xs font-bold uppercase tracking-wider text-black">
              Job URL
            </Label>
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
              <Label htmlFor="referral_name" className="text-xs font-bold uppercase tracking-wider text-black">
                Referral Name
              </Label>
              <Input
                id="referral_name"
                {...register('referral_name')}
                placeholder="John Doe"
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral_contact" className="text-xs font-bold uppercase tracking-wider text-black">
                Referral Contact
              </Label>
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
            <Label htmlFor="applied_date" className="text-xs font-bold uppercase tracking-wider text-black">
              Applied Date
            </Label>
            <Input
              id="applied_date"
              {...register('applied_date')}
              type="date"
              className="h-11 border-2 border-black bg-white font-mono text-sm focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-bold uppercase tracking-wider text-black">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Any additional notes about this application..."
              rows={3}
              className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors resize-none"
            />
          </div>

          {/* Footer */}
          <DialogFooter className="pt-4 border-t-2 border-black mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-11 px-6 bg-white text-black border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="h-11 px-6 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isSubmitting ? 'ADDING...' : 'ADD APPLICATION'}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
