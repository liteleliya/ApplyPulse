'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
          } as any)

        if (profileError) {
          console.error('Profile error:', profileError)
        }
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] brutalist-grid p-4">
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-500 border-2 border-black flex items-center justify-center mx-auto mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-3xl">🎉</span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
              ACCOUNT CREATED!
            </h2>
            <p className="text-xs font-mono uppercase tracking-widest text-gray-600">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    )
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

        {/* Signup Card */}
        <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-black uppercase tracking-tight text-black mb-2">
              CREATE AN ACCOUNT
            </h2>
            <p className="text-[11px] font-mono uppercase tracking-widest text-gray-600">
              Start tracking your job applications with ApplyPulse
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-600">
                <p className="text-[11px] font-mono uppercase tracking-wider text-red-700">
                  {error}
                </p>
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-black">
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={loading}
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

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
                minLength={6}
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-black">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
                className="h-11 border-2 border-black bg-white font-mono text-sm placeholder:text-gray-400 focus:ring-0 focus:outline-none focus:border-[#FF4D00] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#FF4D00] text-white border-2 border-black font-black uppercase text-sm tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>

            {/* Sign In Link */}
            <p className="text-xs font-mono uppercase tracking-widest text-center text-gray-600 pt-4">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#FF4D00] font-bold hover:underline">
                SIGN IN
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
