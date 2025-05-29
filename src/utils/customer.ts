import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

interface Customer {
  name: string;
  email: string;
  phone: string;
}

export async function storeCustomerInfo(customer: Customer): Promise<string> {
  const docRef = await addDoc(collection(db, "customers"), customer);
  return docRef.id;
}
