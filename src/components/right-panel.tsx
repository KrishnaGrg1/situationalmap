import { useState, useEffect } from 'react'
import { RefreshCw, FileText, Shield, ArrowLeft } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Button } from './ui/button'
import { useGetIncidents } from '#/hooks/use-incident'
import { useGetResources } from '#/hooks/use-resource'
import { nepaliSummaries } from '#/lib/data'
import { cn } from '#/lib/utils'

interface RightPanelProps {
  selectedIncident: number | null
  onClose: () => void
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

const getResourceStatusColor = (status: string) => {
  const colors = {
    deployed: 'bg-red-500/10 text-red-500 border-red-500/20',
    standby: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    available: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status as keyof typeof colors] || 'bg-muted'
}

export function RightPanel({ selectedIncident, onClose }: RightPanelProps) {
  const { data: incidents } = useGetIncidents()
  const { data: resources } = useGetResources()
  const [summaryIndex, setSummaryIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const time = now.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      setCurrentTime(`${time} NPT`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const incident = incidents?.find((i) => i.id === selectedIncident)

  if (incident) {
    return (
      <div className="w-[300px] min-w-[300px] border-l overflow-y-auto bg-background">
        <div className="px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
          Incident Detail
        </div>

        <div className="p-3 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={cn(
                  'size-2.5 rounded-full',
                  getSeverityColor(incident.severity),
                )}
              />
              <span className="text-sm font-semibold">{incident.title}</span>
            </div>

            <div className="flex gap-1.5 flex-wrap mb-3">
              <span className="text-xs px-2 py-0.5 rounded border bg-red-500/10 text-red-500 border-red-500/20">
                {incident.category.toUpperCase()}
              </span>
              <span className="text-xs px-2 py-0.5 rounded border bg-red-500/10 text-red-500 border-red-500/20">
                {incident.severity.toUpperCase()}
              </span>
            </div>

            <Card>
              <CardContent className="p-2.5 text-xs text-muted-foreground leading-relaxed">
                {incident.desc}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="text-xs text-muted-foreground">
              District
              <div className="text-foreground font-medium">
                {incident.district}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Time
              <div className="text-foreground font-medium font-mono">
                {incident.time} NPT
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Officers
              <div className="text-blue-500 text-sm font-semibold">
                {incident.officers}
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              Updates
              <div className="text-foreground font-medium">
                {incident.updates.length}
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-semibold">
              Field Updates
            </div>

            <div className="space-y-2">
              {incident.updates.map((update, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="size-6 rounded-full bg-muted border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0 font-mono font-semibold">
                    {update.user}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs leading-relaxed">{update.text}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {update.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="w-full"
          >
            <ArrowLeft />
            Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-[300px] min-w-[300px] border-l overflow-y-auto bg-background">
      <div className="px-4 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
        Situation Summary
      </div>

      <div className="p-3 space-y-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardDescription className="text-xs uppercase tracking-wide">
                AI Summary — Nepali
              </CardDescription>
              <span className="text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 px-1.5 py-0.5 rounded">
                GPT
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed mb-2">
              {nepaliSummaries[summaryIndex]}
            </p>
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>Updated 2 min ago</span>
              <span>{currentTime}</span>
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSummaryIndex((prev) => (prev + 1) % nepaliSummaries.length)
          }
          className="w-full"
        >
          <RefreshCw />
          Regenerate
        </Button>

        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Deployed Resources
          </div>

          <div className="space-y-2">
            {resources?.slice(0, 4).map((resource) => (
              <div
                key={resource.id}
                className="flex items-center gap-2.5 p-2 border rounded-lg"
              >
                <div
                  className={cn(
                    'size-8 rounded-md flex items-center justify-center flex-shrink-0',
                    getResourceStatusColor(resource.status),
                  )}
                >
                  <Shield className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{resource.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {resource.officers} officers · {resource.vehicle}
                  </div>
                </div>

                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded border font-mono whitespace-nowrap',
                    getResourceStatusColor(resource.status),
                  )}
                >
                  {resource.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button variant="default" size="sm" className="w-full">
          <FileText />
          Generate Full Report
        </Button>
      </div>
    </div>
  )
}
