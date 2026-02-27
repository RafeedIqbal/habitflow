'use client'

import { useTransition } from 'react'
import { toggleHabitLog, deleteHabit } from '@/app/dashboard/actions'
import { getShortDayLabel } from '@/lib/habits'

type Props = {
  id: string
  name: string
  emoji: string
  streak: number
  completedToday: boolean
  last7Completed: boolean[]
  last7Days: string[]
}

export default function HabitCard({
  id,
  name,
  emoji,
  streak,
  completedToday,
  last7Completed,
  last7Days,
}: Props) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => { await toggleHabitLog(id, completedToday) })
  }

  function handleDelete() {
    startTransition(async () => { await deleteHabit(id) })
  }

  return (
    <div
      className="group flex items-center justify-between gap-6 rounded-xl bg-white p-6 transition-all hover:shadow-md"
      style={{
        border: '1px solid #f1f5f9',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        opacity: isPending ? 0.7 : 1,
      }}
    >
      <div className={`flex items-center gap-6 flex-1 ${completedToday ? 'opacity-70' : ''}`}>
        {/* Emoji */}
        <div
          className="text-4xl w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: '#f8fafc' }}
        >
          {emoji}
        </div>

        {/* Name + streak */}
        <div className="flex flex-col gap-1 min-w-[160px]">
          <p className="text-lg font-bold text-slate-900">{name}</p>
          {streak > 0 ? (
            <div className="flex items-center gap-1.5 font-bold text-sm text-orange-500">
              <span className="material-symbols-outlined text-base">local_fire_department</span>
              {streak} day streak
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic font-medium">No active streak</p>
          )}
        </div>

        {/* 7-day grid */}
        <div
          className="hidden lg:flex items-center gap-2 px-6"
          style={{ borderLeft: '1px solid #f1f5f9', borderRight: '1px solid #f1f5f9' }}
        >
          {last7Days.map((day, i) => (
            <div key={day} className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{getShortDayLabel(day)}</span>
              <div
                className="w-6 h-6 rounded-md transition-colors"
                style={{ backgroundColor: last7Completed[i] ? '#13ec5b' : '#e2e8f0' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Right side: check button + delete */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={handleDelete}
          disabled={isPending}
          title="Delete habit"
          className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-red-400 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>

        <button
          onClick={handleToggle}
          disabled={isPending}
          title={completedToday ? 'Mark as not done' : 'Mark as done'}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-60"
          style={
            completedToday
              ? { backgroundColor: '#13ec5b', boxShadow: '0 4px 12px rgba(19,236,91,0.3)' }
              : { border: '4px solid #f1f5f9' }
          }
        >
          <span
            className="material-symbols-outlined text-3xl font-bold"
            style={{ color: completedToday ? '#0f172a' : '#cbd5e1' }}
          >
            check
          </span>
        </button>
      </div>
    </div>
  )
}
