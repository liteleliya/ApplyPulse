'use client'

import { useState } from 'react'
import { useInterviews, useDeleteInterview, useUpdateInterview, InterviewWithApplication } from '@/hooks/use-interviews'
import { useApplications } from '@/hooks/use-applications'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Calendar,
  Clock,
  Plus,
  Loader2,
  Video,
  Phone,
  Building2,
  FileCode,
  Trash2,
  Edit2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Link,
  ExternalLink
} from 'lucide-react'
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'
import { AddInterviewDialog } from './add-interview-dialog'
import { Interview } from '@/types'

const interviewTypeIcons = {
  phone: Phone,
  video: Video,
  onsite: Building2,
  take_home: FileCode,
}

const interviewTypeLabels = {
  phone: 'Phone',
  video: 'Video',
  onsite: 'On-site',
  take_home: 'Take Home',
}

const resultColors = {
  pending: 'bg-yellow-200 text-black border-2 border-black',
  passed: 'bg-green-200 text-black border-2 border-black',
  failed: 'bg-red-200 text-black border-2 border-black',
  no_show: 'bg-gray-200 text-black border-2 border-black',
}

const resultLabels = {
  pending: 'PENDING',
  passed: 'PASSED',
  failed: 'FAILED',
  no_show: 'NO SHOW',
}

