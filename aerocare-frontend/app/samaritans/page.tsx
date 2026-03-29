"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, MapPin, Radio, Award, Phone, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const volunteers = [
  {
    id: 1,
    name: "Sarah Mitchell",
    distance: "0.3 km",
    certifications: ["CPR", "First Aid", "AED"],
    responseTime: "2 min",
    available: true,
  },
  {
    id: 2,
    name: "James Rodriguez",
    distance: "0.5 km",
    certifications: ["CPR", "EMT-B"],
    responseTime: "3 min",
    available: true,
  },
  {
    id: 3,
    name: "Emily Chen",
    distance: "0.8 km",
    certifications: ["CPR", "First Aid"],
    responseTime: "4 min",
    available: true,
  },
  {
    id: 4,
    name: "Michael Thompson",
    distance: "1.2 km",
    certifications: ["CPR", "First Aid", "Trauma"],
    responseTime: "6 min",
    available: true,
  },
  {
    id: 5,
    name: "Lisa Patel",
    distance: "1.5 km",
    certifications: ["CPR", "AED"],
    responseTime: "7 min",
    available: false,
  },
]

export default function SamaritansPage() {
  const [pinging, setPinging] = useState<number | null>(null)

  const handlePing = (id: number) => {
    setPinging(id)
    setTimeout(() => setPinging(null), 2000)
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success">
              <Users className="h-6 w-6 text-success-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Good Samaritan Radar
              </h1>
              <p className="text-sm text-muted-foreground">
                {volunteers.filter(v => v.available).length} certified volunteers available nearby
              </p>
            </div>
          </div>
        </div>

        {/* Radar Map Placeholder */}
        <Card className="mb-8 border-border bg-card">
          <CardContent className="p-0">
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-secondary/30 sm:h-80">
              {/* Radar Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute h-32 w-32 animate-ping rounded-full border-2 border-success/30 sm:h-48 sm:w-48" style={{ animationDuration: "2s" }} />
                <div className="absolute h-48 w-48 animate-ping rounded-full border border-success/20 sm:h-64 sm:w-64" style={{ animationDuration: "3s" }} />
                <div className="absolute h-64 w-64 animate-ping rounded-full border border-success/10 sm:h-80 sm:w-80" style={{ animationDuration: "4s" }} />
              </div>
              
              {/* Center Point */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success shadow-lg">
                  <Radio className="h-8 w-8 text-success-foreground" />
                </div>
                <span className="rounded-full bg-card px-3 py-1 text-sm font-medium text-foreground shadow">
                  Your Location
                </span>
              </div>

              {/* Volunteer Dots */}
              <div className="absolute left-[20%] top-[30%] h-3 w-3 animate-pulse rounded-full bg-success" />
              <div className="absolute right-[25%] top-[40%] h-3 w-3 animate-pulse rounded-full bg-success" />
              <div className="absolute left-[35%] bottom-[25%] h-3 w-3 animate-pulse rounded-full bg-success" />
              <div className="absolute right-[30%] bottom-[35%] h-3 w-3 animate-pulse rounded-full bg-success" />
              <div className="absolute left-[45%] top-[20%] h-3 w-3 animate-pulse rounded-full bg-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>

        {/* Volunteers List */}
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Nearby CPR-Certified Volunteers
        </h2>
        
        <div className="space-y-3">
          {volunteers.map((volunteer) => (
            <Card key={volunteer.id} className={`border-border bg-card ${!volunteer.available ? "opacity-60" : ""}`}>
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <User className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {volunteer.name}
                      </h3>
                      {volunteer.available ? (
                        <span className="h-2 w-2 rounded-full bg-success" />
                      ) : (
                        <span className="text-xs text-muted-foreground">(Busy)</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {volunteer.distance}
                      </span>
                      <span>·</span>
                      <span>ETA: {volunteer.responseTime}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="flex flex-wrap gap-1">
                    {volunteer.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-foreground"
                      >
                        <Award className="h-3 w-3" />
                        {cert}
                      </span>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handlePing(volunteer.id)}
                    disabled={!volunteer.available || pinging !== null}
                    className="bg-success text-success-foreground hover:bg-success/90"
                    size="sm"
                  >
                    {pinging === volunteer.id ? (
                      <>
                        <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-success-foreground border-t-transparent" />
                        Pinging...
                      </>
                    ) : (
                      <>
                        <Phone className="mr-2 h-3.5 w-3.5" />
                        Ping for Assistance
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
