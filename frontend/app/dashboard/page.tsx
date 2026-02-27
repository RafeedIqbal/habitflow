import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLast7Days, computeStreak, toLocalDateString } from '@/lib/habits'
import type { Habit, HabitLog } from '@/lib/habits'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const today = toLocalDateString(new Date())
  const last7 = getLast7Days()
  const sevenDaysAgo = last7[0]

  const { data: habits } = await supabase
    .from('habits')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: logs } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('completed_date', sevenDaysAgo)

  const habitsWithData = (habits as Habit[] ?? []).map((habit) => {
    const habitLogs = (logs as HabitLog[] ?? [])
      .filter((l) => l.habit_id === habit.id)
      .map((l) => l.completed_date)
    const streak = computeStreak(habitLogs, today)
    const completedToday = habitLogs.includes(today)
    const last7Completed = last7.map((d) => habitLogs.includes(d))
    return { ...habit, streak, completedToday, last7Completed }
  })

  return (
    <DashboardClient
      user={{ email: user.email! }}
      habits={habitsWithData}
      today={today}
      last7Days={last7}
    />
  )
}
