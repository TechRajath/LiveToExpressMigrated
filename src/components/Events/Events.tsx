import { useState, useEffect, useRef, RefObject } from "react";
import { ArrowRight } from "lucide-react";

// Type for each event
interface EventData {
  id: number;
  title: string;
  date: string;
  location: string;
  attendees: number;
  tags: string[];
  image: string;
}

// Sample event data with tags
const eventsData: EventData[] = [
  {
    id: 1,
    title: "Birthday Event",
    date: "5th August 2024",
    location: "Los Angeles, USA",
    attendees: 28,
    tags: ["#party", "#celebration"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQV-Pmitjpb6QSnGa7bmYhDbklri1usqUZRiA&s",
  },
  {
    id: 2,
    title: "Music Festival",
    date: "12th August 2024",
    location: "San Francisco, USA",
    attendees: 124,
    tags: ["#music", "#arts"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzKzccO6FA_ogUCFo5n6TeUGvW6FVyuBXL9PK1aBx1fZJ7SkozuZ8EXneVEFs3God5fZE&usqp=CAU",
  },
  {
    id: 3,
    title: "Tech Conference",
    date: "18th August 2024",
    location: "New York, USA",
    attendees: 85,
    tags: ["#tech", "#business"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRchbXSjRQTL1853VH_GdjK8KB1Synfd2Uwdw&s",
  },
  {
    id: 4,
    title: "Art Exhibition",
    date: "22nd August 2024",
    location: "Chicago, USA",
    attendees: 42,
    tags: ["#art", "#culture"],
    image:
      "https://images.stockcake.com/public/2/3/9/2397d77f-af92-4b51-8bb9-d60d138cf4d0_large/vibrant-art-exhibition-stockcake.jpg",
  },
  {
    id: 5,
    title: "Comedy Night",
    date: "27th August 2024",
    location: "Austin, USA",
    attendees: 56,
    tags: ["#comedy", "#entertainment"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQP3LUP-jibsnIq17HTQax3PX6-D2IvfOOaoQ&s",
  },
  {
    id: 6,
    title: "Food Festival",
    date: "3rd September 2024",
    location: "Seattle, USA",
    attendees: 93,
    tags: ["#food", "#culture"],
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQLTdj3LNvCCTBj1RV_Ugmu7l0kT-uTo1XQnzwl7g1Fo_UZwKOQ1El9AyJ8v88gv8QAYg&usqp=CAU",
  },
];

// Props for Avatar component
interface AvatarProps {
  index: number;
}

// Avatar component for attendees
const Avatar: React.FC<AvatarProps> = ({ index }) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
  ];

  return (
    <div
      className={`${
        colors[index % colors.length]
      } h-6 w-6 rounded-full flex items-center justify-center text-xs text-white border border-gray-800`}
      style={{
        marginLeft: index > 0 ? "-8px" : "0",
        fontFamily: "'Poor Story', cursive",
      }}
    >
      {index + 1}
    </div>
  );
};

const Events: React.FC = () => {
  const carouselRef: RefObject<HTMLDivElement | null> = useRef(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto slide functionality
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex =
            prevIndex < eventsData.length - 1 ? prevIndex + 1 : 0;

          if (carouselRef.current && carouselRef.current.children[nextIndex]) {
            const child = carouselRef.current.children[
              nextIndex
            ] as HTMLElement;
            const scrollAmount = child.clientLeft + child.offsetLeft;
            carouselRef.current.scrollTo({
              left: scrollAmount,
              behavior: "smooth",
            });
          }

          return nextIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isPaused, eventsData.length]);

  return (
    <div className="bg-black text-white p-4 md:p-6 lg:p-8 w-full">
      {/* Header with absolute positioning for the "View all" button */}
      <div className="mb-6">
        {/* Heading in center */}
        <div className="text-center w-full">
          <h1
            className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
            style={{
              fontFamily: "'Poor Story', cursive",
              lineHeight: "2",
            }}
          >
            Popular events
          </h1>
        </div>

        {/* "View all" button below */}
        <div className="text-right mt-2">
          <button
            className="flex items-center justify-center space-x-1 text-purple-300 hover:text-purple-400 transition-colors"
            style={{ fontFamily: "'Poor Story', cursive" }}
          >
            <span className="text-sm md:text-base">View all</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Events carousel - with hidden scrollbar */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x pb-4 no-scrollbar"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {eventsData.map((event, index) => (
            <div
              key={event.id}
              className="flex-none w-64 md:w-80 lg:w-96 mr-4 snap-start bg-black rounded-xl overflow-hidden shadow-lg"
              style={{ fontFamily: "'Poor Story', cursive" }}
            >
              <div className="relative h-40 md:h-52 lg:h-64">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              <div className="p-5">
                <div className="text-xs text-gray-400">{event.date}</div>
                <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-400">
                  <span>📍</span>
                  <span className="ml-1">{event.location}</span>
                </div>

                <div className="flex items-center justify-between mt-5">
                  <div className="flex">
                    {[...Array(Math.min(3, event.attendees % 10))].map(
                      (_, i) => (
                        <Avatar key={i} index={i} />
                      )
                    )}
                    {event.attendees > 3 && (
                      <div
                        className="bg-gray-700 h-6 w-8 rounded-full flex items-center justify-center text-xs text-white border border-gray-800 ml-1"
                        style={{ fontFamily: "'Poor Story', cursive" }}
                      >
                        +{event.attendees - 3}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-purple-900/50 px-2 py-1 text-xs text-purple-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {eventsData.map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${
                currentIndex === index ? "w-4 bg-purple-400" : "w-2 bg-gray-600"
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setIsPaused(true);
                setTimeout(() => setIsPaused(false), 5000);

                if (
                  carouselRef.current &&
                  carouselRef.current.children[index]
                ) {
                  const child = carouselRef.current.children[
                    index
                  ] as HTMLElement;
                  const scrollAmount = child.offsetLeft;
                  carouselRef.current.scrollTo({
                    left: scrollAmount,
                    behavior: "smooth",
                  });
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Events;
