"use client";
import { useState } from "react";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);

  // ✅ CREATE SHIPMENT
  const createShipment = async () => {
  if (!pickup || !delivery) {
    alert("Enter pickup and delivery");
    return;
  }

  try {
    const res = await fetch("/api/shipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pickup, delivery }),
    });

    const data = await res.json();

    console.log("Shipment Response:", data); // 👈 IMPORTANT DEBUG

    if (data.error) {
      setResult({ error: data.error });
    } else {
      setResult(data);
    }

    setPickup("");
    setDelivery("");
    setSearchId("");
  } catch (error) {
    console.error(error);
    setResult({ error: "Failed to create shipment" });
  }
};

  // ✅ TRACK SHIPMENT
  const trackShipment = async () => {
    if (!searchId) {
      setResult({ error: "Enter shipment ID first" });
      return;
    }

    try {
      setResult(null);

      const res = await fetch("/api/shipment");
      const data = await res.json();

      const found = data.find(
        (s) => s.id.trim() === searchId.trim()
      );

      if (found) {
        setResult(found);
      } else {
        setResult({ error: "Shipment not found" });
      }
    } catch (error) {
      setResult({ error: "Something went wrong" });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "30px" }}>
        LNX Logistics 🚀
      </h1>

      {/* CREATE SHIPMENT */}
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h2>Create Shipment</h2>

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

        <button onClick={createShipment} style={btnStyle}>
          Create Shipment
        </button>
      </div>

      {/* TRACK SHIPMENT */}
      <div
        style={{
          background: "#0f172a",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h2>Track Shipment</h2>

        <input
          placeholder="Enter Shipment ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={inputStyle}
        />

        <button onClick={trackShipment} style={btnStyle}>
          Track
        </button>
      </div>

      {/* RESULT */}
      <div style={{ marginTop: "30px" }}>
        <h2>Result</h2>
        <pre
          style={{
            background: "#020617",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// STYLES
const inputStyle = {
  display: "block",
  margin: "10px 0",
  padding: "10px",
  width: "100%",
  borderRadius: "5px",
  border: "none",
};

const btnStyle = {
  marginTop: "10px",
  padding: "10px 20px",
  background: "#3b82f6",
  border: "none",
  borderRadius: "5px",
  color: "white",
  cursor: "pointer",
};