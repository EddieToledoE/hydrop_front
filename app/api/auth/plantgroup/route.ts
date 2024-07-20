import { NextResponse } from "next/server";
import PlantGroup from "@/models/plantgroup";
import { connectarBD } from "@/libs/mongodb";

export async function POST(request: Request) {
  const { name, optimal_temp, optimal_humidity, optimal_ph, optimal_ec } = await request.json();

  try {
    await connectarBD();

    const newGroup = new PlantGroup({
      name,
      optimal_temp,
      optimal_humidity,
      optimal_ph,
      optimal_ec
    });

    const savedGroup = await newGroup.save();

    return NextResponse.json(savedGroup);
  } catch (error) {
    console.error("Error al crear grupo de plantas:", error);
    return NextResponse.error();
  }
}

export async function GET() {
    try {
      await connectarBD();
  
      const groups = await PlantGroup.find();
  
      return NextResponse.json(groups);
    } catch (error) {
      console.error("Error al obtener grupos de plantas:", error);
      return NextResponse.error();
    }
  }