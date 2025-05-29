import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  QueryConstraint,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { eventInput } from "@/models/event";

export const createEvent = async (eventData: eventInput) => {
  try {
    console.log("event data", JSON.stringify(eventData));
    const eventsCollection = collection(db, "event");
    const docRef = await addDoc(eventsCollection, {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating event:", error);
    throw new Error("Failed to create event");
  }
};

export async function fetchEventsFromFirebase(
  filters: Record<string, string | null>
) {
  try {
    const eventsRef = collection(db, "event");
    const constraints: QueryConstraint[] = [];

    if (filters.status) {
      constraints.push(where("status", "==", filters.status));
    }

    // Add more filters here in the future

    const q =
      constraints.length > 0
        ? query(eventsRef, ...constraints)
        : query(eventsRef);
    const snapshot = await getDocs(q);

    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { success: true, data: events };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getEventById(id: string) {
  const ref = doc(db, "event", id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;

  return { id: snapshot.id, ...snapshot.data() };
}

export async function incrementTicketsSold(
  docId: string,
  ticketCount: number
): Promise<void> {
  try {
    const docRef = doc(db, "event", docId);
    const snap = await getDoc(docRef);

    const currentData = snap.data();
    const currentTicketsSold = currentData?.ticketsSold ?? 0;

    const newTicketsSold = currentTicketsSold + ticketCount;

    await updateDoc(docRef, { ticketsSold: newTicketsSold });
  } catch (error) {
    console.error("Error incrementing ticketsSold:", error);
    throw error;
  }
}
