import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("lnx-logistics");

   const newShipment = {
  id: "LNX-" + Math.floor(100000 + Math.random() * 900000),
  pickup: body.pickup,
  delivery: body.delivery,
  status: "Booked",
  history: [
    {
      status: "Booked",
      time: new Date(),
    },
  ],
  createdAt: new Date(),
};

   const result = await db.collection("shipments").insertOne(newShipment);

const responseData = {
  id: newShipment.id,
  pickup: newShipment.pickup,
  delivery: newShipment.delivery,
  status: newShipment.status,
  createdAt: newShipment.createdAt,
};

return Response.json(responseData);
  } catch (error) {
    console.error("POST ERROR:", error);
    return Response.json({ error: "Failed to create shipment" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("lnx-logistics");

   const shipments = await db
  .collection("shipments")
  .find({})
  .toArray();

const cleanData = shipments.map((s) => ({
  id: s.id,
  pickup: s.pickup,
  delivery: s.delivery,
  status: s.status,
  history: s.history,
  createdAt: s.createdAt,
}));

return Response.json(cleanData);
  } catch (error) {
    console.error("GET ERROR:", error);
    return Response.json({ error: "Failed to fetch shipments" }, { status: 500 });
  }
}