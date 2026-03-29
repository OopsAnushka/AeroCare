import Link from "next/link"
import { Building2, Users, Droplets, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const modules = [
  {
    href: "/hospitals",
    title: "Hospital Routing",
    description: "Find nearby hospitals with available ICU beds and route ambulances instantly",
    icon: Building2,
    color: "bg-accent",
    textColor: "text-accent",
  },
  {
    href: "/samaritans",
    title: "Good Samaritan Radar",
    description: "Locate CPR-certified volunteers and trained responders in your vicinity",
    icon: Users,
    color: "bg-success",
    textColor: "text-success",
  },
  {
    href: "/donors",
    title: "Blood Donor Network",
    description: "Connect with verified blood donors for emergency transfusion needs",
    icon: Droplets,
    color: "bg-emergency",
    textColor: "text-emergency",
  },
]

export function ModuleCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {modules.map((module) => {
        const Icon = module.icon
        return (
          <Link key={module.href} href={module.href} className="group">
            <Card className="h-full border-border bg-card transition-all duration-200 hover:border-border/80 hover:shadow-lg">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${module.color}`}>
                  <Icon className="h-6 w-6 text-card" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {module.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {module.description}
                  </p>
                </div>
                <div className={`flex items-center gap-2 text-sm font-medium ${module.textColor} transition-transform group-hover:translate-x-1`}>
                  Access Module
                  <ArrowRight className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
