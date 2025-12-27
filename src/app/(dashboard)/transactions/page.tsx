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
import { Plus, Search, CreditCard, TrendingUp, TrendingDown, X } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Transaction {
  id: string
  type: 'income' | 'expense'
  category_name: string
  property_address: string | null
  amount: number
  date: string
  description: string
  payment_method: string
  reference_number: string
}

interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

export default function TransactionsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    type: 'expense',
    category: '',
    property: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    payment_method: 'other',
    reference_number: '',
  })

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions', { search, type: typeFilter }],
    queryFn: async () => {
      const params: any = {}
      if (search) params.search = search
      if (typeFilter) params.type = typeFilter
      const response = await apiClient.get('/transactions/', { params })
      return response.data.data
    },
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/transactions/categories/')
      return response.data.data
    },
  })

  const { data: propertiesData } = useQuery({
    queryKey: ['properties-list'],
    queryFn: async () => {
      const response = await apiClient.get('/properties/')
      return response.data.data
    },
  })

  const transactions: Transaction[] = transactionsData || []
  const categories: Category[] = categoriesData || []
  const properties = propertiesData || []

  const filteredCategories = categories.filter((c) => c.type === formData.type)

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        type: data.type,
        category: data.category || null,
        property: data.property || null,
        amount: parseFloat(data.amount),
        date: data.date,
        description: data.description,
        payment_method: data.payment_method,
        reference_number: data.reference_number || null,
      }
      const response = await apiClient.post('/transactions/', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
      setShowForm(false)
      setFormData({
        type: 'expense',
        category: '',
        property: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        payment_method: 'other',
        reference_number: '',
      })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transactions/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteMutation.mutate(id)
    }
  }

  // Calculate totals
  const totals = transactions.reduce(
    (acc, t) => {
      if (t.type === 'income') acc.income += t.amount
      else acc.expense += t.amount
      return acc
    },
    { income: 0, expense: 0 }
  )

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
  ]

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'other', label: 'Other' },
  ]

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        <Button onClick={() => setShowForm(true)} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-2xl font-semibold text-green-600">{formatCurrency(totals.income)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-semibold text-red-600">{formatCurrency(totals.expense)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${totals.income - totals.expense >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <CreditCard className={`h-6 w-6 ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net</p>
                <p className={`text-2xl font-semibold ${totals.income - totals.expense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totals.income - totals.expense)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Add Transaction</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    options={[
                      { value: 'income', label: 'Income' },
                      { value: 'expense', label: 'Expense' },
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Select category' },
                      ...filteredCategories.map((c) => ({ value: c.id, label: c.name })),
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="property">Property</Label>
                  <Select
                    id="property"
                    name="property"
                    value={formData.property}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Select property' },
                      ...properties.map((p: any) => ({ value: p.id, label: p.street_address })),
                    ]}
                  />
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    id="payment_method"
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleChange}
                    options={paymentMethods}
                  />
                </div>
                <div>
                  <Label htmlFor="reference_number">Reference #</Label>
                  <Input
                    id="reference_number"
                    name="reference_number"
                    value={formData.reference_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description..."
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Adding...' : 'Add Transaction'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          options={typeOptions}
          className="w-40"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && transactions.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No transactions</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first transaction.
            </p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transactions Table */}
      {!isLoading && transactions.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Property</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.description || '-'}</div>
                    {transaction.reference_number && (
                      <div className="text-xs text-gray-500">Ref: {transaction.reference_number}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.type === 'income' ? 'success' : 'danger'}>
                      {transaction.category_name || transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transaction.property_address || '-'}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(transaction.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
