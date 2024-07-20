import { NextResponse } from "next/server";
import StationPlant, { IStationPlant } from "@/models/stationplant";
import HydroponicSystem from "@/models/hydroponicsystem";
import PlantCatalog, {IPlantCatalog} from "@/models/plantcatalog";
import PlantGroup, {IPlantGroup} from "@/models/plantgroup"; // Importar PlantGroup
import { connectarBD } from "@/libs/mongodb";
import { Types, Document, Schema } from "mongoose";

export async function POST(request: Request) {
  const { systemId, plantId, count } = await request.json();

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

    const plant = await PlantCatalog.findById(plantId).populate<{ group_id: IPlantGroup }>('group_id');
    if (!plant) {
      return NextResponse.json(
        {
          message: "Planta no encontrada en el catálogo",
        },
        {
          status: 404,
        }
      );
    }

    const plantGroup = plant.group_id as unknown as IPlantGroup; // Conversión segura para TypeScript

    // Verificar que todas las plantas en la estación pertenezcan al mismo grupo
    const plantsInSystem = await StationPlant.find({ system_id: systemId }).populate<{ plant_id: IPlantCatalog }>('plant_id');
    for (const plantInSystem of plantsInSystem) {
      const plantInSystemGroup = (plantInSystem.plant_id.group_id as unknown) as IPlantGroup;
      if (plantInSystemGroup._id.toString() !== plantGroup._id.toString()) {
        return NextResponse.json(
          {
            message: "No se pueden mezclar plantas de diferentes grupos en la misma estación.",
          },
          {
            status: 400,
          }
        );
      }
    }

    const plants: IStationPlant[] = [];
    const plantIds: Types.ObjectId[] = [];
    const datePlanted = new Date();

    for (let i = 0; i < count; i++) {
      const estimatedHarvestDate = new Date();
      estimatedHarvestDate.setDate(datePlanted.getDate() + plant.harvest_days);

      const stationPlant = new StationPlant({
        system_id: new Types.ObjectId(systemId),
        plant_id: new Types.ObjectId(plantId),
        status: 'growing',
        date_planted: datePlanted,
        estimated_harvest_date: estimatedHarvestDate,
      });

      const savedPlant = await stationPlant.save();
      plants.push(savedPlant as IStationPlant);
      plantIds.push(savedPlant._id);
    }

    // Actualizar el documento de HydroponicSystem
    hydroponicSystem.plants.push(...(plantIds as unknown as Schema.Types.ObjectId[]));
    await hydroponicSystem.save();

    return NextResponse.json({ message: `${count} plantas añadidas correctamente`, plants });
  } catch (error) {
    console.error("Error al agregar plantas a la estación:", error);
    return NextResponse.error();
  }
}



export async function GET(request: Request) {
  const url = new URL(request.url);
  const systemId = url.searchParams.get('systemId');

  try {
    await connectarBD();

    if (!systemId || !Types.ObjectId.isValid(systemId)) {
      return NextResponse.json({ message: "ID de sistema inválido" }, { status: 400 });
    }

    const plants = await StationPlant.find({ system_id: systemId }).populate('plant_id');

    return NextResponse.json(plants);
  } catch (error) {
    console.error("Error al obtener plantas de la estación:", error);
    return NextResponse.error();
  }
}

