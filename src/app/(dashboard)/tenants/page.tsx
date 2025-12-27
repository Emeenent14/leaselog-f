'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Users, Mail, Phone } from 'lucide-react'
import { formatPhoneNumber } from '@/lib/utils'

interface Tenant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  status: string
  current_property: string | null
  move_in_date: string | null
}

export default function TenantsPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['tenants', { search }],
    queryFn: async () => {
      const params = search ? { search } : {}
      const response = await apiClient.get<{ success: boolean; data: Tenant[] }>('/tenants/', { params })
      return response.data.data
    },
  })

  const tenants = data || []

  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'secondary'> = {
    active: 'success',
    pending: 'warning',
    past: 'secondary',
    applicant: 'info',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
        <Link href="/tenants/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search tenants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && tenants.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No tenants</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first tenant.
            </p>
            <Link href="/tenants/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Tenant
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Tenants Grid */}
      {!isLoading && tenants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tenants.map((tenant) => (
            <Link key={tenant.id} href={`/tenants/${tenant.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {tenant.first_name} {tenant.last_name}
                      </h3>
                      {tenant.current_property && (
                        <p className="text-sm text-gray-500 mt-1">{tenant.current_property}</p>
                      )}
                    </div>
                    <Badge variant={statusColors[tenant.status] || 'secondary'}>
                      {tenant.status}
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-2" />
                      {tenant.email}
                    </div>
                    {tenant.phone && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Phone className="h-4 w-4 mr-2" />
                        {formatPhoneNumber(tenant.phone)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
