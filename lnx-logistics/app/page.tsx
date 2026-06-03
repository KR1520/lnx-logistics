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

    const found = data.find((s) => s.id === trackingId);
    setResult(found);
  };

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        LNX Logistics 🚀
      </h1>

      {/* CREATE SHIPMENT */}
      <h2>Create Shipment</h2>

      <input
        placeholder="Pickup Location"
        value={pickup}
        onChange={(e) => setPickup(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <input
        placeholder="Delivery Location"
        value={delivery}
        onChange={(e) => setDelivery(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <button onClick={createShipment} style={{ padding: "8px 12px" }}>
        Create
      </button>

      {/* TRACK SHIPMENT */}
      <h2 style={{ marginTop: "30px" }}>Track Shipment</h2>

      <input
        placeholder="Enter Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
        style={{ marginRight: "10px", padding: "8px" }}
      />

      <button onClick={trackShipment} style={{ padding: "8px 12px" }}>
        Track
      </button>

      {/* RESULT + MAP */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h3>ID: {result.id}</h3>
          <p>
            {result.pickup} → {result.delivery}
          </p>
          <p>Status: {result.status}</p>

          {/* MAP WILL SHOW HERE */}
          <MapTracker
            pickup={result.pickup}
            delivery={result.delivery}
          />
        </div>
      )}
    </div>
  );
}