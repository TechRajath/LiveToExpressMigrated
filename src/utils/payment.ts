import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { PaymentInfo } from "@/models/payment";

export const storePaymentInfo = async (paymentData: PaymentInfo) => {
  try {
    await addDoc(collection(db, "payment-info"), {
      ...paymentData,
      datetime: new Date(paymentData.datetime),
    });
    console.log("✅ Payment info stored in Firestore");
    return { success: true };
  } catch (error) {
    console.error("❌ Error storing payment info:", error);
    return { success: false, error };
  }
};