export function InterviewTracker() {
  const { data: interviews, isLoading } = useInterviews()
  const { data: applications } = useApplications()
  const deleteInterview = useDeleteInterview()
  const updateInterview = useUpdateInterview()

  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedInterview, setSelectedInterview] = useState<InterviewWithApplication | null>(null)

  // Form state for editing
  const [editPrepNotes, setEditPrepNotes] = useState('')
  const [editPostNotes, setEditPostNotes] = useState('')
  const [editResult, setEditResult] = useState<string>('pending')
  const [editMeetingLink, setEditMeetingLink] = useState('')
  const [editDate, setEditDate] = useState('')
  const [editTime, setEditTime] = useState('')
  const [editInterviewType, setEditInterviewType] = useState<string>('video')
  const [editRoundNumber, setEditRoundNumber] = useState<number>(1)

  const handleEdit = (interview: InterviewWithApplication) => {
    setSelectedInterview(interview)
    setEditPrepNotes(interview.preparation_notes || '')
    setEditPostNotes(interview.post_interview_notes || '')
    setEditResult(interview.result)
    setEditMeetingLink(interview.meeting_link || '')
    // Parse date and time from interview_date
    const interviewDate = new Date(interview.interview_date)
    setEditDate(format(interviewDate, 'yyyy-MM-dd'))
    setEditTime(format(interviewDate, 'HH:mm'))
    setEditInterviewType(interview.interview_type)
    setEditRoundNumber(interview.round_number)
    setShowEditDialog(true)
  }

  const handleSaveEdit = async () => {
    if (!selectedInterview) return

    // Combine date and time into ISO string
    const combinedDateTime = new Date(`${editDate}T${editTime}:00`)

    try {
      await updateInterview.mutateAsync({
        id: selectedInterview.id,
        preparation_notes: editPrepNotes,
        post_interview_notes: editPostNotes,
        result: editResult,
        meeting_link: editMeetingLink || undefined,
        interview_date: combinedDateTime.toISOString(),
        interview_type: editInterviewType,
        round_number: editRoundNumber,
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error('Failed to update interview:', error)
    }
  }

  const handleDelete = async () => {
    if (!selectedInterview) return

    try {
      await deleteInterview.mutateAsync(selectedInterview.id)
      setShowDeleteConfirm(false)
      setSelectedInterview(null)
    } catch (error) {
      console.error('Failed to delete interview:', error)
    }
  }

  const getDateLabel = (dateStr: string) => {
    const date = new Date(dateStr)
    if (isToday(date)) return 'TODAY'
    if (isTomorrow(date)) return 'TOMORROW'
    if (isPast(date)) return format(date, 'MMM d, yyyy').toUpperCase()
    return format(date, 'EEE, MMM d').toUpperCase()
  }

  // Separate upcoming and past interviews
  const now = new Date()
  const upcomingInterviews = interviews?.filter(i => new Date(i.interview_date) >= now) || []
  const pastInterviews = interviews?.filter(i => new Date(i.interview_date) < now) || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-black bg-[#F5F5F0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4D00]" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-black uppercase tracking-tight">INTERVIEW TRACKER</h2>
            <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
              {upcomingInterviews.length} UPCOMING • {pastInterviews.length} COMPLETED
            </p>
          </div>
          <button 
            onClick={() => setShowAddDialog(true)} 
            disabled={!applications?.length}
            className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
            SCHEDULE
          </button>
        </div>

        {!applications?.length && (
          <div className="border-2 border-yellow-500 bg-yellow-100 p-4">
            <p className="text-xs font-mono text-yellow-800 uppercase tracking-wider">
              ⚠ ADD JOB APPLICATIONS FIRST BEFORE SCHEDULING INTERVIEWS
            </p>
          </div>
        )}

        {/* Upcoming Interviews */}
        <div className="space-y-4">
          <h3 className="text-sm font-black flex items-center gap-2 text-black uppercase tracking-wider">
            <Calendar className="h-5 w-5 text-[#FF4D00]" />
            UPCOMING INTERVIEWS
          </h3>

          {upcomingInterviews.length === 0 ? (
            <div className="border-2 border-dashed border-black p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">NO UPCOMING INTERVIEWS</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {upcomingInterviews.map((interview) => {
                const Icon = interviewTypeIcons[interview.interview_type as keyof typeof interviewTypeIcons]
                const isUpcomingSoon = isToday(new Date(interview.interview_date)) || isTomorrow(new Date(interview.interview_date))

                return (
                  <div key={interview.id} className={`border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isUpcomingSoon ? 'bg-[#FF4D00]/10' : 'bg-white'}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 border-2 border-black ${isUpcomingSoon ? 'bg-[#FF4D00]' : 'bg-gray-100'}`}>
                          <Icon className={`h-6 w-6 ${isUpcomingSoon ? 'text-white' : 'text-black'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-black text-sm uppercase tracking-tight text-black">{interview.applications?.company_name}</h4>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                              R{interview.round_number}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-gray-600 mb-2">{interview.applications?.role_title}</p>
                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div className="flex items-center gap-1 text-gray-600">
                              <Calendar className="h-4 w-4" />
                              <span className={isUpcomingSoon ? 'font-bold text-[#FF4D00]' : ''}>
                                {getDateLabel(interview.interview_date)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="h-4 w-4" />
                              <span>{format(new Date(interview.interview_date), 'h:mm a')}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-gray-200 text-black px-2 py-0.5 border border-black">
                              {interviewTypeLabels[interview.interview_type as keyof typeof interviewTypeLabels].toUpperCase()}
                            </span>
                          </div>
                          {interview.meeting_link && (
                            <a
                              href={interview.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs font-mono font-bold text-[#FF4D00] hover:underline uppercase tracking-wider"
                            >
                              <Link className="h-3 w-3" />
                              JOIN MEETING
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleEdit(interview)}
                          className="h-8 w-8 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4 text-black" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedInterview(interview)
                            setShowDeleteConfirm(true)
                          }}
                          className="h-8 w-8 border-2 border-red-500 bg-red-100 flex items-center justify-center hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                    {interview.preparation_notes && (
                      <div className="mt-4 p-3 bg-gray-100 border-2 border-black">
                        <p className="text-[10px] font-mono font-bold text-gray-500 mb-1 uppercase tracking-widest">PREP NOTES</p>
                        <p className="text-sm text-black">{interview.preparation_notes}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Past Interviews */}
        {pastInterviews.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-black flex items-center gap-2 text-black uppercase tracking-wider">
              <Clock className="h-5 w-5 text-gray-500" />
              PAST INTERVIEWS
            </h3>

            <div className="grid gap-3">
              {pastInterviews.map((interview) => {
                const Icon = interviewTypeIcons[interview.interview_type as keyof typeof interviewTypeIcons]

                return (
                  <div key={interview.id} className="border-2 border-black p-3 bg-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-gray-500" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-xs uppercase tracking-tight text-black">{interview.applications?.company_name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-xs font-mono text-gray-600">{interview.applications?.role_title}</span>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white px-1.5 py-0.5">
                              R{interview.round_number}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                            {format(new Date(interview.interview_date), 'MMM d, yyyy').toUpperCase()} • {formatDistanceToNow(new Date(interview.interview_date), { addSuffix: true }).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`${resultColors[interview.result as keyof typeof resultColors]} text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5`}>
                          {resultLabels[interview.result as keyof typeof resultLabels]}
                        </span>
                        <button 
                          onClick={() => handleEdit(interview)}
                          className="h-8 w-8 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100"
                        >
                          <Edit2 className="h-4 w-4 text-black" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Add Interview Dialog */}
      <AddInterviewDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        applications={applications || []}
      />

      {/* Edit Interview Dialog - Brutalist */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F5F5F0] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black uppercase tracking-tight text-black">EDIT INTERVIEW</DialogTitle>
            <DialogDescription className="text-xs font-mono uppercase tracking-widest text-gray-600">
              {selectedInterview?.applications?.company_name} - {selectedInterview?.applications?.role_title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  DATE
                </label>
                <Input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="border-2 border-black bg-white font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  TIME
                </label>
                <Input
                  type="time"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                  className="border-2 border-black bg-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Type & Round Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black">INTERVIEW TYPE</label>
                <Select value={editInterviewType} onValueChange={setEditInterviewType}>
                  <SelectTrigger className="border-2 border-black bg-white font-mono text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-2 border-black">
                    <SelectItem value="video">
                      <div className="flex items-center gap-2 font-mono text-sm uppercase">
                        <Video className="h-4 w-4" />
                        VIDEO
                      </div>
                    </SelectItem>
                    <SelectItem value="phone">
                      <div className="flex items-center gap-2 font-mono text-sm uppercase">
                        <Phone className="h-4 w-4" />
                        PHONE
                      </div>
                    </SelectItem>
                    <SelectItem value="onsite">
                      <div className="flex items-center gap-2 font-mono text-sm uppercase">
                        <Building2 className="h-4 w-4" />
                        ON-SITE
                      </div>
                    </SelectItem>
                    <SelectItem value="take_home">
                      <div className="flex items-center gap-2 font-mono text-sm uppercase">
                        <FileCode className="h-4 w-4" />
                        TAKE HOME
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black">ROUND #</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={editRoundNumber}
                  onChange={(e) => setEditRoundNumber(parseInt(e.target.value) || 1)}
                  className="border-2 border-black bg-white font-mono text-sm"
                />
              </div>
            </div>

            {/* Result */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">RESULT</label>
              <Select value={editResult} onValueChange={setEditResult}>
                <SelectTrigger className="border-2 border-black bg-white font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2 font-mono text-sm uppercase">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                      PENDING
                    </div>
                  </SelectItem>
                  <SelectItem value="passed">
                    <div className="flex items-center gap-2 font-mono text-sm uppercase">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      PASSED
                    </div>
                  </SelectItem>
                  <SelectItem value="failed">
                    <div className="flex items-center gap-2 font-mono text-sm uppercase">
                      <XCircle className="h-4 w-4 text-red-500" />
                      FAILED
                    </div>
                  </SelectItem>
                  <SelectItem value="no_show" className="font-mono text-sm uppercase">NO SHOW</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting Link - show for video/phone */}
            {(editInterviewType === 'video' || editInterviewType === 'phone') && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  MEETING LINK
                </label>
                <Input
                  type="url"
                  value={editMeetingLink}
                  onChange={(e) => setEditMeetingLink(e.target.value)}
                  placeholder="https://zoom.us/j/..."
                  className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">PREPARATION NOTES</label>
              <Textarea
                value={editPrepNotes}
                onChange={(e) => setEditPrepNotes(e.target.value)}
                placeholder="Topics to review, questions to ask..."
                rows={3}
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">POST-INTERVIEW NOTES</label>
              <Textarea
                value={editPostNotes}
                onChange={(e) => setEditPostNotes(e.target.value)}
                placeholder="How did it go? What questions were asked?"
                rows={3}
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button 
              onClick={() => setShowEditDialog(false)}
              className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors"
            >
              CANCEL
            </button>
            <button 
              onClick={handleSaveEdit}
              className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              SAVE CHANGES
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation - Brutalist */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="border-2 border-red-500 bg-[#F5F5F0] shadow-[8px_8px_0px_0px_rgba(239,68,68,0.5)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-black uppercase tracking-tight text-black">⚠ DELETE INTERVIEW?</AlertDialogTitle>
            <AlertDialogDescription className="text-xs font-mono uppercase tracking-wider text-gray-600">
              THIS WILL PERMANENTLY DELETE THIS INTERVIEW RECORD.
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
