'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to log in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] brutalist-grid p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 bg-[#FF4D00] border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-white font-black text-xl">AP</span>
          </div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">
            APPLYPULSE
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-[#FF4D00] border-2 border-black flex items-center justify-center">
                <LogIn className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">
                WELCOME BACK
              </h2>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-widest text-gray-600">
              Sign in to your ApplyPulse account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-600">
                <p className="text-[11px] font-mono uppercase tracking-wider text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-black">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-black">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF4D00] text-white border-2 border-black font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>

            {/* Sign Up Link */}
            <p className="text-xs font-mono uppercase tracking-widest text-center text-gray-600 pt-4">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-[#FF4D00] font-bold hover:underline">
                SIGN UP
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
