"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("general");
  const [urgency, setUrgency] = useState("normal");
  const [email, setEmail] = useState("");

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState(null);

  // 🚀 CREATE
  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: JSON.stringify({
        pickup,
        delivery,
        weight: Number(weight),
        type,
        urgency,
      }),
    });

    const data = await res.json();

    alert(`Shipment Created: ${data.id}`);

    // DO NOT AUTO SHOW RESULT
    setTrackingId("");
    setResult(null);

    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email,
        id: data.id,
      }),
    });
  };

  // 🔍 TRACK ONLY ON BUTTON
  const trackShipment = async () => {
    if (!trackingId) return alert("Enter Tracking ID");

    const res = await fetch("/api/shipments");
    const all = await res.json();

    const found = all.find((s) => s.id === trackingId);

    if (!found) return alert("Not found");

    setResult(found);
  };

  return (
    <div style={{ padding: 30, background: "#020826", color: "white" }}>
      <h1>LNX Logistics 🚀</h1>

      <h2>Create Shipment</h2>

      <input placeholder="Pickup" onChange={(e) => setPickup(e.target.value)} />
      <input placeholder="Delivery" onChange={(e) => setDelivery(e.target.value)} />
      <input placeholder="Weight" onChange={(e) => setWeight(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="general">General</option>
        <option value="pharma">Pharma</option>
      </select>

      <select onChange={(e) => setUrgency(e.target.value)}>
        <option value="normal">Normal</option>
        <option value="high">Urgent</option>
      </select>

      <button onClick={createShipment}>Create</button>

      <h2>Track Shipment</h2>

      <input
        placeholder="Tracking ID"
        value={trackingId}
        onChange={(e) => setTrackingId(e.target.value)}
      />

      <button onClick={trackShipment}>Track</button>

      {result && (
        <div style={{ marginTop: 20 }}>
          <h3>ID: {result.id}</h3>
          <p>{result.pickup} → {result.delivery}</p>
          <p>Status: {result.status}</p>
          <p>Mode: {result.mode}</p>
          <p>ETA: {result.eta}</p>

          <h4>Current Location: {result.currentLocation}</h4>

          <MapTracker shipment={result} />
        </div>
      )}
    </div>
  );
}