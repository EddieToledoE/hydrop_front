import { NextResponse } from "next/server";
import Reading from "@/models/reading";
import { connectarBD } from "@/libs/mongodb";

// Obtiene las lecturas del sensor de temperatura
export async function GET() {
  try {
    await connectarBD();
    const sensorId = "6699defcf167387f3335e149"; // Reemplaza con el ID real del sensor de temperatura
    const readings = await Reading.find({ sensor: sensorId }).sort({ timestamp: -1 });

    if (!readings) {
      return NextResponse.json(
        { message: "Lecturas no encontradas" },
        { status: 404 }
      );
    }

    return NextResponse.json(readings);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error obteniendo las lecturas" },
      { status: 500 }
    );
  }
}
