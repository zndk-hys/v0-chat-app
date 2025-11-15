'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MessageInputProps {
  username: string
  onUsernameChange: (username: string) => void
  onSendMessage: (content: string) => Promise<void>
  isLoading?: boolean
}

export function MessageInput({
  username,
  onUsernameChange,
  onSendMessage,
  isLoading = false,
}: MessageInputProps) {
  const [content, setContent] = useState('')

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !username.trim()) return

    await onSendMessage(content)
    setContent('')
  }

  return (
    <form onSubmit={handleSend} className="border-t border-border p-4 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Your name"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Button
          type="submit"
          disabled={!content.trim() || !username.trim() || isLoading}
          className="px-4 py-2"
        >
          Send
        </Button>
      </div>
    </form>
  )
}
