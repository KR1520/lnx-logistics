"use client";

import { useEffect, useRef } from "react";

/* ✅ FIX TYPES */
declare global {
  interface Window {
    google: any;
  }
}

type Shipment = {
  pickup: string;
  delivery: string;
  mode: string;
  progress: number;
};

type Props = {
  shipment: Shipment;
};

export default function MapTracker({ shipment }: Props) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ❌ Prevent errors if Google not loaded
    if (
      typeof window === "undefined" ||
      !window.google ||
      !mapRef.current ||
      !shipment
    )
      return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: 20.5937, lng: 78.9629 },
    });

    const geocoder = new window.google.maps.Geocoder();

    // 🔧 Convert address → lat/lng safely
    const getLatLng = (address: string) =>
      new Promise<any>((resolve, reject) => {
        geocoder.geocode({ address }, (results: any, status: string) => {
          if (status === "OK" && results[0]) {
            resolve(results[0].geometry.location);
          } else {
            reject("Geocode failed: " + status);
          }
        });
      });

    const drawRoute = async () => {
      try {
        const start = await getLatLng(shipment.pickup);
        const end = await getLatLng(shipment.delivery);

        // 🚚 ROAD MODE
        if (shipment.mode === "road") {
          const service = new window.google.maps.DirectionsService();
          const renderer = new window.google.maps.DirectionsRenderer();

          renderer.setMap(map);

          service.route(
            {
              origin: start,
              destination: end,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result: any, status: string) => {
              if (status === "OK") {
                renderer.setDirections(result);
              } else {
                console.error("Directions error:", status);
              }
            }
          );
        }

        // ✈️ AIR / 🚢 SEA
        else {
          const line = new window.google.maps.Polyline({
            path: [start, end],
            strokeColor: "#00BFFF",
            strokeOpacity: 1,
            strokeWeight: 3,
          });

          line.setMap(map);

          // 📍 Movement simulation
          const progress = shipment.progress || 0.3;

          const lat =
            start.lat() + (end.lat() - start.lat()) * progress;

          const lng =
            start.lng() + (end.lng() - start.lng()) * progress;

          new window.google.maps.Marker({
            position: { lat, lng },
            map,
            icon:
              shipment.mode === "air"
                ? "https://maps.google.com/mapfiles/kml/shapes/airports.png"
                : "https://maps.google.com/mapfiles/kml/shapes/ferry.png",
          });
        }
      } catch (err) {
        console.error("Map error:", err);
      }
    };

    drawRoute();
  }, [shipment]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        marginTop: "20px",
      }}
    />
  );
}