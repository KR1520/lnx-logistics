"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);

  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: JSON.stringify({ pickup, delivery }),
    });

    const data = await res.json();
    setResult(data);
  };

  const trackShipment = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();

    const found = data.find((s) => s.id === trackingId);
    setResult(found);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>LNX Logistics 🚀</h1>

      {/* CREATE */}
      <h2>Create Shipment</h2>
      <input
        placeholder="Pickup"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
      />
      <input
        placeholder="Delivery"
        value={delivery}
        onChange={(e) => setDelivery(e.target.value)}
      />
      <button onClick={createShipment}>Create</button>

      {/* TRACK */}
      <h2>Track Shipment</h2>
      <input
        placeholder="Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
      <button onClick={trackShipment}>Track</button>

      {/* RESULT */}
      {result && (
        <div>
          <h3>ID: {result.id}</h3>
          <p>
            {result.pickup} → {result.delivery}
          </p>
          <p>Status: {result.status}</p>

          {/* MAP */}
          <MapTracker
            pickup={result.pickup}
            delivery={result.delivery}
          />
        </div>
      )}
    </div>
  );
}