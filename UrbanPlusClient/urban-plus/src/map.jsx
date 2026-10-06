import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// תיקון נתיבי התמונות של הסמן ב-React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// רכיב עזר שמעדכן את מרכז המפה
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function Map() {
  const [position, setPosition] = useState([32.0853, 34.7818]);
  const [loading, setLoading] = useState(true);

  // רשימת דוגמה של מפגעים ברחוב
  const [hazards, setHazards] = useState([
    {
      id: 1,
      lat: 32.0860,
      lng: 34.7820,
      type: "בור בכביש",
      description: "בור עמוק בנתיב הימני"
    },
    {
      id: 2,
      lat: 32.0845,
      lng: 34.7805,
      type: "תאורת רחוב מקולקלת",
      description: "פנס רחוב כבוי בלילה"
    },
    {
      id: 3,
      lat: 32.0870,
      lng: 34.7830,
      type: "מדרכה שבורה",
      description: "אבנים משתלבות רופפות"
    }
  ]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
          setLoading(false);
        },
        (err) => {
          console.error("שגיאה באיתור מיקום:", err);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>

      <MapContainer
        center={position}
        zoom={19}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >

        <ChangeView center={position} />

        {/* שכבת מפה */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* סמן למיקום הנוכחי של המשתמש */}
        <Marker position={position}>
          <Popup>
            {loading ? "מאתר מיקום..." : "המיקום הנוכחי שלך"}
          </Popup>
        </Marker>

        {/* הצגת סמני המפגעים */}
        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            position={[hazard.lat, hazard.lng]}
          >
            <Popup>
              <div
                style={{
                  direction: 'rtl',
                  textAlign: 'right'
                }}
              >
                <h3 style={{ margin: '0 0 5px 0' }}>
                  {hazard.type}
                </h3>

                <p style={{ margin: 0 }}>
                  {hazard.description}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* כפתור דיווח על מפגע */}
      <button
        onClick={() => window.location.href = "/createReport"}
        style={{
          position: 'fixed',
          bottom: '25px',
          left: '25px',
          padding: '14px 25px',
          border: 'none',
          borderRadius: '30px',
          backgroundColor: 'white',
          color: '#333',
          fontSize: '16px',
          fontWeight: 'bold',
          boxShadow: '0 3px 12px rgba(0, 0, 0, 0.25)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        דיווח על מפגע
      </button>

    </div>
  );
}

export default Map;