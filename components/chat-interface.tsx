'use client'

import { useEffect, useRef } from 'react'
import { MessageList } from './message-list'
import { Message } from '@/lib/chat-utils'

interface ChatInterfaceProps {
  messages: Message[]
  currentUsername: string
}

export function ChatInterface({ messages, currentUsername }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={messages} currentUsername={currentUsername} />
      <div ref={messagesEndRef} />
    </div>
  )
}
