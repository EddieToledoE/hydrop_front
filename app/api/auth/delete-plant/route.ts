import { NextResponse } from "next/server";
import StationPlant from "@/models/stationplant";
import { connectarBD } from "@/libs/mongodb";
import { NextRequest } from "next/server";

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plantId = searchParams.get("plantId");

  if (!plantId) {
    return NextResponse.json(
      { message: "Falta el parámetro plantId" },
      { status: 400 }
    );
  }

  try {
    await connectarBD();
    const deletedPlant = await StationPlant.findByIdAndDelete(plantId);

    if (!deletedPlant) {
      return NextResponse.json(
        {
          message: "Planta no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({ message: "Planta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la planta:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
