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
  Mail,
  Phone,
  Search,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Inquiry {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  isCommon: boolean
  status: string
  createdAt: string
  pg?: {
    id: string
    title: string
    type: 'BOYS' | 'GIRLS'
  }
}

export default function AdminInquiriesPage() {
  const router = useRouter()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
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
          fetchInquiries()
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

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/admin/inquiries')
      if (!res.ok) throw new Error('Failed to fetch inquiries')
      const data = await res.json()
      setInquiries(data)
    } catch (error) {
      console.error('Error fetching inquiries:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load inquiries',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (inquiryId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) throw new Error('Failed to update inquiry')

      toast({
        title: 'Success',
        description: 'Inquiry status updated',
      })
      fetchInquiries()
    } catch (error) {
      console.error('Error updating inquiry:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update inquiry',
      })
    }
  }

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch =
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.phone.includes(searchTerm) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter
    const matchesType = typeFilter === 'all' ||
      (typeFilter === 'common' && inquiry.isCommon) ||
      (typeFilter === 'pg' && !inquiry.isCommon)

    return matchesSearch && matchesStatus && matchesType
  })

  const pendingCount = inquiries.filter(i => i.status === 'pending').length
  const contactedCount = inquiries.filter(i => i.status === 'contacted').length
  const closedCount = inquiries.filter(i => i.status === 'closed').length

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
      case 'closed':
        return <Badge variant="default" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Closed
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
                <span className="text-xl font-bold">FindPG Admin - Inquiries</span>
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
              <CardTitle className="text-sm font-medium text-muted-foreground">Closed</CardTitle>
              <div className="text-3xl font-bold text-green-500">{closedCount}</div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or message..."
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
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="common">Common</SelectItem>
              <SelectItem value="pg">PG-Specific</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inquiries Table */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries ({filteredInquiries.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredInquiries.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No inquiries found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>PG</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id}>
                        <TableCell className="text-sm">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium">{inquiry.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3" />
                              {inquiry.phone}
                            </div>
                            {inquiry.email && (
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {inquiry.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={inquiry.isCommon ? 'secondary' : 'default'}>
                            {inquiry.isCommon ? 'Common' : 'PG-Specific'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {inquiry.pg ? (
                            <div>
                              <div className="font-medium text-sm">{inquiry.pg.title}</div>
                              <Badge variant="outline" className="text-xs">
                                {inquiry.pg.type}
                              </Badge>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm line-clamp-2">{inquiry.message}</p>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(inquiry.status)}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={inquiry.status}
                            onValueChange={(value) => handleStatusUpdate(inquiry.id, value)}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="contacted">Contacted</SelectItem>
                              <SelectItem value="closed">Closed</SelectItem>
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
