"use client";

import { useEffect, useRef } from "react";

/* ✅ FIX: extend Window type */
declare global {
  interface Window {
    google: any;
  }
}

/* ✅ TYPES */
type MapTrackerProps = {
  pickup: string;
  delivery: string;
};

export default function MapTracker({ pickup, delivery }: MapTrackerProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.google || !pickup || !delivery || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 20.5937, lng: 78.9629 },
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: pickup,
        destination: delivery,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result: any, status: string) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        } else {
          console.log("Map error:", status);
        }
      }
    );
  }, [pickup, delivery]);

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