'use client'

import { useMemo } from 'react'
import { Application } from '@/types'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from 'recharts'
import { format, parseISO, startOfMonth, eachWeekOfInterval, eachMonthOfInterval, subMonths } from 'date-fns'

interface ApplicationTimelineProps {
  applications: Application[]
  groupBy?: 'week' | 'month'
}

export function ApplicationTimeline({ applications, groupBy = 'week' }: ApplicationTimelineProps) {
  const timelineData = useMemo(() => {
    if (!applications.length) return []

    // Get date range - go back further to capture more data
    const maxDate = new Date()
    const minDate = subMonths(maxDate, groupBy === 'week' ? 3 : 6)

    // Generate time intervals
    const intervals = groupBy === 'week'
      ? eachWeekOfInterval({ start: minDate, end: maxDate })
      : eachMonthOfInterval({ start: minDate, end: maxDate })

    // Group applications by interval
    return intervals.map(intervalStart => {
      const intervalEnd = groupBy === 'week'
        ? new Date(intervalStart.getTime() + 7 * 24 * 60 * 60 * 1000)
        : startOfMonth(new Date(intervalStart.getFullYear(), intervalStart.getMonth() + 1, 1))

      const appsInInterval = applications.filter(app => {
        // Use created_at as primary, fall back to applied_date
        const dateStr = app.created_at || app.applied_date
        if (!dateStr) return false
        
        try {
          const appDate = parseISO(dateStr)
          return appDate >= intervalStart && appDate < intervalEnd
        } catch {
          return false
        }
      })

      return {
        date: format(intervalStart, groupBy === 'week' ? 'MMM d' : 'MMM yyyy'),
        fullDate: intervalStart,
        total: appsInInterval.length,
        wishlist: appsInInterval.filter(a => a.status === 'wishlist').length,
        applied: appsInInterval.filter(a => a.status === 'applied').length,
        interview: appsInInterval.filter(a => a.status === 'interview' || a.status === 'assessment').length,
        offer: appsInInterval.filter(a => a.status === 'offer' || a.status === 'accepted').length,
        rejected: appsInInterval.filter(a => a.status === 'rejected').length,
      }
    })
  }, [applications, groupBy])

  if (!applications.length) {
    return (
      <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-4 border-b-2 border-black bg-black">
          <h3 className="text-sm font-black uppercase tracking-tight text-white">APPLICATION TIMELINE</h3>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">YOUR APPLICATION ACTIVITY OVER TIME</p>
        </div>
        <div className="h-64 flex items-center justify-center">
          <p className="text-xs font-mono uppercase tracking-widest text-gray-500">NO APPLICATION DATA TO DISPLAY</p>
        </div>
      </div>
    )
  }

  // Check if there's any data in the timeline
  const hasData = timelineData.some(d => d.total > 0)

  return (
    <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-black">
        <h3 className="text-sm font-black uppercase tracking-tight text-white">APPLICATION TIMELINE</h3>
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
          APPLICATIONS BY {groupBy === 'week' ? 'WEEK' : 'MONTH'} • LAST {groupBy === 'week' ? '3 MONTHS' : '6 MONTHS'}
        </p>
      </div>
      
      <div className="p-6">
        {!hasData ? (
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-2">NO RECENT ACTIVITY</p>
              <p className="text-[10px] font-mono text-gray-400">Applications will appear here as you add them</p>
            </div>
          </div>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" strokeOpacity={0.5} vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#666', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={{ stroke: '#000', strokeWidth: 1 }}
                />
                <YAxis
                  tick={{ fontSize: 10, fontFamily: 'JetBrains Mono, monospace', fill: '#666', fontWeight: 600 }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#F5F5F0',
                    border: '2px solid #000',
                    borderRadius: '0',
                    boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    padding: '12px',
                  }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '8px', color: '#000' }}
                  itemStyle={{ color: '#333', padding: '2px 0' }}
                  formatter={(value: number, name: string) => [value, name]}
                />
                <Legend 
                  wrapperStyle={{ 
                    fontFamily: 'JetBrains Mono, monospace', 
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                  }}
                />
                <Bar dataKey="wishlist" name="WISHLIST" stackId="a" fill="#64748b" />
                <Bar dataKey="applied" name="APPLIED" stackId="a" fill="#0ea5e9" />
                <Bar dataKey="interview" name="INTERVIEW" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="offer" name="OFFER" stackId="a" fill="#FF4D00" />
                <Bar dataKey="rejected" name="REJECTED" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
