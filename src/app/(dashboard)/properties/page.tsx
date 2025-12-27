'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, Building, MapPin } from 'lucide-react'

interface Property {
  id: string
  street_address: string
  city: string
  state: string
  zip_code: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  status: string
  occupancy_status: string
}

export default function PropertiesPage() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['properties', { search }],
    queryFn: async () => {
      const params = search ? { search } : {}
      const response = await apiClient.get<{ success: boolean; data: Property[] }>('/properties/', { params })
      return response.data.data
    },
  })

  const properties = data || []

  const statusColors: Record<string, string> = {
    occupied: 'bg-green-100 text-green-800',
    vacant: 'bg-yellow-100 text-yellow-800',
    partial: 'bg-blue-100 text-blue-800',
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
        <Link href="/properties/new">
          <Button className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search properties..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && properties.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Building className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first property.
            </p>
            <Link href="/properties/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Properties Grid */}
      {!isLoading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Link key={property.id} href={`/properties/${property.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {property.street_address}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {property.city}, {property.state} {property.zip_code}
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[property.occupancy_status] || 'bg-gray-100 text-gray-800'}`}>
                      {property.occupancy_status}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                    <span className="capitalize">{property.property_type.replace('_', ' ')}</span>
                    {property.bedrooms && <span>{property.bedrooms} bed</span>}
                    {property.bathrooms && <span>{property.bathrooms} bath</span>}
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
