
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "../App.css";

// הגדרת האייקון של הסמנים במפה
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// מבנה של מפגע
type Hazard = {
  id: number;
  lat: number;
  lng: number;
  type: string;
  description: string;
};

// עדכון מרכז המפה כאשר המיקום משתנה
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}

function Map() {
  // מיקום ברירת מחדל - תל אביב
  const [position, setPosition] = useState<[number, number]>([
    32.0853,
    34.7818,
  ]);

  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  // רשימת המפגעים במפה
  const [hazards] = useState<Hazard[]>([
    {
      id: 1,
      lat: 32.086,
      lng: 34.782,
      type: "בור בכביש",
      description: "בור עמוק בנתיב הימני",
    },
    {
      id: 2,
      lat: 32.0845,
      lng: 34.7805,
      type: "תאורת רחוב מקולקלת",
      description: "פנס רחוב כבוי בלילה",
    },
    {
      id: 3,
      lat: 32.087,
      lng: 34.783,
      type: "מדרכה שבורה",
      description: "אבנים משתלבות רופפות",
    },
  ]);

  // איתור המיקום הנוכחי של המשתמש
  useEffect(() => {
    let active = true;

    // בדיקה אם הדפדפן תומך באיתור מיקום
    if (!navigator.geolocation) {
      setLocationError("הדפדפן אינו תומך באיתור מיקום");
      setLoading(false);

      return () => {
        active = false;
      };
    }

    // בקשת הרשאה לקבלת המיקום
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (!active) return;

        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);

        setLoading(false);
        setLocationError("");
      },
      (err) => {
        if (!active) return;

        console.error("שגיאה באיתור מיקום:", err);

        setLocationError(
          err.code === 1
            ? "לא ניתנה הרשאה לאיתור המיקום"
            : "לא הצלחנו לאתר את המיקום שלך"
        );

        setLoading(false);
      }
    );

    // ניקוי כאשר הקומפוננטה יוצאת מהמסך
    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {locationError && (
        <div
          style={{
            position: "absolute",
            top: "80px",
            right: "20px",
            zIndex: 1000,
            background: "white",
            padding: "12px 18px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            direction: "rtl",
          }}
          role="status"
        >
          {locationError}
        </div>
      )}

      <MapContainer
        center={position}
        zoom={19}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <ChangeView center={position} />

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* סימון המיקום הנוכחי */}
        <Marker position={position}>
          <Popup>
            {loading
              ? "מאתר מיקום..."
              : locationError
                ? "מיקום ברירת מחדל"
                : "המיקום הנוכחי שלך"}
          </Popup>
        </Marker>

        {/* הצגת כל המפגעים */}
        {hazards.map((hazard) => (
          <Marker
            key={hazard.id}
            position={[hazard.lat, hazard.lng]}
          >
            <Popup>
              <div style={{ direction: "rtl", textAlign: "right" }}>
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
