import { MapView } from './map-view';
import { IncidentSidebar } from './incident-sidebar';
import { RightPanel } from './right-panel';
import { ProvinceBar } from './province-bar';

interface OperationalMapProps {
  selectedIncident: number | null;
  onSelectIncident: (id: number | null) => void;
}

export function OperationalMap({ selectedIncident, onSelectIncident }: OperationalMapProps) {
  return (
    <div className="flex h-[calc(100vh-105px)]">
      <IncidentSidebar
        selectedIncident={selectedIncident}
        onSelectIncident={onSelectIncident}
      />

      <div className="flex-1 flex flex-col">
        <div className="flex-1 relative">
          <MapView
            onIncidentClick={onSelectIncident}
            selectedIncident={selectedIncident}
          />
        </div>
        <ProvinceBar />
      </div>

      <RightPanel selectedIncident={selectedIncident} onClose={() => onSelectIncident(null)} />
    </div>
  );
}
