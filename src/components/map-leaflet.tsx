'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetIncidents } from '#/hooks/use-incident';
import type { Incident } from '#/lib/data';

import { MAP_CONFIG, LEAFLET_ICONS, SEVERITY_COLORS } from '#/lib/constants';

// Configure Leaflet default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: LEAFLET_ICONS.markerIcon2x,
  iconUrl: LEAFLET_ICONS.markerIcon,
  shadowUrl: LEAFLET_ICONS.markerShadow,
});

interface LeafletMapProps {
  onIncidentClick: (id: number) => void;
  selectedIncident: number | null;
}

function MapUpdater({
  selectedIncident,
  incidents
}: {
  selectedIncident: number | null;
  incidents: Incident[];
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedIncident !== null) {
      const incident = incidents.find((i) => i.id === selectedIncident);
      if (incident) {
        map.setView([incident.coordinates.lat, incident.coordinates.lng], 10, {
          animate: true,
        });
      }
    }
  }, [selectedIncident, map, incidents]);

  return null;
}

const getMarkerColor = (severity: string): string => {
  return SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS] || '#8B94B0';
};

function createCustomIcon(severity: string) {
  const color = getMarkerColor(severity);
  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="12" fill="${color}" opacity="0.2"/>
      <circle cx="16" cy="16" r="8" fill="${color}" opacity="0.4"/>
      <circle cx="16" cy="16" r="5" fill="${color}" stroke="white" stroke-width="2"/>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
}

export function LeafletMap({ onIncidentClick, selectedIncident }: LeafletMapProps) {
  const { data: incidents, isLoading } = useGetIncidents();

  if (isLoading || !incidents) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#0A0E1A]">
        <div className="text-[#5A6480]">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[MAP_CONFIG.center.lat, MAP_CONFIG.center.lng]}
        zoom={MAP_CONFIG.defaultZoom}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">${MAP_CONFIG.attribution}</a>`}
          url={MAP_CONFIG.tileUrl}
        />

        <MapUpdater selectedIncident={selectedIncident} incidents={incidents} />

        {incidents.map((incident) => (
          <div key={incident.id}>
            <Circle
              center={[incident.coordinates.lat, incident.coordinates.lng]}
              radius={incident.severity === 'critical' ? 15000 : 8000}
              pathOptions={{
                color: getMarkerColor(incident.severity),
                fillColor: getMarkerColor(incident.severity),
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
            <Marker
              position={[incident.coordinates.lat, incident.coordinates.lng]}
              icon={createCustomIcon(incident.severity)}
              eventHandlers={{
                click: () => onIncidentClick(incident.id),
              }}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <h3 className="font-semibold text-sm mb-1">{incident.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{incident.desc}</p>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {incident.district}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 rounded">
                      {incident.time}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
}
