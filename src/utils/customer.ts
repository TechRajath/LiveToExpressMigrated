import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

export async function storeCustomerInfo(customer: Customer): Promise<string> {
  const customerRef = collection(db, "customers");
  const q = query(customerRef, where("phone", "==", customer.phone));
  const existing = await getDocs(q);
  if (!existing.empty) {
    return existing.docs[0].id;
  }
  const docRef = await addDoc(customerRef, customer);
  return docRef.id;
}

export async function fetchCustomersFromFirebase(filters: {
  eventId?: string;
}) {
  try {
    if (!filters.eventId) {
      // Return all customers
      const allSnap = await getDocs(collection(db, "customers"));
      const allCustomers = allSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: allCustomers };
    }

    // Step 1: Get bookings by eventId
    const bookingSnap = await getDocs(
      query(
        collection(db, "eventbooking"),
        where("eventId", "==", filters.eventId)
      )
    );

    const customerIds = bookingSnap.docs.map((doc) => doc.data().customerId);

    if (customerIds.length === 0) {
      return { success: true, data: [] }; // no customers booked
    }

    // Step 2: Fetch customers by IDs
    const customerFetches = customerIds.map((id) =>
      getDoc(doc(db, "customers", id))
    );
    const customerDocs = await Promise.all(customerFetches);

    const customers = customerDocs
      .filter((doc) => doc.exists())
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

    return { success: true, data: customers };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}
