import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("logistics");

  const shipments = await db.collection("shipments").find({}).toArray();

  return Response.json(shipments);
}

export async function POST(req) {
  const body = await req.json();

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
}