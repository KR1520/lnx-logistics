"use client";

import { useState } from "react";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [delivery, setDelivery] = useState("");
  const [searchId, setSearchId] = useState("");
  const [result, setResult] = useState(null);

  const createShipment = async () => {
    if (!pickup || !delivery) {
      alert("Enter pickup and delivery");
      return;
    }

    const res = await fetch("/api/shipment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pickup, delivery }),
    });

    const data = await res.json();
    setResult(data);

    setPickup("");
    setDelivery("");
    setSearchId("");
  };

  const trackShipment = async () => {
    if (!searchId) {
      setResult({ error: "Enter shipment ID first" });
      return;
    }

    const res = await fetch("/api/shipment");
    const data = await res.json();

    const found = data.find((s) => s.id === searchId.trim());

    setResult(found || { error: "Shipment not found" });
  };

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>LNX Logistics</h1>
        <p style={styles.subtitle}>Smart 5PL Supply Chain Platform</p>

        <a href="/admin" style={styles.adminBtn}>
          Admin Dashboard
        </a>
      </div>

      {/* GRID */}
      <div style={styles.grid}>

        {/* CREATE */}
        <div style={styles.card}>
          <h2>📦 Create Shipment</h2>

          <input
            placeholder="Pickup Location"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Delivery Location"
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            style={styles.input}
          />

          <button onClick={createShipment} style={styles.primaryBtn}>
            Create Shipment
          </button>
        </div>

        {/* TRACK */}
        <div style={styles.card}>
          <h2>🔍 Track Shipment</h2>

          <input
            placeholder="Enter Shipment ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={styles.input}
          />

          <button onClick={trackShipment} style={styles.primaryBtn}>
            Track Now
          </button>
        </div>

      </div>

      {/* RESULT */}
      <div style={styles.resultBox}>
        <h3>Live Tracking</h3>
        <pre style={styles.pre}>
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #050816, #0f172a)",
    color: "white",
    padding: "40px",
    fontFamily: "Arial",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "42px",
    fontWeight: "bold",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "15px",
  },

  adminBtn: {
    display: "inline-block",
    padding: "10px 18px",
    background: "#2563eb",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255,255,255,0.1)",
  },

  input: {
    display: "block",
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none",
  },

  primaryBtn: {
    padding: "12px 18px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },

  resultBox: {
    marginTop: "30px",
    background: "rgba(255,255,255,0.05)",
    padding: "20px",
    borderRadius: "12px",
  },

  pre: {
    color: "#a5b4fc",
  },
};