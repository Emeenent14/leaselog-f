'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface TenantSession {
  session_token: string
  expires_at: string
  tenant: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

interface Lease {
  id: string
  property_name: string
  property_address: string
  unit_name?: string
  start_date: string
  end_date: string
  rent_amount: number
  status: string
}

interface Payment {
  id: string
  due_date: string
  amount_due: number
  amount_paid: number
  balance_due: number
  late_fee_applied: number
  status: string
  paid_date?: string
}

interface MaintenanceRequest {
  id: string
  title: string
  category: string
  priority: string
  status: string
  created_at: string
}

export default function TenantPortalPage() {
  const params = useParams()
  const token = params.token as string

  const [session, setSession] = useState<TenantSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'maintenance'>('overview')

  useEffect(() => {
    login()
  }, [token])

  const login = async () => {
    try {
      const response = await fetch(`${API_URL}/tenant-portal/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await response.json()

      if (data.success) {
        setSession(data.data)
      } else {
        setError(data.error?.message || 'Invalid or expired access link')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Unable to access portal'}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              Please contact your landlord for a new access link.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Tenant Portal</h1>
          <div className="text-sm text-muted-foreground">
            Welcome, {session.tenant.first_name}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-6">
            <button
              className={`py-4 border-b-2 ${
                activeTab === 'overview'
                  ? 'border-primary font-medium'
                  : 'border-transparent text-muted-foreground'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-4 border-b-2 ${
                activeTab === 'payments'
                  ? 'border-primary font-medium'
                  : 'border-transparent text-muted-foreground'
              }`}
              onClick={() => setActiveTab('payments')}
            >
              Payments
            </button>
            <button
              className={`py-4 border-b-2 ${
                activeTab === 'maintenance'
                  ? 'border-primary font-medium'
                  : 'border-transparent text-muted-foreground'
              }`}
              onClick={() => setActiveTab('maintenance')}
            >
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'overview' && <OverviewTab sessionToken={session.session_token} />}
        {activeTab === 'payments' && <PaymentsTab sessionToken={session.session_token} />}
        {activeTab === 'maintenance' && <MaintenanceTab sessionToken={session.session_token} />}
      </main>
    </div>
  )
}

function OverviewTab({ sessionToken }: { sessionToken: string }) {
  const [lease, setLease] = useState<Lease | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leaseRes, paymentsRes] = await Promise.all([
        fetch(`${API_URL}/tenant-portal/lease/`, {
          headers: { 'Authorization': `TenantPortal ${sessionToken}` },
        }),
        fetch(`${API_URL}/tenant-portal/payments/`, {
          headers: { 'Authorization': `TenantPortal ${sessionToken}` },
        }),
      ])

      const leaseData = await leaseRes.json()
      const paymentsData = await paymentsRes.json()

      if (leaseData.success) setLease(leaseData.data)
      if (paymentsData.success) setPayments(paymentsData.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Loading...</p>

  const nextPayment = payments.find(p => p.status !== 'paid')

  return (
    <div className="space-y-6">
      {/* Lease Info */}
      {lease && (
        <Card>
          <CardHeader>
            <CardTitle>Your Lease</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Property</p>
                <p className="font-medium">{lease.property_name}</p>
                <p className="text-sm">{lease.property_address}</p>
                {lease.unit_name && <p className="text-sm">Unit: {lease.unit_name}</p>}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lease Term</p>
                <p className="font-medium">
                  {new Date(lease.start_date).toLocaleDateString()} -{' '}
                  {new Date(lease.end_date).toLocaleDateString()}
                </p>
                <p className="text-sm">Monthly Rent: ${lease.rent_amount.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Payment */}
      {nextPayment && (
        <Card>
          <CardHeader>
            <CardTitle>Next Payment Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">${nextPayment.balance_due.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(nextPayment.due_date).toLocaleDateString()}
                </p>
                {nextPayment.late_fee_applied > 0 && (
                  <p className="text-sm text-red-600">
                    Includes ${nextPayment.late_fee_applied.toFixed(2)} late fee
                  </p>
                )}
              </div>
              <Badge variant={nextPayment.status === 'overdue' ? 'destructive' : 'secondary'}>
                {nextPayment.status}
              </Badge>
            </div>
            <Button className="w-full mt-4">
              Pay Now
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function PaymentsTab({ sessionToken }: { sessionToken: string }) {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_URL}/tenant-portal/payments/`, {
      headers: { 'Authorization': `TenantPortal ${sessionToken}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setPayments(data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <Card key={payment.id}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {new Date(payment.due_date).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  Due: {new Date(payment.due_date).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${payment.amount_due.toFixed(2)}</p>
                <Badge variant={payment.status === 'paid' ? 'default' : 'secondary'}>
                  {payment.status}
                </Badge>
              </div>
            </div>
            {payment.status !== 'paid' && payment.balance_due > 0 && (
              <Button className="w-full mt-4" size="sm">
                Pay ${payment.balance_due.toFixed(2)}
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function MaintenanceTab({ sessionToken }: { sessionToken: string }) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    permission_to_enter: false,
    preferred_times: '',
  })

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/tenant-portal/maintenance/`, {
        headers: { 'Authorization': `TenantPortal ${sessionToken}` },
      })
      const data = await res.json()
      if (data.success) setRequests(data.data)
    } finally {
      setLoading(false)
    }
  }

  const submitRequest = async () => {
    try {
      const res = await fetch(`${API_URL}/tenant-portal/maintenance/`, {
        method: 'POST',
        headers: {
          'Authorization': `TenantPortal ${sessionToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (data.success) {
        setShowForm(false)
        setFormData({
          title: '',
          description: '',
          category: 'other',
          priority: 'medium',
          permission_to_enter: false,
          preferred_times: '',
        })
        fetchRequests()
      }
    } catch (err) {
      alert('Failed to submit request')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Maintenance Requests</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Request'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Submit Maintenance Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Brief description of the issue"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="appliance">Appliance</SelectItem>
                  <SelectItem value="structural">Structural</SelectItem>
                  <SelectItem value="pest">Pest Control</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the problem"
                rows={4}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="permission"
                checked={formData.permission_to_enter}
                onChange={(e) => setFormData({ ...formData, permission_to_enter: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="permission" className="text-sm">
                Permission to enter if I am not home
              </label>
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Times (optional)</label>
              <Input
                value={formData.preferred_times}
                onChange={(e) => setFormData({ ...formData, preferred_times: e.target.value })}
                placeholder="e.g., Weekdays 9am-5pm"
              />
            </div>
            <Button onClick={submitRequest} className="w-full">
              Submit Request
            </Button>
          </CardContent>
        </Card>
      )}

      {requests.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No maintenance requests
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{request.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.category} - {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge>{request.status.replace('_', ' ')}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
