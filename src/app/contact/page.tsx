'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Home,
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Building,
  Send,
  CheckCircle
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ContactPage() {
  const { toast } = useToast()
  const [tenantSubmitting, setTenantSubmitting] = useState(false)
  const [ownerSubmitting, setOwnerSubmitting] = useState(false)

  const [tenantForm, setTenantForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })

  const [ownerForm, setOwnerForm] = useState({
    name: '',
    phone: '',
    email: '',
    pgName: '',
    pgType: 'boys',
    pgAddress: '',
    pgCity: '',
    pgState: '',
    pgPincode: '',
    capacity: '',
    existingRooms: '',
    message: ''
  })

  const handleTenantSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTenantSubmitting(true)

    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...tenantForm,
          isCommon: true
        })
      })

      if (!res.ok) throw new Error('Failed to submit inquiry')

      toast({
        title: 'Inquiry Submitted!',
        description: 'Thank you for reaching out. We\'ll get back to you within 24 hours.',
      })

      setTenantForm({
        name: '',
        phone: '',
        email: '',
        message: ''
      })
    } catch (err) {
      console.error('Error submitting tenant inquiry:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
      })
    } finally {
      setTenantSubmitting(false)
    }
  }

  const handleOwnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setOwnerSubmitting(true)

    try {
      const res = await fetch('/api/owner-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...ownerForm,
          capacity: ownerForm.capacity ? parseInt(ownerForm.capacity) : null,
          existingRooms: ownerForm.existingRooms ? parseInt(ownerForm.existingRooms) : null
        })
      })

      if (!res.ok) throw new Error('Failed to submit request')

      toast({
        title: 'Onboarding Request Submitted!',
        description: 'Thank you for your interest. Our team will contact you within 24-48 hours.',
      })

      setOwnerForm({
        name: '',
        phone: '',
        email: '',
        pgName: '',
        pgType: 'boys',
        pgAddress: '',
        pgCity: '',
        pgState: '',
        pgPincode: '',
        capacity: '',
        existingRooms: '',
        message: ''
      })
    } catch (err) {
      console.error('Error submitting owner onboarding:', err)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to submit request. Please try again.',
      })
    } finally {
      setOwnerSubmitting(false)
    }
  }

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
                <Home className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">FindPG</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">About Us</Link>
              <Link href="/contact" className="text-sm font-medium text-primary">Contact</Link>
              <Button asChild>
                <Link href="/listings?type=boys">Find PG</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground">
              Whether you're looking for a PG or want to list your property, we're here to help
            </p>
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <Phone className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Call Us</CardTitle>
                <CardDescription>
                  Speak directly with our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-semibold text-lg">+91 98765 43210</div>
                <div className="text-sm text-muted-foreground">Mon-Sat: 9:00 AM - 7:00 PM</div>
                <div className="text-sm text-muted-foreground">Sun: 10:00 AM - 5:00 PM</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Mail className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Email Us</CardTitle>
                <CardDescription>
                  Drop us a line anytime
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-semibold">info@findpg.com</div>
                <div className="font-semibold">support@findpg.com</div>
                <div className="text-sm text-muted-foreground">
                  We typically respond within 24 hours
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-6 w-6 text-primary mb-2" />
                <CardTitle>Visit Us</CardTitle>
                <CardDescription>
                  Come meet our team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="font-medium">FindPG Office</div>
                <div className="text-sm text-muted-foreground">
                  123, Connaught Place<br />
                  New Delhi - 110001<br />
                  Delhi, India
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MessageCircle className="h-6 w-6 text-primary mb-2" />
                <CardTitle>WhatsApp Support</CardTitle>
                <CardDescription>
                  Quick responses via chat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-semibold text-lg">+91 98765 43210</div>
                <div className="text-sm text-muted-foreground mt-2">
                  Available 9:00 AM - 9:00 PM
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forms Section */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="tenant" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tenant">
                  <Home className="h-4 w-4 mr-2" />
                  I'm Looking for a PG
                </TabsTrigger>
                <TabsTrigger value="owner">
                  <Building className="h-4 w-4 mr-2" />
                  I'm a PG Owner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="tenant" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Send Us Your Inquiry</CardTitle>
                    <CardDescription>
                      Tell us what you're looking for and our team will help you find the perfect PG
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTenantSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tenant-name">Full Name *</Label>
                          <Input
                            id="tenant-name"
                            value={tenantForm.name}
                            onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                            required
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="tenant-phone">Phone Number *</Label>
                          <Input
                            id="tenant-phone"
                            type="tel"
                            value={tenantForm.phone}
                            onChange={(e) => setTenantForm({ ...tenantForm, phone: e.target.value })}
                            required
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="tenant-email">Email Address</Label>
                        <Input
                          id="tenant-email"
                          type="email"
                          value={tenantForm.email}
                          onChange={(e) => setTenantForm({ ...tenantForm, email: e.target.value })}
                          placeholder="Your email address"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tenant-message">Your Message *</Label>
                        <Textarea
                          id="tenant-message"
                          value={tenantForm.message}
                          onChange={(e) => setTenantForm({ ...tenantForm, message: e.target.value })}
                          required
                          rows={6}
                          placeholder="Tell us about your requirements - preferred location, budget, type of PG, any specific amenities you need, etc."
                        />
                      </div>
                      <Button type="submit" className="w-full" size="lg" disabled={tenantSubmitting}>
                        {tenantSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Inquiry
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="owner" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>List Your PG With Us</CardTitle>
                    <CardDescription>
                      Join thousands of PG owners who trust FindPG to connect them with genuine tenants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleOwnerSubmit} className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          Owner Information
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="owner-name">Owner Name *</Label>
                            <Input
                              id="owner-name"
                              value={ownerForm.name}
                              onChange={(e) => setOwnerForm({ ...ownerForm, name: e.target.value })}
                              required
                              placeholder="Your full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="owner-phone">Phone Number *</Label>
                            <Input
                              id="owner-phone"
                              type="tel"
                              value={ownerForm.phone}
                              onChange={(e) => setOwnerForm({ ...ownerForm, phone: e.target.value })}
                              required
                              placeholder="Your phone number"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="owner-email">Email Address *</Label>
                          <Input
                            id="owner-email"
                            type="email"
                            value={ownerForm.email}
                            onChange={(e) => setOwnerForm({ ...ownerForm, email: e.target.value })}
                            required
                            placeholder="Your email address"
                          />
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-semibold mb-3 flex items-center">
                          <Home className="h-4 w-4 mr-2" />
                          PG Details
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="pg-name">PG Name *</Label>
                            <Input
                              id="pg-name"
                              value={ownerForm.pgName}
                              onChange={(e) => setOwnerForm({ ...ownerForm, pgName: e.target.value })}
                              required
                              placeholder="Name of your PG"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pg-type">PG Type *</Label>
                            <select
                              id="pg-type"
                              value={ownerForm.pgType}
                              onChange={(e) => setOwnerForm({ ...ownerForm, pgType: e.target.value })}
                              className="w-full px-3 py-2 border border-input rounded-md bg-background"
                              required
                            >
                              <option value="boys">Boys PG</option>
                              <option value="girls">Girls PG</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor="pg-address">Full Address *</Label>
                          <Input
                            id="pg-address"
                            value={ownerForm.pgAddress}
                            onChange={(e) => setOwnerForm({ ...ownerForm, pgAddress: e.target.value })}
                            required
                            placeholder="Complete street address"
                          />
                        </div>
                        <div className="grid md:grid-cols-3 gap-4 mt-4">
                          <div>
                            <Label htmlFor="pg-city">City *</Label>
                            <Input
                              id="pg-city"
                              value={ownerForm.pgCity}
                              onChange={(e) => setOwnerForm({ ...ownerForm, pgCity: e.target.value })}
                              required
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pg-state">State *</Label>
                            <Input
                              id="pg-state"
                              value={ownerForm.pgState}
                              onChange={(e) => setOwnerForm({ ...ownerForm, pgState: e.target.value })}
                              required
                              placeholder="State"
                            />
                          </div>
                          <div>
                            <Label htmlFor="pg-pincode">Pincode *</Label>
                            <Input
                              id="pg-pincode"
                              value={ownerForm.pgPincode}
                              onChange={(e) => setOwnerForm({ ...ownerForm, pgPincode: e.target.value })}
                              required
                              placeholder="Pincode"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor="capacity">Total Capacity</Label>
                            <Input
                              id="capacity"
                              type="number"
                              value={ownerForm.capacity}
                              onChange={(e) => setOwnerForm({ ...ownerForm, capacity: e.target.value })}
                              placeholder="Number of occupants"
                            />
                          </div>
                          <div>
                            <Label htmlFor="existing-rooms">Number of Rooms</Label>
                            <Input
                              id="existing-rooms"
                              type="number"
                              value={ownerForm.existingRooms}
                              onChange={(e) => setOwnerForm({ ...ownerForm, existingRooms: e.target.value })}
                              placeholder="Total rooms available"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <Label htmlFor="owner-message">Additional Message</Label>
                        <Textarea
                          id="owner-message"
                          value={ownerForm.message}
                          onChange={(e) => setOwnerForm({ ...ownerForm, message: e.target.value })}
                          rows={4}
                          placeholder="Any additional information about your PG - amenities, rent range, special features, etc."
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={ownerSubmitting}>
                        {ownerSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Onboarding Request
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose FindPG?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Zero Brokerage</h3>
                <p className="text-sm text-muted-foreground">
                  No hidden fees or brokerage charges. Direct connection between tenants and owners.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Verified Listings</h3>
                <p className="text-sm text-muted-foreground">
                  Every PG is personally verified by our team for authenticity and quality.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Round-the-clock support to assist you with any queries or concerns.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted/80 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="h-6 w-6 text-primary" />
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
