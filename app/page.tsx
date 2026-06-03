"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

/* ✅ TYPE DEFINE */
type Shipment = {
  id: string;
  pickup: string;
  delivery: string;
  status: string;
  history?: { status: string; time: string }[];
  createdAt: string;
};

export default function Home() {
  const [pickup, setPickup] = useState<string>("");
  const [delivery, setDelivery] = useState<string>("");
  const [trackingId, setTrackingId] = useState<string>("");
  const [result, setResult] = useState<Shipment | null>(null);

  const createShipment = async () => {
    try {
      const res = await fetch("/api/shipments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pickup, delivery }),
      });

      const data: Shipment = await res.json();

      alert("✅ Shipment Created: " + data.id);
      setResult(data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to create shipment");
    }
  };

  const trackShipment = async () => {
    try {
      const res = await fetch("/api/shipments");
      const data: Shipment[] = await res.json();

      const found = data.find(
        (s: Shipment) => s.id.trim() === trackingId.trim()
      );

      if (!found) {
        alert("❌ Shipment not found");
        return;
      }

      setResult(found);
    } catch (err) {
      console.error(err);
      alert("❌ Tracking failed");
    }
  };

  return (
    <div style={{ padding: "40px", background: "#020617", color: "white" }}>
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
        <div style={{ marginTop: "20px" }}>
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