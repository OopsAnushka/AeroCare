import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import '../styles/globals.css';

// Dynamically import the map to avoid SSR issues
const MapWithNoSSR = dynamic(() => import('../app/components/MapCard'), { ssr: false });

export default function SOSPage() {
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('idle');
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Try to fetch location on load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCoords({ lat: latitude, lon: longitude });
        },
        (e) => {
          setErr(e.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setErr('Geolocation is not supported by this browser.');
    }
  }, []);

  const triggerSOS = async () => {
    if (!coords) {
      setErr('Location not available yet.');
      return;
    }
    setStatus('sending');
    try {
      const resp = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'BLS',
          lat: coords.lat,
          lon: coords.lon,
        }),
      });
      const data = await resp.json();
      if (data?.dispatch) {
        setStatus('sent');
        // You can subscribe to a WebSocket for updates here
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="sos-page">
      <Head>
        <title>AeroCare – SOS</title>
        <meta name="description" content="One-tap emergency SOS with offline-ready support." />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <main className="container">
        <h1>One-Tap SOS</h1>
        <p>Swipe or tap to send an emergency request. Location is used to dispatch the nearest ambulance.</p>

        <div className="cta-area">
          <button className="sos-btn" onClick={triggerSOS} aria-label="Send SOS">
            Swipe to SOS (or Tap)
          </button>
          <div className="hint">No login required. Coordinates are sent for dispatch.</div>
        </div>

        {coords && (
          <MapWithNoSSR center={[coords.lat, coords.lon]} marker={[coords.lat, coords.lon]} />
        )}
        {err && <div className="error">Error: {err}</div>}
        {status && <div className="status">Status: {status}</div>}
      </main>
    </div>
  );
}