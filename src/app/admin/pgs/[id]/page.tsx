'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  MapPin,
  DollarSign,
  CheckCircle2,
  X
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface PG {
  id: string
  title: string
  description: string
  type: 'BOYS' | 'GIRLS'
  address: string
  city: string
  state: string
  pincode: string
  latitude: number | null
  longitude: number | null
  featured: boolean
  active: boolean
  ownerId: string | null
  owner?: {
    id: string
    name: string
    phone: string
    email: string
  }
  images: Array<{
    id: string
    url: string
    caption: string | null
    order: number
  }>
  videos: Array<{
    id: string
    url: string
    thumbnail: string | null
    caption: string | null
    order: number
  }>
  rentPlans: Array<{
    id: string
    sharingType: string
    rent: number
    securityDeposit: number | null
    facilities: string | null
  }>
  amenities: Array<{
    id: string
    name: string
    icon: string | null
  }>
  rules: Array<{
    id: string
    rule: string
  }>
}

interface Owner {
  id: string
  name: string
  phone: string
  email: string
}

export default function EditPGPage() {
  const router = useRouter()
  const params = useParams()
  const pgId = params.id as string
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)

  const [pg, setPG] = useState<PG | null>(null)
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
          fetchPG()
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
  }, [router, toast, pgId])

  const fetchPG = async () => {
    try {
      const res = await fetch(`/api/admin/pgs/${pgId}`)
      if (!res.ok) throw new Error('Failed to fetch PG')
      const data: PG = await res.json()
      setPG(data)
      setFormData({
        title: data.title,
        description: data.description,
        type: data.type,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
        ownerId: data.ownerId || '',
        featured: data.featured,
        active: data.active
      })
    } catch (error) {
      console.error('Error fetching PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load PG details',
      })
      router.push('/admin/pgs')
    } finally {
      setLoading(false)
    }
  }

  const fetchOwners = async () => {
    try {
      const res = await fetch('/api/admin/owners')
      if (res.ok) {
        const data: Owner[] = await res.json()
        setOwners(data)
      }
    } catch (error) {
      console.error('Error fetching owners:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const updateData: any = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        ownerId: formData.ownerId || null
      }

      const res = await fetch(`/api/admin/pgs/${pgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      })

      if (!res.ok) throw new Error('Failed to update PG')

      toast({
        title: 'Success',
        description: 'PG updated successfully',
      })
      router.push('/admin/pgs')
    } catch (error) {
      console.error('Error updating PG:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update PG',
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
                <span className="text-xl font-bold">Edit PG - {formData.title}</span>
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
              <TabsTrigger value="media">
                Media ({pg?.images.length || 0} images, {pg?.videos.length || 0} videos)
              </TabsTrigger>
              <TabsTrigger value="rent">Rent Plans ({pg?.rentPlans.length || 0})</TabsTrigger>
              <TabsTrigger value="amenities">Amenities ({pg?.amenities.length || 0})</TabsTrigger>
              <TabsTrigger value="rules">Rules ({pg?.rules.length || 0})</TabsTrigger>
            </TabsList>

            {/* Basic Info Tab */}
            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
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
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode}
                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
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
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-semibold">Featured PG</Label>
                      <p className="text-sm text-muted-foreground">
                        Show this PG on homepage featured section
                      </p>
                    </div>
                    <Badge variant={formData.featured ? 'default' : 'outline'}>
                      {formData.featured ? 'Featured' : 'Normal'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-semibold">Active Status</Label>
                      <p className="text-sm text-muted-foreground">
                        Make this PG visible to users
                      </p>
                    </div>
                    <Badge variant={formData.active ? 'default' : 'destructive'}>
                      {formData.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                    >
                      Toggle Featured
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ ...formData, active: !formData.active })}
                    >
                      Toggle Active
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Images & Videos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Images ({pg?.images.length || 0})</h3>
                    {pg?.images && pg.images.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {pg.images.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={image.url}
                              alt={image.caption || ''}
                              className="w-full h-40 object-cover rounded-lg border"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm">{image.order}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No images uploaded yet</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Videos ({pg?.videos.length || 0})</h3>
                    {pg?.videos && pg.videos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pg.videos.map((video) => (
                          <div key={video.id} className="relative group border rounded-lg overflow-hidden">
                            {video.thumbnail ? (
                              <img
                                src={video.thumbnail}
                                alt={video.caption || ''}
                                className="w-full h-40 object-cover"
                              />
                            ) : (
                              <div className="w-full h-40 bg-muted flex items-center justify-center">
                                <Video className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <span className="text-white text-sm">Video {video.order + 1}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No videos uploaded yet</p>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Image and video management features will be added in a future update.
                      Currently, you can only view existing media.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rent Plans Tab */}
            <TabsContent value="rent">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Rent Plans
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {pg?.rentPlans && pg.rentPlans.length > 0 ? (
                    <div className="space-y-4">
                      {pg.rentPlans.map((plan) => (
                        <div key={plan.id} className="flex items-start justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="font-semibold">{plan.sharingType}</div>
                            <div className="text-2xl font-bold text-primary">₹{plan.rent}/month</div>
                            {plan.securityDeposit && (
                              <div className="text-sm text-muted-foreground">
                                Security Deposit: ₹{plan.securityDeposit}
                              </div>
                            )}
                            {plan.facilities && (
                              <div className="text-sm text-muted-foreground mt-2">
                                {plan.facilities}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No rent plans added yet</p>
                  )}
                  <div className="mt-4 bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Rent plan management will be added in a future update.
                      Currently, you can only view existing plans.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Amenities Tab */}
            <TabsContent value="amenities">
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  {pg?.amenities && pg.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {pg.amenities.map((amenity) => (
                        <Badge key={amenity.id} variant="secondary" className="text-sm py-2 px-3">
                          {amenity.icon} {amenity.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No amenities added yet</p>
                  )}
                  <div className="mt-4 bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Amenity management will be added in a future update.
                      Currently, you can only view existing amenities.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Rules Tab */}
            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  {pg?.rules && pg.rules.length > 0 ? (
                    <ul className="space-y-3">
                      {pg.rules.map((rule, index) => (
                        <li key={rule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 font-semibold">
                            {index + 1}
                          </div>
                          <span className="flex-1">{rule.rule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No rules added yet</p>
                  )}
                  <div className="mt-4 bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Rule management will be added in a future update.
                      Currently, you can only view existing rules.
                    </p>
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
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
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
