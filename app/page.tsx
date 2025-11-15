'use client'

import { useEffect, useState, useCallback } from 'react'
import useSWR from 'swr'
import { getSupabaseClient } from '@/lib/supabase/client'
import { ChatInterface } from '@/components/chat-interface'
import { MessageInput } from '@/components/message-input'
import { Message } from '@/lib/chat-utils'

const fetcher = async () => {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true })
    .limit(100)

  if (error) throw error
  return data as Message[]
}

export default function Page() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { data: messages = [], mutate } = useSWR('messages', fetcher, {
    refreshInterval: 1000,
    revalidateOnFocus: false,
  })

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!username.trim() || !content.trim()) return

      setIsLoading(true)
      try {
        const supabase = getSupabaseClient()
        const { error } = await supabase.from('messages').insert({
          username: username.trim(),
          content: content.trim(),
        })

        if (error) throw error

        // Revalidate messages after sending
        await mutate()
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [username, mutate]
  )

  return (
    <main className="flex flex-col h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-foreground">Chat Room</h1>
          <p className="text-sm text-muted-foreground">
            {messages.length} message{messages.length !== 1 ? 's' : ''}
          </p>
        </div>
      </header>

      <div className="flex-1 flex flex-col overflow-hidden max-w-4xl mx-auto w-full">
        <ChatInterface messages={messages} currentUsername={username} />
        <MessageInput
          username={username}
          onUsernameChange={setUsername}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </main>
  )
}
