import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images: string[] = [
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/QYaR1RdnARVxli274TpZk8luB48-TqMQ29tLoftKurc/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9qdWxpYW4tZ2xh/bmRlci1naWYuZ2lm.gif",
  "https://imgs.search.brave.com/zqDuxRgz7KXas0Sm0imqrgM5UJhtNVrXyVPRDacMKbE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9zaG90/a2l0LmNvbS93cC1j/b250ZW50L3VwbG9h/ZHMvYmItcGx1Z2lu/L2NhY2hlL3Bob3Rv/LXRvLXBhaW50aW5n/LWxhbmRzY2FwZS0w/NzdhYTJiNTY2NmU5/OTg4M2I5ZTU0OWI2/NTM3YmU0ZC16eWJy/YXZneDJxNDcuanBn",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/rKsyW2T083lyvhfBdlyZz_ppzhwhyFeZapVNXWsqK-4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTM0/MDYxMjU4Ni9waG90/by9mZW1hbGUtYXJ0/aXN0LXdvcmtzLW9u/LWFic3RyYWN0LW9p/bC1wYWludGluZy5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/M054SEJPODEwMUJu/SGJBMTQ0b3dNdDMy/UzNVSXpyaVdsVlNj/dmVZd05fcz0",
  "https://imgs.search.brave.com/TUsK8Cgyea1tRHW9N5psDzlD-URs67b7_BGJyb5qjQU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbmZs/dWVuY2VybWFya2V0/aW5naHViLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAyMC8w/Ny9jaHJpcy1waGls/bGlwcy1naWYuZ2lm.gif",
];

const imageCaptions: string[] = [
  "Exploring abstract expressionism",
  "A journey through modern art",
  "Conceptual design experiment",
  "Fusion of traditional and digital media",
  "Color theory in practice",
  "Geometric abstraction study",
  "Minimalist composition",
];

const CreativeCorner: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState<number>(0);

  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const containerWidth = slider.offsetWidth;
      const scrollPos = slider.scrollLeft + containerWidth / 2;
      const itemWidth =
        slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
      const newCenterIndex = Math.round(scrollPos / (itemWidth + 24));
      setCenterIndex(Math.min(newCenterIndex, images.length - 1));
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  // Drag scroll (PC)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      startX = e.pageX - slider.offsetLeft;
      scrollStart = slider.scrollLeft;
      slider.style.cursor = "grabbing";
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const x = e.pageX - slider.offsetLeft;
      const scroll = x - startX;
      slider.scrollLeft = scrollStart - scroll;
    };

    const handleMouseUp = () => {
      isDragging = false;
      slider.style.cursor = "default";
      snapToCenter();
    };

    slider.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      slider.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Touch scroll (Mobile)
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    let startX = 0;
    let scrollStart = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollStart = slider.scrollLeft;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const scroll = x - startX;
      slider.scrollLeft = scrollStart - scroll;
    };

    const handleTouchEnd = () => {
      snapToCenter();
    };

    slider.addEventListener("touchstart", handleTouchStart);
    slider.addEventListener("touchmove", handleTouchMove);
    slider.addEventListener("touchend", handleTouchEnd);

    return () => {
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const snapToCenter = () => {
    const slider = scrollRef.current;
    if (!slider) return;

    const containerWidth = slider.offsetWidth;
    const scrollPos = slider.scrollLeft + containerWidth / 2;
    const itemWidth =
      slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
    const newCenterIndex = Math.round(scrollPos / (itemWidth + 24));

    const newScrollPos =
      newCenterIndex * (itemWidth + 24) - containerWidth / 2 + itemWidth / 2;

    slider.scrollTo({ left: newScrollPos, behavior: "smooth" });
    setCenterIndex(Math.min(newCenterIndex, images.length - 1));
  };

  const scrollToIndex = (index: number) => {
    const slider = scrollRef.current;
    if (!slider) return;

    const itemWidth =
      slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
    const scrollPos =
      index * (itemWidth + 24) - slider.offsetWidth / 2 + itemWidth / 2;

    slider.scrollTo({ left: scrollPos, behavior: "smooth" });
    setCenterIndex(index);
  };

  return (
    <div className="bg-black w-full py-8 px-4 md:py-12 md:px-8 overflow-hidden">
      <h1
        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-12"
        style={{
          fontFamily: "'Poor Story', cursive",
          lineHeight: "1.2",
        }}
      >
        Creative corner
      </h1>

      <div className="relative group">
        {/* Desktop Nav */}
        <button
          onClick={() => scrollToIndex(Math.max(centerIndex - 1, 0))}
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white rounded-full w-12 h-12 items-center justify-center hover:bg-opacity-80"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={() =>
            scrollToIndex(Math.min(centerIndex + 1, images.length - 1))
          }
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white rounded-full w-12 h-12 items-center justify-center hover:bg-opacity-80"
        >
          <ChevronRight size={28} />
        </button>

        {/* Mobile Nav */}
        <div className="flex md:hidden justify-center gap-8 mb-6">
          <button
            onClick={() => scrollToIndex(Math.max(centerIndex - 1, 0))}
            className="bg-transparent text-white border border-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() =>
              scrollToIndex(Math.min(centerIndex + 1, images.length - 1))
            }
            className="bg-transparent text-white border border-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-white hover:text-black"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto touch-pan-x scrollbar-none select-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-6 p-4 min-w-max items-center h-[32rem] md:h-[36rem]">
            {images.map((src, index) => (
              <div
                key={index}
                className="carousel-item relative transition-transform duration-500 ease-in-out"
                style={{
                  transform:
                    index === centerIndex
                      ? "scale(1.1)"
                      : `perspective(1000px) rotateY(${
                          index < centerIndex ? "-10deg" : "10deg"
                        }) scale(0.9)`,
                  opacity: index === centerIndex ? 1 : 0.8,
                  transition: "transform 0.5s ease, opacity 0.5s ease",
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`border-2 ${
                    index === centerIndex ? "border-white" : "border-gray-600"
                  } rounded-xl overflow-hidden`}
                >
                  <img
                    src={src}
                    alt={`Creative work ${index + 1}`}
                    className={`w-64 h-80 md:w-80 md:h-96 object-cover transition-all duration-300 ${
                      hoveredIndex === index
                        ? "brightness-75"
                        : "brightness-100"
                    }`}
                    draggable={false}
                  />
                  <div
                    className={`absolute inset-0 flex items-end p-4 transition-opacity duration-500 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
                    }}
                  >
                    <p
                      className="text-white text-center text-lg mb-4"
                      style={{ fontFamily: "'Poor Story', cursive" }}
                    >
                      {imageCaptions[index % imageCaptions.length]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p
        className="text-white text-center mt-6"
        style={{
          fontFamily: "'Poor Story', cursive",
          fontSize: "clamp(24px, 3vw, 48px)",
        }}
      >
        Creative explorations done by the individuals ...
      </p>
    </div>
  );
};

export default CreativeCorner;
