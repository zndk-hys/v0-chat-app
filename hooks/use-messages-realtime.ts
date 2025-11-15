'use client'

import { useEffect, useState } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Message } from '@/lib/chat-utils'

export function useMessagesRealtime() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseClient()
    let subscription: any

    const setupRealtime = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100)

        if (fetchError) throw fetchError

        setMessages(data as Message[])
        setIsLoading(false)

        subscription = supabase
          .channel('messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
            },
            (payload: any) => {
              setMessages((prev) => [...prev, payload.new as Message])
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'DELETE',
              schema: 'public',
              table: 'messages',
            },
            (payload: any) => {
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== payload.old.id)
              )
            }
          )
          .subscribe()
      } catch (err) {
        console.error('[v0] Failed to setup realtime:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        setIsLoading(false)
      }
    }

    setupRealtime()

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [])

  return { messages, isLoading, error, setMessages }
}
