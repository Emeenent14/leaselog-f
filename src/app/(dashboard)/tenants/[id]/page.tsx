'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Trash2, Mail, Phone, Calendar, FileText, Home } from 'lucide-react'
import { formatPhoneNumber, formatDate } from '@/lib/utils'

interface Tenant {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string | null
  ssn_last_four: string | null
  drivers_license: string | null
  current_address: string | null
  employer_name: string | null
  employer_phone: string | null
  job_title: string | null
  monthly_income: number | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  emergency_contact_relationship: string | null
  status: string
  notes: string
  created_at: string
  updated_at: string
}

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const tenantId = params.id as string

  const { data: tenant, isLoading } = useQuery({
    queryKey: ['tenant', tenantId],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Tenant }>(`/tenants/${tenantId}/`)
      return response.data.data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiClient.delete(`/tenants/${tenantId}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      router.push('/tenants')
    },
  })

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this tenant?')) {
      deleteMutation.mutate()
    }
  }

  const statusColors: Record<string, 'success' | 'warning' | 'info' | 'secondary'> = {
    active: 'success',
    pending: 'warning',
    past: 'secondary',
    applicant: 'info',
  }

  if (isLoading) {
    return (
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  if (!tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Tenant not found</p>
        <Link href="/tenants">
          <Button className="mt-4">Back to Tenants</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link href="/tenants">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {tenant.first_name} {tenant.last_name}
              </h1>
              <Badge variant={statusColors[tenant.status]}>{tenant.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/tenants/${tenantId}/edit`}>
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
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="font-medium">{tenant.email}</dd>
                  </div>
                </div>
                {tenant.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{formatPhoneNumber(tenant.phone)}</dd>
                    </div>
                  </div>
                )}
                {tenant.date_of_birth && (
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-sm text-gray-500">Date of Birth</dt>
                      <dd className="font-medium">{formatDate(tenant.date_of_birth)}</dd>
                    </div>
                  </div>
                )}
                {tenant.current_address && (
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <dt className="text-sm text-gray-500">Current Address</dt>
                      <dd className="font-medium">{tenant.current_address}</dd>
                    </div>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>

          {/* Employment */}
          {(tenant.employer_name || tenant.job_title || tenant.monthly_income) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Employment</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tenant.employer_name && (
                    <div>
                      <dt className="text-sm text-gray-500">Employer</dt>
                      <dd className="font-medium">{tenant.employer_name}</dd>
                    </div>
                  )}
                  {tenant.job_title && (
                    <div>
                      <dt className="text-sm text-gray-500">Job Title</dt>
                      <dd className="font-medium">{tenant.job_title}</dd>
                    </div>
                  )}
                  {tenant.monthly_income && (
                    <div>
                      <dt className="text-sm text-gray-500">Monthly Income</dt>
                      <dd className="font-medium">${tenant.monthly_income.toLocaleString()}</dd>
                    </div>
                  )}
                  {tenant.employer_phone && (
                    <div>
                      <dt className="text-sm text-gray-500">Employer Phone</dt>
                      <dd className="font-medium">{formatPhoneNumber(tenant.employer_phone)}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Emergency Contact */}
          {tenant.emergency_contact_name && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <dt className="text-sm text-gray-500">Name</dt>
                    <dd className="font-medium">{tenant.emergency_contact_name}</dd>
                  </div>
                  {tenant.emergency_contact_phone && (
                    <div>
                      <dt className="text-sm text-gray-500">Phone</dt>
                      <dd className="font-medium">{formatPhoneNumber(tenant.emergency_contact_phone)}</dd>
                    </div>
                  )}
                  {tenant.emergency_contact_relationship && (
                    <div>
                      <dt className="text-sm text-gray-500">Relationship</dt>
                      <dd className="font-medium">{tenant.emergency_contact_relationship}</dd>
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {tenant.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 whitespace-pre-wrap">{tenant.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/leases?tenant=${tenantId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Leases
                </Button>
              </Link>
              <Link href={`/rent?tenant=${tenantId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Home className="h-4 w-4 mr-2" />
                  View Payments
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Identification */}
          {(tenant.ssn_last_four || tenant.drivers_license) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tenant.ssn_last_four && (
                  <div>
                    <p className="text-sm text-gray-500">SSN (Last 4)</p>
                    <p className="font-medium">***-**-{tenant.ssn_last_four}</p>
                  </div>
                )}
                {tenant.drivers_license && (
                  <div>
                    <p className="text-sm text-gray-500">Driver's License</p>
                    <p className="font-medium">{tenant.drivers_license}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
