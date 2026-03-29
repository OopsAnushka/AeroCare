"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Droplets, MapPin, Search, CheckCircle2, User, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const bloodTypes = ["All Types", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

const donors = [
  {
    id: 1,
    name: "Robert Williams",
    bloodType: "O-",
    distance: "0.8 km",
    lastDonation: "3 months ago",
    verified: true,
    available: true,
  },
  {
    id: 2,
    name: "Amanda Foster",
    bloodType: "A+",
    distance: "1.1 km",
    lastDonation: "6 months ago",
    verified: true,
    available: true,
  },
  {
    id: 3,
    name: "David Kim",
    bloodType: "B+",
    distance: "1.4 km",
    lastDonation: "2 months ago",
    verified: true,
    available: true,
  },
  {
    id: 4,
    name: "Jennifer Martinez",
    bloodType: "O+",
    distance: "1.8 km",
    lastDonation: "4 months ago",
    verified: true,
    available: true,
  },
  {
    id: 5,
    name: "Christopher Lee",
    bloodType: "AB-",
    distance: "2.2 km",
    lastDonation: "5 months ago",
    verified: true,
    available: false,
  },
  {
    id: 6,
    name: "Maria Garcia",
    bloodType: "A-",
    distance: "2.5 km",
    lastDonation: "1 month ago",
    verified: true,
    available: true,
  },
  {
    id: 7,
    name: "Thomas Anderson",
    bloodType: "O-",
    distance: "2.9 km",
    lastDonation: "3 months ago",
    verified: true,
    available: true,
  },
  {
    id: 8,
    name: "Sarah Johnson",
    bloodType: "B-",
    distance: "3.1 km",
    lastDonation: "4 months ago",
    verified: false,
    available: true,
  },
]

export default function DonorsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [requesting, setRequesting] = useState<number | null>(null)

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "All Types" || donor.bloodType === selectedType
    return matchesSearch && matchesType
  })

  const handleRequest = (id: number) => {
    setRequesting(id)
    setTimeout(() => setRequesting(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emergency">
              <Droplets className="h-6 w-6 text-emergency-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Blood Donor Network
              </h1>
              <p className="text-sm text-muted-foreground">
                {donors.filter(d => d.available).length} verified donors available in your area
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6 border-border bg-card">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search donors by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {bloodTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-emergency text-emergency-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Results Count */}
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredDonors.length} donor{filteredDonors.length !== 1 ? "s" : ""}
          {selectedType !== "All Types" && ` with blood type ${selectedType}`}
        </p>

        {/* Donors List */}
        <div className="space-y-3">
          {filteredDonors.map((donor) => (
            <Card key={donor.id} className={`border-border bg-card ${!donor.available ? "opacity-60" : ""}`}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {donor.name}
                      </h3>
                      {donor.verified && (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      )}
                      {!donor.available && (
                        <span className="text-xs text-muted-foreground">(Unavailable)</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {donor.distance}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Last donated: {donor.lastDonation}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-emergency/10 font-bold text-emergency">
                    {donor.bloodType}
                  </div>
                  
                  <Button
                    onClick={() => handleRequest(donor.id)}
                    disabled={!donor.available || requesting !== null}
                    className="bg-emergency text-emergency-foreground hover:bg-emergency/90"
                    size="sm"
                  >
                    {requesting === donor.id ? (
                      <>
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emergency-foreground border-t-transparent" />
                        Requesting...
                      </>
                    ) : (
                      <>
                        <Droplets className="mr-2 h-3.5 w-3.5" />
                        Request Blood
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredDonors.length === 0 && (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Droplets className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="mb-2 font-semibold text-foreground">No donors found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
