'use client'

import { useMemo } from 'react'
import { Application, Interview } from '@/types'
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Send,
  Calendar,
  CheckCircle,
  XCircle,
  Briefcase,
  BarChart3
} from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'

interface MetricsCardsProps {
  applications: Application[]
  interviews?: Interview[]
}

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
    isPositive: boolean
  }
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red' | 'gray'
}

const iconBgColors = {
  blue: 'bg-blue-200 border-blue-400',
  green: 'bg-green-200 border-green-400',
  orange: 'bg-[#FF4D00] border-black',
  purple: 'bg-purple-200 border-purple-400',
  red: 'bg-red-200 border-red-400',
  gray: 'bg-gray-200 border-gray-400',
}

const iconTextColors = {
  blue: 'text-blue-700',
  green: 'text-green-700',
  orange: 'text-white',
  purple: 'text-purple-700',
  red: 'text-red-700',
  gray: 'text-gray-700',
}

function MetricCard({ title, value, subtitle, icon, trend, color }: MetricCardProps) {
  return (
    <div className="border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500">{title}</p>
          <p className="text-3xl font-black mt-1 text-black">{value}</p>
          {subtitle && <p className="text-[10px] font-mono text-gray-500 mt-1 uppercase tracking-wider">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-[10px] font-mono uppercase tracking-wider ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              <span>{trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={`p-2 border-2 border-black ${iconBgColors[color]}`}>
          <span className={iconTextColors[color]}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

export function MetricsCards({ applications, interviews = [] }: MetricsCardsProps) {
  const metrics = useMemo(() => {
    const total = applications.length
    const applied = applications.filter(a => a.status !== 'wishlist').length
    const inProgress = applications.filter(a =>
      ['applied', 'assessment', 'interview'].includes(a.status)
    ).length
    const interviews_stage = applications.filter(a => a.status === 'interview').length
    const offers = applications.filter(a => a.status === 'offer').length
    const accepted = applications.filter(a => a.status === 'accepted').length
    const rejected = applications.filter(a => a.status === 'rejected').length

    // Calculate response rate (applications that got past 'applied' stage)
    const responded = applications.filter(a =>
      ['assessment', 'interview', 'offer', 'accepted', 'rejected'].includes(a.status)
    ).length
    const responseRate = applied > 0 ? ((responded / applied) * 100).toFixed(1) : '0'

    // Calculate average time to first response (for apps that got responses)
    const appsWithResponse = applications.filter(a =>
      a.status !== 'wishlist' && a.status !== 'applied' && a.applied_date
    )
    let avgResponseTime = 0
    if (appsWithResponse.length > 0) {
      const totalDays = appsWithResponse.reduce((sum, app) => {
        const appliedDate = parseISO(app.applied_date!)
        const statusUpdated = parseISO(app.status_updated_at || app.updated_at)
        return sum + differenceInDays(statusUpdated, appliedDate)
      }, 0)
      avgResponseTime = Math.round(totalDays / appsWithResponse.length)
    }

    // This month stats
    const now = new Date()
    const thisMonth = applications.filter(a => {
      const date = parseISO(a.applied_date || a.created_at)
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    }).length

    const lastMonth = applications.filter(a => {
      const date = parseISO(a.applied_date || a.created_at)
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear()
    }).length

    const monthlyTrend = lastMonth > 0
      ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100)
      : thisMonth > 0 ? 100 : 0

    // Offer rate
    const offerRate = interviews_stage + offers + accepted > 0
      ? ((offers + accepted) / (interviews_stage + offers + accepted) * 100).toFixed(1)
      : '0'

    return {
      total,
      applied,
      inProgress,
      interviews: interviews_stage,
      offers,
      accepted,
      rejected,
      responseRate,
      avgResponseTime,
      thisMonth,
      monthlyTrend,
      offerRate,
      upcomingInterviews: interviews.filter(i => new Date(i.interview_date) > now).length,
    }
  }, [applications, interviews])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Total Applications"
        value={metrics.total}
        subtitle={`${metrics.thisMonth} this month`}
        icon={<Briefcase className="h-5 w-5" />}
        color="blue"
        trend={metrics.monthlyTrend !== 0 ? {
          value: metrics.monthlyTrend,
          label: 'vs last month',
          isPositive: metrics.monthlyTrend > 0
        } : undefined}
      />

      <MetricCard
        title="Response Rate"
        value={`${metrics.responseRate}%`}
        subtitle={`${metrics.applied - (metrics.total - metrics.applied)} applied`}
        icon={<Send className="h-5 w-5" />}
        color="purple"
      />

      <MetricCard
        title="In Progress"
        value={metrics.inProgress}
        subtitle={`${metrics.interviews} at interview stage`}
        icon={<Target className="h-5 w-5" />}
        color="orange"
      />

      <MetricCard
        title="Avg Response Time"
        value={metrics.avgResponseTime > 0 ? `${metrics.avgResponseTime}d` : 'N/A'}
        subtitle="days to first response"
        icon={<Clock className="h-5 w-5" />}
        color="gray"
      />

      <MetricCard
        title="Offers Received"
        value={metrics.offers + metrics.accepted}
        subtitle={`${metrics.offerRate}% offer rate`}
        icon={<CheckCircle className="h-5 w-5" />}
        color="green"
      />

      <MetricCard
        title="Accepted"
        value={metrics.accepted}
        subtitle={metrics.offers > 0 ? `${metrics.offers} pending decision` : 'none pending'}
        icon={<BarChart3 className="h-5 w-5" />}
        color="green"
      />

      <MetricCard
        title="Rejected"
        value={metrics.rejected}
        subtitle={metrics.total > 0 ? `${((metrics.rejected / metrics.total) * 100).toFixed(0)}% of total` : '0%'}
        icon={<XCircle className="h-5 w-5" />}
        color="red"
      />

      <MetricCard
        title="Upcoming Interviews"
        value={metrics.upcomingInterviews}
        subtitle="scheduled"
        icon={<Calendar className="h-5 w-5" />}
        color="blue"
      />
    </div>
  )
}
