import { Clock, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useGetIncidents } from '#/hooks/use-incident';

const useIncidentStats = (incidents: any[] | undefined) => {
  if (!incidents) return null;

  return {
    critical: incidents.filter((i) => i.severity === 'critical').length,
    high: incidents.filter((i) => i.severity === 'high').length,
    medium: incidents.filter((i) => i.severity === 'medium').length,
    low: incidents.filter((i) => i.severity === 'low').length,
    resolved: incidents.filter((i) => i.status === 'resolved').length,
  };
};

const getSeverityColor = (severity: string) => {
  const colors = {
    critical: 'border-red-500',
    high: 'border-orange-500',
    medium: 'border-blue-500',
    low: 'border-green-500',
  };
  return colors[severity as keyof typeof colors] || 'border-border';
};

const getCategoryBadge = (category: string) => {
  const badges = {
    disaster: 'bg-red-500/10 text-red-500 border-red-500/20',
    protest: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    traffic: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    crime: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    medical: 'bg-green-500/10 text-green-500 border-green-500/20',
  };
  return badges[category as keyof typeof badges] || 'bg-muted text-muted-foreground';
};

export function IncidentsTab() {
  const { data: incidents, isLoading, error } = useGetIncidents();
  const stats = useIncidentStats(incidents);

  if (isLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading incidents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-destructive">Error loading incidents. Please try again.</div>
      </div>
    );
  }

  if (!incidents || !stats) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Critical</CardDescription>
            <CardTitle className="text-2xl text-red-500">{stats.critical}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">High</CardDescription>
            <CardTitle className="text-2xl text-orange-500">{stats.high}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Close monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Medium</CardDescription>
            <CardTitle className="text-2xl text-blue-500">{stats.medium}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Standard response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription className="text-xs uppercase tracking-wide">Resolved</CardDescription>
            <CardTitle className="text-2xl text-green-500">{stats.resolved}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Closed today</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {incidents.map((incident) => (
          <Card
            key={incident.id}
            className={`border-l-4 ${getSeverityColor(incident.severity)}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm">{incident.title}</CardTitle>
                <span className={`text-xs px-2 py-0.5 rounded border ${getCategoryBadge(incident.category)}`}>
                  {incident.category.toUpperCase()}
                </span>
              </div>
              <CardDescription className="text-xs leading-relaxed">
                {incident.desc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {incident.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" />
                  {incident.district}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="size-3" />
                  {incident.officers}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
