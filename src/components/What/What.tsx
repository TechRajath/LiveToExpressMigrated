import { useState, useEffect, useRef, useCallback } from "react";

// Define TypeScript interfaces
interface Video {
  id: string;
  title: string;
  description: string;
}

interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  destroy: () => void;
}

declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars: {
            autoplay: number;
            loop: number;
            controls: number;
            modestbranding: number;
            mute: number;
            playsinline: number;
            playlist: string;
          };
          events: {
            onReady: (event: { target: YouTubePlayer }) => void;
            onStateChange: (event: {
              data: number;
              target: YouTubePlayer;
            }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: {
        ENDED: number;
      };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const What = () => {
  const [videos] = useState<Video[]>([
    {
      id: "JrFKltOYd6o",
      title: "Art in Motion",
      description: "Experience creative freedom",
    },
    {
      id: "lek816sgKZQ",
      title: "Creative Process",
      description: "Behind the scenes look",
    },
    {
      id: "DO_N7TB9o-I",
      title: "Urban Art",
      description: "Street art showcase",
    },
    {
      id: "92bftuPqHD4",
      title: "Digital Canvas",
      description: "Modern art techniques",
    },
    {
      id: "yWSsO00eKZ8",
      title: "Color Explosion",
      description: "Vibrant art collection",
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [individualMutes, setIndividualMutes] = useState<boolean[]>(
    Array(videos.length).fill(true)
  );
  const [loadingStates, setLoadingStates] = useState<boolean[]>(
    Array(videos.length).fill(true)
  );
  const [hoverStates, setHoverStates] = useState<boolean[]>(
    Array(videos.length).fill(false)
  );

  const playersRef = useRef<YouTubePlayer[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.YT && window.YT.Player) {
      initializePlayers();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayers;
    }

    return () => {
      playersRef.current.forEach((player) => player?.destroy?.());
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const initializePlayers = () => {
    playersRef.current = videos.map((video, index) => {
      return new window.YT.Player(`youtube-player-${index}`, {
        videoId: video.id,
        playerVars: {
          autoplay: 1,
          loop: 1,
          controls: 0,
          modestbranding: 1,
          mute: 1,
          playsinline: 1,
          playlist: video.id,
        },
        events: {
          onReady: (event) => {
            if (index === activeIndex) {
              event.target.playVideo();
            } else {
              event.target.pauseVideo();
            }
            setLoadingStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    });
  };

  const scrollToVideo = useCallback((index: number) => {
    setActiveIndex(index);
    const container = containerRef.current;
    if (!container) return;

    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      const card = container.children[index];
      if (card) {
        (card as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }, 50);

    playersRef.current.forEach((player, i) => {
      if (player && i !== index) {
        player.pauseVideo();
      }
      if (player && i === index) {
        player.playVideo();
      }
    });
  }, []);

  const toggleIndividualMute = useCallback((index: number) => {
    setIndividualMutes((prev) => {
      const newMutes = [...prev];
      newMutes[index] = !newMutes[index];

      const player = playersRef.current[index];
      if (player) {
        newMutes[index] ? player.mute() : player.unMute();
      }

      return newMutes;
    });
  }, []);

  const navigate = useCallback(
    (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (activeIndex + 1) % videos.length
          : (activeIndex - 1 + videos.length) % videos.length;
      scrollToVideo(newIndex);
    },
    [activeIndex, scrollToVideo, videos.length]
  );

  // Swipe detection
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) =>
    setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) =>
    setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) navigate("next");
    if (touchStart - touchEnd < -50) navigate("prev");
  };

  const openFullVideo = (videoId: string) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
  };

  return (
    <div
      className="relative bg-black min-h-screen"
      style={{ fontFamily: "'Poor Story', cursive" }}
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 text-white">
        Art in Motion
      </h1>

      {/* Navigation Arrows */}
      <button
        onClick={() => navigate("prev")}
        className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-4 ml-2 hover:bg-opacity-70 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
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
        className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-50 rounded-full p-4 mr-2 hover:bg-opacity-70 transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
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

      {/* Video Cards */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-8 py-4 sm:py-8 items-center scrollbar-hide"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, index) => (
          <div
            key={video.id + index}
            className="relative flex-shrink-0 rounded-xl overflow-hidden snap-center transition-all duration-300 ease-in-out w-[70vw] h-[100vw] sm:w-[400px] sm:h-[600px] border border-white opacity-80 hover:opacity-100 hover:scale-95"
            onMouseEnter={() => {
              setHoverStates((prev) => {
                const newHovers = [...prev];
                newHovers[index] = true;
                return newHovers;
              });
            }}
            onMouseLeave={() => {
              setHoverStates((prev) => {
                const newHovers = [...prev];
                newHovers[index] = false;
                return newHovers;
              });
            }}
          >
            {loadingStates[index] && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-10">
                <p className="text-white animate-pulse">Loading video...</p>
              </div>
            )}

            <div
              id={`youtube-player-${index}`}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Video Info Overlay */}
            {hoverStates[index] && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-4 z-10 transition-opacity duration-300">
                <h2 className="text-white text-xl font-bold mb-2">
                  {video.title}
                </h2>
                <p className="text-white text-sm mb-4">{video.description}</p>
                <button
                  onClick={() => openFullVideo(video.id)}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Watch on YouTube
                </button>
              </div>
            )}

            {/* Mute Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleIndividualMute(index);
              }}
              className="absolute top-2 right-2 z-20 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
              aria-label={
                individualMutes[index] ? "Unmute video" : "Mute video"
              }
            >
              {individualMutes[index] ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    clipRule="evenodd"
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
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072M12 6a7.975 7.975 0 015.657 2.343m0 0a7.975 7.975 0 010 11.314m-11.314 0a7.975 7.975 0 010-11.314m0 0a7.975 7.975 0 015.657-2.343"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
        ))}
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

        

       

        
        }
      `}</style>
    </div>
  );
};

export default What;
