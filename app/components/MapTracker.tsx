"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function MapTracker({ pickup, delivery, mode }: any) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: 20.5937, lng: 78.9629 },
    });

    // 🚚 ROAD
    if (mode === "road") {
      const service = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(map);

      service.route(
        {
          origin: pickup,
          destination: delivery,
          travelMode: "DRIVING",
        },
        (res: any, status: string) => {
          if (status === "OK") renderer.setDirections(res);
        }
      );
    }

    // ✈️ AIR
    if (mode === "air") {
      const line = new window.google.maps.Polyline({
        path: [
          { lat: 20, lng: 70 },
          { lat: 35, lng: 100 },
        ],
        strokeColor: "#00f",
      });

      line.setMap(map);

      new window.google.maps.Marker({
        position: { lat: 28, lng: 85 },
        map,
        icon: "https://maps.google.com/mapfiles/kml/shapes/airports.png",
      });
    }

    // 🚢 SEA
    if (mode === "sea") {
      const line = new window.google.maps.Polyline({
        path: [
          { lat: 13, lng: 80 },
          { lat: 31, lng: 121 },
        ],
        strokeColor: "#00ffff",
      });

      line.setMap(map);

      new window.google.maps.Marker({
        position: { lat: 20, lng: 100 },
        map,
        icon: "https://maps.google.com/mapfiles/kml/shapes/ferry.png",
      });
    }

  }, [pickup, delivery, mode]);

  return <div ref={mapRef} style={{ height: "400px", marginTop: "20px" }} />;
}