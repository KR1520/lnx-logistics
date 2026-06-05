let shipments = [];

// 🚀 Decide transport mode
function getMode(weight, urgency) {
  if (urgency === "high") return "air";
  if (weight > 100) return "sea";
  return "road";
}

// 🚀 ETA logic
function getETA(mode) {
  if (mode === "air") return "2 Days";
  if (mode === "sea") return "10-15 Days";
  return "4-6 Days";
}

// 🚀 Progress simulation
function getProgress() {
  return Math.random() * 0.6 + 0.2; // 20% → 80%
}

// 🚀 Location simulation
function getCurrentLocation(pickup, delivery, progress) {
  if (progress < 0.3) return `Departed from ${pickup}`;
  if (progress < 0.6) return `In transit`;
  if (progress < 0.9) return `Near ${delivery}`;
  return `Arrived at ${delivery}`;
}

// 🚀 CREATE
export async function POST(req) {
  try {
    const body = await req.json();
    const { pickup, delivery, weight, type, urgency } = body;

    if (!pickup || !delivery || !weight) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const id = "LNX-" + Math.floor(100000 + Math.random() * 900000);

    const mode = getMode(weight, urgency);
    const progress = getProgress();

    const shipment = {
      id,
      pickup,
      delivery,
      weight,
      type,
      urgency,
      mode,
      eta: getETA(mode),
      progress,
      currentLocation: getCurrentLocation(pickup, delivery, progress),
      status: "In Transit",
    };

    shipments.push(shipment);

    return new Response(JSON.stringify(shipment), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

// 🚀 GET ALL
export async function GET() {
  return new Response(JSON.stringify(shipments), { status: 200 });
}