import { Plus } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { useGetIncidents } from '#/hooks/use-incident'
import { cn } from '#/lib/utils'

const useIncidentStats = (incidents: any[] | undefined) => {
  if (!incidents) return null
  return {
    critical: incidents.filter((i) => i.severity === 'critical').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    medium: incidents.filter((i) => i.severity === 'medium').length,
    low: incidents.filter((i) => i.severity === 'low').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  }
}

interface IncidentSidebarProps {
  selectedIncident: number | null
  onSelectIncident: (id: number) => void
}

const getSeverityColor = (severity: string) => {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-blue-500',
    low: 'bg-green-500',
  }
  return colors[severity as keyof typeof colors] || 'bg-muted-foreground'
}

const getCategoryBadge = (category: string) => {
  const badges = {
    disaster: 'bg-red-500/10 text-red-500 border-red-500/20',
    protest: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    traffic: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    crime: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    medical: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return (
    badges[category as keyof typeof badges] || 'bg-muted text-muted-foreground'
  )
}

export function IncidentSidebar({
  selectedIncident,
  onSelectIncident,
}: IncidentSidebarProps) {
  const { data: incidents, isLoading } = useGetIncidents()
  const stats = useIncidentStats(incidents)

  if (isLoading || !incidents || !stats) {
    return (
      <div className="w-[280px] min-w-[280px] border-r flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    )
  }

  const activeCount = incidents.filter((i) => i.status === 'active').length

  return (
    <div className="w-[280px] min-w-[280px] border-r overflow-y-auto bg-background">
      <div className="grid grid-cols-2 gap-2 p-3 border-b">
        <Card className="p-2.5">
          <CardContent className="p-0">
            <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Critical
            </div>
            <div className="font-bold text-2xl leading-none text-red-500">
              {stats.critical}
            </div>
          </CardContent>
        </Card>

        <Card className="p-2.5">
          <CardContent className="p-0">
            <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              High
            </div>
            <div className="font-bold text-2xl leading-none text-orange-500">
              {stats.high}
            </div>
          </CardContent>
        </Card>

        <Card className="p-2.5">
          <CardContent className="p-0">
            <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Active
            </div>
            <div className="font-bold text-2xl leading-none text-blue-500">
              {activeCount}
            </div>
          </CardContent>
        </Card>

        <Card className="p-2.5">
          <CardContent className="p-0">
            <div className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wide">
              Resolved
            </div>
            <div className="font-bold text-2xl leading-none text-green-500">
              {stats.resolved}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
        Active Incidents
        <Button variant="outline" size="xs">
          <Plus />
          Add
        </Button>
      </div>

      <div>
        {incidents.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onSelectIncident(incident.id)}
            className={cn(
              'flex items-start gap-2.5 px-4 py-2.5 border-b cursor-pointer transition-colors hover:bg-accent',
              selectedIncident === incident.id &&
                'bg-accent border-l-2 border-l-primary',
            )}
          >
            <span
              className={cn(
                'size-2 rounded-full mt-1 flex-shrink-0',
                getSeverityColor(incident.severity),
                incident.severity === 'critical' &&
                  'shadow-lg shadow-red-500/50',
              )}
            />

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight">
                {incident.title}
              </div>
              <div className="flex gap-2 items-center mt-1 text-xs text-muted-foreground">
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded border font-medium',
                    getCategoryBadge(incident.category),
                  )}
                >
                  {incident.category.toUpperCase()}
                </span>
                <span className="font-mono">{incident.time}</span>
                <span>{incident.district}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
