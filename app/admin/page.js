"use client";
import { useEffect, useState } from "react";

export default function Admin() {
  const [shipments, setShipments] = useState([]);

  useEffect(() => {
    fetch("/api/shipment")
      .then(res => res.json())
      .then(data => setShipments(data));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch("/api/shipment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    location.reload();
  };

  return (
    <div style={{ padding: 30, background: "#0f172a", color: "white" }}>
      <h1>Admin Panel 🚀</h1>

      {shipments.map((s) => (
        <div key={s.id} style={{ marginBottom: 20, border: "1px solid gray", padding: 10 }}>
          <p><b>ID:</b> {s.id}</p>
          <p>{s.pickup} → {s.delivery}</p>
          <p>Status: {s.status}</p>

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
  <button onClick={() => updateStatus(s.id, "Picked Up")}>Picked</button>
  <button onClick={() => updateStatus(s.id, "In Transit")}>Transit</button>
  <button onClick={() => updateStatus(s.id, "Delivered")}>Delivered</button>
</div>
        </div>
      ))}
    </div>
  );
}