"use client";

import { useEffect, useState } from "react";

const backgroundImages: string[] = [
  "https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/blogs/6871/images/24d3166-c8f2-b5e3-1405-1070bea48e_IMG_2342_copy.jpg",
  "https://media.mutualart.com/Images//2020_10/16/13/132832261/41b83a86-6ae5-45b3-ba0b-3ff0aa04b0f1.Jpeg",
  "https://engageart.org/wp-content/uploads/2018/01/angelina-litvin-37702ADJ.jpg",
  "https://realismtoday.com/wp-content/uploads/2023/03/contemporary-realism-art-Michael-Klein-Studio_shot3.jpg",
];

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>(
    new Array(backgroundImages.length).fill(false)
  );

  // Preload images
  useEffect(() => {
    backgroundImages.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setLoadedImages((prev) => {
          const updated = [...prev];
          updated[index] = true;
          return updated;
        });
      };
    });
  }, []);

  // Cycle images every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative min-h-screen text-white font-poorstory overflow-hidden">
      {/* Background layers */}
      {backgroundImages.map((src, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-center bg-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 p-4">
        {/* <h1 className="text-4xl font-bold">Welcome to LiveToExpress</h1> */}
      </div>
    </div>
  );
}
