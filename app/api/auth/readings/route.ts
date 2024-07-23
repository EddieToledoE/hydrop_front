import { NextResponse } from "next/server";
import Reading from "@/models/reading";
import { connectarBD } from "@/libs/mongodb";

export async function POST(request: Request) {
  const { readings } = await request.json();
  try {
    await connectarBD();
    await Reading.insertMany(readings);
    return NextResponse.json({ message: "Lecturas guardadas exitosamente" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error guardando las lecturas" },
      { status: 500 }
    );
  }
}
