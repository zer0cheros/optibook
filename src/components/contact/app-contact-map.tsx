"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



const icon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = icon;


export default function LeafletMap() {
  return (
      <MapContainer className="lg:w-full md:w-full rounded-xl h-full border-2"
        center={[63.67085788416841, 22.6995561687818]}
        zoom={16}
        scrollWheelZoom={true}
      >
  <TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution="&copy; OpenStreetMap contributors"
/>
          <Marker position={[63.67085788416841, 22.6995561687818]}>
            <Popup>
                Vi finns här!
            </Popup>
          </Marker>
      </MapContainer>

  );
}
