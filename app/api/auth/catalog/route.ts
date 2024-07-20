import { NextResponse } from "next/server";
import PlantCatalog from "@/models/plantcatalog";
import PlantGroup from "@/models/plantgroup";
import { connectarBD } from "@/libs/mongodb";

export async function POST(request: Request) {
  const { name, harvest_days, image, group_id } = await request.json();

  try {
    await connectarBD();

    const group = await PlantGroup.findById(group_id);
    if (!group) {
      return NextResponse.json(
        {
          message: "Grupo de plantas no encontrado",
        },
        {
          status: 404,
        }
      );
    }

    const newPlant = new PlantCatalog({
      name,
      harvest_days,
      image,
      group_id,
    });

    const savedPlant = await newPlant.save();

    return NextResponse.json(savedPlant);
  } catch (error) {
    console.error("Error al agregar planta al catálogo:", error);
    return NextResponse.error();
  }
}

export async function GET() {
  connectarBD();
  try {
    const plants = await PlantCatalog.find().populate("group_id");
    return NextResponse.json(plants);
  } catch (error) {
    console.error("Error al obtener plantas del catálogo:", error);
    return NextResponse.json({
      statusCode: 500,
      message: "Error del servidor",
    });
  }
}