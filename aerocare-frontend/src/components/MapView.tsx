'use client';
import { useEffect, useState, memo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TabId, Volunteer, HospitalData } from '@/app/emergency/EmergencyClient';

/* ── Custom icons ── */
const userIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ambulanceIcon = L.divIcon({
  html: `<div style="background: black; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); font-size: 18px; transform: scaleX(-1);">🚑</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18],
});

/* ── Map controller for flyTo ── */
function FlyTo({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 1.2 });
  }, [center, map]);
  return null;
}

interface Props {
  center: [number, number];
  userLocation: [number, number];
  activeTab: TabId;
  pickupLocation: [number, number] | null;
  hospitalRoute: [number, number][] | null;
  volunteers: Volunteer[];
  hospitals: HospitalData[];
  dispatched: boolean;
  dispatchData?: any;
}

function MapView({
  center,
  userLocation,
  activeTab,
  pickupLocation,
  hospitalRoute,
  volunteers,
  hospitals,
  dispatched,
  dispatchData,
}: Props) {
  const [ambPos, setAmbPos] = useState<[number, number] | null>(null);
  const [ambRoute, setAmbRoute] = useState<[number, number][] | null>(null);

  // Live Ambulance Animation
  useEffect(() => {
    let interval: NodeJS.Timeout;

    async function initAmbulance() {
      if (dispatched && userLocation) {
        // Start ambulance slightly away from user (approx 1.5km), or from actual nearest hospital
        let startPos: [number, number] = [userLocation[0] - 0.012, userLocation[1] + 0.015];
        if (dispatchData?.startPos) {
          startPos = dispatchData.startPos;
        }
        setAmbPos(startPos);
        
        try {
          // Fetch exact road route from OSRM
          const res = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${startPos[1]},${startPos[0]};${userLocation[1]},${userLocation[0]}?geometries=geojson`
          );
          const data = await res.json();
          
          if (data.routes && data.routes[0]) {
            const coords = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]] as [number, number]);
            setAmbRoute(coords);
            
            const startTime = Date.now();
            const duration = 120000; // 2 minutes to arrive
            
            interval = setInterval(() => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              const totalSegments = coords.length - 1;
              const exactIdx = progress * totalSegments;
              const idx = Math.floor(exactIdx);
              const segmentProgress = exactIdx - idx;
              
              if (idx >= totalSegments) {
                setAmbPos(coords[coords.length - 1]);
                clearInterval(interval);
              } else {
                const p1 = coords[idx];
                const p2 = coords[idx + 1];
                const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
                const lon = p1[1] + (p2[1] - p1[1]) * segmentProgress;
                setAmbPos([lat, lon]);
              }
            }, 200);
          } else {
            throw new Error('No route');
          }
        } catch (err) {
          // Fallback: linear straight-line animation if OSRM fails
          console.error(err);
          const startTime = Date.now();
          const duration = 120000;
          
          interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentLat = startPos[0] + (userLocation[0] - startPos[0]) * progress;
            const currentLon = startPos[1] + (userLocation[1] - startPos[1]) * progress;
            setAmbPos([currentLat, currentLon]);
            if (progress === 1) clearInterval(interval);
          }, 500);
        }
      } else {
        setAmbPos(null);
        setAmbRoute(null);
      }
    }

    initAmbulance();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [dispatched, userLocation]);

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer center={center} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <FlyTo center={center} />

        {/* User marker */}
        <Marker position={userLocation} icon={userIcon}>
          <Popup className="font-semibold">You are here</Popup>
        </Marker>

        {/* Pickup marker */}
        {pickupLocation && (
          <Marker position={pickupLocation} icon={userIcon}>
            <Popup className="font-semibold">Pickup Location</Popup>
          </Marker>
        )}

        {/* Removed volunteer markers section */}

        {/* Hospital markers */}
        {activeTab === 'hospitals' &&
          hospitals.map((h) => (
            <Marker key={h.id} position={h.pos} icon={redIcon}>
              <Popup>
                <strong>{h.name}</strong>
                <br />
                ICU Beds: {h.beds}
              </Popup>
            </Marker>
          ))}

        {/* Live Ambulance Tracker */}
        {dispatched && ambRoute && (
          <Polyline positions={ambRoute} color="#ef4444" dashArray="8, 12" weight={4} />
        )}
        {dispatched && ambPos && (
          <Marker position={ambPos} icon={ambulanceIcon} zIndexOffset={1000}>
            <Popup className="font-bold">
              ALS Unit En Route<br />
              <span className="text-gray-500 font-normal">MP09-1234</span>
            </Popup>
          </Marker>
        )}

        {/* Hospital route polyline */}
        {hospitalRoute && <Polyline positions={hospitalRoute} color="#2563eb" dashArray="8, 12" weight={4} />}
      </MapContainer>
    </div>
  );
}

export default memo(MapView);
