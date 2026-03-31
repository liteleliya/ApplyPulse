'use client'

import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import {
  getRecommendedQuestions,
  getInterviewTopics,
  getCompanyTier,
  type PracticeQuestion,
  type StudyTopic,
  type CompanyTier
} from '@/lib/practice/study-data'
import { CheckSquare, Square, ExternalLink, BookOpen, Code, Database, Network, Cpu, Users, ChevronDown, ChevronRight, Trophy } from 'lucide-react'

interface Application {
  id: string
  company_name: string
  role_title: string
  status: string
}

// Category icons and labels
const categoryConfig = {
  dsa: { icon: Code, label: 'DSA', color: 'bg-blue-500' },
  dbms: { icon: Database, label: 'DBMS', color: 'bg-green-500' },
  oops: { icon: Cpu, label: 'OOPs', color: 'bg-purple-500' },
  cn: { icon: Network, label: 'Networks', color: 'bg-orange-500' },
  system_design: { icon: Users, label: 'System Design', color: 'bg-red-500' },
  behavioral: { icon: Users, label: 'Behavioral', color: 'bg-pink-500' },
}

const difficultyColors = {
  easy: 'text-green-600 bg-green-100 border-green-600',
  medium: 'text-yellow-600 bg-yellow-100 border-yellow-600',
  hard: 'text-red-600 bg-red-100 border-red-600',
}

const tierLabels: Record<CompanyTier, string> = {
  faang: 'FAANG+',
  tier1: 'Tier 1',
  tier2: 'Tier 2',
  startup: 'Startup',
}

