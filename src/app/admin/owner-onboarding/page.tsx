'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Home,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building,
  Search,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface OwnerOnboarding {
  id: string
  name: string
  phone: string
  email: string
  pgName: string
  pgType: 'BOYS' | 'GIRLS'
  pgAddress: string
  pgCity: string
  pgState: string
  pgPincode: string
  capacity: number | null
  existingRooms: number | null
  message: string | null
  status: string
  createdAt: string
}

export default function AdminOwnerOnboardingPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<OwnerOnboarding[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { toast } = useToast()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session')

        if (res.status === 401) {
          // Not authenticated
          toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'Please login to access admin panel',
          })
          router.push('/admin/login')
          return
        }

        if (!res.ok) {
          throw new Error('Failed to check authentication')
        }

        const data = await res.json()
        if (data.authenticated) {
          setAuthChecked(true)
          fetchRequests()
        } else {
          toast({
            variant: 'destructive',
            title: 'Authentication Required',
            description: 'Please login to access admin panel',
          })
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router, toast])

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/admin/owner-onboarding')
      if (!res.ok) throw new Error('Failed to fetch requests')
      const data = await res.json()
      setRequests(data)
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load onboarding requests',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/owner-onboarding/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error('Failed to update request')

      toast({
        title: 'Success',
        description: 'Request status updated',
      })
      fetchRequests()
    } catch (error) {
      console.error('Error updating request:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update request',
      })
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch =
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.pgName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.phone.includes(searchTerm) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.pgCity.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const contactedCount = requests.filter(r => r.status === 'contacted').length
  const completedCount = requests.filter(r => r.status === 'completed').length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      case 'contacted':
        return <Badge variant="secondary" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" /> Contacted
        </Badge>
      case 'completed':
        return <Badge variant="default" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Completed
        </Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FindPG Admin - Owner Onboarding</span>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/admin/pgs">Manage PGs</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {!authChecked ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Checking authentication...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <div className="text-3xl font-bold text-orange-500">{pendingCount}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Contacted</CardTitle>
              <div className="text-3xl font-bold text-blue-500">{contactedCount}</div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <div className="text-3xl font-bold text-green-500">{completedCount}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, PG name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Requests Table */}
        <Card>
          <CardHeader>
            <CardTitle>Onboarding Requests ({filteredRequests.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No onboarding requests found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>PG Details</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{request.name}</div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {request.phone}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {request.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium">{request.pgName}</div>
                            <Badge variant={request.pgType === 'BOYS' ? 'default' : 'secondary'}>
                              {request.pgType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start gap-1 text-sm">
                            <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                            <div>
                              <div>{request.pgCity}</div>
                              <div className="text-muted-foreground">{request.pgState}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {request.capacity && <div>Capacity: {request.capacity}</div>}
                            {request.existingRooms && <div>Rooms: {request.existingRooms}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(request.status)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={request.status}
                            onValueChange={(value) => handleStatusUpdate(request.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
          </>
        )}
      </main>
    </div>
  )
}
