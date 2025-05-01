"use client";

import { useEffect, useRef } from "react";

import Navbar from "@/components/Navbar/Navbar";
import HomePage from "@/components/Home/Home";
import About from "@/components/About/About";
import What from "@/components/What/What";
import Events from "@/components/Events/Events";
import CreativeCorner from "@/components/CreativeCorner/CreativeCorner";
import MultiFormPage from "@/components/MultiFormPage/Form";
import LocationSection from "@/components/Location/Location";
import FloatingTestimonialCards from "@/components/FloatingTestimonialCards/FloatingTestimonialCards";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  const homePageRef = useRef<HTMLDivElement>(null);
  const oneRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      scrollToSection(hash.toLowerCase());
    }
  }, []);

  const scrollToSection = (section: string) => {
    switch (section) {
      case "home":
        homePageRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "one":
        oneRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "two":
        twoRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "slider":
        sliderRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      case "form":
        formRef.current?.scrollIntoView({ behavior: "smooth" });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Navbar scrollToSection={scrollToSection} />
      <main>
        <div ref={homePageRef}>
          <HomePage />
        </div>
        <div ref={oneRef}>
          <About />
        </div>
        <div ref={twoRef}>{<What />}</div>
        <Events />
        <div ref={sliderRef}>
          <CreativeCorner />
        </div>

        <LocationSection />
        <FloatingTestimonialCards />
        <div ref={formRef}>
          <MultiFormPage />
        </div>
        <Footer />
      </main>
    </>
  );
}
