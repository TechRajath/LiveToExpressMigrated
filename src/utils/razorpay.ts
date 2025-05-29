import axios from "axios";
import crypto from "crypto";

const RAZORPAY_BASE_URL =
  process.env.RAZORPAY_BASE_URL || "https://api.razorpay.com/v1";
const RAZORPAY_KEY_ID =
  process.env.RAZORPAY_KEY_ID || "rzp_test_H91f0AbfHSRlGV";
const RAZORPAY_KEY_SECRET =
  process.env.RAZORPAY_KEY_SECRET || "b6ni37hY3ysNiFtCOihPVPbJ";

interface CreateOrderParams {
  amount: number; // in INR, not paise
  receipt: string;
  currency: string;
}

interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  [key: string]: any; // for any extra fields
}

export const createOrder = async ({
  amount,
  receipt,
  currency,
}: CreateOrderParams): Promise<RazorpayOrderResponse> => {
  const options = {
    amount: amount * 100, // Convert to paise
    currency,
    receipt,
  };

  try {
    const response = await axios.post(`${RAZORPAY_BASE_URL}/orders`, options, {
      auth: {
        username: RAZORPAY_KEY_ID,
        password: RAZORPAY_KEY_SECRET,
      },
    });

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Failed to create Razorpay order";
    throw new Error(message);
  }
};

interface VerifyPaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export const verifyPayment = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}: VerifyPaymentParams): boolean => {
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expectedSignature === razorpay_signature;
};
