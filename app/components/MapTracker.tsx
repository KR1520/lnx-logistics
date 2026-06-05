"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function MapTracker({
  pickup,
  delivery,
}: {
  pickup: string;
  delivery: string;
}) {
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

          const route = result.routes[0].overview_path;

          let index = 0;

          const truck = new window.google.maps.Marker({
            position: route[0],
            map: map,
            icon: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
          });

          setInterval(() => {
            if (index < route.length) {
              truck.setPosition(route[index]);
              index++;
            }
          }, 700);
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
        borderRadius: "10px",
      }}
    />
  );
}