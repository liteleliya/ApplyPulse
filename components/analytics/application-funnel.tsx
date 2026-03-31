'use client'

import { useMemo } from 'react'
import { Application } from '@/types'

interface ApplicationFunnelProps {
  applications: Application[]
}

export function ApplicationFunnel({ applications }: ApplicationFunnelProps) {
  const funnelData = useMemo(() => {
    // Count applications by status
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const total = applications.length

    return { statusCounts, total }
  }, [applications])

  // Better color palette - more distinct and professional
  const stages = [
    { label: 'TOTAL', count: funnelData.total, color: 'bg-slate-500', borderColor: 'border-slate-700' },
    { label: 'WISHLIST', count: funnelData.statusCounts.wishlist || 0, color: 'bg-amber-400', borderColor: 'border-amber-600' },
    { label: 'APPLIED', count: funnelData.statusCounts.applied || 0, color: 'bg-sky-500', borderColor: 'border-sky-700' },
    { label: 'ASSESSMENT', count: funnelData.statusCounts.assessment || 0, color: 'bg-violet-500', borderColor: 'border-violet-700' },
    { label: 'INTERVIEW', count: funnelData.statusCounts.interview || 0, color: 'bg-cyan-500', borderColor: 'border-cyan-700' },
    { label: 'OFFER', count: funnelData.statusCounts.offer || 0, color: 'bg-[#FF4D00]', borderColor: 'border-[#CC3D00]' },
    { label: 'ACCEPTED', count: funnelData.statusCounts.accepted || 0, color: 'bg-emerald-500', borderColor: 'border-emerald-700' },
    { label: 'REJECTED', count: funnelData.statusCounts.rejected || 0, color: 'bg-rose-500', borderColor: 'border-rose-700' },
  ]

  // Calculate conversion rates
  const conversionRate = (from: number, to: number) => {
    if (from === 0) return '0'
    return ((to / from) * 100).toFixed(1)
  }

  const applied = funnelData.statusCounts.applied || 0
  const interview = funnelData.statusCounts.interview || 0
  const offer = funnelData.statusCounts.offer || 0
  const accepted = funnelData.statusCounts.accepted || 0

  return (
    <div className="border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
      {/* Header */}
      <div className="p-4 border-b-2 border-black bg-black">
        <h3 className="text-sm font-black uppercase tracking-tight text-white">APPLICATION FUNNEL</h3>
        <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400">TRACK YOUR JOURNEY FROM START TO FINISH</p>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Visual Funnel - Brutalist Style */}
        <div className="space-y-2">
          {stages.map((stage) => {
            const percentage = funnelData.total > 0 
              ? (stage.count / funnelData.total) * 100 
              : 0
            const width = Math.max(percentage, stage.count > 0 ? 10 : 3)
            
            return (
              <div key={stage.label} className="flex items-center gap-3 group">
                <div className="w-24 text-right">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-600 group-hover:text-black transition-colors">{stage.label}</span>
                </div>
                <div className="flex-1 relative h-8 bg-gray-100 border-2 border-black overflow-hidden">
                  <div
                    className={`absolute left-0 top-0 h-full ${stage.color} transition-all duration-500 ease-out flex items-center justify-end pr-2`}
                    style={{ width: `${width}%` }}
                  >
                    {stage.count > 0 && (
                      <span className="text-white font-black text-xs drop-shadow-[1px_1px_0px_rgba(0,0,0,0.5)]">
                        {stage.count}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-14 text-right">
                  <span className="text-[10px] font-mono font-bold text-gray-500">{percentage.toFixed(0)}%</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Grid - Brutalist with better colors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t-2 border-black">
          <div className="text-center p-3 border-2 border-black bg-sky-50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-1">RESPONSE RATE</p>
            <p className="text-2xl font-black text-sky-600">
              {conversionRate(
                applied,
                (funnelData.statusCounts.assessment || 0) + interview + offer
              )}%
            </p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-gray-500">APPLIED → RESPONSE</p>
          </div>
          
          <div className="text-center p-3 border-2 border-black bg-violet-50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-1">INTERVIEW RATE</p>
            <p className="text-2xl font-black text-violet-600">
              {conversionRate(applied, interview)}%
            </p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-gray-500">APPLIED → INTERVIEW</p>
          </div>
          
          <div className="text-center p-3 border-2 border-black bg-orange-50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-1">OFFER RATE</p>
            <p className="text-2xl font-black text-[#FF4D00]">
              {conversionRate(interview, offer)}%
            </p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-gray-500">INTERVIEW → OFFER</p>
          </div>
          
          <div className="text-center p-3 border-2 border-black bg-emerald-50">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-600 mb-1">SUCCESS RATE</p>
            <p className="text-2xl font-black text-emerald-600">
              {conversionRate(funnelData.total, accepted)}%
            </p>
            <p className="text-[8px] font-mono uppercase tracking-widest text-gray-500">TOTAL → ACCEPTED</p>
          </div>
        </div>
      </div>
    </div>
  )
}
