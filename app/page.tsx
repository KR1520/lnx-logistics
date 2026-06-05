"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [form, setForm] = useState({
    pickup: "",
    delivery: "",
    weight: "",
    type: "general",
    urgency: "normal",
    email: "",
  });

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [created, setCreated] = useState<any>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🚀 CREATE SHIPMENT
  const createShipment = async () => {
    const res = await fetch("/api/shipments", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        weight: Number(form.weight),
      }),
    });

    const data = await res.json();

    setCreated(data);
    setTrackingId(data.id);

    // EMAIL (simulated)
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email: form.email,
        id: data.id,
      }),
    });
  };

  // 🔍 TRACK
  const trackShipment = async () => {
    const res = await fetch("/api/shipments");
    const data = await res.json();

    const found = data.find((s: any) => s.id === trackingId);

    if (!found) return alert("Invalid Tracking ID");

    setResult(found);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg,#020826,#0f172a)",
        minHeight: "100vh",
        color: "white",
        padding: 30,
      }}
    >
      <h1 style={{ fontSize: 32 }}>LNX Logistics 🚀</h1>

      {/* CREATE */}
      <div style={{ marginTop: 30 }}>
        <h2>Create Shipment</h2>

        <input name="pickup" placeholder="Pickup" onChange={handleChange} />
        <input name="delivery" placeholder="Delivery" onChange={handleChange} />
        <input name="weight" placeholder="Weight (kg)" onChange={handleChange} />
        <input name="email" placeholder="Customer Email" onChange={handleChange} />

        <select name="type" onChange={handleChange}>
          <option value="general">General Goods</option>
          <option value="pharma">Pharma</option>
          <option value="electronics">Electronics</option>
        </select>

        <select name="urgency" onChange={handleChange}>
          <option value="normal">Normal</option>
          <option value="high">Urgent</option>
        </select>

        <button onClick={createShipment}>Create Shipment</button>

        {/* SHOW CREATED */}
        {created && (
          <div style={{ marginTop: 20, background: "#111", padding: 10 }}>
            <h3>✅ Shipment Created</h3>
            <p>ID: {created.id}</p>
            <p>Status: {created.status}</p>
            <p>Mode: {created.mode}</p>
          </div>
        )}
      </div>

      {/* TRACK */}
      <div style={{ marginTop: 40 }}>
        <h2>Track Shipment</h2>

        <input
          value={trackingId}
          placeholder="Enter Tracking ID"
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
            <p>Location: {result.currentLocation}</p>

            <MapTracker shipment={result} />
          </div>
        )}
      </div>
    </div>
  );
}