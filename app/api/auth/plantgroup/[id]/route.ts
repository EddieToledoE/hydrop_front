import { NextResponse } from "next/server";
import PlantGroup from "@/models/plantgroup";
import { connectarBD } from "@/libs/mongodb";
import { Types } from "mongoose";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    await connectarBD();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const group = await PlantGroup.findById(id);
    if (!group) {
      return NextResponse.json({ message: "Grupo de plantas no encontrado" }, { status: 404 });
    }

    return NextResponse.json(group);
  } catch (error) {
    console.error("Error al obtener grupo de plantas:", error);
    return NextResponse.error();
  }
}

export async function PUT(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();
  const { name, optimal_temp, optimal_humidity, optimal_ph, optimal_ec } = await request.json();

  try {
    await connectarBD();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const updatedGroup = await PlantGroup.findByIdAndUpdate(
      id,
      { name, optimal_temp, optimal_humidity, optimal_ph, optimal_ec },
      { new: true }
    );

    if (!updatedGroup) {
      return NextResponse.json({ message: "Grupo de plantas no encontrado" }, { status: 404 });
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error("Error al actualizar grupo de plantas:", error);
    return NextResponse.error();
  }
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split('/').pop();

  try {
    await connectarBD();

    if (!id || !Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const deletedGroup = await PlantGroup.findByIdAndDelete(id);
    if (!deletedGroup) {
      return NextResponse.json({ message: "Grupo de plantas no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "Grupo de plantas eliminado" });
  } catch (error) {
    console.error("Error al eliminar grupo de plantas:", error);
    return NextResponse.error();
  }
}
