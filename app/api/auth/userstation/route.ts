// src/pages/api/hydroponic/userstation/[id].ts
import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import { connectarBD } from "@/libs/mongodb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("id");

  try {
    await connectarBD();

    const systems = await HydroponicSystem.find({ user: userId });

    if (!systems.length)
      return NextResponse.json(
        {
          message: "No se encontraron sistemas hidropónicos para este usuario",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(systems);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
