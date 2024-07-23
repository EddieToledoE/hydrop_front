import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import { connectarBD } from "@/libs/mongodb";

// Agrega un nuevo sensor a un sistema hidropónico
export async function PATCH(request: Request) {
  const { systemId, type, name } = await request.json();

  try {
    await connectarBD();

    const system = await HydroponicSystem.findById(systemId);

    if (!system) {
      return NextResponse.json(
        { message: "Sistema hidropónico no encontrado" },
        { status: 404 }
      );
    }

    system.sensors.push({ type, readings: [] });
    await system.save();

    return NextResponse.json(system);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error al agregar el sensor" },
      { status: 500 }
    );
  }
}
