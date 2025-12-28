'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MaintenanceRequest {
  id: string
  title: string
  category: string
  priority: string
  status: string
  property: string
  property_name: string
  unit?: string
  unit_name?: string
  tenant?: string
  tenant_name?: string
  submitted_by_tenant: boolean
  scheduled_date?: string
  comments_count: number
  photos_count: number
  created_at: string
}

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  emergency: 'bg-red-100 text-red-800',
}

const statusColors: Record<string, string> = {
  open: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  pending_parts: 'bg-purple-100 text-purple-800',
  scheduled: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  canceled: 'bg-gray-100 text-gray-800',
}

const categories = [
  'plumbing', 'electrical', 'hvac', 'appliance', 'structural',
  'pest', 'landscaping', 'cleaning', 'safety', 'other'
]

const priorities = ['low', 'medium', 'high', 'emergency']
const statuses = ['open', 'in_progress', 'pending_parts', 'scheduled', 'completed', 'canceled']

export default function MaintenancePage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showOpenOnly, setShowOpenOnly] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const { data: requests, isLoading } = useQuery({
    queryKey: ['maintenance', statusFilter, priorityFilter, showOpenOnly],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)
      if (showOpenOnly) params.append('open', 'true')
      const response = await apiClient.get(`/maintenance/?${params}`)
      return response.data.data as MaintenanceRequest[]
    },
  })

  const openRequests = requests?.filter(r =>
    ['open', 'in_progress', 'pending_parts', 'scheduled'].includes(r.status)
  ).length || 0

  const emergencyRequests = requests?.filter(r =>
    r.priority === 'emergency' && r.status !== 'completed'
  ).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance</h1>
          <p className="text-muted-foreground">
            Track and manage maintenance requests
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          New Request
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{openRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Emergency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{emergencyRequests}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests?.filter(r => r.status === 'completed').length || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tenant Submitted
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {requests?.filter(r => r.submitted_by_tenant).length || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(s => (
                  <SelectItem key={s} value={s}>
                    {s.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                {priorities.map(p => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOpenOnly}
                onChange={(e) => setShowOpenOnly(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Show open only</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      {isLoading ? (
        <p className="text-center py-8 text-muted-foreground">Loading...</p>
      ) : requests?.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No maintenance requests found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests?.map((request) => (
            <Card
              key={request.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => router.push(`/maintenance/${request.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{request.title}</h3>
                      {request.submitted_by_tenant && (
                        <Badge variant="outline" className="text-xs">
                          Tenant Submitted
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {request.property_name}
                      {request.unit_name && ` - ${request.unit_name}`}
                    </p>
                    {request.tenant_name && (
                      <p className="text-sm text-muted-foreground">
                        Tenant: {request.tenant_name}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{request.comments_count} comments</span>
                      <span>-</span>
                      <span>{request.photos_count} photos</span>
                      {request.scheduled_date && (
                        <>
                          <span>-</span>
                          <span>Scheduled: {request.scheduled_date}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-2">
                      <Badge className={priorityColors[request.priority]}>
                        {request.priority}
                      </Badge>
                      <Badge className={statusColors[request.status]}>
                        {request.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Badge variant="outline">
                      {request.category}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateMaintenanceModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateMaintenanceModal({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    priority: 'medium',
    property: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const response = await apiClient.get('/properties/')
      return response.data.data
    },
  })

  const handleSubmit = async () => {
    if (!formData.title || !formData.property) return

    setSubmitting(true)
    try {
      await apiClient.post('/maintenance/', formData)
      queryClient.invalidateQueries({ queryKey: ['maintenance'] })
      onClose()
    } catch (error) {
      console.error('Failed to create request:', error)
      alert('Failed to create request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>New Maintenance Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief description of the issue"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Property</label>
            <Select
              value={formData.property}
              onValueChange={(v) => setFormData({ ...formData, property: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties?.map((p: any) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(p => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the issue"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
