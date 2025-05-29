import { z } from "zod";

const PaymentInfoSchema = z.object({
  paymentOrderId: z.string().min(1, "Payment Order ID is required"),
  razorpayPaymentId: z.string().min(1, "Razorpay Payment ID is required"),
  eventBookingId: z.string().min(1, "Event Booking ID is required"),
  datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date-time format",
  }),
});

export type PaymentInfo = z.infer<typeof PaymentInfoSchema>;
