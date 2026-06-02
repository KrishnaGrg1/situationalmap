'use client';

import { useEffect, useState } from 'react';
import { incidents } from '#/lib/data';

interface MapViewProps {
  onIncidentClick: (id: number) => void;
  selectedIncident: number | null;
}

export function MapView({ onIncidentClick, selectedIncident }: MapViewProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [MapComponent, setMapComponent] = useState<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('./map-leaflet').then((mod) => {
      setMapComponent(() => mod.LeafletMap);
      setMapLoaded(true);
    });
  }, []);

  if (!mapLoaded || !MapComponent) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0E1422] text-[#8B94B0]">
        Loading map...
      </div>
    );
  }

  return <MapComponent onIncidentClick={onIncidentClick} selectedIncident={selectedIncident} />;
}
