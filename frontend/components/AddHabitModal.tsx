'use client'

import { useState, useTransition, useRef } from 'react'
import { addHabit } from '@/app/dashboard/actions'

const EMOJI_OPTIONS = ['✅', '💧', '🧘', '🏃', '📖', '🍎', '💪', '🎯', '🌱', '⭐']

type Props = {
  onClose: () => void
}

export default function AddHabitModal({ onClose }: Props) {
  const [selectedEmoji, setSelectedEmoji] = useState('✅')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('emoji', selectedEmoji)

    startTransition(async () => {
      const result = await addHabit(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        onClose()
      }
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
        style={{ border: '1px solid #e2e8f0' }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="p-8">
            <div className="flex flex-col gap-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900">Create New Habit</h2>
                <p className="text-slate-500 text-sm">Define your new daily routine and stay consistent.</p>
              </div>

              {error && (
                <div className="rounded-lg p-3 text-sm text-red-700 bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              {/* Habit name input */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Habit Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g., Morning Yoga"
                  className="w-full px-4 py-3 rounded-lg outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  style={{ border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}
                />
              </div>

              {/* Emoji picker */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-slate-700">Icon</label>
                <div className="flex flex-wrap gap-2 p-2 rounded-xl" style={{ backgroundColor: '#f8fafc' }}>
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className="w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-all hover:scale-110"
                      style={
                        selectedEmoji === emoji
                          ? { backgroundColor: 'white', border: '2px solid #13ec5b', boxShadow: '0 0 0 3px rgba(19,236,91,0.15)' }
                          : { border: '2px solid transparent' }
                      }
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Repeat (display only in v1) */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Repeat</label>
                <div className="flex gap-2">
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={{ backgroundColor: 'rgba(19,236,91,0.1)', color: '#13ec5b' }}
                  >
                    Every Day
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 px-8 py-6"
            style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}
          >
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-8 py-2.5 text-sm font-bold rounded-lg transition-all active:scale-95 disabled:opacity-60 text-slate-900"
              style={{ backgroundColor: '#13ec5b', boxShadow: '0 4px 12px rgba(19,236,91,0.25)' }}
            >
              {isPending ? 'Adding…' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
