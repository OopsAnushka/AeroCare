"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, MapPin, Bed, Navigation as NavIcon, Clock } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const hospitals = [
  {
    id: 1,
    name: "Metro General Hospital",
    distance: "1.2 km",
    icuBeds: 8,
    totalBeds: 45,
    eta: "4 min",
    trauma: true,
  },
  {
    id: 2,
    name: "St. Mary&apos;s Medical Center",
    distance: "2.4 km",
    icuBeds: 3,
    totalBeds: 32,
    eta: "7 min",
    trauma: true,
  },
  {
    id: 3,
    name: "University Hospital",
    distance: "3.1 km",
    icuBeds: 12,
    totalBeds: 120,
    eta: "9 min",
    trauma: true,
  },
  {
    id: 4,
    name: "Riverside Community Hospital",
    distance: "4.8 km",
    icuBeds: 5,
    totalBeds: 28,
    eta: "12 min",
    trauma: false,
  },
  {
    id: 5,
    name: "Central Medical Center",
    distance: "5.2 km",
    icuBeds: 2,
    totalBeds: 18,
    eta: "14 min",
    trauma: false,
  },
  {
    id: 6,
    name: "Northside Regional Hospital",
    distance: "6.7 km",
    icuBeds: 6,
    totalBeds: 52,
    eta: "18 min",
    trauma: true,
  },
]

export default function HospitalsPage() {
  const [routingTo, setRoutingTo] = useState<number | null>(null)

  const handleRoute = (id: number) => {
    setRoutingTo(id)
    setTimeout(() => setRoutingTo(null), 2000)
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
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
              <Building2 className="h-6 w-6 text-accent-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Hospital Routing
              </h1>
              <p className="text-sm text-muted-foreground">
                {hospitals.length} hospitals with available capacity nearby
              </p>
            </div>
          </div>
        </div>

        {/* Hospital Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hospitals.map((hospital) => (
            <Card key={hospital.id} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {hospital.name.replace("&apos;", "'")}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {hospital.distance}
                      <span className="mx-1">·</span>
                      <Clock className="h-3.5 w-3.5" />
                      {hospital.eta}
                    </div>
                  </div>
                  {hospital.trauma && (
                    <span className="rounded-full bg-emergency/10 px-2 py-0.5 text-xs font-medium text-emergency">
                      Trauma
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-success" />
                    <div>
                      <p className="text-2xl font-bold text-success">
                        {hospital.icuBeds}
                      </p>
                      <p className="text-xs text-muted-foreground">ICU Beds</p>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-border" />
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      {hospital.totalBeds}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Beds</p>
                  </div>
                </div>

                <Button
                  onClick={() => handleRoute(hospital.id)}
                  disabled={routingTo !== null}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {routingTo === hospital.id ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-accent-foreground border-t-transparent" />
                      Routing...
                    </>
                  ) : (
                    <>
                      <NavIcon className="mr-2 h-4 w-4" />
                      Route Ambulance Here
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
