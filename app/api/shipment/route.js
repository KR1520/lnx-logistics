let shipments = [];

export async function GET() {
  return Response.json(shipments);
}

export async function POST(req) {
  const body = await req.json();

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

  shipments.push(newShipment);

  return Response.json(newShipment);
}