'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface StripeAccount {
  id: string
  stripe_account_id: string
  charges_enabled: boolean
  payouts_enabled: boolean
  details_submitted: boolean
  onboarding_completed_at?: string
}

interface PlaidConnection {
  id: string
  institution_name: string
  institution_logo?: string
  status: string
  last_synced_at?: string
  accounts_count: number
}

interface PlaidTransaction {
  id: string
  account_name: string
  date: string
  name: string
  merchant_name?: string
  amount: number
  status: string
}

export default function BankingPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions'>('overview')

  const { data: stripeAccount } = useQuery({
    queryKey: ['stripe-account-status'],
    queryFn: async () => {
      const response = await apiClient.get('/banking/stripe/accounts/status/')
      return response.data.data as StripeAccount | null
    },
  })

  const { data: plaidConnections } = useQuery({
    queryKey: ['plaid-connections'],
    queryFn: async () => {
      const response = await apiClient.get('/banking/plaid/connections/')
      return response.data.data as PlaidConnection[]
    },
  })

  const { data: pendingTransactions } = useQuery({
    queryKey: ['plaid-transactions', 'pending'],
    queryFn: async () => {
      const response = await apiClient.get('/banking/plaid/transactions/?status=pending')
      return response.data.data as PlaidTransaction[]
    },
  })

  const connectStripeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiClient.post('/banking/stripe/accounts/connect/')
      return response.data.data
    },
    onSuccess: (data) => {
      if (data.onboarding_url) {
        window.location.href = data.onboarding_url
      }
    },
  })

  const syncConnectionMutation = useMutation({
    mutationFn: async (connectionId: string) => {
      await apiClient.post(`/banking/plaid/connections/${connectionId}/sync/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-connections'] })
      queryClient.invalidateQueries({ queryKey: ['plaid-transactions'] })
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Banking & Payments</h1>
        <p className="text-muted-foreground">
          Manage payment processing and bank connections
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          className={`px-4 py-2 -mb-px ${
            activeTab === 'overview'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 -mb-px ${
            activeTab === 'transactions'
              ? 'border-b-2 border-primary font-medium'
              : 'text-muted-foreground'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions ({pendingTransactions?.length || 0} pending)
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stripe Section */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Processing</CardTitle>
              <CardDescription>
                Accept online rent payments from tenants via credit card or bank transfer
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stripeAccount?.details_submitted ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge variant={stripeAccount.charges_enabled ? 'default' : 'secondary'}>
                      {stripeAccount.charges_enabled ? 'Payments Enabled' : 'Payments Disabled'}
                    </Badge>
                    <Badge variant={stripeAccount.payouts_enabled ? 'default' : 'secondary'}>
                      {stripeAccount.payouts_enabled ? 'Payouts Enabled' : 'Payouts Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connected since {stripeAccount.onboarding_completed_at &&
                      new Date(stripeAccount.onboarding_completed_at).toLocaleDateString()}
                  </p>
                  <Button variant="outline" onClick={() => {
                    apiClient.get('/banking/stripe/accounts/dashboard_link/').then(res => {
                      if (res.data.data.dashboard_url) {
                        window.open(res.data.data.dashboard_url, '_blank')
                      }
                    })
                  }}>
                    Open Stripe Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect your Stripe account to start accepting online payments from tenants.
                  </p>
                  <Button onClick={() => connectStripeMutation.mutate()}>
                    Connect Stripe
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plaid Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bank Connections</CardTitle>
                  <CardDescription>
                    Connect your bank accounts to automatically import transactions
                  </CardDescription>
                </div>
                <Button onClick={() => {
                  // Would open Plaid Link here
                  alert('Plaid Link integration would open here')
                }}>
                  Connect Bank
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!plaidConnections?.length ? (
                <p className="text-muted-foreground py-4">
                  No bank accounts connected. Connect a bank to automatically import transactions.
                </p>
              ) : (
                <div className="space-y-4">
                  {plaidConnections.map((connection) => (
                    <div
                      key={connection.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {connection.institution_logo && (
                          <img
                            src={connection.institution_logo}
                            alt={connection.institution_name}
                            className="w-10 h-10 rounded"
                          />
                        )}
                        <div>
                          <p className="font-medium">{connection.institution_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {connection.accounts_count} account(s)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={connection.status === 'active' ? 'default' : 'destructive'}>
                          {connection.status}
                        </Badge>
                        {connection.last_synced_at && (
                          <span className="text-sm text-muted-foreground">
                            Last synced: {new Date(connection.last_synced_at).toLocaleString()}
                          </span>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncConnectionMutation.mutate(connection.id)}
                        >
                          Sync
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'transactions' && (
        <TransactionsTab />
      )}
    </div>
  )
}

function TransactionsTab() {
  const queryClient = useQueryClient()

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['plaid-transactions', 'pending'],
    queryFn: async () => {
      const response = await apiClient.get('/banking/plaid/transactions/?status=pending')
      return response.data.data as PlaidTransaction[]
    },
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/categories/')
      return response.data.data
    },
  })

  const categorizeMutation = useMutation({
    mutationFn: async ({ id, categoryId }: { id: string; categoryId: string }) => {
      await apiClient.post(`/banking/plaid/transactions/${id}/categorize/`, {
        category_id: categoryId,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-transactions'] })
    },
  })

  const ignoreMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/banking/plaid/transactions/${id}/ignore/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plaid-transactions'] })
    },
  })

  if (isLoading) {
    return <p className="text-center py-8">Loading transactions...</p>
  }

  if (!transactions?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No pending transactions to review
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Transactions</CardTitle>
        <CardDescription>
          Review and categorize imported bank transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Account</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell>{txn.date}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{txn.name}</p>
                    {txn.merchant_name && (
                      <p className="text-sm text-muted-foreground">{txn.merchant_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{txn.account_name}</TableCell>
                <TableCell className={`text-right font-medium ${
                  txn.amount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {txn.amount > 0 ? '-' : '+'}${Math.abs(txn.amount).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Would show category picker
                        const categoryId = prompt('Enter category ID:')
                        if (categoryId) {
                          categorizeMutation.mutate({ id: txn.id, categoryId })
                        }
                      }}
                    >
                      Categorize
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => ignoreMutation.mutate(txn.id)}
                    >
                      Ignore
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
