import { Shield } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useGetResources } from '#/hooks/use-resource'
import { cn } from '#/lib/utils'

const getResourceStatusColor = (status: string) => {
  const colors = {
    deployed: 'bg-red-500/10 text-red-500 border-red-500/20',
    standby: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    available: 'bg-green-500/10 text-green-500 border-green-500/20',
  }
  return colors[status as keyof typeof colors] || 'bg-muted'
}

const getResourceIcon = (status: string) => {
  const colors = {
    deployed: 'bg-red-500/10 text-red-500',
    standby: 'bg-orange-500/10 text-orange-500',
    available: 'bg-green-500/10 text-green-500',
  }
  return colors[status as keyof typeof colors] || 'bg-muted'
}

export function ResourcesTab() {
  const { data: resources, isLoading, error } = useGetResources()

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading resources...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-destructive">
          Error loading resources. Please try again.
        </div>
      </div>
    )
  }

  if (!resources) return null

  const totalOfficers = resources.reduce((sum, r) => sum + r.officers, 0)
  const deployedOfficers = resources
    .filter((r) => r.status === 'deployed')
    .reduce((sum, r) => sum + r.officers, 0)
  const vehicleCount = resources.length
  const availableOfficers = totalOfficers - deployedOfficers

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">
              Total Officers
            </CardDescription>
            <CardTitle className="text-2xl text-blue-500">
              {totalOfficers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">On duty</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">
              Deployed
            </CardDescription>
            <CardTitle className="text-2xl text-green-500">
              {deployedOfficers}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">At incidents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">
              Vehicles
            </CardDescription>
            <CardTitle className="text-2xl text-orange-500">
              {vehicleCount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Fleet active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">
              Available
            </CardDescription>
            <CardTitle className="text-2xl">{availableOfficers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Ready to deploy</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="text-xs text-muted-foreground mb-2.5 uppercase tracking-wide font-semibold">
          Deployed Units
        </div>

        <Card>
          <CardContent className="p-0">
            {resources.map((resource, index) => (
              <div
                key={resource.id}
                className={cn(
                  'flex items-center gap-2.5 px-4 py-3',
                  index !== resources.length - 1 && 'border-b',
                )}
              >
                <div
                  className={cn(
                    'size-9 rounded-md flex items-center justify-center flex-shrink-0',
                    getResourceIcon(resource.status),
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
                    'text-xs px-2 py-1 rounded border font-mono whitespace-nowrap',
                    getResourceStatusColor(resource.status),
                  )}
                >
                  {resource.status.toUpperCase()}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
