'use client'

import { useUpcomingInterviews } from '@/hooks/use-interviews'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Video, Phone, Building2, FileCode, AlertTriangle } from 'lucide-react'
import { format, isToday, isTomorrow, differenceInHours } from 'date-fns'

const interviewTypeIcons = {
  phone: Phone,
  video: Video,
  onsite: Building2,
  take_home: FileCode,
}

export function UpcomingInterviewsWidget() {
  const { data: interviews, isLoading } = useUpcomingInterviews()

  if (isLoading) {
    return (
      <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-4 py-3 border-b-2 border-black bg-gray-200">
          <h3 className="text-xs font-black flex items-center gap-2 text-black uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            LOADING...
          </h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="h-16 bg-gray-100 border-2 border-black animate-pulse" />
          <div className="h-16 bg-gray-100 border-2 border-black animate-pulse" />
        </div>
      </div>
    )
  }

  if (!interviews?.length) {
    return (
      <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="px-4 py-3 border-b-2 border-black bg-gray-200">
          <h3 className="text-xs font-black flex items-center gap-2 text-black uppercase tracking-wider">
            <Calendar className="h-4 w-4" />
            UPCOMING INTERVIEWS
          </h3>
        </div>
        <div className="p-6 text-center">
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
            NO INTERVIEWS SCHEDULED
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      <div className="px-4 py-3 border-b-2 border-black bg-[#FF4D00]">
        <h3 className="text-xs font-black flex items-center gap-2 text-white uppercase tracking-wider">
          <Calendar className="h-4 w-4" />
          UPCOMING INTERVIEWS
        </h3>
        <p className="text-[10px] font-mono text-white/80 mt-1 uppercase tracking-widest">{interviews.length} SCHEDULED</p>
      </div>
      <div className="p-3 space-y-2">
        {interviews.slice(0, 3).map((interview) => {
          const Icon = interviewTypeIcons[interview.interview_type as keyof typeof interviewTypeIcons]
          const date = new Date(interview.interview_date)
          const hoursUntil = differenceInHours(date, new Date())
          const isUrgent = hoursUntil <= 24 && hoursUntil > 0

          let dateLabel = format(date, 'EEE, MMM d')
          if (isToday(date)) dateLabel = 'TODAY'
          if (isTomorrow(date)) dateLabel = 'TOMORROW'

          return (
            <div
              key={interview.id}
              className={`flex items-center gap-3 p-3 border-2 border-black transition-all ${
                isUrgent 
                  ? 'bg-[#FF4D00]/10' 
                  : 'bg-gray-50'
                }`}
            >
              <div className={`p-2 border-2 border-black ${isUrgent ? 'bg-[#FF4D00]' : 'bg-white'}`}>
                <Icon className={`h-4 w-4 ${isUrgent ? 'text-white' : 'text-black'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-xs truncate text-black uppercase tracking-tight">
                  {interview.applications?.company_name}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-gray-600 uppercase tracking-wider">
                  <span className={isUrgent ? 'text-[#FF4D00] font-bold' : ''}>
                    {dateLabel}
                  </span>
                  <span>•</span>
                  <span>{format(date, 'h:mm a')}</span>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
                R{interview.round_number}
              </span>
              {isUrgent && (
                <AlertTriangle className="h-4 w-4 text-[#FF4D00]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
