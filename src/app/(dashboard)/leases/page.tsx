'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Search, FileText } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Lease {
  id: string
  property_address: string
  unit_number: string | null
  tenant_name: string
  lease_type: string
  start_date: string
  end_date: string
  rent_amount: number
  status: string
  days_until_expiry: number | null
}

export default function LeasesPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['leases', { search }],
    queryFn: async () => {
      const params = search ? { search } : {}
      const response = await apiClient.get<{ success: boolean; data: Lease[] }>('/leases/', { params })
      return response.data.data
    },
  })

  const leases = data || []

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
    active: 'success',
    pending: 'warning',
    expired: 'danger',
    terminated: 'danger',
    renewed: 'info',
    draft: 'secondary',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leases</h1>
        <Link href="/leases/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Lease
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search leases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
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
      {!isLoading && leases.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No leases</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first lease.
            </p>
            <Link href="/leases/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                New Lease
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Leases Table */}
      {!isLoading && leases.length > 0 && (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Term</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leases.map((lease) => (
                <TableRow key={lease.id} className="cursor-pointer hover:bg-gray-50">
                  <TableCell>
                    <Link href={`/leases/${lease.id}`} className="block">
                      <div className="font-medium">{lease.property_address}</div>
                      {lease.unit_number && (
                        <div className="text-sm text-gray-500">Unit {lease.unit_number}</div>
                      )}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`}>{lease.tenant_name}</Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`} className="block">
                      <div className="text-sm">
                        {formatDate(lease.start_date)} - {formatDate(lease.end_date)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {lease.lease_type.replace('_', ' ')}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`}>
                      {formatCurrency(lease.rent_amount)}/mo
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`}>
                      <Badge variant={statusColors[lease.status]}>{lease.status}</Badge>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leases/${lease.id}`}>
                      {lease.days_until_expiry !== null && (
                        <span className={lease.days_until_expiry <= 30 ? 'text-orange-600 font-medium' : ''}>
                          {lease.days_until_expiry > 0
                            ? `${lease.days_until_expiry} days`
                            : lease.days_until_expiry === 0
                            ? 'Today'
                            : 'Expired'}
                        </span>
                      )}
                    </Link>
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
