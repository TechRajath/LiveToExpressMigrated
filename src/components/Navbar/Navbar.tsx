"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import "@/components/Navbar/Navbar.css";
import { addDoc, collection } from "firebase/firestore";

interface ModalGridProps {
  scrollToSection: (section: string) => void;
}

const ModalGrid = ({ scrollToSection }: ModalGridProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleNavigation = (section: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      scrollToSection(section.toLowerCase());
    } else {
      router.push("/");

      setTimeout(() => {
        scrollToSection(section.toLowerCase());
      }, 100);
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const subscribersRef = collection(db, "subscribers");
      await addDoc(subscribersRef, {
        email: email,
        subscribedAt: new Date(),
      });
      setIsSubmitted(true);
      setError("");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-8 py-4 border-b-2 ${
          isMenuOpen
            ? "bg-transparent text-customRed"
            : "bg-transparent text-white"
        }`}
        style={{
          fontFamily: "'Poor Story', cursive",
          height: "80px",
        }}
      >
        <span
          className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wider bg-clip-text text-transparent transition-all duration-500 ease-in-out bg-white"
          style={{
            fontFamily: "'Poor Story', cursive",
            lineHeight: "normal",
          }}
        >
          #LiveToExpress
        </span>

        <button
          onClick={toggleMenu}
          className="text-2xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl text-white border-l-2 pl-4 flex items-center justify-center"
          style={{
            borderColor: "white",
            height: "80px",
          }}
        >
          {isMenuOpen ? "Close" : "Menu"}
        </button>
      </nav>

      {/* Modal */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 text-white overflow-hidden"
          style={{
            fontFamily: "'Poor Story', cursive",
            animation: "slideUpIn 0.3s ease-out forwards",
          }}
        >
          <div className="h-[calc(100vh-80px)] mt-20 overflow-y-auto relative">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 w-full h-full border-t-4 border-white md:h-[calc(100vh-80px)]">
              {/* HOW */}
              <div
                className="outlined-text hover:outline-hover transition-all duration-300 border border-white flex justify-center items-center text-5xl sm:text-7xl md:text-8xl lg:text-[11vw] font-black leading-none text-white p-8 md:p-4 cursor-pointer"
                onClick={() => handleScroll("how")}
              >
                HOW
              </div>

              {/* ABOUT */}
              <div
                className="outlined-text hover:outline-hover transition-all duration-300 border border-white flex justify-center items-center text-5xl sm:text-7xl md:text-8xl lg:text-[11vw] font-black leading-none text-white p-8 md:p-4 cursor-pointer"
                onClick={() => handleScroll("about")}
              >
                ABOUT
              </div>

              {/* CREATIVE CORNER */}
              <div
                className="outlined-text hover:outline-hover transition-all duration-300 border border-white flex justify-start md:justify-center items-center text-5xl sm:text-7xl md:text-8xl lg:text-7xl font-black leading-none text-white font-[Poor Story] p-8 md:p-4 md:pl-4 cursor-pointer"
                onClick={() => handleNavigation("slider")}
              >
                <span>CREATIVE CORNER</span>
              </div>

              {/* JOIN US */}
              <div
                className="outlined-text hover:outline-hover transition-all duration-300 border border-white flex justify-center items-center text-5xl sm:text-7xl md:text-8xl font-black leading-none text-white p-8 md:p-4 cursor-pointer"
                onClick={() => handleNavigation("form")}
              >
                JOIN US
              </div>

              {/* SUBSCRIBE */}
              <div className="border border-white flex flex-col justify-center items-start p-4">
                {isSubmitted ? (
                  <div className="w-full bg-black px-2 py-3 text-base text-white">
                    Successfully subscribed!
                  </div>
                ) : (
                  <div className="w-full max-w-md flex flex-row items-center gap-2">
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className="flex-1 min-w-0 bg-black border-b-2 border-white px-2 py-3 focus:outline-none text-base placeholder-white text-white font-black"
                    />
                    <button
                      onClick={handleSubscribe}
                      disabled={isLoading}
                      className="whitespace-nowrap py-3 px-4 text-white border border-white text-sm rounded bg-black hover:bg-white hover:text-black transition disabled:opacity-50 disabled:cursor-not-allowed font-black"
                    >
                      {isLoading ? "Subscribing..." : "Subscribe"}
                    </button>
                  </div>
                )}
                {error && <p className="text-white text-sm mt-1">{error}</p>}
              </div>

              {/* MINIMALIST INSTITUTE */}
              <div className="border border-white flex flex-col justify-center items-center text-lg sm:text-xl font-extrabold p-6">
                <a href="#" className="hover:underline text-white font-black">
                  MINIMALIST INSTITUTE
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add the CSS animation for slide-up effect */}
      <style jsx>{`
        @keyframes slideUpIn {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ModalGrid;
