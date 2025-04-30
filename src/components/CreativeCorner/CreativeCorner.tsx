import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CreativeCornerProps {
  // Add any props if needed
}

const CreativeCorner: React.FC<CreativeCornerProps> = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [centerIndex, setCenterIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const images = [
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
  const imageCaptions = [
    "Exploring abstract expressionism",
    "A journey through modern art",
    "Conceptual design experiment",
    "Fusion of traditional and digital media",
    "Color theory in practice",
    "Geometric abstraction study",
    "Minimalist composition",
  ];

  // Calculate center index on scroll
  useEffect(() => {
    const slider = scrollRef.current;
    if (!slider) return;

    const handleScroll = () => {
      if (isDragging || isAnimating) return;

      const containerWidth = slider.offsetWidth;
      const scrollPos = slider.scrollLeft + containerWidth / 2;
      const itemWidth =
        slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
      const newCenterIndex = Math.round(scrollPos / (itemWidth + 24)); // 24 is gap
      setCenterIndex(Math.min(newCenterIndex, images.length - 1));
    };

    slider.addEventListener("scroll", handleScroll, { passive: true });
    return () => slider.removeEventListener("scroll", handleScroll);
  }, [images.length, isDragging, isAnimating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;

    setIsDragging(true);
    const startX = e.pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleMouseMove = (e: MouseEvent) => {
      if (!slider) return;
      const x = e.pageX - slider.offsetLeft;
      const scroll = x - startX;
      slider.scrollLeft = scrollLeft - scroll;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      snapToCenter();
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const slider = scrollRef.current;
    if (!slider) return;

    setIsDragging(true);
    const startX = e.touches[0].pageX - slider.offsetLeft;
    const scrollLeft = slider.scrollLeft;

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!slider) return;
      const x = e.touches[0].pageX - slider.offsetLeft;
      const scroll = x - startX;
      slider.scrollLeft = scrollLeft - scroll;
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      snapToCenter();
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);
  };

  const snapToCenter = () => {
    const slider = scrollRef.current;
    if (!slider) return;

    const containerWidth = slider.offsetWidth;
    const scrollPos = slider.scrollLeft + containerWidth / 2;
    const itemWidth =
      slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
    const newCenterIndex = Math.round(scrollPos / (itemWidth + 24));

    if (newCenterIndex >= 0 && newCenterIndex < images.length) {
      const newScrollPos =
        newCenterIndex * (itemWidth + 24) - containerWidth / 2 + itemWidth / 2;

      smoothScrollTo(newScrollPos, () => {
        setCenterIndex(newCenterIndex);
      });
    }
  };

  const scrollLeft = () => {
    if (isAnimating) return;

    const slider = scrollRef.current;
    if (!slider) return;

    const newIndex = Math.max(centerIndex - 1, 0);
    const itemWidth =
      slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
    const scrollPos =
      newIndex * (itemWidth + 24) - slider.offsetWidth / 2 + itemWidth / 2;

    smoothScrollTo(scrollPos, () => {
      setCenterIndex(newIndex);
    });
  };

  const scrollRight = () => {
    if (isAnimating) return;

    const slider = scrollRef.current;
    if (!slider) return;

    const newIndex = Math.min(centerIndex + 1, images.length - 1);
    const itemWidth =
      slider.querySelector<HTMLElement>(".carousel-item")?.offsetWidth || 0;
    const scrollPos =
      newIndex * (itemWidth + 24) - slider.offsetWidth / 2 + itemWidth / 2;

    smoothScrollTo(scrollPos, () => {
      setCenterIndex(newIndex);
    });
  };

  const smoothScrollTo = (targetPosition: number, callback?: () => void) => {
    const slider = scrollRef.current;
    if (!slider) return;

    setIsAnimating(true);
    const startPosition = slider.scrollLeft;
    const distance = targetPosition - startPosition;
    const duration = 500; // ms
    let startTime: number | null = null;

    const animationScroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;

      // Use cubic bezier for smoother easing
      const progress = Math.min(timeElapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      const run = startPosition + distance * easeProgress;

      slider.scrollLeft = run;

      if (timeElapsed < duration) {
        requestAnimationFrame(animationScroll);
      } else {
        setIsAnimating(false);
        if (callback) callback();
      }
    };

    requestAnimationFrame(animationScroll);
  };

  // Smooth easing function
  const easeOutCubic = (t: number): number => {
    return 1 - Math.pow(1 - t, 3);
  };

  return (
    <div className="bg-black w-full py-8 px-4 md:py-12 md:px-8 overflow-hidden">
      <h1
        className={`whitespace-nowrap overflow-hidden text-ellipsis 
             text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl 
             font-bold text-center max-w-full text-white mb-12`}
        style={{
          fontFamily: "'Poor Story', cursive",
          lineHeight: "1.2",
        }}
      >
        Creative corner
      </h1>

      <div className="relative group">
        {/* Navigation buttons */}
        <button
          onClick={scrollLeft}
          disabled={isAnimating || centerIndex === 0}
          className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white rounded-full w-12 h-12 items-center justify-center hover:bg-opacity-80 transition-all ${
            isAnimating || centerIndex === 0
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Scroll left"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={scrollRight}
          disabled={isAnimating || centerIndex === images.length - 1}
          className={`hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white rounded-full w-12 h-12 items-center justify-center hover:bg-opacity-80 transition-all ${
            isAnimating || centerIndex === images.length - 1
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          aria-label="Scroll right"
        >
          <ChevronRight size={28} />
        </button>

        {/* Mobile navigation buttons */}
        <div className="flex md:hidden justify-center gap-8 mb-6">
          <button
            onClick={scrollLeft}
            disabled={isAnimating || centerIndex === 0}
            className={`bg-transparent text-white border border-white rounded-full w-12 h-12 flex items-center justify-center transition-all ${
              isAnimating || centerIndex === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white hover:text-black"
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={scrollRight}
            disabled={isAnimating || centerIndex === images.length - 1}
            className={`bg-transparent text-white border border-white rounded-full w-12 h-12 flex items-center justify-center transition-all ${
              isAnimating || centerIndex === images.length - 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white hover:text-black"
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto overflow-y-hidden touch-pan-x scrollbar-none"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="flex gap-6 p-4 min-w-max items-center h-[32rem] md:h-[36rem]">
            {images.map((src, index) => (
              <div
                key={index}
                className="carousel-item relative"
                style={{
                  transform: `
                 perspective(1000px)
                 rotateY(${index < centerIndex ? "-10deg" : "10deg"})
                 scale(${1 - 0.1 * Math.min(Math.abs(index - centerIndex), 1)})
               `,
                  transition: "transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
                  opacity: 1 - 0.2 * Math.min(Math.abs(index - centerIndex), 1),
                  transformOrigin: "center center",
                  zIndex: index === centerIndex ? 10 : 1,
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div
                  className={`border-2 ${
                    index === centerIndex ? "border-white" : "border-gray-600"
                  } rounded-xl overflow-hidden transition-all duration-300`}
                >
                  <img
                    src={src}
                    alt={`Creative work ${index + 1}`}
                    className={`w-64 h-80 md:w-80 md:h-96 object-cover transition-all duration-300 ${
                      hoveredIndex === index
                        ? "brightness-75"
                        : "brightness-100"
                    }`}
                    draggable="false"
                  />
                  <div
                    className={`absolute inset-0 flex items-end p-4 transition-all duration-300 ${
                      hoveredIndex === index ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
                    }}
                  >
                    <p
                      className="text-white text-center font-medium text-lg mb-4"
                      style={{
                        fontFamily: "'Poor Story', cursive",
                      }}
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
        className="text-center text-white mt-6"
        style={{
          fontFamily: "'Poor Story', cursive",
          fontSize: "clamp(24px, 3vw, 48px)",
          lineHeight: "normal",
        }}
      >
        Creative explorations done by the individuals ...
      </p>
    </div>
  );
};

export default CreativeCorner;
