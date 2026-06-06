"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function MapTracker({ pickup, delivery }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!pickup || !delivery) return;

    // Load script if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyD-QwjCnPMEuZN0-QkY3UR5aDnlC5HNjD0`;
      script.async = true;

      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
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
          }
        }
      );
    }
  }, [pickup, delivery]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}