'use client'

import { useState, useMemo, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Download, Filter, X } from 'lucide-react'
import { Application } from '@/types'
import { parseISO, isWithinInterval, subDays, subMonths } from 'date-fns'

interface AnalyticsFiltersProps {
  applications: Application[]
  onFilteredApplications: (apps: Application[]) => void
  onExportCSV: () => void
}

type DatePreset = 'all' | 'today' | 'week' | 'month' | '3months' | '6months' | 'year' | 'custom'

export function AnalyticsFilters({ applications, onFilteredApplications, onExportCSV }: AnalyticsFiltersProps) {
  const [datePreset, setDatePreset] = useState<DatePreset>('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredApplications = useMemo(() => {
    let filtered = [...applications]

    // Apply date filter
    if (datePreset !== 'all') {
      const now = new Date()
      let startDate: Date | null = null
      let endDate: Date = now

      switch (datePreset) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0))
          break
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = subMonths(now, 1)
          break
        case '3months':
          startDate = subMonths(now, 3)
          break
        case '6months':
          startDate = subMonths(now, 6)
          break
        case 'year':
          startDate = subMonths(now, 12)
          break
        case 'custom':
          if (customStartDate) startDate = parseISO(customStartDate)
          if (customEndDate) endDate = parseISO(customEndDate)
          break
      }

      if (startDate) {
        filtered = filtered.filter(app => {
          const appDate = parseISO(app.applied_date || app.created_at)
          return isWithinInterval(appDate, { start: startDate!, end: endDate })
        })
      }
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    return filtered
  }, [applications, datePreset, customStartDate, customEndDate, statusFilter])

  // Update parent with filtered applications using useEffect (not useMemo)
  useEffect(() => {
    onFilteredApplications(filteredApplications)
  }, [filteredApplications, onFilteredApplications])

  const clearFilters = () => {
    setDatePreset('all')
    setCustomStartDate('')
    setCustomEndDate('')
    setStatusFilter('all')
  }

  const hasActiveFilters = datePreset !== 'all' || statusFilter !== 'all'

  return (
    <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-black">
        <div>
          <h3 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-2">
            <Filter className="h-4 w-4" />
            FILTERS
          </h3>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500">
            SHOWING {filteredApplications.length} OF {applications.length} APPLICATIONS
          </p>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="h-8 px-3 border-2 border-black bg-white text-black font-bold uppercase text-[10px] tracking-wider hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              CLEAR
            </button>
          )}
          <button 
            onClick={onExportCSV}
            className="h-8 px-3 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-[10px] tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
          >
            <Download className="h-3 w-3" />
            EXPORT CSV
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-4">
        {/* Date Preset */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">TIME PERIOD</label>
          <Select value={datePreset} onValueChange={(v) => setDatePreset(v as DatePreset)}>
            <SelectTrigger className="w-36 border-2 border-black bg-white font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              <SelectItem value="all" className="font-mono text-xs">ALL TIME</SelectItem>
              <SelectItem value="today" className="font-mono text-xs">TODAY</SelectItem>
              <SelectItem value="week" className="font-mono text-xs">LAST 7 DAYS</SelectItem>
              <SelectItem value="month" className="font-mono text-xs">LAST 30 DAYS</SelectItem>
              <SelectItem value="3months" className="font-mono text-xs">LAST 3 MONTHS</SelectItem>
              <SelectItem value="6months" className="font-mono text-xs">LAST 6 MONTHS</SelectItem>
              <SelectItem value="year" className="font-mono text-xs">LAST YEAR</SelectItem>
              <SelectItem value="custom" className="font-mono text-xs">CUSTOM RANGE</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Custom Date Range */}
        {datePreset === 'custom' && (
          <>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">FROM</label>
              <Input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-36 border-2 border-black bg-white font-mono text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">TO</label>
              <Input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-36 border-2 border-black bg-white font-mono text-xs"
              />
            </div>
          </>
        )}

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">STATUS</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 border-2 border-black bg-white font-mono text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              <SelectItem value="all" className="font-mono text-xs">ALL STATUSES</SelectItem>
              <SelectItem value="wishlist" className="font-mono text-xs">⭐ WISHLIST</SelectItem>
              <SelectItem value="applied" className="font-mono text-xs">📤 APPLIED</SelectItem>
              <SelectItem value="assessment" className="font-mono text-xs">📝 ASSESSMENT</SelectItem>
              <SelectItem value="interview" className="font-mono text-xs">🎤 INTERVIEW</SelectItem>
              <SelectItem value="offer" className="font-mono text-xs">🎉 OFFER</SelectItem>
              <SelectItem value="accepted" className="font-mono text-xs">✅ ACCEPTED</SelectItem>
              <SelectItem value="rejected" className="font-mono text-xs">❌ REJECTED</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
