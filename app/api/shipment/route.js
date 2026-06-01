import clientPromise from "../../../lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { pickup, delivery } = body;

    const client = await clientPromise;
    const db = client.db("lnx-logistics");

    const newShipment = {
      id: "LNX-" + Date.now(),
      pickup,
      delivery,
      status: "Booked",
      createdAt: new Date(),
    };

    await db.collection("shipments").insertOne(newShipment);

    return Response.json(newShipment);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    );
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

    return Response.json(shipments);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch shipments" },
      { status: 500 }
    );
  }
}