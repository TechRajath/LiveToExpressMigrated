import React, { useEffect, useState } from "react";
import {
  BiLogoTwitter,
  BiLogoInstagram,
  BiLogoLinkedin,
  BiLogoFacebook,
} from "react-icons/bi";
import { FiArrowUpRight } from "react-icons/fi";

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const pageHeight = document.body.offsetHeight - 200;

      if (scrollPosition >= pageHeight) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`w-full bg-black py-12 md:py-16 lg:py-20 transition-opacity duration-700 opacity-100`}
      style={{
        fontFamily: "'Poor Story', cursive",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Big Brand Name */}
        <div className="mb-8 md:mb-12 overflow-hidden flex flex-col items-start">
          <h2
            className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-red-700  transition-transform duration-1000 ${
              isVisible ? "translate-y-0" : "translate-y-full"
            }`}
          >
            #LiveToExpress
          </h2>
          <p
            className={`text-md md:text-base lg:text-lg text-red-600 mt-2 transition-transform duration-1000 delay-200 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-full opacity-0"
            }`}
          >
            a product by Minimalist Institute
          </p>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between mb-8 border-t border-gray-800 pt-8">
          <div className="mb-6 md:mb-0">
            <p className="text-sm text-gray-400">
              © 2025 Minimalist. All rights reserved.
            </p>
          </div>

          {/* Book a Call Button */}
          <div className="mb-8 md:mb-0 order-3 md:order-2 ">
            <button className="bg-gray-900 text-white rounded-full py-2 sm:py-3 px-4 sm:px-6 flex items-center gap-2 hover:bg-gray-800 transition-all duration-300 group cursor-pointer">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHCIe6fv_xLeSSq-hX_kwbhkCspe9g1MzvEw&s"
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-medium text-sm sm:text-base">
                  Book a Call
                </span>
                <span className="text-xs opacity-80 hidden sm:block">
                  Let's talk about creativity
                </span>
              </div>
              <FiArrowUpRight
                size={16}
                className="ml-1 sm:ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 order-2 md:order-3 mb-6 md:mb-0">
            <div className="flex gap-4 sm:gap-6 flex-wrap">
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Terms
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div
          className={`flex gap-3 sm:gap-4 justify-center md:justify-end transition-transform duration-1000 ${
            isVisible ? "translate-y-0" : "translate-y-16"
          }`}
        >
          <a
            href="#"
            className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="Twitter"
          >
            <BiLogoTwitter size={16} className="text-gray-300" />
          </a>
          <a
            href="#"
            className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="Instagram"
          >
            <BiLogoInstagram size={16} className="text-gray-300" />
          </a>
          <a
            href="#"
            className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="LinkedIn"
          >
            <BiLogoLinkedin size={16} className="text-gray-300" />
          </a>
          <a
            href="#"
            className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
            aria-label="Facebook"
          >
            <BiLogoFacebook size={16} className="text-gray-300" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
