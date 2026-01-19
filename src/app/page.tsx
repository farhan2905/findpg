'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Home, MapPin, Phone, Mail, Menu, X, CheckCircle, Building } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import type { PG } from '@prisma/client'

export default function FindPGPage() {
  const [featuredPGs, setFeaturedPGs] = useState<PG[]>([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchFeaturedPGs()
  }, [])

  const fetchFeaturedPGs = async () => {
    try {
      const res = await fetch('/api/pg/featured')
      if (res.ok) {
        const data = await res.json()
        setFeaturedPGs(data)
      }
    } catch (error) {
      console.error('Error fetching featured PGs:', error)
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
          ...inquiryForm,
          isCommon: true
        })
      })

      if (!res.ok) {
        throw new Error('Failed to submit inquiry')
      }

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">FindPG</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
              <Link href="#boys-pg" className="text-sm font-medium hover:text-primary transition-colors">PG for Boys</Link>
              <Link href="#girls-pg" className="text-sm font-medium hover:text-primary transition-colors">PG for Girls</Link>
              <Link href="#featured" className="text-sm font-medium hover:text-primary transition-colors">Featured PGs</Link>
              <Button asChild>
                <Link href="/contact">Send Inquiry</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </nav>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-2">
              <Link href="/about" className="block py-2 text-sm font-medium hover:text-primary">About Us</Link>
              <Link href="/contact" className="block py-2 text-sm font-medium hover:text-primary">Contact</Link>
              <Link href="#boys-pg" className="block py-2 text-sm font-medium hover:text-primary">PG for Boys</Link>
              <Link href="#girls-pg" className="block py-2 text-sm font-medium hover:text-primary">PG for Girls</Link>
              <Link href="#featured" className="block py-2 text-sm font-medium hover:text-primary">Featured PGs</Link>
              <Button asChild className="w-full mt-2">
                <Link href="/contact">Send Inquiry</Link>
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect PG in Minutes
            </h1>
            <p className="text-xl text-muted-foreground">
              India's most trusted platform for verified, safe, and affordable PG accommodations. 
              No brokerage, no hidden fees – just genuine listings handpicked for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/listings?type=boys">
                  <Search className="mr-2 h-5 w-5" />
                  Find PG for Boys
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/listings?type=girls">
                  <Search className="mr-2 h-5 w-5" />
                  Find PG for Girls
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-6 justify-center pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>5000+ Verified PGs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>25+ Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Zero Brokerage</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose FindPG?</h2>
            <p className="text-center text-muted-foreground text-lg mb-12">
              We're not just another PG listing platform. We're your accommodation partner
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Home className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>100% Verified</CardTitle>
                  <CardDescription>
                    Every PG is personally verified by our team for safety, authenticity, and quality. No fake listings, ever.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Prime Locations</CardTitle>
                  <CardDescription>
                    PGs located near colleges, IT parks, metro stations, and commercial hubs. Commute less, live more.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Dedicated Support</CardTitle>
                  <CardDescription>
                    Our team is available 7 days a week to help you find the perfect place. Real people, real support.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Boys PG Section */}
      <section id="boys-pg" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PG for Boys</h2>
            <p className="text-muted-foreground text-lg">
              Explore our curated list of boys' PGs with modern amenities
            </p>
          </div>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/listings?type=boys">
                Browse All Boys PGs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Girls PG Section */}
      <section id="girls-pg" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">PG for Girls</h2>
            <p className="text-muted-foreground text-lg">
              Safe and secure accommodations for women with verified security
            </p>
          </div>
          <div className="flex justify-center">
            <Button size="lg" asChild>
              <Link href="/listings?type=girls">
                Browse All Girls PGs
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured PGs Section */}
      <section id="featured" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured PGs Near You</h2>
            <p className="text-muted-foreground text-lg">
              Hand-picked premium PGs with excellent facilities and ratings
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredPGs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured PGs available at the moment</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPGs.map((pg) => (
                <PGCard key={pg.id} pg={pg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PG Owner Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <Building className="h-16 w-16 text-primary mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Own a PG? Partner With Us</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  List your PG with FindPG and connect with thousands of genuine tenants looking for accommodation. 
                  Zero listing fees, no commission – just more bookings for your property.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Free listing with no commission</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Connect with verified, genuine tenants</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Dedicated account manager for your property</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">Professional photography and listing support</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/contact">List Your PG Now</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="tel:+919876543210">
                      <Phone className="mr-2 h-4 w-4" />
                      Call: +91 98765 43210
                    </Link>
                  </Button>
                </div>
              </div>
              <Card className="hidden md:block">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">5000+</div>
                      <div className="text-sm text-muted-foreground">PGs Listed</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">50K+</div>
                      <div className="text-sm text-muted-foreground">Tenants Connected</div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="text-3xl font-bold text-primary">25+</div>
                      <div className="text-sm text-muted-foreground">Cities Covered</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Common Inquiry Form Section */}
      <section id="inquiry" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions?</h2>
              <p className="text-muted-foreground text-lg">
                Send us your inquiry and our team will get back to you within 24 hours
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Send Inquiry</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll help you find the perfect PG
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium mb-2 block">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Your full name"
                      suppressHydrationWarning={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium mb-2 block">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Your phone number"
                      suppressHydrationWarning={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium mb-2 block">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Your email address"
                      suppressHydrationWarning={true}
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="text-sm font-medium mb-2 block">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={inquiryForm.message}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      placeholder="Tell us what you're looking for..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? 'Sending...' : 'Submit Inquiry'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-muted/80 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FindPG</span>
              </div>
              <p className="text-muted-foreground">
                Your trusted partner in finding safe, comfortable, and affordable PG accommodations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-primary">Contact Us</Link></li>
                <li><Link href="/listings?type=boys" className="hover:text-primary">PG for Boys</Link></li>
                <li><Link href="/listings?type=girls" className="hover:text-primary">PG for Girls</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@findpg.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} FindPG. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

// PG Card Component
function PGCard({ pg }: { pg: PG & { images?: Array<{ url: string }> } }) {
  const firstImage = pg.images?.[0]?.url || '/placeholder-pg.jpg'

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={firstImage}
          alt={pg.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3">
          {pg.type === 'BOYS' ? 'Boys' : 'Girls'}
        </Badge>
        {pg.featured && (
          <Badge variant="secondary" className="absolute top-3 left-3">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{pg.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="line-clamp-1">{pg.city}, {pg.state}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {pg.description}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/pg/${pg.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
