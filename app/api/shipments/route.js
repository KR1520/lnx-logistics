import clientPromise from "../../../lib/mongodb";

// 📍 Simulated route checkpoints
const ROUTES = {
  air: ["Hyderabad", "Dubai", "Frankfurt", "Germany"],
  sea: ["Chennai Port", "Singapore", "Rotterdam", "Germany"],
  road: ["Hyderabad", "Mumbai", "Delhi", "Germany"],
};

function getMode(weight, urgency) {
  if (urgency === "urgent") return "Air";
  if (weight > 100) return "Sea";
  return "Road";
}

function getRoute(mode) {
  return ROUTES[mode.toLowerCase()];
}

function getTemperature(productType) {
  if (productType === "pharma") {
    return (Math.random() * (8 - 2) + 2).toFixed(1); // 2–8°C
  }
  return null;
}

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      pickup,
      delivery,
      weight,
      email,
      urgency,
      productType,
    } = body;

    const id = "LNX-" + Math.floor(100000 + Math.random() * 900000);

    const mode = getMode(weight, urgency);
    const route = getRoute(mode);

    const newShipment = {
      id,
      pickup,
      delivery,
      weight,
      email,
      urgency,
      productType,
      mode,
      route,
      currentStep: 0,
      status: "Shipment Created",
      temperature: getTemperature(productType),
      eta: "5-7 days",
      createdAt: new Date(),
    };

    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    await db.collection("shipments").insertOne(newShipment);

    return new Response(JSON.stringify(newShipment), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed" }), { status: 500 });
  }
}

// 🚀 REAL-TIME UPDATE (SIMULATION ENGINE)
export async function PUT(req) {
  try {
    const { id } = await req.json();

    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    const shipment = await db.collection("shipments").findOne({ id });

    if (!shipment) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 404,
      });
    }

    let nextStep = shipment.currentStep + 1;

    if (nextStep >= shipment.route.length) {
      nextStep = shipment.route.length - 1;
    }

    const updated = {
      currentStep: nextStep,
      status:
        nextStep === shipment.route.length - 1
          ? "Delivered ✅"
          : "In Transit 🚚",
      temperature:
        shipment.productType === "pharma"
          ? (Math.random() * (8 - 2) + 2).toFixed(1)
          : null,
    };

    await db
      .collection("shipments")
      .updateOne({ id }, { $set: updated });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Update failed" }), {
      status: 500,
    });
  }
}

// 📦 FETCH SHIPMENT
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    const shipment = await db.collection("shipments").findOne({ id });

    if (!shipment) {
      return new Response(JSON.stringify({ error: "Invalid ID" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(shipment), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Fetch failed" }), {
      status: 500,
    });
  }
}