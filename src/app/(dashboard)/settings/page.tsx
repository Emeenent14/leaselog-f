'use client'

import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { User, Bell, Shield, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  company_name: string
}

interface UserSettings {
  email_notifications: boolean
  rent_reminders: boolean
  lease_expiry_alerts: boolean
  payment_confirmations: boolean
  reminder_days_before: number
}

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const { logout } = useAuthStore()
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    company_name: '',
  })
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  })
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: UserProfile }>('/users/me/')
      return response.data.data
    },
  })

  const { data: settings } = useQuery({
    queryKey: ['user-settings'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: UserSettings }>('/users/me/settings/')
      return response.data.data
    },
  })

  useEffect(() => {
    if (profile) {
      setProfileData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
      })
    }
  }, [profile])

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await apiClient.patch('/users/me/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] })
      setSuccessMessage('Profile updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.error?.message || 'Failed to update profile')
      setTimeout(() => setErrorMessage(''), 3000)
    },
  })

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      const response = await apiClient.patch('/users/me/settings/', data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] })
      setSuccessMessage('Settings updated successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async (data: typeof passwordData) => {
      const response = await apiClient.post('/auth/password/change/', {
        old_password: data.current_password,
        new_password: data.new_password,
      })
      return response.data
    },
    onSuccess: () => {
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' })
      setSuccessMessage('Password changed successfully')
      setTimeout(() => setSuccessMessage(''), 3000)
    },
    onError: (err: any) => {
      setErrorMessage(err.response?.data?.error?.message || 'Failed to change password')
      setTimeout(() => setErrorMessage(''), 3000)
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.new_password !== passwordData.confirm_password) {
      setErrorMessage('Passwords do not match')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }
    changePasswordMutation.mutate(passwordData)
  }

  const handleSettingToggle = (key: keyof UserSettings) => {
    if (settings) {
      updateSettingsMutation.mutate({ [key]: !settings[key] })
    }
  }

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout/')
    } catch (e) {
      // Ignore errors
    }
    logout()
    window.location.href = '/login'
  }

  if (profileLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">{errorMessage}</div>
      )}

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={profileData.first_name}
                    onChange={(e) => setProfileData((p) => ({ ...p, first_name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={profileData.last_name}
                    onChange={(e) => setProfileData((p) => ({ ...p, last_name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={profile?.email || ''} disabled className="bg-gray-50" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  value={profileData.company_name}
                  onChange={(e) => setProfileData((p) => ({ ...p, company_name: e.target.value }))}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </CardTitle>
            <CardDescription>Manage your email notification preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">Receive email notifications</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.email_notifications || false}
                    onChange={() => handleSettingToggle('email_notifications')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Rent Reminders</p>
                  <p className="text-sm text-gray-500">Get reminded about upcoming rent due dates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.rent_reminders || false}
                    onChange={() => handleSettingToggle('rent_reminders')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Lease Expiry Alerts</p>
                  <p className="text-sm text-gray-500">Get alerted about expiring leases</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings?.lease_expiry_alerts || false}
                    onChange={() => handleSettingToggle('lease_expiry_alerts')}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>Change your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="current_password">Current Password</Label>
                <Input
                  id="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData((p) => ({ ...p, current_password: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="new_password">New Password</Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData((p) => ({ ...p, new_password: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData((p) => ({ ...p, confirm_password: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={changePasswordMutation.isPending}>
                  {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-600">Log Out</p>
                <p className="text-sm text-gray-500">Sign out of your account</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Log Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
