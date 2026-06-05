"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export default function MapTracker({ shipment }: any) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 4,
      center: { lat: 20.5937, lng: 78.9629 },
    });

    const geocoder = new window.google.maps.Geocoder();

    const getLatLng = (address: string) =>
      new Promise<any>((resolve) => {
        geocoder.geocode({ address }, (res: any, status: string) => {
          if (status === "OK") resolve(res[0].geometry.location);
        });
      });

    const draw = async () => {
      const start = await getLatLng(shipment.pickup);
      const end = await getLatLng(shipment.delivery);

      if (shipment.mode === "road") {
        const service = new window.google.maps.DirectionsService();
        const renderer = new window.google.maps.DirectionsRenderer();

        renderer.setMap(map);

        service.route(
          {
            origin: start,
            destination: end,
            travelMode: "DRIVING",
          },
          (res: any, status: string) => {
            if (status === "OK") renderer.setDirections(res);
          }
        );
      } else {
        const line = new window.google.maps.Polyline({
          path: [start, end],
          strokeColor: "#00f",
          strokeWeight: 2,
        });

        line.setMap(map);

        const progress = shipment.progress || 0.3;

        const lat = start.lat() + (end.lat() - start.lat()) * progress;
        const lng = start.lng() + (end.lng() - start.lng()) * progress;

        new window.google.maps.Marker({
          position: { lat, lng },
          map,
          icon:
            shipment.mode === "air"
              ? "https://maps.google.com/mapfiles/kml/shapes/airports.png"
              : "https://maps.google.com/mapfiles/kml/shapes/ferry.png",
        });
      }
    };

    draw();
  }, [shipment]);

  return <div ref={mapRef} style={{ height: "400px" }} />;
}