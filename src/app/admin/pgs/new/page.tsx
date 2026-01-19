'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs'
import {
  Home,
  ArrowLeft,
  Save,
  Loader2,
  MapPin
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface Owner {
  id: string
  name: string
  phone: string
  email: string
}

export default function NewPGPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const [owners, setOwners] = useState<Owner[]>([])

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'BOYS' as 'BOYS' | 'GIRLS',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    ownerId: '',
    featured: false,
    active: true
  })

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/session')
        if (res.status === 401) {
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
          fetchOwners()
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        router.push('/admin/login')
      }
    }
    checkAuth()
  }, [router, toast])

  const fetchOwners = async () => {
    try {
      const res = await fetch('/api/admin/owners')
      if (res.ok) {
        const data: Owner[] = await res.json()
        setOwners(data)
      }
    } catch (error) {
      console.error('Error fetching owners:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const createData: any = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        ownerId: formData.ownerId || null
      }

      const res = await fetch('/api/admin/pgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      })

      if (!res.ok) throw new Error('Failed to create PG')

      const result = await res.json()

      toast({
        title: 'Success',
        description: 'PG created successfully',
      })
      router.push('/admin/pgs')
    } catch (error) {
      console.error('Error creating PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create PG',
      })
    } finally {
      setSaving(false)
    }
  }

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/pgs">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Add New PG</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="location">Location</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Sunrise PG"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'BOYS' | 'GIRLS') => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BOYS">Boys</SelectItem>
                        <SelectItem value="GIRLS">Girls</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      placeholder="Provide a detailed description of the PG..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner">Owner</Label>
                    <Select
                      value={formData.ownerId}
                      onValueChange={(value) => setFormData({ ...formData, ownerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner (optional)" />
                      </SelectTrigger>
                      <SelectContent>
                        {owners.map((owner) => (
                          <SelectItem key={owner.id} value={owner.id}>
                            {owner.name} ({owner.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Location Tab */}
            <TabsContent value="location">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g., 123 Main Street, Koramangala"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        placeholder="e.g., Delhi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        placeholder="e.g., Delhi"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                        placeholder="e.g., 110001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                        placeholder="e.g., 28.6139"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                        placeholder="e.g., 77.2090"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>PG Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      By default, new PGs will be <strong>active</strong> (visible to users) and <strong>not featured</strong>.
                      You can change these settings after creation from the PG list.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-5 w-5"
                      />
                      <div>
                        <Label htmlFor="featured" className="text-base font-semibold cursor-pointer">
                          Featured PG
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show this PG on homepage featured section
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-4 border rounded-lg">
                      <input
                        type="checkbox"
                        id="active"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="h-5 w-5"
                      />
                      <div>
                        <Label htmlFor="active" className="text-base font-semibold cursor-pointer">
                          Active Status
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Make this PG visible to users immediately after creation
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-6">
            <Button
              type="submit"
              disabled={saving}
              size="lg"
              className="min-w-[150px]"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create PG
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/pgs')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
