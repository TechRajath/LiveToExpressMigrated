"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./DashboardComponents/Sidebar";
import Content from "./DashboardComponents/Content";

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Home");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar onSectionChange={setActiveSection} />

      {/* Main content */}
      <main className="flex-1 p-4 mt-16 md:mt-0 md:ml-64">
        <Content section={activeSection} />
      </main>
    </div>
  );
}
