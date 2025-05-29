import { NextResponse } from "next/server";
import { getEventById } from "@/utils/events";
import { storeCustomerInfo } from "@/utils/customer";
import { saveEventBookingToFirebase } from "@/utils/eventbooking";
import { EventBookingSchema } from "@/models/eventbooking";
import { createOrder, verifyPayment } from "@/utils/razorpay";

//Razorpay key iid , should be in env
const RAZORPAY_KEY_ID = "rzp_test_H91f0AbfHSRlGV";
interface BookingDetails {
  eventId: string;
  ticketCount: number;
  name: string;
  email: string;
  phone: string;
}
interface EventData {
  id: string;
  totalTickets: number;
  ticketsSold: number;
  price: number;
}
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
  const bookingDetails: BookingDetails = await request.json();
  console.log("Body received", bookingDetails);

  const eventData = (await getEventById(
    bookingDetails.eventId
  )) as EventData | null;
  if (!eventData) {
    return NextResponse.json(
      { success: false, message: "Event not found" },
      { status: 404 }
    );
  }
  const availableTickets = eventData.totalTickets - eventData.ticketsSold;
  if (availableTickets < bookingDetails.ticketCount) {
    return NextResponse.json(
      {
        success: false,
        message: `Only ${availableTickets} tickets available, but ${bookingDetails.ticketCount} requested`,
      },
      { status: 400 }
    );
  }
  //Store the customer information
  const customerId = await storeCustomerInfo({
    name: bookingDetails.name,
    email: bookingDetails.email,
    phone: bookingDetails.phone,
  });
  console.log("Customer ID returned", customerId);
  //Store event booking data in firebase
  const now = new Date();
  //Calculating total price of the event
  const amount = bookingDetails.ticketCount * eventData.price;
  const bookingData = EventBookingSchema.parse({
    customerId,
    eventId: bookingDetails.eventId,
    ticketCount: bookingDetails.ticketCount,
    bookingDate: now,
    ticketAmount: amount,
    bookingTime: now.toTimeString().slice(0, 5), // "HH:MM"
    status: "pending",
  });

  const eventBookId = await saveEventBookingToFirebase(bookingData);
  //Lets consider recept as booking order id , so that easy to track

  //Call the Razorpay create order API , once order is created return the razorpay orderid nd other stuff so in UI we can give iframe
  const receipt = String(eventBookId);
  const razorpayOrderDetails = await createOrder({
    amount,
    receipt,
    currency: "INR",
  });
  console.log("Razorpay order details", razorpayOrderDetails);

  return NextResponse.json(
    {
      success: true,
      order: razorpayOrderDetails,
      key: RAZORPAY_KEY_ID,
    },
    { status: 200 }
  );

  //Implement /verifyayment endpoint ro verify paremnt , update eventbooking status to completed and increase the count in ticketSold in event collection
}
