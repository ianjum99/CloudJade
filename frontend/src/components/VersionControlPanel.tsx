import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GitBranchIcon, GitCommitIcon, GitMergeIcon } from 'lucide-react'

export default function VersionControlPanel() {
  const [commitMessage, setCommitMessage] = useState('')
  const [branches, setBranches] = useState(['main', 'develop', 'feature/new-ui'])

  const createCommit = () => {
    // TODO: Implement actual commit logic
    console.log('Creating commit:', commitMessage)
    setCommitMessage('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Version Control</CardTitle>
          <CardDescription>Manage your project's version control</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Create Commit</h3>
              <div className="flex">
                <Input
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Enter commit message"
                  className="flex-1 mr-2"
                />
                <Button onClick={createCommit}>
                  <GitCommitIcon className="h-4 w-4 mr-2" /> Commit
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Branches</h3>
              <div className="space-y-2">
                {branches.map((branch, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-[#2A2F3A] rounded-md">
                    <div className="flex items-center">
                      <GitBranchIcon className="h-5 w-5 mr-2" />
                      <span>{branch}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Checkout
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Merge</h3>
              <div className="flex">
                <Input placeholder="Source branch" className="flex-1 mr-2" />
                <Input placeholder="Target branch" className="flex-1 mr-2" />
                <Button>
                  <GitMergeIcon className="h-4 w-4 mr-2" /> Merge
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}