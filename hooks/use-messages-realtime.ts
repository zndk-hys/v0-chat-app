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
        console.log("[v0] Setting up realtime subscription...")
        
        const { data, error: fetchError } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(100)

        if (fetchError) throw fetchError
        
        console.log("[v0] Initial messages loaded:", data?.length)

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
              console.log("[v0] New message received:", payload.new)
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
              console.log("[v0] Message deleted:", payload.old.id)
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== payload.old.id)
              )
            }
          )
          .subscribe((status: string) => {
            console.log("[v0] Subscription status:", status)
          })
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
