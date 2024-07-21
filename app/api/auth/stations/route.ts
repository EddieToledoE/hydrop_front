import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import User from "@/models/user";
import { connectarBD } from "@/libs/mongodb";
// Crea un sistema hidropónico
export async function POST(request: Request) {
  const { userId, name, city, plants } = await request.json();

  try {
    await connectarBD();

    const user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        {
          message: "Usuario no encontrado",
        },
        {
          status: 404,
        }
      );

      const hydroponicSystem = new HydroponicSystem({
        user,
        name,
        city,
        plants
      });

    const savedSystem = await hydroponicSystem.save();
    user.hydroponicSystems.push(savedSystem._id);
    await user.save();

    return NextResponse.json(savedSystem);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
