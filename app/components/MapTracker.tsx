"use client";

import { useEffect, useRef, useState } from "react";

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google) {
        setLoaded(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loaded || !mapRef.current) return;

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

          let i = 0;

          const truck = new window.google.maps.Marker({
            position: route[0],
            map,
            icon: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
          });

          setInterval(() => {
            if (i < route.length) {
              truck.setPosition(route[i]);
              i++;
            }
          }, 700);
        }
      }
    );
  }, [loaded, pickup, delivery]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}