import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquareIcon, UserPlusIcon, SendIcon } from 'lucide-react'

export default function CollaborationPanel() {
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { user: 'System', message: 'Welcome to the collaboration chat!' },
  ])

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { user: 'You', message }])
      setMessage('')
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 mb-4 overflow-hidden">
        <CardHeader>
          <CardTitle>Real-Time Collaboration</CardTitle>
          <CardDescription>Work together with your team in real-time</CardDescription>
        </CardHeader>
        <CardContent className="h-full flex flex-col">
          <div className="flex-1 overflow-auto mb-4 p-4 bg-[#2A2F3A] rounded-md">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{msg.user}: </span>
                {msg.message}
              </div>
            ))}
          </div>
          <div className="flex">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
            />
            <Button onClick={sendMessage}>
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Invite Collaborators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex">
            <Input placeholder="Enter email address" className="flex-1 mr-2" />
            <Button>
              <UserPlusIcon className="h-4 w-4 mr-2" /> Invite
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}