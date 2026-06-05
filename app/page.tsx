"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [weight, setWeight] = useState("");
  const [urgency, setUrgency] = useState("normal");
  const [email, setEmail] = useState("");

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);

  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: JSON.stringify({
        pickup,
        delivery,
        weight: Number(weight),
        urgency,
      }),
    });

    const data = await res.json();

    alert("Shipment Created: " + data.id);

    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email,
        id: data.id,
      }),
    });
  };

  const trackShipment = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();

    const found = data.find((s: any) => s.id === trackingId);

    if (!found) {
      alert("Invalid Tracking ID");
      return;
    }

    setResult(found);
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>LNX Logistics 🚀</h1>

      <h2>Create Shipment</h2>

      <input placeholder="Pickup" onChange={(e) => setPickup(e.target.value)} />
      <input placeholder="Delivery" onChange={(e) => setDelivery(e.target.value)} />
      <input placeholder="Weight" onChange={(e) => setWeight(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

      <select onChange={(e) => setUrgency(e.target.value)}>
        <option value="normal">Normal</option>
        <option value="high">Urgent</option>
      </select>

      <button onClick={createShipment}>Create</button>

      <h2>Track Shipment</h2>

      <input
        placeholder="Tracking ID"
        onChange={(e) => setTrackingId(e.target.value)}
      />

      <button onClick={trackShipment}>Track</button>

      {result && (
        <>
          <h3>ID: {result.id}</h3>
          <p>{result.pickup} → {result.delivery}</p>
          <p>Status: {result.status}</p>
          <p>Mode: {result.mode}</p>
          <p>ETA: {result.eta}</p>
          <p>Current: {result.currentLocation}</p>

          <MapTracker shipment={result} />
        </>
      )}
    </div>
  );
}