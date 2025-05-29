import { events } from "@/models/event";
import { createEvent } from "@/utils/events";
import { NextResponse } from "next/server";
import { fetchEventsFromFirebase } from "@/utils/events";

const SERVER_API_KEY =
  process.env.SERVER_API_KEY! || "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4";

// ✅ Utility function to validate x-api-key
//TODO: Need to add Origin check , only allow request from specifc Domain , once deployed
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === SERVER_API_KEY;
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const validatedData = events.parse(body);
    const result = await createEvent(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        eventId: result.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.errors) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to create event",
      },
      { status: 500 }
    );
  }
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
    status: searchParams.get("status"),
  };

  const result = await fetchEventsFromFirebase(filters);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch events",
        error: result.error,
      },
      { status: 500 }
    );
  }

  // ✅ Safe to access result.data here
  return NextResponse.json(
    {
      success: true,
      //total: result.data.length,
      data: result.data,
    },
    { status: 200 }
  );
}
