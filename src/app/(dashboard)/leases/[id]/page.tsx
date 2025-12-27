'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Calendar, DollarSign, RefreshCw, XCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Lease {
  id: string
  rental_property: string
  property_detail: {
    id: string
    street_address: string
    city: string
    state: string
  }
  unit: string | null
  tenant: string
  tenant_detail: {
    id: string
    first_name: string
    last_name: string
    email: string
    phone: string
  }
  lease_type: string
  start_date: string
  end_date: string
  status: string
  rent_amount: number
  rent_due_day: number
  security_deposit: number
  security_deposit_paid: boolean
  security_deposit_paid_date: string | null
  late_fee_type: string
  late_fee_amount: number
  late_fee_grace_days: number
  auto_renew: boolean
  renewal_term_months: number
  terminated_date: string | null
  termination_reason: string
  notes: string
  days_until_expiry: number | null
  created_at: string
  updated_at: string
}

export default function LeaseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const leaseId = params.id as string

  const { data: lease, isLoading } = useQuery({
    queryKey: ['lease', leaseId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Lease }>(`/leases/${leaseId}/`)
      return response.data.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/leases/${leaseId}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      router.push('/leases')
    },
  })

  const terminateMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/leases/${leaseId}/terminate/`, {
        termination_date: new Date().toISOString().split('T')[0],
        reason: 'Terminated by landlord',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lease', leaseId] })
      queryClient.invalidateQueries({ queryKey: ['leases'] })
    },
  })

  const renewMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/leases/${leaseId}/renew/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leases'] })
      router.push('/leases')
    },
  })

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this lease?')) {
      deleteMutation.mutate()
    }
  }

  const handleTerminate = () => {
    if (confirm('Are you sure you want to terminate this lease?')) {
      terminateMutation.mutate()
    }
  }

  const handleRenew = () => {
    if (confirm('Are you sure you want to renew this lease?')) {
      renewMutation.mutate()
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
    active: 'success',
    pending: 'warning',
    expired: 'danger',
    terminated: 'danger',
    renewed: 'info',
    draft: 'secondary',
  }

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!lease) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lease not found</p>
        <Link href="/leases">
          <Button className="mt-4">Back to Leases</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/leases">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                Lease at {lease.property_detail.street_address}
              </h1>
              <Badge variant={statusColors[lease.status]}>{lease.status}</Badge>
            </div>
            <p className="text-gray-500">
              {lease.tenant_detail.first_name} {lease.tenant_detail.last_name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {lease.status === 'active' && (
            <>
              <Button variant="outline" onClick={handleRenew} disabled={renewMutation.isPending}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Renew
              </Button>
              <Button variant="outline" onClick={handleTerminate} disabled={terminateMutation.isPending}>
                <XCircle className="h-4 w-4 mr-2" />
                Terminate
              </Button>
            </>
          )}
          <Link href={`/leases/${leaseId}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button variant="outline" onClick={handleDelete} disabled={deleteMutation.isPending}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lease Term */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lease Term</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Type</dt>
                  <dd className="font-medium capitalize">{lease.lease_type.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Start Date</dt>
                  <dd className="font-medium">{formatDate(lease.start_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">End Date</dt>
                  <dd className="font-medium">{formatDate(lease.end_date)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Days Until Expiry</dt>
                  <dd className={`font-medium ${lease.days_until_expiry !== null && lease.days_until_expiry <= 30 ? 'text-orange-600' : ''}`}>
                    {lease.days_until_expiry !== null ? (
                      lease.days_until_expiry > 0 ? `${lease.days_until_expiry} days` : 'Expired'
                    ) : 'N/A'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Rent Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rent & Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Monthly Rent</dt>
                  <dd className="text-xl font-semibold text-green-600">{formatCurrency(lease.rent_amount)}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Due Day</dt>
                  <dd className="font-medium">{lease.rent_due_day}{getOrdinalSuffix(lease.rent_due_day)} of month</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Security Deposit</dt>
                  <dd className="font-medium">
                    {formatCurrency(lease.security_deposit)}
                    {lease.security_deposit_paid && (
                      <Badge variant="success" className="ml-2">Paid</Badge>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Late Fee Type</dt>
                  <dd className="font-medium capitalize">{lease.late_fee_type}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Late Fee Amount</dt>
                  <dd className="font-medium">
                    {lease.late_fee_type === 'percent'
                      ? `${lease.late_fee_amount}%`
                      : formatCurrency(lease.late_fee_amount)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Grace Period</dt>
                  <dd className="font-medium">{lease.late_fee_grace_days} days</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          {/* Auto-Renewal */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Renewal Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Auto-Renew</dt>
                  <dd className="font-medium">{lease.auto_renew ? 'Yes' : 'No'}</dd>
                </div>
                {lease.auto_renew && (
                  <div>
                    <dt className="text-sm text-gray-500">Renewal Term</dt>
                    <dd className="font-medium">{lease.renewal_term_months} months</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Termination Info */}
          {lease.terminated_date && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Termination</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Terminated Date</dt>
                    <dd className="font-medium">{formatDate(lease.terminated_date)}</dd>
                  </div>
                  {lease.termination_reason && (
                    <div>
                      <dt className="text-sm text-gray-500">Reason</dt>
                      <dd className="font-medium">{lease.termination_reason}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {lease.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{lease.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Property Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/properties/${lease.property_detail.id}`} className="hover:text-primary-600">
                <p className="font-medium">{lease.property_detail.street_address}</p>
                <p className="text-sm text-gray-500">
                  {lease.property_detail.city}, {lease.property_detail.state}
                </p>
              </Link>
            </CardContent>
          </Card>

          {/* Tenant Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tenant</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/tenants/${lease.tenant_detail.id}`} className="hover:text-primary-600">
                <p className="font-medium">
                  {lease.tenant_detail.first_name} {lease.tenant_detail.last_name}
                </p>
              </Link>
              <p className="text-sm text-gray-500 mt-1">{lease.tenant_detail.email}</p>
              {lease.tenant_detail.phone && (
                <p className="text-sm text-gray-500">{lease.tenant_detail.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/rent?lease=${leaseId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Payments
                </Button>
              </Link>
              <Link href={`/transactions?lease=${leaseId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Transactions
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return s[(v - 20) % 10] || s[v] || s[0]
}
