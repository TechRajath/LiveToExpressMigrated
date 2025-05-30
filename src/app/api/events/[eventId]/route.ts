import { NextResponse } from "next/server";
import { getEventById, deleteEventById } from "@/utils/events";
const SERVER_API_KEY =
  process.env.SERVER_API_KEY! || "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4";
function validateApiKey(request: Request): boolean {
  const apiKey = request.headers.get("x-api-key");
  return apiKey === SERVER_API_KEY;
}
export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  try {
    const event = await getEventById(params.eventId);

    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: event }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch event",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  // Validate API key
  if (!validateApiKey(request)) {
    return NextResponse.json(
      { success: false, message: "Invalid or missing API key" },
      { status: 401 }
    );
  }

  try {
    const deleted = await deleteEventById(params.eventId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Event not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete event",
      },
      { status: 500 }
    );
  }
}
