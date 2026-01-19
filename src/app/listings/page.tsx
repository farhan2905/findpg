'use client'

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, MapPin, Home, ArrowLeft, Filter, SlidersHorizontal } from 'lucide-react'
import type { PG, PGType } from '@prisma/client'

export const dynamic = 'force-dynamic'

export default function ListingsPage() {
  const searchParams = useSearchParams()
  const typeParam = searchParams.get('type') as PGType | null

  const [pgs, setPgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [cityFilter, setCityFilter] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')

  const pageTitle = typeParam === 'BOYS' ? 'PG for Boys' : typeParam === 'GIRLS' ? 'PG for Girls' : 'All PGs'

  useEffect(() => {
    fetchPGs()
  }, [typeParam, page, cityFilter, sortBy])

  const fetchPGs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy
      })

      if (typeParam) {
        params.append('type', typeParam)
      }

      if (cityFilter) {
        params.append('city', cityFilter)
      }

      const res = await fetch(`/api/pg/listings?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Failed to fetch PG listings')
      }

      const data = await res.json()
      setPgs(data.pgs || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      console.error('Error fetching PGs:', err)
      setError('Failed to load PG listings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchPGs()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getLowestRent = (pg: any) => {
    if (!pg.rentPlans || pg.rentPlans.length === 0) return null
    return Math.min(...pg.rentPlans.map((plan: any) => plan.rent))
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
          </nav>
        </div>
      </header>

      {/* Page Title */}
      <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            Browse through our verified and safe PG accommodations
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by city..."
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 items-center w-full md:w-auto">
              <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Newest First</SelectItem>
                  <SelectItem value="rent">Lowest Rent</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-8 flex-1">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={fetchPGs}>Try Again</Button>
            </div>
          ) : pgs.length === 0 ? (
            <div className="text-center py-12">
              <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No PGs Found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later
              </p>
              <Button asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pgs.map((pg) => {
                  const firstImage = pg.images?.[0]?.url || '/placeholder-pg.jpg'
                  const lowestRent = getLowestRent(pg)

                  return (
                    <Card key={pg.id} className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                      <div className="relative h-48 overflow-hidden bg-muted group">
                        <img
                          src={firstImage}
                          alt={pg.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg line-clamp-1">{pg.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span className="line-clamp-1">{pg.city}, {pg.state}</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {pg.description}
                        </p>
                        {lowestRent && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Starting from</span>
                            <span className="text-lg font-bold text-primary">
                              ₹{lowestRent.toLocaleString()}/mo
                            </span>
                          </div>
                        )}
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
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1
                      if (totalPages > 5 && page > 3) pageNum = page - 2 + i
                      if (pageNum > totalPages) return null

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
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
