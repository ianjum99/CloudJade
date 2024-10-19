import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudIcon, UploadIcon, FolderIcon, FileIcon } from 'lucide-react'

export default function CloudStoragePanel() {
  const [files, setFiles] = useState([
    { name: 'Project1', type: 'folder' },
    { name: 'main.java', type: 'file' },
    { name: 'README.md', type: 'file' },
  ])

  const uploadFile = () => {
    // TODO: Implement file upload logic
    setFiles([...files, { name: 'New File.txt', type: 'file' }])
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Cloud Storage</CardTitle>
          <CardDescription>Manage your files in the cloud</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex mb-4">
            <Input type="file" className="flex-1 mr-2" />
            <Button onClick={uploadFile}>
              <UploadIcon className="h-4 w-4 mr-2" /> Upload
            </Button>
          </div>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center p-2 bg-[#2A2F3A] rounded-md">
                {file.type === 'folder' ? (
                  <FolderIcon className="h-5 w-5 mr-2 text-yellow-500" />
                ) : (
                  <FileIcon className="h-5 w-5 mr-2 text-blue-500" />
                )}
                <span>{file.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}