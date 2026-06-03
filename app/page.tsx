"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);

  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pickup, delivery }),
    });

    const data = await res.json();
    setResult(data);
  };

  const trackShipment = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();

    const found = data.find((s: any) => s.id === trackingId);
    setResult(found);
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>LNX Logistics 🚀</h1>

      <h2>Create Shipment</h2>
      <input value={pickup} onChange={(e) => setPickup(e.target.value)} />
      <input value={delivery} onChange={(e) => setDelivery(e.target.value)} />
      <button onClick={createShipment}>Create</button>

      <h2>Track Shipment</h2>
      <input
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />
      <button onClick={trackShipment}>Track</button>

      {result && (
        <div>
          <h3>{result.id}</h3>
          <p>
            {result.pickup} → {result.delivery}
          </p>

          <MapTracker pickup={result.pickup} delivery={result.delivery} />
        </div>
      )}
    </div>
  );
}