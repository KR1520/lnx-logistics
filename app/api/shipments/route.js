import clientPromise from "../../../lib/mongodb";

// 🚀 MODE LOGIC
function getMode(weight, urgency) {
  if (urgency === "high") return "air";
  if (weight > 100) return "sea";
  return "road";
}

// 🚀 ETA
function getETA(mode) {
  if (mode === "air") return "2 Days";
  if (mode === "sea") return "10-15 Days";
  return "4-6 Days";
}

// 🚀 PROGRESS
function getProgress() {
  return Math.random() * 0.6 + 0.2;
}

// 🚀 LOCATION
function getLocation(pickup, delivery, progress) {
  if (progress < 0.3) return `Departed from ${pickup}`;
  if (progress < 0.6) return `In transit`;
  if (progress < 0.9) return `Near ${delivery}`;
  return `Arrived at ${delivery}`;
}

// 🚀 CREATE SHIPMENT
export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    const body = await req.json();
    const { pickup, delivery, weight, type, urgency } = body;

    if (!pickup || !delivery || !weight) {
      return new Response(
        JSON.stringify({ error: "Missing fields" }),
        { status: 400 }
      );
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
      currentLocation: getLocation(pickup, delivery, progress),
      status: "In Transit",
      createdAt: new Date(),
    };

    await db.collection("shipments").insertOne(shipment);

    return new Response(JSON.stringify(shipment), { status: 200 });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}

// 🚀 GET ALL SHIPMENTS (TRACK + ADMIN)
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    const shipments = await db
      .collection("shipments")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return new Response(JSON.stringify(shipments), { status: 200 });

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}