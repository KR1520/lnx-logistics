"use client";

import { useEffect, useRef } from "react";

export default function MapTracker({ pickup, delivery }) {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.google) {
      console.log("Google not loaded");
      return;
    }

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: { lat: 20.5937, lng: 78.9629 }, // India center
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      suppressMarkers: false,
    });

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: pickup,
        destination: delivery,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
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
        } else {
          console.log("Directions error:", status);
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