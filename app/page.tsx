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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #020617, #0f172a)",
      color: "white",
      padding: "40px"
    }}>

      {/* HEADER */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "bold" }}>
          LNX Logistics
        </h1>
        <p style={{ color: "#94a3b8", marginTop: "10px" }}>
          Smart 5PL Supply Chain Platform
        </p>

        <button
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            background: "#3b82f6",
            border: "none",
            borderRadius: "8px",
            color: "white",
            cursor: "pointer"
          }}
        >
          Admin Dashboard
        </button>
      </div>

      {/* CARDS */}
      <div style={{
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        justifyContent: "center"
      }}>

        {/* CREATE */}
        <div style={{
          background: "#0f172a",
          padding: "25px",
          borderRadius: "12px",
          width: "400px"
        }}>
          <h2>📦 Create Shipment</h2>

          <input
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Delivery Location"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            style={inputStyle}
          />

          <button onClick={createShipment} style={primaryBtn}>
            Create Shipment
          </button>
        </div>

        {/* TRACK */}
        <div style={{
          background: "#0f172a",
          padding: "25px",
          borderRadius: "12px",
          width: "400px"
        }}>
          <h2>🔍 Track Shipment</h2>

          <input
            placeholder="Enter Shipment ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            style={inputStyle}
          />

          <button onClick={trackShipment} style={primaryBtn}>
            Track Now
          </button>
        </div>
      </div>

      {/* LIVE TRACKING */}
      {result && (
        <div style={{
          marginTop: "40px",
          background: "#0f172a",
          padding: "20px",
          borderRadius: "12px"
        }}>
          <h2>Live Tracking</h2>

          <pre style={{
            background: "#020617",
            padding: "15px",
            borderRadius: "8px",
            color: "#38bdf8"
          }}>
{JSON.stringify(result, null, 2)}
          </pre>

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

/* 🔹 STYLES */
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  marginBottom: "15px",
  background: "#020617",
  border: "1px solid #334155",
  borderRadius: "8px",
  color: "white"
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "8px",
  color: "white",
  cursor: "pointer"
};