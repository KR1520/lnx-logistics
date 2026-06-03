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

    await db.collection("shipments").insertOne(newShipment);

    return Response.json(newShipment);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Failed" }, { status: 500 });
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
    console.error(error);
    return Response.json({ error: "Failed" }, { status: 500 });
  }
}