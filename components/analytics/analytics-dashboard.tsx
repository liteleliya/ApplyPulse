'use client'

import { useState, useCallback } from 'react'
import { useApplications } from '@/hooks/use-applications'
import { useInterviews } from '@/hooks/use-interviews'
import { Application } from '@/types'
import { ApplicationFunnel } from './application-funnel'
import { ApplicationTimeline } from './application-timeline'
import { MetricsCards } from './metrics-cards'
import { AnalyticsFilters } from './analytics-filters'
import { BarChart3, TrendingUp, Loader2 } from 'lucide-react'
import { format } from 'date-fns'

export function AnalyticsDashboard() {
  const { data: applications, isLoading: applicationsLoading } = useApplications()
  const { data: interviews, isLoading: interviewsLoading } = useInterviews()
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [timelineGroupBy, setTimelineGroupBy] = useState<'week' | 'month'>('week')
  const [activeChart, setActiveChart] = useState<'funnel' | 'timeline'>('funnel')

  const handleFilteredApplications = useCallback((apps: Application[]) => {
    setFilteredApplications(apps)
  }, [])

  const handleExportCSV = useCallback(() => {
    if (!filteredApplications.length) return

    // Define CSV columns
    const columns = [
      'Company',
      'Role',
      'Status',
      'Applied Date',
      'Location',
      'Work Type',
      'Salary Range',
      'Job URL',
      'Referral Name',
      'Notes',
      'Tags',
      'Created At',
      'Updated At'
    ]

    // Convert applications to CSV rows
    const rows = filteredApplications.map(app => [
      app.company_name,
      app.role_title,
      app.status,
      app.applied_date ? format(new Date(app.applied_date), 'yyyy-MM-dd') : '',
      app.location || '',
      app.work_type || '',
      app.salary_range || '',
      app.job_url || '',
      app.referral_name || '',
      (app.notes || '').replace(/"/g, '""'), // Escape quotes
      (app.tags || []).join('; '),
      format(new Date(app.created_at), 'yyyy-MM-dd HH:mm'),
      format(new Date(app.updated_at), 'yyyy-MM-dd HH:mm'),
    ])

    // Build CSV content
    const csvContent = [
      columns.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `applypulse-export-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [filteredApplications])

  if (applicationsLoading || interviewsLoading) {
    return (
      <div className="flex items-center justify-center h-64 border-2 border-black bg-[#F5F5F0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4D00]" />
      </div>
    )
  }

  const allApplications = applications || []
  const displayApplications = filteredApplications.length > 0 ? filteredApplications : allApplications

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-black uppercase tracking-tight">ANALYTICS DASHBOARD</h2>
          <p className="text-xs font-mono text-gray-600 uppercase tracking-widest">
            TRACK YOUR JOB SEARCH PROGRESS
          </p>
        </div>
      </div>

      {/* Filters */}
      <AnalyticsFilters
        applications={allApplications}
        onFilteredApplications={handleFilteredApplications}
        onExportCSV={handleExportCSV}
      />

      {/* Key Metrics */}
      <MetricsCards
        applications={displayApplications}
        interviews={interviews || []}
      />

      {/* Charts Section */}
      <div className="space-y-4">
        {/* Chart Toggle - Brutalist Tab Style */}
        <div className="flex gap-0 border-2 border-black inline-flex">
          <button
            onClick={() => setActiveChart('funnel')}
            className={`h-10 px-4 font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-colors ${
              activeChart === 'funnel' 
                ? 'bg-[#FF4D00] text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            FUNNEL
          </button>
          <button
            onClick={() => setActiveChart('timeline')}
            className={`h-10 px-4 font-bold uppercase text-xs tracking-wider flex items-center gap-2 border-l-2 border-black transition-colors ${
              activeChart === 'timeline' 
                ? 'bg-[#FF4D00] text-white' 
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            TIMELINE
          </button>
        </div>

        {/* Chart Content */}
        {activeChart === 'funnel' && (
          <ApplicationFunnel applications={displayApplications} />
        )}

        {activeChart === 'timeline' && (
          <div className="space-y-4">
            <div className="flex justify-end gap-0 border-2 border-black inline-flex">
              <button
                onClick={() => setTimelineGroupBy('week')}
                className={`h-8 px-3 font-bold uppercase text-[10px] tracking-wider transition-colors ${
                  timelineGroupBy === 'week' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                WEEKLY
              </button>
              <button
                onClick={() => setTimelineGroupBy('month')}
                className={`h-8 px-3 font-bold uppercase text-[10px] tracking-wider border-l-2 border-black transition-colors ${
                  timelineGroupBy === 'month' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                MONTHLY
              </button>
            </div>
            <ApplicationTimeline
              applications={displayApplications}
              groupBy={timelineGroupBy}
            />
          </div>
        )}
      </div>
    </div>
  )
}
