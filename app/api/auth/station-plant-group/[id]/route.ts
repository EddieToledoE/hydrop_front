import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import { connectarBD } from "@/libs/mongodb";
import StationPlant from "@/models/stationplant";
export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;
  
    try {
      await connectarBD();
      const station = await HydroponicSystem.findById(id).populate("plants");
  
      if (!station) {
        return NextResponse.json(
          { message: "Estación no encontrada" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(station);
    } catch (error) {
      console.log(error);
      return NextResponse.error();
    }
  }
  