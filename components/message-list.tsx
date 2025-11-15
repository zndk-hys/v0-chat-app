'use client'

import { Message, formatTime } from '@/lib/chat-utils'

interface MessageListProps {
  messages: Message[]
  currentUsername: string
}

export function MessageList({ messages, currentUsername }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.username === currentUsername
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card text-card-foreground border border-border'
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs font-semibold opacity-70 mb-1">
                    {message.username}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p className="text-xs opacity-60 mt-1">
                  {formatTime(message.created_at)}
                </p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
