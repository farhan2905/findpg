'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plus,
  Pencil,
  Trash2,
  Home,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Search,
  CheckCircle,
  XCircle,
  LogOut,
  Shield
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PG {
  id: string
  title: string
  type: 'BOYS' | 'GIRLS'
  address: string
  city: string
  state: string
  pincode: string
  featured: boolean
  active: boolean
  description: string
  owner?: {
    id: string
    name: string
    phone: string
    email: string
  }
  createdAt: string
}

export default function AdminPGsPage() {
  const router = useRouter()
  const [pgs, setPGs] = useState<PG[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pgToDelete, setPgToDelete] = useState<string | null>(null)
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
          fetchPGs()
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

  const fetchPGs = async () => {
    try {
      const res = await fetch('/api/admin/pgs')
      if (!res.ok) throw new Error('Failed to fetch PGs')
      const data = await res.json()
      setPGs(data)
    } catch (error) {
      console.error('Error fetching PGs:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load PG listings',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFeatured = async (pgId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/pgs/${pgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !currentFeatured })
      })

      if (!res.ok) throw new Error('Failed to update PG')

      toast({
        title: 'Success',
        description: currentFeatured ? 'Removed from featured' : 'Added to featured',
      })
      fetchPGs()
    } catch (error) {
      console.error('Error updating PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update PG',
      })
    }
  }

  const handleToggleActive = async (pgId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/pgs/${pgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentActive })
      })

      if (!res.ok) throw new Error('Failed to update PG')

      toast({
        title: 'Success',
        description: 'PG updated successfully',
      })
      fetchPGs()
    } catch (error) {
      console.error('Error updating PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update PG',
      })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully',
      })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleDeletePG = async () => {
    if (!pgToDelete) return

    try {
      const res = await fetch(`/api/admin/pgs/${pgToDelete}`, {
        method: 'DELETE'
      })

      if (!res.ok) throw new Error('Failed to delete PG')

      toast({
        title: 'Success',
        description: 'PG deleted successfully',
      })
      setDeleteDialogOpen(false)
      setPgToDelete(null)
      fetchPGs()
    } catch (error) {
      console.error('Error deleting PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete PG',
      })
    }
  }

  const filteredPGs = pgs.filter(pg =>
    pg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pg.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const activePGs = filteredPGs.filter(pg => pg.active)
  const inactivePGs = filteredPGs.filter(pg => !pg.active)

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
                <span className="text-xl font-bold">FindPG Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
              <Button asChild>
                <Link href="/admin/pgs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New PG
                </Link>
              </Button>
            </div>
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
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PGs by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Tabs defaultValue="active" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="active">
                  Active PGs ({activePGs.length})
                </TabsTrigger>
                <TabsTrigger value="inactive">
                  Inactive PGs ({inactivePGs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                <PGTable
                  pgs={activePGs}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleActive={handleToggleActive}
                  onDelete={(id) => {
                    setPgToDelete(id)
                    setDeleteDialogOpen(true)
                  }}
                />
              </TabsContent>

              <TabsContent value="inactive">
                <PGTable
                  pgs={inactivePGs}
                  onToggleFeatured={handleToggleFeatured}
                  onToggleActive={handleToggleActive}
                  onDelete={(id) => {
                    setPgToDelete(id)
                    setDeleteDialogOpen(true)
                  }}
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this PG? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePG}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PGTable({
  pgs,
  onToggleFeatured,
  onToggleActive,
  onDelete
}: {
  pgs: PG[]
  onToggleFeatured: (id: string, featured: boolean) => void
  onToggleActive: (id: string, active: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>PG Listings</CardTitle>
      </CardHeader>
      <CardContent>
        {pgs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No PGs found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pgs.map((pg) => (
                  <TableRow key={pg.id}>
                    <TableCell className="font-medium">{pg.title}</TableCell>
                    <TableCell>
                      <Badge variant={pg.type === 'BOYS' ? 'default' : 'secondary'}>
                        {pg.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1 text-sm">
                        <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                        <div>
                          <div>{pg.city}</div>
                          <div className="text-muted-foreground">{pg.state}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {pg.owner ? (
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">{pg.owner.name}</div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {pg.owner.phone}
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {pg.owner.email || '-'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">No owner</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(pg.id, pg.active)}
                      >
                        {pg.active ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleFeatured(pg.id, pg.featured)}
                      >
                        {pg.featured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/pgs/${pg.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(pg.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
