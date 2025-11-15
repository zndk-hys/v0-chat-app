'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabase/client'
import { ChatInterface } from '@/components/chat-interface'
import { MessageInput } from '@/components/message-input'
import { useMessagesRealtime } from '@/hooks/use-messages-realtime'

export default function Page() {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { messages } = useMessagesRealtime()

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
      } catch (error) {
        console.error('Failed to send message:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [username]
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
