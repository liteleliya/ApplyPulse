'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { AnalyticsDashboard } from '@/components/analytics/analytics-dashboard'
import { ResumeManager } from '@/components/resume/resume-manager'
import { InterviewTracker } from '@/components/interview/interview-tracker'
import { UpcomingInterviewsWidget } from '@/components/interview/upcoming-interviews-widget'
import { EmailImportDialog } from '@/components/intelligence/email-import-dialog'
import { BarChart3, Kanban, FileText, Calendar, Sparkles, LogOut, User, GraduationCap } from 'lucide-react'
import { PracticeHub } from '@/components/practice/practice-hub'

interface DashboardContentProps {
  user: any
  profile: any
}

export function DashboardContent({ user, profile }: DashboardContentProps) {
  const [showEmailImport, setShowEmailImport] = useState(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth/login'
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] brutalist-grid">
      {/* Neo-Brutalist Navigation */}
      <nav className="border-b-2 border-black bg-[#F5F5F0]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand - Bold & Technical */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-white font-black text-lg">AP</span>
              </div>
              <div>
                <h1 className="text-lg font-black text-black uppercase tracking-tight">
                  APPLYPULSE
                </h1>
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                  Career Tracker v1.0
                </p>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Import Button - Brutalist Style */}
              <button 
                onClick={() => setShowEmailImport(true)}
                className="h-10 px-4 bg-[#FF4D00] text-white border-2 border-black font-bold uppercase text-xs tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                IMPORT
              </button>

              {/* User Profile - Technical */}
              <div className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-gray-100">
                <div className="w-7 h-7 bg-black flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-xs font-mono font-bold text-black uppercase hidden sm:block">
                  {profile?.full_name?.split(' ')[0] || user.email.split('@')[0]}
                </span>
              </div>

              {/* Sign Out */}
              <button 
                onClick={handleSignOut}
                className="h-10 w-10 border-2 border-black bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <LogOut className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <Tabs defaultValue="kanban" className="space-y-8">
          {/* Neo-Brutalist Tab Navigation */}
          <div className="inline-flex border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <TabsList className="flex bg-transparent h-auto p-0">
              <TabsTrigger 
                value="kanban" 
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-black data-[state=active]:bg-[#FF4D00] data-[state=active]:text-white text-black hover:bg-gray-100 transition-colors"
              >
                <Kanban className="h-4 w-4" />
                <span className="hidden sm:inline">KANBAN</span>
              </TabsTrigger>
              <TabsTrigger 
                value="interviews"
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-black data-[state=active]:bg-[#FF4D00] data-[state=active]:text-white text-black hover:bg-gray-100 transition-colors"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">INTERVIEWS</span>
              </TabsTrigger>
              <TabsTrigger 
                value="resumes"
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-black data-[state=active]:bg-[#FF4D00] data-[state=active]:text-white text-black hover:bg-gray-100 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">RESUMES</span>
              </TabsTrigger>
              <TabsTrigger 
                value="practice"
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider border-r-2 border-black data-[state=active]:bg-[#FF4D00] data-[state=active]:text-white text-black hover:bg-gray-100 transition-colors"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="hidden sm:inline">PRACTICE</span>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider data-[state=active]:bg-[#FF4D00] data-[state=active]:text-white text-black hover:bg-gray-100 transition-colors"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">ANALYTICS</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="kanban" className="space-y-6 mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <KanbanBoard />
              </div>
              <div className="lg:col-span-1">
                <UpcomingInterviewsWidget />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="interviews" className="space-y-6 mt-8">
            <InterviewTracker />
          </TabsContent>

          <TabsContent value="resumes" className="space-y-6 mt-8">
            <ResumeManager />
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 mt-8">
            <PracticeHub />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6 mt-8">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>

      {/* Smart Email Import Dialog */}
      <EmailImportDialog 
        open={showEmailImport} 
        onOpenChange={setShowEmailImport} 
      />
    </div>
  )
}
