import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RocketIcon, SendIcon } from 'lucide-react'

export default function AIAssistantPanel() {
  const [query, setQuery] = useState('')
  const [conversation, setConversation] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you with your coding today?' }
  ])

  const sendQuery = () => {
    if (query.trim()) {
      setConversation([...conversation, { role: 'user', content: query }])
      // TODO: Implement AI response logic
      setConversation(prev => [...prev, { role: 'assistant', content: 'I understand your question. Let me think about it...' }])
      setQuery('')
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Coding Assistant</CardTitle>
          <CardDescription>Get help with your code using AI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 overflow-auto mb-4 p-4 bg-[#2A2F3A] rounded-md">
            {conversation.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                <span className="font-bold">{msg.role === 'user' ? 'You: ' : 'AI: '}</span>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask the AI assistant..."
              className="flex-1 mr-2"
            />
            <Button onClick={sendQuery}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}