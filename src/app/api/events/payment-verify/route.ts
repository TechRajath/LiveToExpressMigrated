import { verifyPayment } from "@/utils/razorpay";
import { NextResponse } from "next/server";
import { storePaymentInfo } from "@/utils/payment";
import { updateEventBookingStatus } from "@/utils/eventbooking";
import { incrementTicketsSold } from "@/utils/events";
const SERVER_API_KEY =
  process.env.SERVER_API_KEY! || "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4";
export interface RazorpayVerificationDetails {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
  receipt: string;
  ticketCount: number;
}

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

  const razorpayVerificationDetails: RazorpayVerificationDetails =
    await request.json();
  console.log("Payment verification data", razorpayVerificationDetails);
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    receipt: eventBookingId, //Here eventBookingId
    ticketCount,
  } = razorpayVerificationDetails;

  const paymentSuccess = await verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });
  if (!paymentSuccess) {
    return Response.json(
      { success: false, message: "Payment verification failed." },
      { status: 400 }
    );
  }
  //If payment done successfully
  //Store the payment information in Firebase
  const currentDateTime = new Date().toISOString();
  const paymentData = await storePaymentInfo({
    paymentOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    eventBookingId,
    datetime: currentDateTime,
  });

  //Update the status in Eventbooking collection to "completed"
  const updatedEventBooking = await updateEventBookingStatus(
    eventBookingId,
    "completed"
  );
  if (updatedEventBooking && updatedEventBooking.eventId) {
    await incrementTicketsSold(updatedEventBooking.eventId, ticketCount);
  } else {
    console.warn("Event booking update failed or missing eventId.");
  }
  //All Needed operation is Done , send ticket informatin through whatsapp or email
  //sending ticket in whatsapp or email code will go here.......

  //send success response that payment verified succesfully after all these are done , n UI display a big toast messgae that event booked , tickets sent though whatsapp
  return NextResponse.json(
    { message: "Payment verified successfully" },
    { status: 200 }
  );
}
