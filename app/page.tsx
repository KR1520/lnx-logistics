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
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          LNX Logistics 🚀
        </h1>

        {/* CREATE SHIPMENT */}
        <div className="bg-zinc-800 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Create Shipment</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Pickup Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-blue-500"
            />

            <input
              placeholder="Delivery Location"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-blue-500"
            />

            <button
              onClick={createShipment}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold transition"
            >
              Create
            </button>
          </div>
        </div>

        {/* TRACK SHIPMENT */}
        <div className="bg-zinc-800 p-6 rounded-xl mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Track Shipment</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            <input
              placeholder="Enter Tracking ID"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:border-green-500"
            />

            <button
              onClick={trackShipment}
              className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-lg font-semibold transition"
            >
              Track
            </button>
          </div>
        </div>

        {/* RESULT */}
        {result && (
          <div className="bg-zinc-800 p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-bold mb-2">Shipment Details</h3>

            <p className="mb-1">ID: {result.id}</p>
            <p className="mb-1">
              {result.pickup} → {result.delivery}
            </p>
            <p className="mb-4">Status: {result.status}</p>

            {/* MAP */}
            <MapTracker
              pickup={result.pickup}
              delivery={result.delivery}
            />
          </div>
        )}

      </div>
    </div>
  );
}