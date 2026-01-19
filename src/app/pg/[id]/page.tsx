'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Wifi,
  Tv,
  UtensilsCrossed,
  Shield,
  Clock,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  BedDouble,
  Video,
  Image as ImageIcon,
  Send
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function PGDetailPage() {
  const params = useParams()
  const { toast } = useToast()
  const pgId = params.id as string

  const [pg, setPg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  useEffect(() => {
    fetchPGDetails()
  }, [pgId])

  const fetchPGDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/pg/${pgId}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('PG not found')
        }
        throw new Error('Failed to fetch PG details')
      }

      const data = await res.json()
      setPg(data)
    } catch (err: any) {
      console.error('Error fetching PG details:', err)
      setError(err.message || 'Failed to load PG details')
    } finally {
      setLoading(false)
    }
  }

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          pgId,
          ...inquiryForm,
          isCommon: false
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit inquiry')
      }

      const data = await res.json()
      toast({
        title: 'Success',
        description: 'Your inquiry has been submitted successfully! We will contact you soon.',
      })

      // Reset form
      setInquiryForm({
        name: '',
        phone: '',
        email: '',
        message: ''
      })
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getAmenityIcon = (icon: string | null) => {
    if (!icon) return <Check className="h-5 w-5" />

    const icons: Record<string, React.ReactNode> = {
      wifi: <Wifi className="h-5 w-5" />,
      tv: <Tv className="h-5 w-5" />,
      meals: <UtensilsCrossed className="h-5 w-5" />,
      security: <Shield className="h-5 w-5" />,
    }

    return icons[icon] || <Check className="h-5 w-5" />
  }

  const nextImage = () => {
    if (pg && pg.images && pg.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % pg.images.length)
    }
  }

  const prevImage = () => {
    if (pg && pg.images && pg.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + pg.images.length) % pg.images.length)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading PG details...</p>
        </div>
      </div>
    )
  }

  if (error || !pg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{error || 'PG not found'}</p>
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentImage = pg.images?.[currentImageIndex]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <BedDouble className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FindPG</span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Image Gallery */}
        <section className="relative bg-muted">
          {currentImage && (
            <div className="aspect-video md:aspect-[2/1] relative cursor-pointer group" onClick={() => setShowImageModal(true)}>
              <img
                src={currentImage.url}
                alt={pg.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
                  <ChevronLeft className="h-4 w-4 mr-2" /> Previous
                </Button>
                <Button variant="secondary" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <Badge variant="secondary" className="text-sm">
                  {currentImageIndex + 1} / {pg.images?.length || 0}
                </Badge>
                <Badge>{pg.type === 'BOYS' ? 'Boys PG' : 'Girls PG'}</Badge>
              </div>
            </div>
          )}

          {/* Thumbnail navigation */}
          {pg.images && pg.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {pg.images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-24 h-16 rounded overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${pg.title} - Image ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title and Basic Info */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{pg.title}</h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{pg.address}, {pg.city}, {pg.state} - {pg.pincode}</span>
                    </div>
                  </div>
                  {pg.featured && (
                    <Badge variant="secondary" className="hidden md:inline-flex">
                      Featured PG
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed">{pg.description}</p>
              </div>

              <Separator />

              {/* Tabs for detailed info */}
              <Tabs defaultValue="rent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="rent">Rent Plans</TabsTrigger>
                  <TabsTrigger value="amenities">Amenities</TabsTrigger>
                  <TabsTrigger value="rules">Rules</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>

                <TabsContent value="rent" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    {pg.rentPlans && pg.rentPlans.length > 0 ? (
                      pg.rentPlans.map((plan: any) => (
                        <Card key={plan.id}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <BedDouble className="h-5 w-5 text-primary" />
                              {plan.sharingType}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Monthly Rent</span>
                                <span className="text-2xl font-bold text-primary">
                                  ₹{plan.rent.toLocaleString()}
                                </span>
                              </div>
                              {plan.securityDeposit && (
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-muted-foreground">Security Deposit</span>
                                  <span>₹{plan.securityDeposit.toLocaleString()}</span>
                                </div>
                              )}
                              {plan.facilities && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  {plan.facilities}
                                </p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Alert>
                        <AlertDescription>No rent plans available at the moment.</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="amenities" className="mt-6">
                  {pg.amenities && pg.amenities.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {pg.amenities.map((amenity: any) => (
                        <Card key={amenity.id}>
                          <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                {getAmenityIcon(amenity.icon)}
                              </div>
                              <div>
                                <h4 className="font-medium">{amenity.name}</h4>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>No amenities listed at the moment.</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="rules" className="mt-6">
                  {pg.rules && pg.rules.length > 0 ? (
                    <Card>
                      <CardContent className="pt-6">
                        <ul className="space-y-3">
                          {pg.rules.map((rule: any) => (
                            <li key={rule.id} className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-0.5">
                                <Check className="h-3 w-3" />
                              </div>
                              <span>{rule.rule}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ) : (
                    <Alert>
                      <AlertDescription>No specific rules listed at the moment.</AlertDescription>
                    </Alert>
                  )}
                </TabsContent>

                <TabsContent value="media" className="mt-6">
                  {pg.videos && pg.videos.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Videos
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {pg.videos.map((video: any) => (
                          <Card key={video.id}>
                            <CardContent className="pt-6">
                              <video
                                controls
                                poster={video.thumbnail}
                                className="w-full rounded-lg"
                              >
                                <source src={video.url} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              {video.caption && (
                                <p className="text-sm text-muted-foreground mt-2">{video.caption}</p>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>No videos available at the moment.</AlertDescription>
                    </Alert>
                  )}

                  <Separator className="my-6" />

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      All Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {pg.images?.map((img: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentImageIndex(idx)
                            setShowImageModal(true)
                          }}
                          className="aspect-video rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img
                            src={img.url}
                            alt={`${pg.title} - Image ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar - Inquiry Form */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Send Inquiry</CardTitle>
                  <CardDescription>
                    Interested in this PG? Send us your details and we'll get back to you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={inquiryForm.name}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={inquiryForm.phone}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                        required
                        placeholder="Your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={inquiryForm.email}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                        placeholder="Your email address"
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={inquiryForm.message}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                        required
                        rows={4}
                        placeholder="Tell us what you're looking for..."
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Submit Inquiry
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {showImageModal && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X className="h-8 w-8" />
          </button>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          <img
            src={currentImage.url}
            alt={pg.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
          >
            <ChevronRight className="h-10 w-10" />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary">
              {currentImageIndex + 1} / {pg.images?.length || 0}
            </Badge>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-muted/80 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BedDouble className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FindPG</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} FindPG. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
