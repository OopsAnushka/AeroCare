'use client';
import { useEffect, useRef } from 'react';
import type { AmbulanceUnit } from '@/lib/firestore';

// Leaflet is already a dependency (used by MapView), import at runtime only
interface Props {
  ambulances: AmbulanceUnit[];
  selected: AmbulanceUnit | null;
  onSelect: (u: AmbulanceUnit) => void;
}

const STATUS_COLORS: Record<string, string> = {
  available:   '#10b981',
  dispatched:  '#3b82f6',
  maintenance: '#f59e0b',
  offline:     '#6b7280',
};

export default function AmbulanceMap({ ambulances, selected, onSelect }: Props) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return;

    // Dynamically import Leaflet (client-only)
    import('leaflet').then(L => {
      // Fix default icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({ iconRetinaUrl: '/leaflet/marker-icon-2x.png', iconUrl: '/leaflet/marker-icon.png', shadowUrl: '/leaflet/marker-shadow.png' });

      if (!mapRef.current) {
        mapRef.current = L.map(containerRef.current!, {
          center: [22.7196, 75.8577],
          zoom: 12,
          zoomControl: false,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '© OpenStreetMap contributors © CARTO',
          maxZoom: 19,
        }).addTo(mapRef.current);

        L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      }

      // Clear old markers
      Object.values(markersRef.current).forEach((m: any) => m.remove());
      markersRef.current = {};

      // Add markers for units with GPS
      const located = ambulances.filter(a => a.lat !== undefined && a.lng !== undefined);

      located.forEach(unit => {
        const color = STATUS_COLORS[unit.status] ?? '#6b7280';
        const svgIcon = L.divIcon({
          html: `
            <div style="position:relative;width:36px;height:36px;">
              <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
                <circle cx="18" cy="18" r="14" fill="${color}" opacity="0.15"/>
                <circle cx="18" cy="18" r="9" fill="${color}" opacity="0.9"/>
                <text x="18" y="22" text-anchor="middle" font-size="10" fill="white" font-weight="bold">🚑</text>
              </svg>
            </div>`,
          className: '',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([unit.lat!, unit.lng!], { icon: svgIcon })
          .addTo(mapRef.current)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:160px;">
              <div style="font-weight:800;font-size:14px;margin-bottom:4px;">${unit.vehiclePlate}</div>
              <div style="color:#9ca3af;font-size:12px;">${unit.unitType} · ${unit.driverName}</div>
              <div style="margin-top:6px;display:inline-block;padding:2px 8px;background:${color}22;color:${color};border-radius:99px;font-size:11px;font-weight:700;text-transform:capitalize;border:1px solid ${color}44;">${unit.status}</div>
              ${unit.lastLocationUpdate ? `<div style="color:#6b7280;font-size:10px;margin-top:4px;">Updated: ${new Date(unit.lastLocationUpdate).toLocaleTimeString()}</div>` : ''}
            </div>`);

        marker.on('click', () => onSelect(unit));
        markersRef.current[unit.id] = marker;
      });

      // Fit bounds if any markers exist
      if (located.length > 0) {
        const group = L.featureGroup(Object.values(markersRef.current));
        mapRef.current.fitBounds(group.getBounds().pad(0.3));
      }
    });

    return () => {
      // Don't destroy the map on re-render — only on unmount
    };
  }, [ambulances]);

  // Pan to selected unit
  useEffect(() => {
    if (selected?.lat && selected?.lng && mapRef.current) {
      mapRef.current.flyTo([selected.lat, selected.lng], 15, { duration: 1 });
      markersRef.current[selected.id]?.openPopup();
    }
  }, [selected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const locatedCount = ambulances.filter(a => a.lat !== undefined).length;

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      {locatedCount === 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060a0f]/90 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-white font-bold text-sm">No GPS Data</p>
          <p className="text-gray-500 text-xs mt-1 text-center max-w-[200px]">
            Click the <span className="text-teal-400 font-bold">↻</span> button on any unit to simulate a GPS ping
          </p>
        </div>
      )}
    </div>
  );
}
