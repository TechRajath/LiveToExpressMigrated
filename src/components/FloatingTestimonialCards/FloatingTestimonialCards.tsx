import { useState, useEffect, useRef } from "react";

// Define TypeScript interfaces
interface Testimonial {
  id: number;
  name: string;
  username: string;
  text: string;
  avatar: string;
  verified: boolean;
  size: "small" | "medium" | "large";
}

interface Card extends Testimonial {
  uniqueId: string;
  column: number;
  posY: number;
  width: number;
  speed: number;
  opacity: number;
}

export default function FloatingTestimonialGrid() {
  const [cards, setCards] = useState<Card[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Joe Mifsud",
      username: "@Joe_Mifsud",
      text: "These look awesome, nice work!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 2,
      name: "Greg Bergé",
      username: "@gregberge_",
      text: "✦ Aceternity UI is a complete collections of stunning effects ready to used for your website. It's shadcn/ui for magic effects. Can't believe it's free! 📌 ui.aceternity.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      verified: true,
      size: "large",
    },
    {
      id: 3,
      name: "Nahuel Candia",
      username: "@dhcandia",
      text: "This is absolutely mind blowing. Animated UIs are the big leap forward on modern interfaces. Already thinking on how to build our website using these",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      verified: true,
      size: "medium",
    },
    {
      id: 4,
      name: "Enis",
      username: "@enisdev",
      text: "Bro this is too beautiful, why is this even free??",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 5,
      name: "Sunshine",
      username: "@sus6461",
      text: "is amazing. It is open forever?",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 6,
      name: "Adrian | JavaScript Mastery",
      username: "@jsmasterymo",
      text: "Have you heard of Aceternity UI? It's packed with various animated components that are ready to copy and paste! Mind-blowing stuff... 😊 Click here 👍 ui.aceternity.com #framermotion #nextis #tailwindcss",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      verified: true,
      size: "large",
    },
    {
      id: 7,
      name: "Joe Mifsud",
      username: "@Joe_Mifsud",
      text: "These look awesome, nice work!",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 8,
      name: "Greg Bergé",
      username: "@gregberge_",
      text: "✦ Aceternity UI is a complete collections of stunning effects ready to used for your website. It's shadcn/ui for magic effects. Can't believe it's free! 📌 ui.aceternity.com",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      verified: true,
      size: "large",
    },
    {
      id: 9,
      name: "Nahuel Candia",
      username: "@dhcandia",
      text: "This is absolutely mind blowing. Animated UIs are the big leap forward on modern interfaces. Already thinking on how to build our website using these",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      verified: true,
      size: "medium",
    },
    {
      id: 10,
      name: "Enis",
      username: "@enisdev",
      text: "Bro this is too beautiful, why is this even free??",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 11,
      name: "Sunshine",
      username: "@sus6461",
      text: "is amazing. It is open forever?",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      verified: false,
      size: "small",
    },
    {
      id: 12,
      name: "Adrian | JavaScript Mastery",
      username: "@jsmasterymo",
      text: "Have you heard of Aceternity UI? It's packed with various animated components that are ready to copy and paste! Mind-blowing stuff... 😊 Click here 👍 ui.aceternity.com #framermotion #nextis #tailwindcss",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      verified: true,
      size: "large",
    },
  ];

  // Get column count based on screen width
  const getColumnCount = (): number => {
    if (typeof window === "undefined") return 3;
    const width = window.innerWidth;
    if (width < 640) return 1;
    if (width < 768) return 2;
    return 3; // Always 3 columns on larger screens
  };

  // Set up initial grid layout
  const setupInitialGrid = (): void => {
    const columns = getColumnCount();
    const newCards: Card[] = [];
    const cardSpacing = 30; // vertical space between cards in pixels
    const viewportHeight = window.innerHeight;

    // Initialize all cards with staggered positions
    for (let i = 0; i < testimonials.length; i++) {
      const columnIndex = i % columns;
      const testimonial = testimonials[i];

      // Calculate initial position - start from bottom
      const positionInSequence = Math.floor(i / columns);
      const startPositionY =
        viewportHeight + positionInSequence * (200 + cardSpacing);

      // Calculate width based on column count
      const cardWidth = 90 / columns;

      // Different speeds for each column
      const columnSpeeds = [0.3, 0.2, 0.3]; // Adjust speeds as needed
      const speed = columnSpeeds[columnIndex % columnSpeeds.length];

      newCards.push({
        ...testimonial,
        uniqueId: `${testimonial.id}-${i}`,
        column: columnIndex,
        posY: startPositionY,
        width: cardWidth,
        speed: speed,
        opacity: 0, // Start with 0 opacity for fade-in effect
      });
    }

    setCards(newCards);
  };

  // Animation function
  const animateCards = (): void => {
    setCards((prevCards) => {
      const viewportHeight = window.innerHeight;
      const columns = getColumnCount();
      const updatedCards = [...prevCards];

      // Track the lowest card in each column
      const columnLowestCards = Array(columns).fill({ posY: -Infinity });

      // First pass to find the lowest card in each column
      updatedCards.forEach((card) => {
        if (card.posY > columnLowestCards[card.column].posY) {
          columnLowestCards[card.column] = card;
        }
      });

      return updatedCards.map((card) => {
        // Move card upward
        let newPosY = card.posY - card.speed;
        let newOpacity = card.opacity;

        // Fade in when entering the viewport from bottom
        if (newPosY < viewportHeight && newPosY > viewportHeight - 300) {
          newOpacity = Math.min(1, (viewportHeight - newPosY) / 100);
        }
        // Fade out when leaving the viewport at top
        else if (newPosY < 100) {
          newOpacity = Math.min(1, newPosY / 100);
        }
        // Fully visible in the middle
        else {
          newOpacity = 1;
        }

        // If card moves above the viewport, reposition to bottom
        if (newPosY < -200) {
          const lowestCardInColumn = columnLowestCards[card.column];
          newPosY = lowestCardInColumn.posY + 200 + 30; // card height + spacing
          newOpacity = 0; // Start invisible at bottom
        }

        return {
          ...card,
          posY: newPosY,
          opacity: newOpacity,
        };
      });
    });

    animationRef.current = requestAnimationFrame(animateCards);
  };

  // Initialize and clean up
  useEffect(() => {
    setupInitialGrid();
    animationRef.current = requestAnimationFrame(animateCards);

    const handleResize = (): void => {
      setupInitialGrid();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-black overflow-hidden py-12 px-4 sm:px-6 lg:px-8 "
      style={{
        fontFamily: "'Poor Story', cursive",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 px-4">
          <h1
            className={`whitespace-nowrap overflow-hidden text-ellipsis 
             text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl 
             font-bold text-center max-w-full text-white`}
            style={{
              fontFamily: "'Poor Story', cursive",
              lineHeight: "1.9",
            }}
          >
            What our artitsts say
          </h1>
        </div>
      </div>

      <div className="relative w-full h-full mx-auto max-w-6xl">
        {cards.map((card) => {
          // Calculate column position based on number of columns
          const columnCount = getColumnCount();
          const columnWidth = 100 / columnCount;
          const leftPosition = card.column * columnWidth + 5; // 5% padding from left

          return (
            <div
              key={card.uniqueId}
              className="absolute bg-black rounded-xl shadow-lg p-4 border border-gray-800 transition-all duration-300 ease-out"
              style={{
                left: `${leftPosition}%`,
                top: `${card.posY}px`,
                width: `${card.width}%`,
                opacity: card.opacity,
                transition: "opacity 0.5s ease",
                maxWidth: "400px",
                transform: `translateY(${
                  card.opacity < 1 ? (1 - card.opacity) * 20 : 0
                }px)`, // subtle lift effect
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        card.name
                      )}&background=random`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium text-sm md:text-base">
                      {card.name}
                    </p>
                    {card.verified && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-blue-400"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs">{card.username}</p>
                  <p className="mt-2 text-gray-200 text-sm md:text-base">
                    {card.text}
                  </p>
                </div>
              </div>
              <div className="absolute top-3 right-3 text-blue-400/50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                  <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
