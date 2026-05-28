let shipments = [];

export async function POST(req) {
  const body = await req.json();

  const shipment = {
    id: "LNX-" + Date.now(),
    pickup: body.pickup,
    delivery: body.delivery,
    status: "Booked",
    stages: [
      { step: "Booked", time: new Date().toISOString() }
    ]
  };

  shipments.push(shipment);

  return Response.json(shipment);
}

export async function GET() {
  return Response.json(shipments);
}

export async function PATCH(req) {
  const body = await req.json();

  const shipment = shipments.find((s) => s.id === body.id);

  if (!shipment) {
    return Response.json({ error: "Not found" });
  }

  shipment.status = body.status;

  shipment.stages.push({
    step: body.status,
    time: new Date().toISOString()
  });

  return Response.json(shipment);
}