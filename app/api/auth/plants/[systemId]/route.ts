import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import { connectarBD } from "@/libs/mongodb";
//Obtiene un sistema hidropónico y sus plantas por id
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const systemId = searchParams.get('systemId');

  try {
    await connectarBD();

    const hydroponicSystem = await HydroponicSystem.findById(systemId).populate('plants');
    if (!hydroponicSystem) {
      return NextResponse.json(
        {
          message: "Sistema hidropónico no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(hydroponicSystem.plants);
  } catch (error) {
    console.error("Error al obtener plantas de la estación:", error);
    return NextResponse.error();
  }
}
