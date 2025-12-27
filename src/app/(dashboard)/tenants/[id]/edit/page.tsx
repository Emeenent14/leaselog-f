'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const statusOptions = [
  { value: 'applicant', label: 'Applicant' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'past', label: 'Past' },
]

export default function EditTenantPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const tenantId = params.id as string
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    ssn_last_four: '',
    drivers_license: '',
    current_address: '',
    employer_name: '',
    employer_phone: '',
    job_title: '',
    monthly_income: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relationship: '',
    status: 'applicant',
    notes: '',
  })

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const response = await apiClient.get(`/tenants/${tenantId}/`)
      return response.data.data
    },
  })

  useEffect(() => {
    if (tenant) {
      setFormData({
        first_name: tenant.first_name || '',
        last_name: tenant.last_name || '',
        email: tenant.email || '',
        phone: tenant.phone || '',
        date_of_birth: tenant.date_of_birth || '',
        ssn_last_four: tenant.ssn_last_four || '',
        drivers_license: tenant.drivers_license || '',
        current_address: tenant.current_address || '',
        employer_name: tenant.employer_name || '',
        employer_phone: tenant.employer_phone || '',
        job_title: tenant.job_title || '',
        monthly_income: tenant.monthly_income?.toString() || '',
        emergency_contact_name: tenant.emergency_contact_name || '',
        emergency_contact_phone: tenant.emergency_contact_phone || '',
        emergency_contact_relationship: tenant.emergency_contact_relationship || '',
        status: tenant.status || 'applicant',
        notes: tenant.notes || '',
      })
    }
  }, [tenant])

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        monthly_income: data.monthly_income ? parseFloat(data.monthly_income) : null,
        date_of_birth: data.date_of_birth || null,
        ssn_last_four: data.ssn_last_four || null,
        drivers_license: data.drivers_license || null,
        current_address: data.current_address || null,
        employer_name: data.employer_name || null,
        employer_phone: data.employer_phone || null,
        job_title: data.job_title || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        emergency_contact_relationship: data.emergency_contact_relationship || null,
      }
      const response = await apiClient.patch(`/tenants/${tenantId}/`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', tenantId] })
      router.push(`/tenants/${tenantId}`)
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to update tenant')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    updateMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link href={`/tenants/${tenantId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Tenant</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_of_birth">Date of Birth</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="current_address">Current Address</Label>
                <Input
                  id="current_address"
                  name="current_address"
                  value={formData.current_address}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          {/* Identification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Identification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ssn_last_four">SSN (Last 4 digits)</Label>
                  <Input
                    id="ssn_last_four"
                    name="ssn_last_four"
                    value={formData.ssn_last_four}
                    onChange={handleChange}
                    maxLength={4}
                  />
                </div>
                <div>
                  <Label htmlFor="drivers_license">Driver's License</Label>
                  <Input
                    id="drivers_license"
                    name="drivers_license"
                    value={formData.drivers_license}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employer_name">Employer Name</Label>
                  <Input
                    id="employer_name"
                    name="employer_name"
                    value={formData.employer_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="job_title">Job Title</Label>
                  <Input
                    id="job_title"
                    name="job_title"
                    value={formData.job_title}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthly_income">Monthly Income</Label>
                  <Input
                    id="monthly_income"
                    name="monthly_income"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_income}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="employer_phone">Employer Phone</Label>
                  <Input
                    id="employer_phone"
                    name="employer_phone"
                    type="tel"
                    value={formData.employer_phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergency_contact_name">Name</Label>
                  <Input
                    id="emergency_contact_name"
                    name="emergency_contact_name"
                    value={formData.emergency_contact_name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_phone">Phone</Label>
                  <Input
                    id="emergency_contact_phone"
                    name="emergency_contact_phone"
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="emergency_contact_relationship">Relationship</Label>
                  <Input
                    id="emergency_contact_relationship"
                    name="emergency_contact_relationship"
                    value={formData.emergency_contact_relationship}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about this tenant..."
                rows={4}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Link href={`/tenants/${tenantId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
