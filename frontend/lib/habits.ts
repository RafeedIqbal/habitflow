export type Habit = {
  id: string
  user_id: string
  name: string
  emoji: string
  created_at: string
}

export type HabitLog = {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export function toLocalDateString(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function getLast7Days(): string[] {
  const days: string[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(toLocalDateString(d))
  }
  return days
}

export function getShortDayLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

export function computeStreak(logs: string[], today: string): number {
  const logSet = new Set(logs)
  let streak = 0
  const current = new Date(today + 'T00:00:00')
  while (true) {
    const dateStr = toLocalDateString(current)
    if (logSet.has(dateStr)) {
      streak++
      current.setDate(current.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}
