import Link from "next/link";
import { BarChart3, FileText, Kanban } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F0] brutalist-grid">
      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-20">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-16 h-16 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-white font-black text-2xl">AP</span>
            </div>
            <h1 className="text-6xl font-black text-black uppercase tracking-tight">
              APPLYPULSE
            </h1>
          </div>

          <p className="text-xl font-bold text-black uppercase tracking-wide max-w-2xl mx-auto">
            Your Career CRM & Placement Tracker
          </p>
          
          <p className="text-sm font-mono text-gray-600 uppercase tracking-widest max-w-xl mx-auto leading-relaxed">
            Track job applications, manage resumes, schedule interviews, and analyze your recruitment funnel — all in one place.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <button className="h-14 px-8 bg-[#FF4D00] text-white border-2 border-black font-black uppercase text-sm tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                GET STARTED
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="h-14 px-8 bg-white text-black border-2 border-black font-black uppercase text-sm tracking-wider shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
                SIGN IN
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kanban Feature */}
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Kanban className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
              Kanban Board
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-600 leading-relaxed">
              Visualize your application pipeline with drag-and-drop simplicity
            </p>
          </div>

          {/* Resume Feature */}
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
              Resume Mapping
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-600 leading-relaxed">
              Track which resume version you used for each application
            </p>
          </div>

          {/* Analytics Feature */}
          <div className="bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6">
            <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black flex items-center justify-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight text-black mb-3">
              Analytics
            </h3>
            <p className="text-xs font-mono uppercase tracking-wider text-gray-600 leading-relaxed">
              Data-driven insights into your job search performance
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
