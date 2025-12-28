'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
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
  description: string
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
  permission_to_enter: boolean
  preferred_times: string
  scheduled_date?: string
  scheduled_time?: string
  completed_at?: string
  resolution_notes: string
  estimated_cost?: number
  actual_cost?: number
  vendor_name: string
  vendor_phone: string
  vendor_email: string
  comments: Comment[]
  photos: Photo[]
  created_at: string
  updated_at: string
}

interface Comment {
  id: string
  content: string
  author_name: string
  is_landlord: boolean
  is_internal: boolean
  created_at: string
}

interface Photo {
  id: string
  file_name: string
  caption: string
  created_at: string
}

const statuses = ['open', 'in_progress', 'pending_parts', 'scheduled', 'completed', 'canceled']

export default function MaintenanceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const { data: request, isLoading } = useQuery({
    queryKey: ['maintenance', params.id],
    queryFn: async () => {
      const response = await apiClient.get(`/maintenance/${params.id}/`)
      return response.data.data as MaintenanceRequest
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await apiClient.post(`/maintenance/${params.id}/update_status/`, {
        status: newStatus,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance', params.id] })
    },
  })

  const addCommentMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/maintenance/${params.id}/comments/`, {
        content: newComment,
        is_internal: isInternal,
      })
    },
    onSuccess: () => {
      setNewComment('')
      queryClient.invalidateQueries({ queryKey: ['maintenance', params.id] })
    },
  })

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!request) {
    return <div className="p-8 text-center">Request not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => router.back()} className="mb-2">
            &larr; Back
          </Button>
          <h1 className="text-2xl font-bold">{request.title}</h1>
          <p className="text-muted-foreground">
            {request.property_name}
            {request.unit_name && ` - ${request.unit_name}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={request.status}
            onValueChange={(v) => updateStatusMutation.mutate(v)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>
                  {s.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {request.status !== 'completed' && (
            <Button onClick={() => setShowCompleteModal(true)}>
              Mark Complete
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{request.description}</p>
            </CardContent>
          </Card>

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle>Comments ({request.comments.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-4 rounded-lg ${
                    comment.is_internal ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.author_name}</span>
                      {comment.is_landlord && (
                        <Badge variant="secondary" className="text-xs">Landlord</Badge>
                      )}
                      {comment.is_internal && (
                        <Badge variant="outline" className="text-xs">Internal</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}

              <div className="space-y-2 pt-4 border-t">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <span className="text-sm">Internal note (not visible to tenant)</span>
                  </label>
                  <Button
                    onClick={() => addCommentMutation.mutate()}
                    disabled={!newComment.trim()}
                  >
                    Add Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resolution */}
          {request.status === 'completed' && request.resolution_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Resolution</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{request.resolution_notes}</p>
                {request.actual_cost && (
                  <p className="mt-2 text-muted-foreground">
                    Cost: ${request.actual_cost.toFixed(2)}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className="mt-1">{request.status.replace('_', ' ')}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Priority</p>
                <Badge variant="outline" className="mt-1">{request.priority}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{request.category}</p>
              </div>
              {request.tenant_name && (
                <div>
                  <p className="text-sm text-muted-foreground">Tenant</p>
                  <p className="font-medium">{request.tenant_name}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(request.created_at).toLocaleDateString()}
                </p>
              </div>
              {request.scheduled_date && (
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="font-medium">
                    {request.scheduled_date}
                    {request.scheduled_time && ` at ${request.scheduled_time}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Access */}
          <Card>
            <CardHeader>
              <CardTitle>Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p>
                <span className="text-muted-foreground">Permission to Enter: </span>
                <span className="font-medium">
                  {request.permission_to_enter ? 'Yes' : 'No'}
                </span>
              </p>
              {request.preferred_times && (
                <p>
                  <span className="text-muted-foreground">Preferred Times: </span>
                  <span className="font-medium">{request.preferred_times}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vendor */}
          {request.vendor_name && (
            <Card>
              <CardHeader>
                <CardTitle>Vendor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="font-medium">{request.vendor_name}</p>
                {request.vendor_phone && (
                  <p className="text-sm">{request.vendor_phone}</p>
                )}
                {request.vendor_email && (
                  <p className="text-sm">{request.vendor_email}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cost */}
          <Card>
            <CardHeader>
              <CardTitle>Cost</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {request.estimated_cost && (
                <p>
                  <span className="text-muted-foreground">Estimated: </span>
                  <span className="font-medium">${request.estimated_cost.toFixed(2)}</span>
                </p>
              )}
              {request.actual_cost && (
                <p>
                  <span className="text-muted-foreground">Actual: </span>
                  <span className="font-medium">${request.actual_cost.toFixed(2)}</span>
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {showCompleteModal && (
        <CompleteModal
          requestId={request.id}
          onClose={() => setShowCompleteModal(false)}
        />
      )}
    </div>
  )
}

function CompleteModal({
  requestId,
  onClose,
}: {
  requestId: string
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [actualCost, setActualCost] = useState('')
  const [createExpense, setCreateExpense] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleComplete = async () => {
    setSubmitting(true)
    try {
      await apiClient.post(`/maintenance/${requestId}/complete/`, {
        resolution_notes: resolutionNotes,
        actual_cost: actualCost ? parseFloat(actualCost) : undefined,
        create_expense: createExpense,
      })
      queryClient.invalidateQueries({ queryKey: ['maintenance', requestId] })
      onClose()
    } catch (error) {
      console.error('Failed to complete request:', error)
      alert('Failed to complete request')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Complete Maintenance Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Resolution Notes</label>
            <Textarea
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Describe what was done..."
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Actual Cost</label>
            <Input
              type="number"
              step="0.01"
              value={actualCost}
              onChange={(e) => setActualCost(e.target.value)}
              placeholder="0.00"
            />
          </div>
          {actualCost && (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={createExpense}
                onChange={(e) => setCreateExpense(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Create expense transaction</span>
            </label>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleComplete} disabled={submitting}>
              {submitting ? 'Completing...' : 'Complete'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
