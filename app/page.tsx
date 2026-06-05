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
  const [result, setResult] = useState<any>(null);

  // 🚀 CREATE SHIPMENT
  const createShipment = async () => {
    if (!pickup || !delivery || !weight || !email) {
      alert("Fill all fields");
      return;
    }

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
    setResult(data);
    setTrackingId(data.id);

    // 📧 CALL EMAIL API
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({
        email,
        id: data.id,
      }),
    });
  };

  // 🔍 TRACK SHIPMENT
  const trackShipment = async () => {
    if (!trackingId) {
      alert("Enter tracking ID");
      return;
    }

    const res = await fetch("/api/shipments");
    const all = await res.json();

    const found = all.find((s: any) => s.id === trackingId);

    if (!found) {
      alert("Shipment not found");
      return;
    }

    setResult(found);
  };

  return (
    <div style={{ padding: 30, background: "#020826", minHeight: "100vh", color: "white" }}>
      
      <h1>LNX Logistics 🚀</h1>
      <p>Multimodal AI Logistics (Road • Sea • Air)</p>

      {/* CREATE */}
      <h2>Create Shipment</h2>

      <input placeholder="Pickup" onChange={(e) => setPickup(e.target.value)} />
      <input placeholder="Delivery" onChange={(e) => setDelivery(e.target.value)} />
      <input placeholder="Weight" onChange={(e) => setWeight(e.target.value)} />
      <input placeholder="Customer Email" onChange={(e) => setEmail(e.target.value)} />

      <select onChange={(e) => setType(e.target.value)}>
        <option value="general">General</option>
        <option value="pharma">Pharma</option>
      </select>

      <select onChange={(e) => setUrgency(e.target.value)}>
        <option value="normal">Normal</option>
        <option value="high">Urgent</option>
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
        <div style={{ marginTop: 20 }}>
          <h3>ID: {result.id}</h3>
          <p>{result.pickup} → {result.delivery}</p>
          <p>Status: {result.status}</p>

          <p>
            Mode:
            {result.mode === "road" && " 🚚 Road"}
            {result.mode === "sea" && " 🚢 Sea"}
            {result.mode === "air" && " ✈️ Air"}
          </p>

          <p>Cost: ₹{result.cost}</p>

          <MapTracker
            pickup={result.pickup}
            delivery={result.delivery}
            mode={result.mode}
          />
        </div>
      )}
    </div>
  );
}