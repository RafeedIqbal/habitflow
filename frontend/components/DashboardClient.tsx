'use client'

import { useState } from 'react'
import { signOut } from '@/app/auth/actions'
import HabitCard from './HabitCard'
import AddHabitModal from './AddHabitModal'

type HabitWithData = {
  id: string
  name: string
  emoji: string
  streak: number
  completedToday: boolean
  last7Completed: boolean[]
}

type Props = {
  user: { email: string }
  habits: HabitWithData[]
  today: string
  last7Days: string[]
}

export default function DashboardClient({ user, habits, today, last7Days }: Props) {
  const [showModal, setShowModal] = useState(false)

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  const formattedDate = new Date(today + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const bestStreak = Math.max(0, ...habits.map((h) => h.streak))

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f6f8f6', fontFamily: 'Manrope, sans-serif' }}>
      {/* Header */}
      <header
        className="flex items-center justify-between px-10 py-4 bg-white sticky top-0 z-50"
        style={{ borderBottom: '1px solid #e2e8f0' }}
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 flex items-center justify-center" style={{ color: '#13ec5b' }}>
            <span className="material-symbols-outlined text-3xl">auto_graph</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">HabitFlow</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center px-4 py-2 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
            <span className="material-symbols-outlined text-sm mr-2 text-slate-500">alternate_email</span>
            <span className="text-slate-700 text-sm font-medium">{user.email}</span>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center justify-center rounded-lg h-10 px-5 text-slate-900 text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: '#13ec5b' }}
            >
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-6 py-10">
        {/* Greeting */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">{greeting}!</h1>
            <div className="flex items-center text-slate-500 font-medium">
              <span className="material-symbols-outlined text-lg mr-2">calendar_today</span>
              <p>{formattedDate}</p>
            </div>
          </div>
          {bestStreak > 0 && (
            <div
              className="bg-white p-4 rounded-xl flex items-center gap-3"
              style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
            >
              <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(19,236,91,0.2)', color: '#13ec5b' }}>
                <span className="material-symbols-outlined">local_fire_department</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold tracking-wider leading-none">Best Streak</p>
                <p className="text-xl font-black">{bestStreak} Days</p>
              </div>
            </div>
          )}
        </div>

        {/* Habit list */}
        {habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                name={habit.name}
                emoji={habit.emoji}
                streak={habit.streak}
                completedToday={habit.completedToday}
                last7Completed={habit.last7Completed}
                last7Days={last7Days}
              />
            ))}
          </div>
        ) : (
          <div
            className="mt-12 text-center p-12 rounded-2xl"
            style={{ border: '2px dashed #e2e8f0' }}
          >
            <div className="text-5xl mb-4">🌱</div>
            <p className="text-slate-700 font-bold text-lg mb-2">No habits yet</p>
            <p className="text-slate-500 mb-6">Click the + button to add your first habit and start building momentum.</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all hover:opacity-90 text-slate-900"
              style={{ backgroundColor: '#13ec5b' }}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add your first habit
            </button>
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-10 right-10 w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 group text-slate-900"
        style={{ backgroundColor: '#13ec5b', boxShadow: '0 8px 24px rgba(19,236,91,0.4)' }}
        title="Add Habit"
      >
        <span className="material-symbols-outlined text-4xl font-bold">add</span>
        <div
          className="absolute right-20 px-3 py-1.5 rounded-lg text-sm font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none"
          style={{ backgroundColor: '#0f172a' }}
        >
          Add Habit
        </div>
      </button>

      {showModal && <AddHabitModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
