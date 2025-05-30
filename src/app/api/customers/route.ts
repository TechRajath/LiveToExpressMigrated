// app/api/customers/route.ts
import { fetchCustomersFromFirebase } from "@/utils/customer";
import { NextResponse } from "next/server";

const SERVER_API_KEY =
  process.env.SERVER_API_KEY! || "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4";

function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === SERVER_API_KEY;
}

export async function GET(request: Request) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const filters = {
    eventId: searchParams.get("eventId") || undefined,
  };

  const result = await fetchCustomersFromFirebase(filters);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customers",
        error: result.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: result.data,
    },
    { status: 200 }
  );
}
