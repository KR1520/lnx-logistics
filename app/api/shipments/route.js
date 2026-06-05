let shipments = [];

// 🔧 Helper: Decide transport mode
function getMode(weight, urgency) {
  if (urgency === "high") return "air";
  if (weight > 100) return "sea";
  return "road";
}

// 🔧 Helper: ETA
function getETA(mode) {
  if (mode === "air") return "2 Days";
  if (mode === "sea") return "10-15 Days";
  return "4-6 Days";
}

// 🔧 Helper: Progress simulation
function getProgress() {
  return Math.random() * 0.7 + 0.1; // 10% → 80%
}

// 🔧 Helper: Current location simulation
function getCurrentLocation(pickup, delivery, progress) {
  if (progress < 0.3) return `Departed from ${pickup}`;
  if (progress < 0.6) return `In transit between ${pickup} → ${delivery}`;
  if (progress < 0.9) return `Near destination (${delivery})`;
  return `Arrived at ${delivery}`;
}

// 🚀 CREATE SHIPMENT
export async function POST(req) {
  try {
    const body = await req.json();
    const { pickup, delivery, weight, type, urgency } = body;

    if (!pickup || !delivery || !weight) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    const id = "LNX-" + Math.floor(100000 + Math.random() * 900000);

    const mode = getMode(weight, urgency);
    const eta = getETA(mode);
    const progress = getProgress();
    const currentLocation = getCurrentLocation(pickup, delivery, progress);

    const shipment = {
      id,
      pickup,
      delivery,
      weight,
      type,
      urgency,
      mode,
      eta,
      progress,
      currentLocation,
      status: "In Transit",
      createdAt: new Date().toISOString(),
    };

    shipments.push(shipment);

    return new Response(JSON.stringify(shipment), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}

// 🔍 GET ALL SHIPMENTS
export async function GET() {
  return new Response(JSON.stringify(shipments), { status: 200 });
}