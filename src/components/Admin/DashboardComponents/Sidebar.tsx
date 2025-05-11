"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

// Icons from lucide-react
import {
  Menu,
  Home,
  LayoutDashboard,
  Palette,
  Brush,
  MapPin,
  LogOut,
} from "lucide-react";

export default function Sidebar({
  onSectionChange,
}: {
  onSectionChange: (section: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Home");
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  const sections = [
    { name: "Home", icon: <Home size={20} /> },
    { name: "Landing Page", icon: <LayoutDashboard size={20} /> },
    { name: "Art in Motion", icon: <Palette size={20} /> },
    { name: "Creative Corner", icon: <Brush size={20} /> },
    { name: "Location", icon: <MapPin size={20} /> },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden p-2 bg-gray-800 text-white">
        <button onClick={() => setOpen(!open)} className="text-2xl">
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 p-4 ${
          open ? "block" : "hidden"
        } md:block fixed top-0 left-0 h-screen z-10`}
      >
        <ul className="space-y-4">
          {sections.map((section) => (
            <li
              key={section.name}
              className={`cursor-pointer flex items-center gap-3 p-3 rounded-lg text-lg transition-all ${
                selectedSection === section.name
                  ? "bg-gray-700 font-semibold"
                  : "hover:bg-gray-600"
              }`}
              onClick={() => {
                onSectionChange(section.name);
                setSelectedSection(section.name);
                setOpen(false);
              }}
            >
              {section.icon}
              <span>{section.name}</span>
            </li>
          ))}
          <li
            className="cursor-pointer flex items-center gap-3 p-3 rounded-lg mt-10 text-lg bg-red-600 hover:bg-red-700 transition-all"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </>
  );
}
