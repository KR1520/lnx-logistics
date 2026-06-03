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
    <div style={{ padding: "40px", background: "#000", color: "#fff", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "30px" }}>
        LNX Logistics 🚀
      </h1>

      {/* CREATE SHIPMENT */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Create Shipment</h2>

        <input
          placeholder="Pickup Location"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            background: "#111",
            border: "1px solid #333",
            color: "white",
          }}
        />

        <input
          placeholder="Delivery Location"
          value={delivery}
          onChange={(e) => setDelivery(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            background: "#111",
            border: "1px solid #333",
            color: "white",
          }}
        />

        <button
          onClick={createShipment}
          style={{
            padding: "10px 15px",
            background: "#2563eb",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Create
        </button>
      </div>

      {/* TRACK SHIPMENT */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Track Shipment</h2>

        <input
          placeholder="Enter Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          style={{
            padding: "10px",
            marginRight: "10px",
            background: "#111",
            border: "1px solid #333",
            color: "white",
          }}
        />

        <button
          onClick={trackShipment}
          style={{
            padding: "10px 15px",
            background: "#16a34a",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Track
        </button>
      </div>

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