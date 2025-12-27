'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

const leaseTypes = [
  { value: 'fixed', label: 'Fixed Term' },
  { value: 'month_to_month', label: 'Month to Month' },
]

const lateFeeTypes = [
  { value: 'fixed', label: 'Fixed Amount' },
  { value: 'percent', label: 'Percentage' },
  { value: 'daily', label: 'Daily Amount' },
]

export default function NewLeasePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    rental_property: '',
    unit: '',
    tenant: '',
    lease_type: 'fixed',
    start_date: '',
    end_date: '',
    rent_amount: '',
    rent_due_day: '1',
    security_deposit: '',
    security_deposit_paid: false,
    security_deposit_paid_date: '',
    late_fee_type: 'fixed',
    late_fee_amount: '50',
    late_fee_grace_days: '5',
    auto_renew: false,
    renewal_term_months: '12',
    notes: '',
  })

  // Fetch properties for dropdown
  const { data: propertiesData } = useQuery({
    queryKey: ['properties-list'],
    queryFn: async () => {
      const response = await apiClient.get('/properties/')
      return response.data.data
    },
  })

  // Fetch tenants for dropdown
  const { data: tenantsData } = useQuery({
    queryKey: ['tenants-list'],
    queryFn: async () => {
      const response = await apiClient.get('/tenants/')
      return response.data.data
    },
  })

  const properties = propertiesData || []
  const tenants = tenantsData || []

  const propertyOptions = [
    { value: '', label: 'Select a property' },
    ...properties.map((p: any) => ({ value: p.id, label: p.street_address })),
  ]

  const tenantOptions = [
    { value: '', label: 'Select a tenant' },
    ...tenants.map((t: any) => ({ value: t.id, label: `${t.first_name} ${t.last_name}` })),
  ]

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        rental_property: data.rental_property,
        unit: data.unit || null,
        tenant: data.tenant,
        lease_type: data.lease_type,
        start_date: data.start_date,
        end_date: data.end_date,
        rent_amount: parseFloat(data.rent_amount),
        rent_due_day: parseInt(data.rent_due_day),
        security_deposit: data.security_deposit ? parseFloat(data.security_deposit) : 0,
        security_deposit_paid: data.security_deposit_paid,
        security_deposit_paid_date: data.security_deposit_paid_date || null,
        late_fee_type: data.late_fee_type,
        late_fee_amount: parseFloat(data.late_fee_amount),
        late_fee_grace_days: parseInt(data.late_fee_grace_days),
        auto_renew: data.auto_renew,
        renewal_term_months: parseInt(data.renewal_term_months),
        notes: data.notes,
      }
      const response = await apiClient.post('/leases/', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      router.push('/leases')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to create lease')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link href="/leases">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Create New Lease</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Property & Tenant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property & Tenant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rental_property">Property *</Label>
                  <Select
                    id="rental_property"
                    name="rental_property"
                    value={formData.rental_property}
                    onChange={handleChange}
                    options={propertyOptions}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tenant">Tenant *</Label>
                  <Select
                    id="tenant"
                    name="tenant"
                    value={formData.tenant}
                    onChange={handleChange}
                    options={tenantOptions}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lease Term */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lease Term</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="lease_type">Lease Type</Label>
                  <Select
                    id="lease_type"
                    name="lease_type"
                    value={formData.lease_type}
                    onChange={handleChange}
                    options={leaseTypes}
                  />
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date *</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_date">End Date *</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rent Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="rent_amount">Monthly Rent *</Label>
                  <Input
                    id="rent_amount"
                    name="rent_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.rent_amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rent_due_day">Rent Due Day</Label>
                  <Input
                    id="rent_due_day"
                    name="rent_due_day"
                    type="number"
                    min="1"
                    max="28"
                    value={formData.rent_due_day}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="security_deposit">Security Deposit</Label>
                  <Input
                    id="security_deposit"
                    name="security_deposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.security_deposit}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="security_deposit_paid"
                    checked={formData.security_deposit_paid}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Security deposit paid</span>
                </label>
                {formData.security_deposit_paid && (
                  <div>
                    <Input
                      name="security_deposit_paid_date"
                      type="date"
                      value={formData.security_deposit_paid_date}
                      onChange={handleChange}
                      className="w-40"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Late Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Late Fee Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="late_fee_type">Late Fee Type</Label>
                  <Select
                    id="late_fee_type"
                    name="late_fee_type"
                    value={formData.late_fee_type}
                    onChange={handleChange}
                    options={lateFeeTypes}
                  />
                </div>
                <div>
                  <Label htmlFor="late_fee_amount">
                    Late Fee {formData.late_fee_type === 'percent' ? '(%)' : 'Amount'}
                  </Label>
                  <Input
                    id="late_fee_amount"
                    name="late_fee_amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.late_fee_amount}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="late_fee_grace_days">Grace Period (days)</Label>
                  <Input
                    id="late_fee_grace_days"
                    name="late_fee_grace_days"
                    type="number"
                    min="0"
                    value={formData.late_fee_grace_days}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renewal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Renewal Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="auto_renew"
                    checked={formData.auto_renew}
                    onChange={handleChange}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Auto-renew lease</span>
                </label>
                {formData.auto_renew && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="renewal_term_months" className="text-sm whitespace-nowrap">
                      Renewal term:
                    </Label>
                    <Input
                      id="renewal_term_months"
                      name="renewal_term_months"
                      type="number"
                      min="1"
                      value={formData.renewal_term_months}
                      onChange={handleChange}
                      className="w-20"
                    />
                    <span className="text-sm text-gray-500">months</span>
                  </div>
                )}
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
                placeholder="Add any notes about this lease..."
                rows={4}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Link href="/leases">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Lease'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
