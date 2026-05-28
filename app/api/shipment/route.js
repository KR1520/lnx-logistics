let shipments = [];

export async function GET() {
  return Response.json(shipments);
}

export async function POST(req) {
  const body = await req.json();

  const newShipment = {
    id: Date.now().toString(),
    pickup: body.pickup,
    delivery: body.delivery,
    status: "Created",
    time: new Date().toISOString()
  };

  shipments.push(newShipment);

  return Response.json(newShipment);
}