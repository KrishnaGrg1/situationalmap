/**
 * Application Configuration Constants
 * Centralized configuration using environment variables
 */

// Map Configuration
export const MAP_CONFIG = {
  tileUrl: import.meta.env.VITE_MAP_TILE_URL,
  attribution: import.meta.env.VITE_MAP_ATTRIBUTION,
  center: { lat: 28.3949, lng: 84.124 } as const,
  defaultZoom: 7,
} as const;

// Leaflet Icon URLs
export const LEAFLET_ICONS = {
  markerIcon: import.meta.env.VITE_LEAFLET_MARKER_ICON_URL,
  markerIcon2x: import.meta.env.VITE_LEAFLET_MARKER_ICON_2X_URL,
  markerShadow: import.meta.env.VITE_LEAFLET_MARKER_SHADOW_URL,
} as const;

// Severity Colors
export const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#3b82f6',
  low: '#10b981',
} as const;

// Query Configuration
export const QUERY_CONFIG = {
  refetchInterval: 30000, // 30 seconds
  staleTime: 30000,
} as const;
