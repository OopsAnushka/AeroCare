import { Navigation } from "@/components/navigation"
import { SOSButton } from "@/components/sos-button"
import { ModuleCards } from "@/components/module-cards"
import { Activity } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Status Banner */}
        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:mb-12">
          <Activity className="h-4 w-4 text-success" />
          <span>System Online</span>
          <span className="mx-2 text-border">|</span>
          <span>Response Time: 4.2 min avg</span>
        </div>

        {/* SOS Button Section */}
        <section className="mb-12 flex flex-col items-center sm:mb-16">
          <h1 className="mb-8 text-center text-2xl font-semibold tracking-tight text-foreground sm:mb-12 sm:text-3xl">
            Emergency Dispatch Center
          </h1>
          <SOSButton />
        </section>

        {/* Divider */}
        <div className="mb-8 flex items-center gap-4 sm:mb-12">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quick Access Modules
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Module Cards */}
        <ModuleCards />

        {/* Footer Info */}
        <footer className="mt-12 border-t border-border pt-8 text-center sm:mt-16">
          <p className="text-xs text-muted-foreground">
            AeroCare Emergency Medical Dispatch System v2.4.1
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Coordinating with 247 hospitals and 12,450 certified responders
          </p>
        </footer>
      </main>
    </div>
  )
}
