"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

/* ✅ Extend Window */
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
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapLoaded || !window.google || !pickup || !delivery || !mapRef.current) return;

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
          console.error("Directions error:", status);
        }
      }
    );
  }, [pickup, delivery, mapLoaded]);

  return (
    <>
      {/* ✅ GOOGLE MAPS SCRIPT */}
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD-QwjCnPMEuZN0-QkY3UR5aDnlC5HNjD0"
        strategy="afterInteractive"
        onLoad={() => setMapLoaded(true)}
      />

      {/* ✅ MAP CONTAINER */}
      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "400px",
          marginTop: "20px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      />
    </>
  );
}