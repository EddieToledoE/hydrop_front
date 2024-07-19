import { NextResponse } from "next/server";
import HydroponicSystem from "@/models/hydroponicsystem";
import { connectarBD } from "@/libs/mongodb";
import User from "@/models/user";
export async function PATCH(request: Request) {
  const { id, name, plants, sensors, actuators } = await request.json();

  try {
    await connectarBD();

    const updatedSystem = await HydroponicSystem.findByIdAndUpdate(
      id,
      { name, plants, sensors, actuators },
      { new: true }
    );

    if (!updatedSystem)
      return NextResponse.json(
        {
          message: "Sistema hidropónico no encontrado",
        },
        {
          status: 404,
        }
      );

    return NextResponse.json(updatedSystem);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}


export async function DELETE(request: Request) {
    const { id, userId } = await request.json();
  
    try {
      await connectarBD();
  
      const deletedSystem = await HydroponicSystem.findByIdAndDelete(id);
  
      if (!deletedSystem)
        return NextResponse.json(
          {
            message: "Sistema hidropónico no encontrado",
          },
          {
            status: 404,
          }
        );
  
      await User.findByIdAndUpdate(userId, {
        $pull: { hydroponicSystems: id }
      });
  
      return NextResponse.json({ message: "Sistema hidropónico eliminado" });
    } catch (error) {
      console.log(error);
      return NextResponse.error();
    }
  }