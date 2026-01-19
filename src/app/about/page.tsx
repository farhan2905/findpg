'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Home,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  ShieldCheck,
  Users,
  Star,
  Award,
  CheckCircle,
  Target,
  Heart,
  Clock
} from 'lucide-react'

export default function AboutPage() {
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
              <Link href="/about" className="text-sm font-medium text-primary">About Us</Link>
              <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">Contact</Link>
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
              About FindPG
            </h1>
            <p className="text-xl text-muted-foreground">
              Your Trusted Partner in Finding the Perfect PG Accommodation Across India
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Badge variant="outline" className="mb-4">Our Story</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">We Started With a Simple Mission</h2>
            </div>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p className="text-lg leading-relaxed">
                FindPG was born in 2020 with a clear and simple vision: to make the process of finding a PG accommodation as seamless and stress-free as possible. Our founder, having personally experienced the struggles of finding safe, affordable, and comfortable PG accommodations in new cities, realized there had to be a better way.
              </p>
              <p className="text-lg leading-relaxed">
                We understood that for students, working professionals, and anyone moving to a new city, the search for accommodation is often accompanied by anxiety and uncertainty. Questions about safety, amenities, location, and genuine pricing often go unanswered. That's where FindPG stepped in.
              </p>
              <p className="text-lg leading-relaxed">
                Over the years, we have grown from a small local platform to a nationwide service connecting thousands of PG owners with genuine tenants. Our commitment to quality, transparency, and personalized service has remained unchanged since day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To provide a trusted, transparent, and hassle-free platform that helps individuals find their ideal PG accommodation while supporting PG owners in connecting with genuine tenants. We aim to eliminate the middlemen, reduce hidden costs, and ensure every listing on our platform is verified and authentic.
                </p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To become India's most trusted and comprehensive PG accommodation platform, setting the standard for quality, safety, and customer satisfaction. We envision a future where finding accommodation across any city in India is as simple as a few clicks, with complete peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Sets Us Apart</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Here's why thousands of students and professionals trust FindPG
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Verified Listings</CardTitle>
                <CardDescription>
                  Every PG listed on FindPG undergoes a thorough verification process. Our team personally visits each property to verify ownership, amenities, safety measures, and authenticity of photos.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Dedicated Support Team</CardTitle>
                <CardDescription>
                  Our customer support team is available 7 days a week to assist you with any queries, concerns, or guidance. From initial inquiry to final move-in, we're with you at every step.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Prime Locations</CardTitle>
                <CardDescription>
                  We focus on PGs located in safe, well-connected neighborhoods near colleges, IT parks, metro stations, and commercial hubs – ensuring you're never far from where you need to be.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Transparent Pricing</CardTitle>
                <CardDescription>
                  No hidden charges, no brokerage fees. What you see is what you pay. All amenities, rent details, and any additional costs are clearly mentioned upfront.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Safety First</CardTitle>
                <CardDescription>
                  For women's PGs, we verify additional security measures including CCTV, female staff, visitor policies, and neighborhood safety to ensure complete peace of mind.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Quick Response Time</CardTitle>
                <CardDescription>
                  Submit an inquiry and expect a response within 24 hours. Our streamlined process ensures you don't have to wait days to get information about your preferred PG.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex gap-4 items-start p-6 bg-background rounded-lg border">
              <Award className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Integrity & Trust</h3>
                <p className="text-muted-foreground">
                  We believe in complete honesty and transparency. If a PG doesn't meet our standards, it doesn't make it to our platform. We only list properties we would recommend to our own family and friends.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-background rounded-lg border">
              <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Customer-Centric Approach</h3>
                <p className="text-muted-foreground">
                  Every decision we make is with our users in mind. We constantly gather feedback, listen to your needs, and improve our services to provide a better experience for both tenants and PG owners.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-background rounded-lg border">
              <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
                <p className="text-muted-foreground">
                  We embrace technology and innovation to make the PG search process smarter and more efficient. From virtual tours to instant booking, we're always exploring new ways to serve you better.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start p-6 bg-background rounded-lg border">
              <Heart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold mb-2">Community Focus</h3>
                <p className="text-muted-foreground">
                  We're not just a platform; we're building a community. We facilitate connections, share safety tips, and create resources that help tenants and PG owners thrive together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">5,000+</div>
              <div className="text-muted-foreground">Verified PGs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50,000+</div>
              <div className="text-muted-foreground">Happy Tenants</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">25+</div>
              <div className="text-muted-foreground">Cities Covered</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-muted-foreground">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Find Your Perfect PG?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied tenants who found their home through FindPG
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/listings?type=boys">
                  Browse Boys PGs
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/listings?type=girls">
                  Browse Girls PGs
                </Link>
              </Button>
            </div>
            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">Or reach out to us directly</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@findpg.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
