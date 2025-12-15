import { ZodSchema, ZodIssue } from "zod";
import { NextResponse } from "next/server";

export async function zodValidator<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T | NextResponse> {
  try {
    const body = await request.json();
    const parsedData = schema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        {
          errors: parsedData.error.issues.map((err: ZodIssue) => ({
            field: err.path[0],
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    return parsedData.data;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }
}
