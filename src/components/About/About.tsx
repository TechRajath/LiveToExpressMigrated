"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

type ArtCategory = {
  name: string;
  color: string;
};

const fineArts: ArtCategory[] = [
  { name: "Painting", color: "#FF5A5F" },
  { name: "Sculpture", color: "#E67E22" },
  { name: "Drawing", color: "#3498DB" },
  { name: "Printmaking", color: "#9B59B6" },
  { name: "Ceramics", color: "#1ABC9C" },
  { name: "Photography", color: "#F1C40F" },
];

const performingArts: ArtCategory[] = [
  { name: "Dance", color: "#2ECC71" },
  { name: "Music", color: "#E74C3C" },
  { name: "Theater", color: "#3498DB" },
  { name: "Opera", color: "#FF5A5F" },
  { name: "Poetry", color: "#9B59B6" },
  { name: "Storytelling", color: "#F1C40F" },
];

const digitalArts: ArtCategory[] = [
  { name: "Digital Painting", color: "#1ABC9C" },
  { name: "3D Modeling", color: "#E67E22" },
  { name: "Animation", color: "#2ECC71" },
  { name: "Game Design", color: "#E74C3C" },
  { name: "NFT Art", color: "#3498DB" },
  { name: "AI Art", color: "#9B59B6" },
];

const marqueeVariants: Variants = {
  animate: {
    x: [0, -2000],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

const reversedMarqueeVariants: Variants = {
  animate: {
    x: [-2000, 0],
    transition: {
      x: {
        repeat: Infinity,
        repeatType: "loop",
        duration: 20,
        ease: "linear",
      },
    },
  },
};

const About = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderArtCategory = (
    arts: ArtCategory[],
    variant: Variants,
    opacity?: string
  ) => (
    <div className="overflow-hidden mt-8">
      <motion.div
        variants={variant}
        animate="animate"
        className="whitespace-nowrap relative w-full"
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} className="inline-block">
            {arts.map((art, index) => (
              <span
                key={index}
                className={`text-8xl md:text-9xl font-bold mx-8 inline-block ${
                  opacity ?? ""
                }`}
                style={{
                  fontFamily: "'Poor Story', cursive",
                  color: art.color,
                }}
              >
                {art.name}
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-black flex flex-col justify-center items-center overflow-hidden w-full">
      <h1
        className="whitespace-nowrap overflow-hidden text-ellipsis 
                   text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl 
                   font-bold text-left max-w-full text-white"
        style={{
          fontFamily: "'Poor Story', cursive",
          lineHeight: "1.9",
        }}
      >
        What we focus on
      </h1>

      <section className="py-20 relative w-full overflow-hidden">
        {/* Fine Arts */}
        {renderArtCategory(fineArts, marqueeVariants)}

        {/* Performing Arts */}
        {renderArtCategory(
          performingArts,
          reversedMarqueeVariants,
          "opacity-60"
        )}

        {/* Digital Arts */}
        {renderArtCategory(digitalArts, marqueeVariants)}
      </section>
    </div>
  );
};

export default About;
