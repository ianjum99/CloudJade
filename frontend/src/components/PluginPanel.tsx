import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlugIcon, DownloadIcon } from 'lucide-react'
import axios from 'axios'

const API_URL = 'http://localhost:3001/api'

export default function PluginPanel() {
  const [searchTerm, setSearchTerm] = useState('')
  const [plugins, setPlugins] = useState([])

  useEffect(() => {
    fetchPlugins()
  }, [])

  const fetchPlugins = async () => {
    try {
      const response = await axios.get(`${API_URL}/plugins`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setPlugins(response.data)
    } catch (error) {
      console.error('Error fetching plugins:', error)
    }
  }

  const togglePlugin = async (id) => {
    try {
      const response = await axios.post(`${API_URL}/plugins/${id}/toggle`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      setPlugins(plugins.map(plugin => 
        plugin.id === id ? { ...plugin, installed: response.data.installed } : plugin
      ))
    } catch (error) {
      console.error('Error toggling plugin:', error)
    }
  }

  const filteredPlugins = plugins.filter(plugin => 
    plugin.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plugin Manager</CardTitle>
          <CardDescription>Install and manage IDE plugins</CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plugins..."
            className="mb-4"
          />
          <div className="space-y-2">
            {filteredPlugins.map(plugin => (
              <div key={plugin.id} className="flex items-center justify-between p-2 bg-[#2A2F3A] rounded-md">
                <div className="flex items-center">
                  <PlugIcon className="h-5 w-5 mr-2" />
                  <span>{plugin.name}</span>
                </div>
                <Button
                  variant={plugin.installed ? 'destructive' : 'default'}
                  onClick={() => togglePlugin(plugin.id)}
                >
                  {plugin.installed ? 'Uninstall' : 'Install'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}