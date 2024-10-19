import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BugIcon, PlayIcon, PauseIcon, StepForwardIcon, StopIcon } from 'lucide-react'

export default function DebugPanel() {
  const [isDebugging, setIsDebugging] = useState(false)
  const [breakpoints, setBreakpoints] = useState([10, 15, 20])
  const [variables, setVariables] = useState([
    { name: 'count', value: 0 },
    { name: 'message', value: '"Hello, World!"' },
  ])

  const toggleDebug = () => {
    setIsDebugging(!isDebugging)
  }

  const addBreakpoint = (line) => {
    setBreakpoints([...breakpoints, line])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Debug Panel</CardTitle>
          <CardDescription>Debug your code with advanced tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button onClick={toggleDebug}>
                {isDebugging ? <PauseIcon className="h-4 w-4 mr-2" /> : <PlayIcon className="h-4 w-4 mr-2" />}
                {isDebugging ? 'Pause' : 'Start'} Debugging
              </Button>
              <Button disabled={!isDebugging}>
                <StepForwardIcon className="h-4 w-4 mr-2" /> Step Over
              </Button>
              <Button disabled={!isDebugging}>
                <StopIcon className="h-4 w-4 mr-2" /> Stop
              </Button>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Breakpoints</h3>
              <div className="space-y-2">
                {breakpoints.map((line, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#2A2F3A] rounded-md">
                    <span>Line {line}</span>
                    <Button variant="destructive" size="sm" onClick={() => setBreakpoints(breakpoints.filter(bp => bp !== line))}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex mt-2">
                <Input type="number" placeholder="Line number" className="flex-1 mr-2" />
                <Button onClick={() => addBreakpoint(25)}>Add Breakpoint</Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Variables</h3>
              <div className="space-y-2">
                {variables.map((variable, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#2A2F3A] rounded-md">
                    <span>{variable.name}</span>
                    <span>{variable.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}