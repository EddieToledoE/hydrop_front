import { NextResponse } from "next/server";
import StationPlant from "@/models/stationplant";
import { connectarBD } from "@/libs/mongodb";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const systemId = url.searchParams.get('systemId');

  try {
    await connectarBD();
    const growingPlants = await StationPlant.find({ system_id: systemId, status: "growing" }).populate("plant_id");

    return NextResponse.json(growingPlants);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
