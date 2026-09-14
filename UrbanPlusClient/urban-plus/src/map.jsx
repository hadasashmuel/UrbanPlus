import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import './App.css';

// רכיב עזר שמעדכן את מרכז המפה ברגע שהמיקום משתנה
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

function Map() {
  // ברירת מחדל זמנית (תל אביב) עד שהדפדפן יחזיר את המיקום האמיתי
  const [position, setPosition] = useState([32.0853, 34.7818]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // בדיקה האם הדפדפן תומך באיתור מיקום
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
        zoom={13}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <ChangeView center={position} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <Marker position={position}>
          <Popup>
            {loading ? "מאיתור מיקום..." : "המיקום הנוכחי שלך!"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Map;