export function PracticeHub() {
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set())
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'pre-interview' | 'interview'>('pre-interview')

  const supabase = createClient()

  // Fetch applications
  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications-for-practice'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('id, company_name, role_title, status')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Application[]
    },
  })

  // Separate pre-interview and interview stage applications
  const preInterviewApps = useMemo(() =>
    applications.filter(app =>
      ['wishlist', 'applied', 'assessment'].includes(app.status)
    ), [applications]
  )

  const interviewApps = useMemo(() =>
    applications.filter(app =>
      ['interview', 'offer'].includes(app.status)
    ), [applications]
  )

  // Generate practice data for each company
  const practiceData = useMemo(() => {
    const data: Record<string, {
      questions: PracticeQuestion[],
      topics: { dsa: StudyTopic[], cs: StudyTopic[] },
      tier: CompanyTier
    }> = {}

    applications.forEach(app => {
      const key = `${app.company_name}-${app.role_title}`
      if (!data[key]) {
        data[key] = {
          questions: getRecommendedQuestions(app.company_name, 15),
          topics: getInterviewTopics(app.company_name, app.role_title),
          tier: getCompanyTier(app.company_name),
        }
      }
    })

    return data
  }, [applications])

  const toggleQuestion = (questionId: string) => {
    setCompletedQuestions(prev => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  const toggleTopic = (topicId: string) => {
    setCompletedTopics(prev => {
      const next = new Set(prev)
      if (next.has(topicId)) {
        next.delete(topicId)
      } else {
        next.add(topicId)
      }
      return next
    })
  }

  const toggleCompanyExpand = (companyKey: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev)
      if (next.has(companyKey)) {
        next.delete(companyKey)
      } else {
        next.add(companyKey)
      }
      return next
    })
  }

  // Calculate overall progress
  const totalQuestions = Object.values(practiceData).reduce((acc, d) => acc + d.questions.length, 0)
  const completedQuestionsCount = completedQuestions.size
  const progressPercent = totalQuestions > 0 ? Math.round((completedQuestionsCount / totalQuestions) * 100) : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-sm font-mono uppercase">Loading practice data...</div>
      </div>
    )
  }

  const currentApps = activeTab === 'pre-interview' ? preInterviewApps : interviewApps

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">PRACTICE HUB</h2>
            <p className="text-sm font-mono text-gray-600 mt-1">
              Personalized study plan based on your applications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-[#FF4D00]" />
            <div className="text-right">
              <p className="text-2xl font-black">{progressPercent}%</p>
              <p className="text-xs font-mono text-gray-500 uppercase">{completedQuestionsCount}/{totalQuestions} done</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 border-2 border-black bg-gray-100">
          <div
            className="h-full bg-[#FF4D00] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <button
          onClick={() => setActiveTab('pre-interview')}
          className={`flex-1 py-3 px-4 font-bold uppercase text-sm border-r-2 border-black transition-colors ${activeTab === 'pre-interview'
              ? 'bg-[#FF4D00] text-white'
              : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
          Pre-Interview ({preInterviewApps.length})
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`flex-1 py-3 px-4 font-bold uppercase text-sm transition-colors ${activeTab === 'interview'
              ? 'bg-[#FF4D00] text-white'
              : 'bg-white text-black hover:bg-gray-100'
            }`}
        >
          Interview Prep ({interviewApps.length})
        </button>
      </div>

      {/* No Applications State */}
      {currentApps.length === 0 && (
        <div className="border-2 border-black bg-white p-8 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="font-bold uppercase text-gray-600">
            {activeTab === 'pre-interview'
              ? 'No applications in pre-interview stages'
              : 'No applications in interview stage'}
          </p>
          <p className="text-sm font-mono text-gray-500 mt-2">
            {activeTab === 'pre-interview'
              ? 'Add applications in Wishlist, Applied, or Assessment stages'
              : 'Move applications to Interview stage to see prep materials'}
          </p>
        </div>
      )}

      {/* Company-wise Practice Sections */}
      {currentApps.map(app => {
        const key = `${app.company_name}-${app.role_title}`
        const data = practiceData[key]
        if (!data) return null

        const isExpanded = expandedCompanies.has(key)
        const companyQuestionsDone = data.questions.filter(q => completedQuestions.has(q.id)).length

        return (
          <div key={key} className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {/* Company Header */}
            <button
              onClick={() => toggleCompanyExpand(key)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
                <div className="text-left">
                  <h3 className="font-black uppercase text-lg">{app.company_name}</h3>
                  <p className="text-sm font-mono text-gray-600">{app.role_title}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 border-2 border-black ${data.tier === 'faang' ? 'bg-red-100' :
                    data.tier === 'tier1' ? 'bg-orange-100' :
                      data.tier === 'tier2' ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                  {tierLabels[data.tier]}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono">
                  <span className="font-bold">{companyQuestionsDone}</span>/{data.questions.length} questions
                </p>
                <div className="h-2 w-24 border border-black bg-gray-100 mt-1">
                  <div
                    className="h-full bg-[#FF4D00]"
                    style={{ width: `${(companyQuestionsDone / data.questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </button>

            {/* Expanded Content */}
            {isExpanded && (
              <div className="border-t-2 border-black">
                {/* DSA Questions Section */}
                <div className="p-4 border-b-2 border-black">
                  <h4 className="font-bold uppercase text-sm mb-3 flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    DSA Questions ({data.questions.length})
                  </h4>
                  <div className="space-y-2">
                    {data.questions.map(q => (
                      <div
                        key={q.id}
                        className={`flex items-center gap-3 p-3 border-2 border-black transition-all ${completedQuestions.has(q.id) ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                          }`}
                      >
                        <button
                          onClick={() => toggleQuestion(q.id)}
                          className="flex-shrink-0"
                        >
                          {completedQuestions.has(q.id) ? (
                            <CheckSquare className="h-5 w-5 text-green-600" />
                          ) : (
                            <Square className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                        <div className="flex-grow min-w-0">
                          <p className={`font-bold text-sm ${completedQuestions.has(q.id) ? 'line-through text-gray-500' : ''}`}>
                            {q.title}
                          </p>
                          <p className="text-xs font-mono text-gray-500">{q.pattern} • {q.topic}</p>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 border ${difficultyColors[q.difficulty]}`}>
                          {q.difficulty.toUpperCase()}
                        </span>
                        {q.url && (
                          <a
                            href={q.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 p-1 hover:bg-gray-200 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CS Topics Section (only show for interview stage) */}
                {activeTab === 'interview' && (
                  <div className="p-4">
                    <h4 className="font-bold uppercase text-sm mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Topics to Study
                    </h4>

                    {/* Group by category */}
                    {Object.entries(
                      [...data.topics.dsa, ...data.topics.cs].reduce((acc, topic) => {
                        if (!acc[topic.category]) acc[topic.category] = []
                        acc[topic.category].push(topic)
                        return acc
                      }, {} as Record<string, StudyTopic[]>)
                    ).map(([category, topics]) => {
                      const config = categoryConfig[category as keyof typeof categoryConfig]
                      const Icon = config?.icon || BookOpen

                      return (
                        <div key={category} className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1 ${config?.color || 'bg-gray-500'}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-bold text-sm uppercase">{config?.label || category}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-7">
                            {topics.map(topic => (
                              <div
                                key={topic.id}
                                className={`flex items-start gap-2 p-2 border-2 border-black transition-all ${completedTopics.has(topic.id) ? 'bg-green-50' : 'bg-white hover:bg-gray-50'
                                  }`}
                              >
                                <button
                                  onClick={() => toggleTopic(topic.id)}
                                  className="flex-shrink-0 mt-0.5"
                                >
                                  {completedTopics.has(topic.id) ? (
                                    <CheckSquare className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Square className="h-4 w-4 text-gray-400" />
                                  )}
                                </button>
                                <div className="flex-grow min-w-0">
                                  <p className={`font-bold text-sm ${completedTopics.has(topic.id) ? 'line-through text-gray-500' : ''}`}>
                                    {topic.name}
                                  </p>
                                  <p className="text-xs text-gray-500">{topic.description}</p>
                                  <p className="text-xs font-mono text-gray-400 mt-1">{topic.estimatedTime}</p>
                                </div>
                                <span className={`text-xs font-bold px-1.5 py-0.5 border ${difficultyColors[topic.difficulty]}`}>
                                  {topic.difficulty.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
