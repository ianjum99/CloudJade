import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from 'lucide-react'

export default function CodeAnalysisPanel() {
  const [analysisResults, setAnalysisResults] = useState([
    { type: 'error', message: 'Unused variable on line 15' },
    { type: 'warning', message: 'Function is too complex (cyclomatic complexity: 15)' },
    { type: 'info', message: 'Consider using const for variable declarations' },
  ])

  const runAnalysis = () => {
    // TODO: Implement actual code analysis
    setAnalysisResults([
      ...analysisResults,
      { type: 'info', message: 'Analysis completed' }
    ])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Code Analysis</CardTitle>
          <CardDescription>Analyze your code for quality and potential issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runAnalysis} className="mb-4">
            Run Analysis
          </Button>
          <div className="space-y-2">
            {analysisResults.map((result, index) => (
              <div key={index} className={`flex items-center p-2 rounded-md ${
                result.type === 'error' ? 'bg-red-900' :
                result.type === 'warning' ? 'bg-yellow-900' :
                'bg-blue-900'
              }`}>
                {result.type === 'error' && <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />}
                {result.type === 'warning' && <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />}
                {result.type === 'info' && <CheckCircleIcon className="h-5 w-5 mr-2 text-blue-500" />}
                <span>{result.message}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}