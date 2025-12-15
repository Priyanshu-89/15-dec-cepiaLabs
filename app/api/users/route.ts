import { NextResponse } from "next/server";
import { userSchema, userType } from "@/app/schemas/user.schema";
import { zodValidator } from "@/app/lib/zodValidator";


const users: userType[] = [];

export async function POST(request: Request) {
  const result = await zodValidator(request, userSchema);

  if (result instanceof NextResponse) {
    return result;
  }

  users.push(result);

  return NextResponse.json(
    {
      message: "User registered successfully",
      data: result,
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json(
    {
      users,
    },
    { status: 200 }
  );
}
