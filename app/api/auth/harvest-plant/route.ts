import { NextResponse } from "next/server";
import StationPlant from "@/models/stationplant";
import { connectarBD } from "@/libs/mongodb";
import { NextRequest } from "next/server";

export async function PATCH(request: NextRequest) {
  const { plantId } = await request.json();

  if (!plantId) {
    return NextResponse.json(
      { message: "Falta el parámetro plantId" },
      { status: 400 }
    );
  }

  try {
    await connectarBD();
    const updatedPlant = await StationPlant.findByIdAndUpdate(
      plantId,
      {
        status: "harvested",
        actual_harvest_date: new Date(),
      },
      { new: true }
    );

    if (!updatedPlant) {
      return NextResponse.json(
        {
          message: "Planta no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ message: "Planta cosechada correctamente", updatedPlant });
  } catch (error) {
    console.error("Error al cosechar la planta:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
