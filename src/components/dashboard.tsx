import { useState } from 'react';
import { Map, AlertTriangle, FileText, Users } from 'lucide-react';
import { Navbar } from './navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { OperationalMap } from './operational-map';
import { IncidentsTab } from './incidents-tab';
import { ReportTab } from './report-tab';
import { ResourcesTab } from './resources-tab';
import { useGetIncidents } from '#/hooks/use-incident';

export function Dashboard() {
  const [selectedIncident, setSelectedIncident] = useState<number | null>(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const { data: incidents } = useGetIncidents();

  const activeIncidentsCount = incidents?.filter((i) => i.status === 'active').length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar onOpenReportForm={() => setShowReportForm(true)} />

      <Tabs defaultValue="dashboard" className="px-5 pt-3">
        <TabsList variant="line">
          <TabsTrigger value="dashboard">
            <Map />
            Operational Map
          </TabsTrigger>
          <TabsTrigger value="incidents">
            <AlertTriangle />
            Incidents
            {activeIncidentsCount > 0 && (
              <span className="bg-destructive/20 text-destructive text-xs px-1.5 py-0.5 rounded">
                {activeIncidentsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="report">
            <FileText />
            Situation Report
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Users />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <OperationalMap
            selectedIncident={selectedIncident}
            onSelectIncident={setSelectedIncident}
          />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentsTab />
        </TabsContent>

        <TabsContent value="report">
          <ReportTab />
        </TabsContent>

        <TabsContent value="resources">
          <ResourcesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
