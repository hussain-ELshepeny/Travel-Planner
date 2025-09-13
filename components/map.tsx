"use client";
import "leaflet/dist/leaflet.css";
import { Location as PrismaLocation } from "@/app/generated/prisma";
import { MapContainer, TileLayer, useMap, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";

// @ts-expect-error ddd
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});
interface MapProps {
  iteneraries: PrismaLocation[];
}
export default function Map({ iteneraries }: MapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ height: "400px" }}>Loading map...</div>;
  }

  function FitBounds({ iteneraries }: { iteneraries: PrismaLocation[] }) {
    const map = useMap();

    useEffect(() => {
      if (iteneraries.length > 0) {
        const bounds = iteneraries.map((loc) => [loc.lat, loc.lng]) as [
          number,
          number
        ][];
        map.fitBounds(bounds);
      }
    }, [iteneraries, map]);

    return null;
  }
  return (
    <div id="map" style={{ height: "400px", width: "100%" }}>
      <MapContainer center={[0, 0]} zoom={2} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {iteneraries.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>{loc.locationTitle}</Popup>
          </Marker>
        ))}
        <FitBounds iteneraries={iteneraries} />
      </MapContainer>
    </div>
  );
}
