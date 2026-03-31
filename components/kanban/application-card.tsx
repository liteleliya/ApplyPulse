'use client'

import { Application } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { Building2, MapPin, Calendar, FileText } from 'lucide-react'

interface ApplicationCardProps {
  application: Application
  linkedResumes?: { id: string; title: string }[]
  onClick?: () => void
  isDragging?: boolean
}

export function ApplicationCard({ application, linkedResumes, onClick, isDragging }: ApplicationCardProps) {
  const daysInStage = application.status_updated_at
    ? formatDistanceToNow(new Date(application.status_updated_at), { addSuffix: true })
    : 'Just now'

  return (
    <div
      className={`group p-4 cursor-grab active:cursor-grabbing bg-white border-2 border-black transition-all duration-200 ease-out ${
        isDragging 
          ? 'shadow-[8px_8px_0px_0px_rgba(255,77,0,0.5)] border-[#FF4D00]' 
          : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
      }`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with Company Name */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 bg-[#FF4D00] border-2 border-black flex items-center justify-center flex-shrink-0">
              <Building2 className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-black text-sm truncate text-black uppercase tracking-tight">
                {application.company_name}
              </h3>
            </div>
          </div>
          {application.work_type && (
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2 py-0.5">
              {application.work_type}
            </span>
          )}
        </div>

        {/* Role Title */}
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug font-medium">
          {application.role_title}
        </p>

        {/* Metadata */}
        <div className="flex flex-col gap-1 text-[11px] font-mono text-gray-600 uppercase tracking-wider">
          {application.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{application.location}</span>
            </div>
          )}
          {application.applied_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {new Date(application.applied_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Linked Resumes */}
        {linkedResumes && linkedResumes.length > 0 && (
          <div className="pt-2 border-t-2 border-black">
            <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-gray-600">
              <FileText className="h-3 w-3" />
              <span className="truncate font-bold">
                {linkedResumes.map(r => r.title).join(', ')}
              </span>
            </div>
          </div>
        )}

        {application.tags && application.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {application.tags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-[10px] font-mono font-bold uppercase tracking-widest bg-gray-200 text-black px-2 py-0.5 border border-black">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-black/20 uppercase tracking-widest">
          {daysInStage}
        </div>
      </div>
    </div>
  )
}
