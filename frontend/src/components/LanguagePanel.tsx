import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CodeIcon } from 'lucide-react'

interface LanguagePanelProps {
  setLanguage: (lang: string) => void
}

export default function LanguagePanel({ setLanguage }: LanguagePanelProps) {
  const languages = [
    'java', 'python', 'javascript', 'typescript', 'c', 'cpp', 'csharp', 'go', 'rust', 'php'
  ]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Language Support</CardTitle>
          <CardDescription>Choose your programming language</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {languages.map(lang => (
              <Button
                key={lang}
                variant="outline"
                className="justify-start"
                onClick={() => setLanguage(lang)}
              >
                <CodeIcon className="mr-2 h-4 w-4" />
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}