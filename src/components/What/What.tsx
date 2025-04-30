import { useState, useEffect, useRef, useCallback } from "react";

interface VideoData {
  id: string;
  title: string;
  description: string;
}

// Extend the Window interface to include YouTube API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | null;
  }
}

const What: React.FC = () => {
  const [videos] = useState<VideoData[]>([
    {
      id: "41O_MydqxTU",
      title: "Art in Motion",
      description: "Experience creative freedom",
    },
    {
      id: "41O_MydqxTU",
      title: "Creative Process",
      description: "Behind the scenes look",
    },
    {
      id: "41O_MydqxTU",
      title: "Urban Art",
      description: "Street art showcase",
    },
    {
      id: "41O_MydqxTU",
      title: "Digital Canvas",
      description: "Modern art techniques",
    },
    {
      id: "41O_MydqxTU",
      title: "Color Explosion",
      description: "Vibrant art collection",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [individualMutes, setIndividualMutes] = useState<boolean[]>(
    Array(videos.length).fill(true)
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(videos.length).fill(true)
  );
  const playersRef = useRef<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize YouTube API
  useEffect(() => {
    // Create YouTube script only on client side
    if (typeof window !== "undefined") {
      if (window.YT) {
        initializePlayers();
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayers;

      return () => {
        window.onYouTubeIframeAPIReady = null;
        if (tag.parentNode) tag.parentNode.removeChild(tag);
      };
    }
  }, []);

  // Cleanup players on unmount
  useEffect(() => {
    return () => {
      playersRef.current.forEach((player) => {
        if (player && player.destroy) player.destroy();
      });
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const initializePlayers = useCallback(() => {
    if (typeof window === "undefined" || !window.YT) return;

    playersRef.current = videos.map((_, index) => {
      return new window.YT.Player(`youtube-player-${index}`, {
        videoId: videos[index].id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          controls: 0,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          playlist: videos[index].id,
          origin: window.location.origin, // Add origin parameter
        },
        events: {
          onReady: (event: any) => {
            event.target.mute();
            event.target.playVideo();
            setLoadingStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
          onError: () => {
            setLoadingStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          },
        },
      });
    });
  }, [videos]);

  const toggleIndividualMute = useCallback((index: number) => {
    setIndividualMutes((prev) => {
      const newMutes = [...prev];
      newMutes[index] = !newMutes[index];

      if (playersRef.current[index]) {
        newMutes[index]
          ? playersRef.current[index].mute()
          : playersRef.current[index].unMute();
      }

      return newMutes;
    });
  }, []);

  const scrollToVideo = useCallback((index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    if (container) {
      // Clear any pending scroll timeouts
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Delay the scroll slightly to ensure smooth animation
      scrollTimeoutRef.current = setTimeout(() => {
        const card = container.children[index];
        if (card) {
          card.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }, 50);
    }
  }, []);

  const navigate = useCallback(
    (direction: "next" | "prev") => {
      const newIndex =
        direction === "next"
          ? (activeIndex + 1) % videos.length
          : (activeIndex - 1 + videos.length) % videos.length;
      scrollToVideo(newIndex);
    },
    [activeIndex, scrollToVideo, videos.length]
  );

  const openYouTube = useCallback((videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  }, []);

  // Handle swipe gestures for mobile
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      navigate("next");
    }

    if (touchStart - touchEnd < -50) {
      navigate("prev");
    }
  };

  return (
    <div
      className="relative bg-black min-h-screen"
      style={{ fontFamily: "'Poor Story', cursive" }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 text-white">
        Art in Motion
      </h1>

      {/* Video Gallery */}
      <div className="relative px-2 sm:px-4 pb-16">
        {/* Navigation Arrows - Hidden on mobile */}
        <button
          onClick={() => navigate("prev")}
          className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 ml-2 hover:bg-opacity-70"
          aria-label="Previous video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => navigate("next")}
          className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-2 mr-2 hover:bg-opacity-70"
          aria-label="Next video"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-8 sm:w-8 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Video Cards Container */}
        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-8 py-4 sm:py-8 scrollbar-hide items-center"
          style={{ scrollSnapType: "x mandatory" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {videos.map((video, index) => (
            <div
              key={`${video.id}-${index}`}
              className={`relative flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden snap-center transition-all duration-300 ease-in-out w-[70vw] h-[100vw] sm:w-[400px] sm:h-[600px] border sm:border-2 border-white opacity-80 transform scale-90
               `}
              style={{ scrollSnapAlign: "center" }}
            >
              {/* Loading State */}
              {loadingStates[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                  <div className="text-white text-center p-4">
                    <p className="text-xl sm:text-2xl animate-pulse">
                      Wait buddy, video is loading...
                    </p>
                  </div>
                </div>
              )}

              {/* YouTube Player */}
              <div
                id={`youtube-player-${index}`}
                className="absolute inset-0 w-full h-full object-cover"
              ></div>

              {/* Individual Mute Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleIndividualMute(index);
                }}
                className={`absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-black bg-opacity-50 rounded-full p-1 sm:p-2 hover:bg-opacity-70 transition-all ${
                  activeIndex === index ? "scale-100" : "scale-90"
                }`}
                aria-label={
                  individualMutes[index] ? "Unmute video" : "Mute video"
                }
              >
                {individualMutes[index] ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-6 sm:w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-6 sm:w-6 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                )}
              </button>

              {/* Video Overlay */}
              <div
                className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex flex-col justify-end"
                onClick={() => scrollToVideo(index)}
              >
                {/* Description (shown on hover) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="text-center p-4">
                    <h3 className="text-white text-lg sm:text-xl font-bold mb-2">
                      {video.title}
                    </h3>
                    <p className="text-white text-sm sm:text-base mb-4">
                      {video.description}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openYouTube(video.id);
                      }}
                      className="bg-white text-black px-4 py-1 sm:px-6 sm:py-2 rounded-full font-bold hover:bg-opacity-90 transition-all text-sm sm:text-base"
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 w-full overflow-hidden border-t-2 border-b-2 border-white py-3 bg-black bg-opacity-40">
        <div className="marquee-container">
          <div className="marquee-text">
            <p
              className="text-white text-lg sm:text-xl md:text-2xl font-bold whitespace-nowrap"
              style={{
                fontFamily: "'Poor Story', cursive",
                fontWeight: "800",
                letterSpacing: "1px",
              }}
            >
              EXPERIENCE THE FREEDOM TO BE YOURSELF • CREATIVITY WITHOUT LIMITS
              • JOIN THE MOVEMENT
            </p>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Force YouTube iframe to cover entire card */
        iframe {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }

        /* Apply Poor Story font to all text */
        body {
          font-family: "Poor Story", cursive;
        }
        @keyframes marquee-right-to-left {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes marquee-left-to-right {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .marquee-container {
          width: 100%;
          overflow: hidden;
        }

        .marquee-text {
          display: inline-block;
          white-space: nowrap;
          animation: marquee-right-to-left 15s linear infinite;
        }

        .marquee-text:nth-child(2) {
          animation: marquee-left-to-right 15s linear infinite;
          animation-delay: 15s;
        }
      `}</style>
    </div>
  );
};

export default What;
