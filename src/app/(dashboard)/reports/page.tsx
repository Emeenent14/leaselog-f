'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface IncomeExpenseReport {
  year: number
  income: {
    total: number
    by_category: Array<{ category: string; amount: number }>
  }
  expenses: {
    total: number
    by_category: Array<{ category: string; schedule_e_line: string | null; amount: number }>
  }
  net_operating_income: number
  monthly: Array<{
    month: number
    income: number
    expenses: number
    net: number
  }>
}

export default function ReportsPage() {
  const currentYear = new Date().getFullYear()
  const [year, setYear] = useState(currentYear.toString())

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['income-expense-report', year],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: IncomeExpenseReport }>(
        `/reports/income-expense/?year=${year}`
      )
      return response.data.data
    },
  })

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }))

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const report = reportData

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <div className="mt-4 sm:mt-0 w-32">
          <Select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            options={yearOptions}
          />
        </div>
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
                <p className="text-2xl font-semibold text-green-600">
                  {formatCurrency(report?.income.total || 0)}
                </p>
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
                <p className="text-2xl font-semibold text-red-600">
                  {formatCurrency(report?.expenses.total || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-lg ${(report?.net_operating_income || 0) >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${(report?.net_operating_income || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Net Operating Income</p>
                <p className={`text-2xl font-semibold ${(report?.net_operating_income || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(report?.net_operating_income || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Income by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {report?.income.by_category && report.income.by_category.length > 0 ? (
              <div className="space-y-3">
                {report.income.by_category.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-gray-600">{cat.category}</span>
                    <span className="font-medium text-green-600">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No income data</p>
            )}
          </CardContent>
        </Card>

        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {report?.expenses.by_category && report.expenses.by_category.length > 0 ? (
              <div className="space-y-3">
                {report.expenses.by_category.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-600">{cat.category}</span>
                      {cat.schedule_e_line && (
                        <span className="text-xs text-gray-400 ml-2">({cat.schedule_e_line})</span>
                      )}
                    </div>
                    <span className="font-medium text-red-600">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No expense data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Monthly Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          {report?.monthly && report.monthly.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 text-sm font-medium text-gray-500">Month</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">Income</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">Expenses</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-gray-500">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {report.monthly.map((month) => (
                    <tr key={month.month} className="border-b last:border-0">
                      <td className="py-2 px-3">{monthNames[month.month - 1]}</td>
                      <td className="text-right py-2 px-3 text-green-600">
                        {formatCurrency(month.income)}
                      </td>
                      <td className="text-right py-2 px-3 text-red-600">
                        {formatCurrency(month.expenses)}
                      </td>
                      <td className={`text-right py-2 px-3 font-medium ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(month.net)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-semibold">
                    <td className="py-2 px-3">Total</td>
                    <td className="text-right py-2 px-3 text-green-600">
                      {formatCurrency(report.income.total)}
                    </td>
                    <td className="text-right py-2 px-3 text-red-600">
                      {formatCurrency(report.expenses.total)}
                    </td>
                    <td className={`text-right py-2 px-3 ${report.net_operating_income >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(report.net_operating_income)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No data for {year}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
