'use client'

import { useState, useTransition } from 'react'
import { signIn, signUp } from '@/app/auth/actions'

export default function AuthForm() {
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const action = tab === 'signup' ? signUp : signIn
      const result = await action(formData)
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f6f8f6', fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center justify-between border-b px-10 py-4 bg-white sticky top-0 z-50" style={{ borderColor: 'rgba(19,236,91,0.1)' }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(19,236,91,0.2)', color: '#13ec5b' }}>
            <span className="material-symbols-outlined font-bold">task_alt</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">HabitFlow</h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTab('signup')}
            className="min-w-[84px] cursor-pointer rounded-lg h-10 px-4 text-sm font-bold transition-all hover:opacity-90 text-slate-900"
            style={{ backgroundColor: tab === 'signup' ? '#13ec5b' : 'rgba(19,236,91,0.1)' }}
          >
            Sign Up
          </button>
          <button
            onClick={() => setTab('login')}
            className="min-w-[84px] cursor-pointer rounded-lg h-10 px-4 text-sm font-bold transition-all hover:opacity-90 text-slate-900"
            style={{ backgroundColor: tab === 'login' ? '#13ec5b' : 'rgba(19,236,91,0.1)' }}
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6" style={{ background: 'linear-gradient(to bottom right, #f6f8f6, rgba(19,236,91,0.05))' }}>
        <div className="w-full max-w-[480px] bg-white rounded-xl shadow-xl overflow-hidden" style={{ border: '1px solid rgba(19,236,91,0.1)' }}>
          <div className="p-8 pb-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: 'rgba(19,236,91,0.1)', color: '#13ec5b' }}>
              <span className="material-symbols-outlined text-4xl">show_chart</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
              {tab === 'signup' ? 'Join HabitFlow' : 'Welcome back'}
            </h1>
            <p className="text-slate-500 text-base">
              {tab === 'signup' ? 'Start your journey to a better you' : "Let's stay on track"}
            </p>
          </div>

          <div className="px-8">
            {/* Tab switcher */}
            <div className="flex w-full mb-8" style={{ borderBottom: '1px solid rgba(19,236,91,0.1)' }}>
              <button
                onClick={() => setTab('login')}
                className="flex-1 pb-3 pt-2 text-sm font-semibold transition-colors border-b-2"
                style={{ borderColor: tab === 'login' ? '#13ec5b' : 'transparent', color: tab === 'login' ? '#0f172a' : '#94a3b8' }}
              >
                Log In
              </button>
              <button
                onClick={() => setTab('signup')}
                className="flex-1 pb-3 pt-2 text-sm font-semibold transition-colors border-b-2"
                style={{ borderColor: tab === 'signup' ? '#13ec5b' : 'transparent', color: tab === 'signup' ? '#0f172a' : '#94a3b8' }}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 pb-8">
              {error && (
                <div className="rounded-lg p-3 text-sm text-red-700 bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 px-1">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">mail</span>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    style={{ border: '1px solid rgba(19,236,91,0.2)', backgroundColor: 'rgba(19,236,91,0.05)' }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700 px-1">Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">lock</span>
                  <input
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    placeholder={tab === 'signup' ? 'Create a strong password' : 'Enter your password'}
                    className="w-full pl-12 pr-4 py-3.5 rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-900"
                    style={{ border: '1px solid rgba(19,236,91,0.2)', backgroundColor: 'rgba(19,236,91,0.05)' }}
                  />
                </div>
                {tab === 'signup' && (
                  <p className="text-[11px] text-slate-500 px-1">Must be at least 8 characters long.</p>
                )}
                {tab === 'login' && (
                  <p className="text-xs text-right px-1">
                    <span className="text-slate-400 cursor-not-allowed">Forgot password?</span>
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full font-bold py-4 rounded-lg flex items-center justify-center gap-2 group transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 text-slate-900"
                  style={{ backgroundColor: '#13ec5b', boxShadow: '0 4px 14px rgba(19,236,91,0.25)' }}
                >
                  <span>{isPending ? 'Please wait…' : tab === 'signup' ? 'Create Account' : 'Log In'}</span>
                  {!isPending && (
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  )}
                </button>
                <p className="text-center mt-6 text-slate-500 text-sm font-medium">
                  {tab === 'signup' ? 'Start building better habits today.' : 'Keep the momentum going.'}
                </p>
              </div>
            </form>
          </div>

          <div className="px-8 py-4 flex items-center justify-center" style={{ backgroundColor: 'rgba(19,236,91,0.05)' }}>
            <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Your data stays private</span>
          </div>
        </div>
      </main>
    </div>
  )
}
