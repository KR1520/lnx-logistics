"use client";

import { useState } from "react";
import MapTracker from "./components/MapTracker";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");

  const [weight, setWeight] = useState("");
  const [type, setType] = useState("general");
  const [urgency, setUrgency] = useState("normal");

  const [trackingId, setTrackingId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🚀 CREATE SHIPMENT
  const createShipment = async () => {
    if (!pickup || !delivery || !weight) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
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
    } catch (err) {
      alert("Error creating shipment");
    }

    setLoading(false);
  };

  // 🔍 TRACK SHIPMENT (simple reuse)
  const trackShipment = () => {
    if (!trackingId || !result) {
      alert("No shipment found");
      return;
    }
  };

  return (
    <div style={{ padding: "40px", background: "#020826", minHeight: "100vh", color: "white" }}>
      
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
        LNX Logistics 🚀
      </h1>

      <p style={{ marginBottom: "30px", color: "#94a1b2" }}>
        AI Powered Multimodal Logistics (Road • Sea • Air)
      </p>

      {/* 🚚 CREATE SHIPMENT */}
      <div style={{ marginBottom: "30px" }}>
        <h2>Create Shipment</h2>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
          <input
            placeholder="Pickup (e.g. Chennai)"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
          />

          <input
            placeholder="Delivery (e.g. China)"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
          />

          <input
            placeholder="Weight (kg)"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <select onChange={(e) => setType(e.target.value)} value={type}>
            <option value="general">General</option>
            <option value="pharma">Pharma</option>
          </select>

          <select onChange={(e) => setUrgency(e.target.value)} value={urgency}>
            <option value="normal">Normal</option>
            <option value="high">Urgent</option>
          </select>

          <button onClick={createShipment}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* 📦 TRACK */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Track Shipment</h2>

        <input
          placeholder="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
        />

        <button onClick={trackShipment} style={{ marginLeft: "10px" }}>
          Track
        </button>
      </div>

      {/* 📊 RESULT */}
      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>ID: {result.id}</h3>

          <p>
            {result.pickup} → {result.delivery}
          </p>

          <p>Status: {result.status}</p>

          <p>
            Mode:{" "}
            {result.mode === "road" && "🚚 Road"}
            {result.mode === "sea" && "🚢 Sea"}
            {result.mode === "air" && "✈️ Air"}
          </p>

          <p>Cost: ₹{result.cost}</p>

          {/* 🗺 MAP */}
          <MapTracker pickup={result.pickup} delivery={result.delivery} />
        </div>
      )}
    </div>
  );
}