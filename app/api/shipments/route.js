export async function POST(req) {
  const { pickup, delivery, weight, type, urgency } = await req.json();

  // 🔥 MODE SELECTION LOGIC
  let mode = "road";

  if (pickup !== delivery && delivery.includes("China")) {
    mode = "sea";
  }

  if (urgency === "high" || type === "pharma") {
    mode = "air";
  }

  // 🔥 COST CALCULATION
  let cost = 0;

  if (mode === "road") cost = 50 * weight;
  if (mode === "sea") cost = 20 * weight;
  if (mode === "air") cost = 120 * weight;

  const shipment = {
    id: "LNX-" + Math.floor(Math.random() * 1000000),
    pickup,
    delivery,
    weight,
    type,
    urgency,
    mode,
    cost,
    status: "Booked",
  };

  return Response.json(shipment);
}