"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [weight, setWeight] = useState("");
  const [email, setEmail] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [productType, setProductType] = useState("general");

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);

  // 🚀 CREATE SHIPMENT
  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: JSON.stringify({
        pickup,
        delivery,
        weight,
        email,
        urgency,
        productType,
      }),
    });

    const data = await res.json();
    setResult(data);

    alert("Shipment Created! ID: " + data.id);
  };

  // 🚀 TRACK SHIPMENT (IMPORTANT FIX)
  const trackShipment = async () => {
    if (!trackingId) return alert("Enter Tracking ID");

    const res = await fetch(`/api/shipments?id=${trackingId}`);
    const data = await res.json();

    if (data.error) {
      alert("Invalid Tracking ID");
      return;
    }

    setResult(data);
  };

  return (
    <div style={{ padding: "20px", background: "#020c1b", color: "white" }}>
      <h1>LNX Logistics 🚀</h1>

      {/* CREATE */}
      <h2>Create Shipment</h2>

      <input placeholder="Pickup" onChange={(e) => setPickup(e.target.value)} />
      <input placeholder="Delivery" onChange={(e) => setDelivery(e.target.value)} />
      <input placeholder="Weight" onChange={(e) => setWeight(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <select onChange={(e) => setUrgency(e.target.value)}>
        <option value="normal">Normal</option>
        <option value="urgent">Urgent</option>
      </select>

      <select onChange={(e) => setProductType(e.target.value)}>
        <option value="general">General</option>
        <option value="pharma">Pharma</option>
      </select>

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
          <p>{result.pickup} → {result.delivery}</p>
          <p>Status: {result.status}</p>
          <p>Mode: {result.mode}</p>
          <p>ETA: {result.eta}</p>

          {result.productType === "pharma" && (
            <p>🌡 Temp: {result.temperature}°C</p>
          )}

          {/* 🚀 MAP FIX */}
          <MapTracker
            pickup={result.pickup}
            delivery={result.delivery}
          />
        </div>
      )}
    </div>
  );
}