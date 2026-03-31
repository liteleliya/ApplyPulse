'use client'

import { useState } from 'react'
import { useCreateInterview } from '@/hooks/use-interviews'
import { Application } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, X, Plus, Link } from 'lucide-react'

interface AddInterviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applications: Application[]
  preselectedApplicationId?: string
}

export function AddInterviewDialog({
  open,
  onOpenChange,
  applications,
  preselectedApplicationId
}: AddInterviewDialogProps) {
  const createInterview = useCreateInterview()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [applicationId, setApplicationId] = useState(preselectedApplicationId || '')
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewType, setInterviewType] = useState<string>('video')
  const [roundNumber, setRoundNumber] = useState('1')
  const [interviewerInput, setInterviewerInput] = useState('')
  const [interviewers, setInterviewers] = useState<string[]>([])
  const [meetingLink, setMeetingLink] = useState('')
  const [prepNotes, setPrepNotes] = useState('')

  const resetForm = () => {
    setApplicationId(preselectedApplicationId || '')
    setInterviewDate('')
    setInterviewTime('')
    setInterviewType('video')
    setRoundNumber('1')
    setInterviewers([])
    setInterviewerInput('')
    setMeetingLink('')
    setPrepNotes('')
  }

  const addInterviewer = () => {
    const name = interviewerInput.trim()
    if (name && !interviewers.includes(name)) {
      setInterviewers([...interviewers, name])
      setInterviewerInput('')
    }
  }

  const removeInterviewer = (name: string) => {
    setInterviewers(interviewers.filter(i => i !== name))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!applicationId || !interviewDate || !interviewTime) return

    setIsSubmitting(true)
    try {
      const dateTime = new Date(`${interviewDate}T${interviewTime}`).toISOString()

      await createInterview.mutateAsync({
        application_id: applicationId,
        interview_date: dateTime,
        interview_type: interviewType,
        round_number: parseInt(roundNumber),
        interviewer_names: interviewers,
        meeting_link: meetingLink || undefined,
        preparation_notes: prepNotes || undefined,
      })

      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to create interview:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter to only show applications that are in interview-relevant stages
  const eligibleApplications = applications.filter(app =>
    ['applied', 'assessment', 'interview', 'offer'].includes(app.status)
  )

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogContent className="max-w-lg border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#F5F5F0]">
        <DialogHeader>
          <DialogTitle className="text-lg font-black uppercase tracking-tight text-black">SCHEDULE INTERVIEW</DialogTitle>
          <DialogDescription className="text-xs font-mono uppercase tracking-widest text-gray-600">
            ADD A NEW INTERVIEW TO YOUR CALENDAR
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black">APPLICATION *</label>
            <Select value={applicationId} onValueChange={setApplicationId}>
              <SelectTrigger className="border-2 border-black bg-white font-mono text-sm">
                <SelectValue placeholder="SELECT AN APPLICATION..." />
              </SelectTrigger>
              <SelectContent className="border-2 border-black">
                {eligibleApplications.map(app => (
                  <SelectItem key={app.id} value={app.id} className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold uppercase">{app.company_name}</span>
                      <span className="text-gray-500">-</span>
                      <span className="text-gray-600">{app.role_title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">DATE *</label>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="border-2 border-black bg-white font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">TIME *</label>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                className="border-2 border-black bg-white font-mono text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">TYPE</label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger className="border-2 border-black bg-white font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="phone" className="font-mono text-sm">📞 PHONE</SelectItem>
                  <SelectItem value="video" className="font-mono text-sm">📹 VIDEO</SelectItem>
                  <SelectItem value="onsite" className="font-mono text-sm">🏢 ON-SITE</SelectItem>
                  <SelectItem value="take_home" className="font-mono text-sm">💻 TAKE HOME</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black">ROUND</label>
              <Select value={roundNumber} onValueChange={setRoundNumber}>
                <SelectTrigger className="border-2 border-black bg-white font-mono text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <SelectItem key={n} value={n.toString()} className="font-mono text-sm">ROUND {n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(interviewType === 'video' || interviewType === 'phone') && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2">
                <Link className="h-4 w-4" />
                MEETING LINK
              </label>
              <Input
                type="url"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                placeholder="https://zoom.us/j/..."
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black">INTERVIEWERS</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interviewers.map(name => (
                <span key={name} className="bg-black text-white px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest flex items-center gap-1">
                  {name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-red-400"
                    onClick={() => removeInterviewer(name)}
                  />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={interviewerInput}
                onChange={(e) => setInterviewerInput(e.target.value)}
                placeholder="Add interviewer name..."
                className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addInterviewer()
                  }
                }}
              />
              <button 
                type="button" 
                onClick={addInterviewer}
                className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100"
              >
                <Plus className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-black">PREPARATION NOTES</label>
            <Textarea
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Topics to review, questions to prepare..."
              rows={3}
              className="border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400"
            />
          </div>

          <DialogFooter className="gap-2">
            <button 
              type="button" 
              onClick={() => onOpenChange(false)} 
              disabled={isSubmitting}
              className="h-10 px-4 border-2 border-black bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              CANCEL
            </button>
            <button 
              type="submit" 
              disabled={!applicationId || !interviewDate || !interviewTime || isSubmitting}
              className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  SCHEDULING...
                </>
              ) : (
                'SCHEDULE'
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
