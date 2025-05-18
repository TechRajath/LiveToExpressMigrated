"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Sidebar from "./DashboardComponents/Sidebar";
import Content from "./DashboardComponents/Content";

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("Home");
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
      } else {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const username = currentUser?.email?.split("@")[0] || "User";
  const displayName = currentUser?.displayName || username;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <Sidebar onSectionChange={setActiveSection} />

      <div className="flex-1 flex flex-col">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:inline-block">
            Welcome, {displayName}
          </span>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 text-sm font-medium">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6 mt-8 md:mt-0 overflow-auto md:ml-69">
          <Content section={activeSection} />
        </main>
      </div>
    </div>
  );
}
