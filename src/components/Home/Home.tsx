"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function HomePage() {
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);

  // Fetch background images in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "LandingPage"),
      (snapshot) => {
        const images = snapshot.docs.map((doc) => doc.data().imageUrl);
        setBackgroundImages(images);
        setLoadedImages(new Array(images.length).fill(false));
      },
      (error) => console.error("Error fetching images:", error)
    );

    return () => unsubscribe();
  }, []);

  // Preload images
  useEffect(() => {
    if (backgroundImages.length > 0) {
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
    }
  }, [backgroundImages]);

  // Cycle images every 4 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 4000);

    return () => clearInterval(intervalId);
  }, [backgroundImages]);

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
    </div>
  );
}
