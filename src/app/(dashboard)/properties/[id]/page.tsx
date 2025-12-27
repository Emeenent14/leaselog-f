'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, MapPin, Home, Users, FileText } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface Unit {
  id: string
  unit_number: string
  bedrooms: number
  bathrooms: number
  square_feet: number | null
  rent_amount: number
  status: string
}

interface Property {
  id: string
  street_address: string
  unit_number: string | null
  city: string
  state: string
  zip_code: string
  country: string
  property_type: string
  bedrooms: number | null
  bathrooms: number | null
  square_feet: number | null
  year_built: number | null
  purchase_price: number | null
  purchase_date: string | null
  current_value: number | null
  status: string
  occupancy_status: string
  notes: string
  units: Unit[]
  created_at: string
  updated_at: string
}

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const propertyId = params.id as string

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Property }>(`/properties/${propertyId}/`)
      return response.data.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/properties/${propertyId}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      router.push('/properties')
    },
  })

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate()
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    occupied: 'success',
    vacant: 'warning',
    partial: 'info',
  }

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Property not found</p>
        <Link href="/properties">
          <Button className="mt-4">Back to Properties</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/properties">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{property.street_address}</h1>
            <div className="flex items-center text-gray-500 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.city}, {property.state} {property.zip_code}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/properties/${propertyId}/edit`}>
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
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Property Details
                <Badge variant={statusColors[property.occupancy_status]}>
                  {property.occupancy_status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm text-gray-500">Property Type</dt>
                  <dd className="font-medium capitalize">{property.property_type.replace('_', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Status</dt>
                  <dd className="font-medium capitalize">{property.status}</dd>
                </div>
                {property.bedrooms && (
                  <div>
                    <dt className="text-sm text-gray-500">Bedrooms</dt>
                    <dd className="font-medium">{property.bedrooms}</dd>
                  </div>
                )}
                {property.bathrooms && (
                  <div>
                    <dt className="text-sm text-gray-500">Bathrooms</dt>
                    <dd className="font-medium">{property.bathrooms}</dd>
                  </div>
                )}
                {property.square_feet && (
                  <div>
                    <dt className="text-sm text-gray-500">Square Feet</dt>
                    <dd className="font-medium">{property.square_feet.toLocaleString()}</dd>
                  </div>
                )}
                {property.year_built && (
                  <div>
                    <dt className="text-sm text-gray-500">Year Built</dt>
                    <dd className="font-medium">{property.year_built}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Units */}
          {property.units && property.units.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Units ({property.units.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {property.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Unit {unit.unit_number}</p>
                        <p className="text-sm text-gray-500">
                          {unit.bedrooms} bed, {unit.bathrooms} bath
                          {unit.square_feet && ` | ${unit.square_feet} sqft`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(unit.rent_amount)}/mo</p>
                        <Badge variant={unit.status === 'occupied' ? 'success' : 'warning'}>
                          {unit.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {property.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{property.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Financial Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.purchase_price && (
                <div>
                  <p className="text-sm text-gray-500">Purchase Price</p>
                  <p className="text-lg font-semibold">{formatCurrency(property.purchase_price)}</p>
                </div>
              )}
              {property.current_value && (
                <div>
                  <p className="text-sm text-gray-500">Current Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(property.current_value)}</p>
                </div>
              )}
              {property.purchase_date && (
                <div>
                  <p className="text-sm text-gray-500">Purchase Date</p>
                  <p className="font-medium">{new Date(property.purchase_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/leases?property=${propertyId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Leases
                </Button>
              </Link>
              <Link href={`/tenants?property=${propertyId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View Tenants
                </Button>
              </Link>
              <Link href={`/transactions?property=${propertyId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-2" />
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
