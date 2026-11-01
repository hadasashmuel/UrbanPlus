import { useState, useEffect } from 'react';
import { MapContainer, TileLayer,Marker, Popup, useMap,} from 'react-leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

import "../App.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

type Hazard = {
  id: number;
  lat: number;
  lng: number;
  type: string;
  description: string;
};

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

function Map() {
  const [position, setPosition] = useState<[number, number]>([
    32.0853,
    34.7818,
  ]);

  const [loading, setLoading] = useState(true);

  const [hazards] = useState<Hazard[]>([
    {
      id: 1,
      lat: 32.086,
      lng: 34.782,
      type: 'בור בכביש',
      description: 'בור עמוק בנתיב הימני',
    },
    {
      id: 2,
      lat: 32.0845,
      lng: 34.7805,
      type: 'תאורת רחוב מקולקלת',
      description: 'פנס רחוב כבוי בלילה',
    },
    {
      id: 3,
      lat: 32.087,
      lng: 34.783,
      type: 'מדרכה שבורה',
      description: 'אבנים משתלבות רופפות',
    },
  ]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
        setLoading(false);
      },
      (err) => {
        console.error('שגיאה באיתור מיקום:', err);
        setLoading(false);
      }
    );
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <MapContainer
        center={position}
        zoom={19}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={position} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>
            {loading ? 'מאתר מיקום...' : 'המיקום הנוכחי שלך'}
          </Popup>
        </Marker>

        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            position={[hazard.lat, hazard.lng]}
          >
            <Popup>
              <div style={{ direction: 'rtl', textAlign: 'right' }}>
                <h3>{hazard.type}</h3>
                <p>{hazard.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Map;
