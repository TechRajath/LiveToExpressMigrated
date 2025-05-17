"use client";

import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Palette,
  Brush,
  MapPin,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  onSectionChange: (section: string) => void;
}

export default function CollapsibleSidebar({ onSectionChange }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [selectedSection, setSelectedSection] = useState("Home");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setExpanded(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/admin");
  };

  const sections = [
    { name: "Home", icon: <Home size={24} /> },
    { name: "Landing Page", icon: <LayoutDashboard size={24} /> },
    { name: "Art in Motion", icon: <Palette size={24} /> },
    { name: "Creative Corner", icon: <Brush size={24} /> },
    { name: "Location", icon: <MapPin size={24} /> },
  ];

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      {/* Mobile menu button - now positioned absolutely on the right */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className={`fixed z-50 p-3 rounded-md bg-gray-800 text-white  md:hidden transition-all duration-300  ${
            expanded ? "right-4 top-4" : "left-4 top-4"
          }`}
        >
          {expanded ? <X size={28} /> : <Menu size={28} />}
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white fixed top-0 left-0 h-screen z-40 transition-all duration-300 cursor-pointer ease-in-out ${
          expanded ? "w-72" : "w-20"
        } ${isMobile && !expanded ? "-translate-x-full" : "translate-x-0"}`}
      >
        {/* Desktop toggle button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 z-50 bg-gray-800 rounded-full cursor-pointer p-2 border-2 border-gray-600 hover:bg-gray-700 transition-colors"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {expanded ? (
              <ChevronLeft size={24} className="text-white" />
            ) : (
              <ChevronRight size={24} className="text-white" />
            )}
          </button>
        )}

        {/* Sidebar Content */}
        <div className="h-full flex flex-col pt-6 pb-8 ">
          <ul className="flex-1 space-y-3 px-3 overflow-y-auto cursor-pointer">
            {sections.map((section) => (
              <li key={section.name}>
                <button
                  className={`w-full flex items-center gap-4 p-4 rounded-lg text-xl cursor-pointer transition-all ${
                    selectedSection === section.name
                      ? "bg-gray-700 font-semibold"
                      : "hover:bg-gray-600"
                  } ${expanded ? "justify-start" : "justify-center"}`}
                  onClick={() => {
                    onSectionChange(section.name);
                    setSelectedSection(section.name);
                    if (isMobile) setExpanded(false);
                  }}
                >
                  <span className="flex-shrink-0">{section.icon}</span>
                  {expanded && <span className="truncate">{section.name}</span>}
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <div className="px-3 pt-4 border-t border-gray-700">
            <button
              className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-lg text-xl bg-red-600 hover:bg-red-700 transition-all ${
                expanded ? "justify-start" : "justify-center"
              }`}
              onClick={handleLogout}
            >
              <LogOut size={24} />
              {expanded && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobile && expanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setExpanded(false)}
        />
      )}
    </>
  );
}
