import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
//import { useRouter } from "next/router";
import Link from "next/link";
interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  totalTickets: number;
  images: { url: string }[];
}

const Events = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  //const router = useRouter();
  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/events?status=upcoming",
          {
            headers: {
              "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error("Invalid API response format");
        }

        const formattedEvents = result.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time,
          totalTickets: event.totalTickets,
          images: event.images || [],
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Auto slide functionality
  useEffect(() => {
    if (!isPaused && events.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = prevIndex < events.length - 1 ? prevIndex + 1 : 0;

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
  }, [isPaused, events]);

  if (loading) {
    return (
      <div className="bg-black text-white p-8 w-full flex justify-center">
        <div className="animate-pulse">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white p-8 w-full text-center">
        Error: {error}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-black text-white p-8 w-full text-center">
        No upcoming events found
      </div>
    );
  }

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
          {events.map((event, index) => (
            <Link href={`/event/${event.id}`} key={event.id}>
              <div
                key={event.id}
                //onClick={() => router.push(`/event/${event.id}`)}
                className="flex-none w-64 md:w-80 lg:w-96 mr-4 snap-start bg-black rounded-xl overflow-hidden shadow-lg cursor-pointer"
                style={{ fontFamily: "'Poor Story', cursive" }}
              >
                <div className="relative h-40 md:h-52 lg:h-64">
                  {event.images.length > 0 && (
                    <>
                      <img
                        src={event.images[0].url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    </>
                  )}
                </div>

                <div className="p-5">
                  <div className="text-xs text-gray-400">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <h3 className="text-xl font-bold mt-1">{event.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-400">
                    <span>📍</span>
                    <span className="ml-1">Cafe Loaction </span>{" "}
                    {/* Hardcoded location */}
                  </div>

                  <div className="flex items-center justify-between mt-5">
                    {/* Spot indicator - shows attendee avatars */}
                    <div className="flex items-center">
                      <span className="text-xs text-gray-400 mr-2">Spot:</span>
                      <div className="flex">
                        {[...Array(Math.min(3, event.totalTickets))].map(
                          (_, i) => (
                            <div
                              key={i}
                              className={`h-6 w-6 rounded-full flex items-center justify-center text-xs text-white border border-gray-800`}
                              style={{
                                marginLeft: i > 0 ? "-8px" : "0",
                                backgroundColor: [
                                  "#3b82f6",
                                  "#10b981",
                                  "#f59e0b",
                                ][i % 3], // blue, green, yellow
                                fontFamily: "'Poor Story', cursive",
                                zIndex: 3 - i, // Ensures proper stacking
                              }}
                            >
                              {i + 1}
                            </div>
                          )
                        )}
                        {event.totalTickets > 3 && (
                          <div
                            className="bg-gray-700 h-6 w-8 rounded-full flex items-center justify-center text-xs text-white border border-gray-800 ml-1"
                            style={{
                              fontFamily: "'Poor Story', cursive",
                              zIndex: 1,
                            }}
                          >
                            +{event.totalTickets - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      {["#event", "#popular"].map((tag, i) => (
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
            </Link>
          ))}
        </div>

        {/* Indicators */}
        <div className="flex justify-center mt-4 space-x-2">
          {events.map((_, index) => (
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
