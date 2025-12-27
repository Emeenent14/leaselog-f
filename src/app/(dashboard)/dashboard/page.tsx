'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, DollarSign, TrendingDown, TrendingUp, AlertTriangle, Clock } from 'lucide-react'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface DashboardSummary {
  properties: {
    total: number
    occupied: number
    vacant: number
    occupancy_rate: number
  }
  income: {
    total: number
    rent: number
    other: number
  }
  expenses: {
    total: number
    by_category: Array<{ category: string; amount: number }>
  }
  net_operating_income: number
  rent_collection: {
    expected: number
    collected: number
    collection_rate: number
  }
  upcoming: {
    expiring_leases: number
    overdue_rent: number
    maintenance_pending: number
  }
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: DashboardSummary }>('/reports/summary/')
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">Welcome to LeaseLog! Add your first property to get started.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{data.properties.total}</p>
                <p className="text-xs text-gray-500">
                  {formatPercent(data.properties.occupancy_rate)} occupied
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Income</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(data.income.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Expenses</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(data.expenses.total)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${data.net_operating_income >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <TrendingUp className={`h-6 w-6 ${data.net_operating_income >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                <p className={`text-2xl font-semibold ${data.net_operating_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(data.net_operating_income)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Rent Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Expected</span>
                <span className="font-medium">{formatCurrency(data.rent_collection.expected)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Collected</span>
                <span className="font-medium text-green-600">{formatCurrency(data.rent_collection.collected)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${Math.min(data.rent_collection.collection_rate, 100)}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 text-center">
                {data.rent_collection.collection_rate.toFixed(0)}% collected this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.upcoming.overdue_rent > 0 && (
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
                  <span className="text-red-700">
                    {data.upcoming.overdue_rent} overdue rent payment{data.upcoming.overdue_rent !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              {data.upcoming.expiring_leases > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-500 mr-3" />
                  <span className="text-yellow-700">
                    {data.upcoming.expiring_leases} lease{data.upcoming.expiring_leases !== 1 ? 's' : ''} expiring in 30 days
                  </span>
                </div>
              )}
              {data.upcoming.overdue_rent === 0 && data.upcoming.expiring_leases === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No alerts at this time
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
