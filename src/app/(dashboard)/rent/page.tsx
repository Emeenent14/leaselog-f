'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DollarSign, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface RentPayment {
  id: string
  lease_id: string
  property_address: string
  tenant_name: string
  due_date: string
  amount_due: number
  amount_paid: number
  late_fee_applied: number
  status: string
  is_overdue: boolean
}

export default function RentPaymentsPage() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [showPaymentModal, setShowPaymentModal] = useState<string | null>(null)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'other',
    reference_number: '',
    notes: '',
  })

  const { data: paymentsData, isLoading } = useQuery({
    queryKey: ['rent-payments', { status: statusFilter }],
    queryFn: async () => {
      const params: any = {}
      if (statusFilter) params.status = statusFilter
      const response = await apiClient.get('/payments/', { params })
      return response.data.data
    },
  })

  const payments: RentPayment[] = paymentsData || []

  const recordPaymentMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof paymentData }) => {
      const payload = {
        amount: parseFloat(data.amount),
        payment_date: data.payment_date,
        payment_method: data.payment_method,
        reference_number: data.reference_number || null,
        notes: data.notes || null,
      }
      const response = await apiClient.post(`/payments/${id}/record/`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] })
      setShowPaymentModal(null)
      setPaymentData({
        amount: '',
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'other',
        reference_number: '',
        notes: '',
      })
    },
  })

  const applyLateFee = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/payments/${id}/apply-late-fee/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] })
    },
  })

  const waiveLateFee = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/payments/${id}/waive-late-fee/`, {
        reason: 'Waived by landlord',
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rent-payments'] })
    },
  })

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (showPaymentModal) {
      recordPaymentMutation.mutate({ id: showPaymentModal, data: paymentData })
    }
  }

  const openPaymentModal = (payment: RentPayment) => {
    setPaymentData({
      amount: (payment.amount_due + payment.late_fee_applied - payment.amount_paid).toString(),
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'other',
      reference_number: '',
      notes: '',
    })
    setShowPaymentModal(payment.id)
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    paid: 'success',
    partial: 'warning',
    pending: 'info',
    overdue: 'danger',
  }

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'partial', label: 'Partial' },
    { value: 'paid', label: 'Paid' },
  ]

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'other', label: 'Other' },
  ]

  // Calculate summary
  const summary = payments.reduce(
    (acc, p) => {
      acc.totalDue += p.amount_due + p.late_fee_applied
      acc.totalPaid += p.amount_paid
      if (p.is_overdue) acc.overdueCount++
      return acc
    },
    { totalDue: 0, totalPaid: 0, overdueCount: 0 }
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rent Payments</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Due</p>
                <p className="text-xl font-semibold">{formatCurrency(summary.totalDue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                <p className="text-xl font-semibold text-green-600">{formatCurrency(summary.totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Outstanding</p>
                <p className="text-xl font-semibold text-orange-600">
                  {formatCurrency(summary.totalDue - summary.totalPaid)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Overdue</p>
                <p className="text-xl font-semibold text-red-600">{summary.overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={statusOptions}
          className="w-40"
        />
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Record Payment</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowPaymentModal(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentData.amount}
                    onChange={(e) => setPaymentData((p) => ({ ...p, amount: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payment_date">Payment Date *</Label>
                  <Input
                    id="payment_date"
                    type="date"
                    value={paymentData.payment_date}
                    onChange={(e) => setPaymentData((p) => ({ ...p, payment_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    id="payment_method"
                    value={paymentData.payment_method}
                    onChange={(e) => setPaymentData((p) => ({ ...p, payment_method: e.target.value }))}
                    options={paymentMethods}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reference_number">Reference #</Label>
                  <Input
                    id="reference_number"
                    value={paymentData.reference_number}
                    onChange={(e) => setPaymentData((p) => ({ ...p, reference_number: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={paymentData.notes}
                    onChange={(e) => setPaymentData((p) => ({ ...p, notes: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowPaymentModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={recordPaymentMutation.isPending}>
                  {recordPaymentMutation.isPending ? 'Recording...' : 'Record Payment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && payments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No rent payments</h3>
            <p className="mt-1 text-sm text-gray-500">
              Rent payments will appear here when leases are active.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Payments Table */}
      {!isLoading && payments.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Due Date</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const balance = payment.amount_due + payment.late_fee_applied - payment.amount_paid
                return (
                  <TableRow key={payment.id} className={payment.is_overdue ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className={payment.is_overdue ? 'text-red-600 font-medium' : ''}>
                        {formatDate(payment.due_date)}
                      </div>
                    </TableCell>
                    <TableCell>{payment.property_address}</TableCell>
                    <TableCell>{payment.tenant_name}</TableCell>
                    <TableCell>
                      <div>{formatCurrency(payment.amount_due)}</div>
                      {payment.late_fee_applied > 0 && (
                        <div className="text-xs text-red-600">
                          +{formatCurrency(payment.late_fee_applied)} late fee
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-green-600 font-medium">
                      {formatCurrency(payment.amount_paid)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[payment.status] || 'secondary'}>
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {payment.status !== 'paid' && (
                          <Button size="sm" onClick={() => openPaymentModal(payment)}>
                            Record Payment
                          </Button>
                        )}
                        {payment.is_overdue && payment.late_fee_applied === 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyLateFee.mutate(payment.id)}
                            disabled={applyLateFee.isPending}
                          >
                            Apply Late Fee
                          </Button>
                        )}
                        {payment.late_fee_applied > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => waiveLateFee.mutate(payment.id)}
                            disabled={waiveLateFee.isPending}
                          >
                            Waive Fee
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
