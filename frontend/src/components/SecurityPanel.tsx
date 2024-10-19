import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LockIcon, ShieldIcon, KeyIcon } from 'lucide-react'

export default function SecurityPanel() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [password, setPassword] = useState('')

  const toggleTwoFactor = () => {
    // TODO: Implement actual two-factor authentication logic
    setTwoFactorEnabled(!twoFactorEnabled)
  }

  const changePassword = () => {
    // TODO: Implement password change logic
    console.log('Changing password:', password)
    setPassword('')
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between p-2 bg-[#2A2F3A] rounded-md">
                <div className="flex items-center">
                  <ShieldIcon className="h-5 w-5 mr-2" />
                  <span>Two-Factor Authentication</span>
                </div>
                <Button onClick={toggleTwoFactor}>
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Change Password</h3>
              <div className="flex">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="flex-1 mr-2"
                />
                <Button onClick={changePassword}>
                  <KeyIcon className="h-4 w-4 mr-2" /> Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}