import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { EventBooking } from "@/models/eventbooking";

export const saveEventBookingToFirebase = async (data: EventBooking) => {
  try {
    const docRef = await addDoc(collection(db, "eventbooking"), {
      ...data,
      bookingDate: data.bookingDate.toISOString(), // Store as ISO string
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
};

export async function updateEventBookingStatus(
  docId: string,
  newStatus: string
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, "eventbooking", docId);
    await updateDoc(docRef, { status: newStatus });
    const updatedSnap = await getDoc(docRef);
    const data = updatedSnap.data();
    return data ?? null;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
}
