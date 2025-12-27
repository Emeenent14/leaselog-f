'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const propertyTypes = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'multi_family', label: 'Multi Family' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'other', label: 'Other' },
]

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'sold', label: 'Sold' },
]

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const propertyId = params.id as string
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    street_address: '',
    unit_number: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'USA',
    property_type: 'single_family',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    year_built: '',
    purchase_price: '',
    purchase_date: '',
    current_value: '',
    status: 'active',
    notes: '',
  })

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', propertyId],
    queryFn: async () => {
      const response = await apiClient.get(`/properties/${propertyId}/`)
      return response.data.data
    },
  })

  useEffect(() => {
    if (property) {
      setFormData({
        street_address: property.street_address || '',
        unit_number: property.unit_number || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        country: property.country || 'USA',
        property_type: property.property_type || 'single_family',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        square_feet: property.square_feet?.toString() || '',
        year_built: property.year_built?.toString() || '',
        purchase_price: property.purchase_price?.toString() || '',
        purchase_date: property.purchase_date || '',
        current_value: property.current_value?.toString() || '',
        status: property.status || 'active',
        notes: property.notes || '',
      })
    }
  }, [property])

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        bedrooms: data.bedrooms ? parseInt(data.bedrooms) : null,
        bathrooms: data.bathrooms ? parseFloat(data.bathrooms) : null,
        square_feet: data.square_feet ? parseInt(data.square_feet) : null,
        year_built: data.year_built ? parseInt(data.year_built) : null,
        purchase_price: data.purchase_price ? parseFloat(data.purchase_price) : null,
        current_value: data.current_value ? parseFloat(data.current_value) : null,
        purchase_date: data.purchase_date || null,
        unit_number: data.unit_number || null,
      }
      const response = await apiClient.patch(`/properties/${propertyId}/`, payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] })
      router.push(`/properties/${propertyId}`)
    },
    onError: (err: any) => {
      setError(err.response?.data?.error?.message || 'Failed to update property')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    updateMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <Link href={`/properties/${propertyId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="street_address">Street Address *</Label>
                  <Input
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unit_number">Unit #</Label>
                  <Input
                    id="unit_number"
                    name="unit_number"
                    value={formData.unit_number}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code *</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    id="property_type"
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    options={propertyTypes}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={statusOptions}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    min="0"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="square_feet">Square Feet</Label>
                  <Input
                    id="square_feet"
                    name="square_feet"
                    type="number"
                    min="0"
                    value={formData.square_feet}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="year_built">Year Built</Label>
                  <Input
                    id="year_built"
                    name="year_built"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear()}
                    value={formData.year_built}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="purchase_price">Purchase Price</Label>
                  <Input
                    id="purchase_price"
                    name="purchase_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.purchase_price}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    name="purchase_date"
                    type="date"
                    value={formData.purchase_date}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="current_value">Current Value</Label>
                  <Input
                    id="current_value"
                    name="current_value"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.current_value}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any notes about this property..."
                rows={4}
              />
            </CardContent>
          </Card>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Link href={`/properties/${propertyId}`}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
