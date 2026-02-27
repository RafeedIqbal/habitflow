'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { toLocalDateString } from '@/lib/habits'

export async function addHabit(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const name = formData.get('name') as string
  const emoji = formData.get('emoji') as string

  if (!name?.trim()) return { error: 'Habit name is required' }

  const { error } = await supabase.from('habits').insert({
    user_id: user.id,
    name: name.trim(),
    emoji: emoji || '✅',
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard')
}

export async function toggleHabitLog(habitId: string, completedToday: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const today = toLocalDateString(new Date())

  if (completedToday) {
    await supabase
      .from('habit_logs')
      .delete()
      .eq('habit_id', habitId)
      .eq('completed_date', today)
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      user_id: user.id,
      completed_date: today,
    })
  }

  revalidatePath('/dashboard')
}
