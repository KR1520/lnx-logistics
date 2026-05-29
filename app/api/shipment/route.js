import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("logistics");

    const shipments = await db
      .collection("shipments")
      .find({})
      .toArray();

    return Response.json(shipments);
  } catch (error) {
    return Response.json({ error: "Failed to fetch shipments" });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    if (!body.pickup || !body.delivery) {
      return Response.json({ error: "Missing fields" });
    }

    const client = await clientPromise;
    const db = client.db("logistics");

    const newShipment = {
      id: "LNX-" + Date.now(),
      pickup: body.pickup,
      delivery: body.delivery,
      status: "Booked",
      stages: [
        {
          step: "Booked",
          time: new Date().toISOString(),
        },
      ],
    };

    await db.collection("shipments").insertOne(newShipment);

    return Response.json(newShipment);
  } catch (error) {
    return Response.json({ error: "Failed to create shipment" });
  }
}