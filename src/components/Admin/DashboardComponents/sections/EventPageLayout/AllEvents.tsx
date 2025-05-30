import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface EventData {
  id: string;
  title: string;
  date: string;
  time: string;
  totalTickets: number;
  status: string;
  images: { url: string }[];
}

const statuses = ["upcoming", "ongoing", "completed", "cancelled"];

const AllEvents = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("upcoming");

  const fetchEvents = async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3000/api/events?status=${status}`,
        {
          headers: {
            "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
          },
        }
      );

      if (!response.ok)
        throw new Error(`Failed to fetch events: ${response.status}`);

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
        status: event.status,
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

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  return (
    <div className="bg-white text-gray-800 p-4 md:p-6 lg:p-8 w-full">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1
            className="text-3xl xs:text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800"
            style={{ fontFamily: "'Poor Story', cursive", lineHeight: "2" }}
          >
            All Events
          </h1>
          <select
            className="bg-gray-100 border border-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500">Loading events...</p>
      )}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      {!loading && events.length === 0 && (
        <p className="text-center text-gray-500">
          No events found for selected status.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <Link href={`dashboard/event/${event.id}`} key={event.id}>
            <div
              className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:border-purple-400 transition cursor-pointer"
              style={{ fontFamily: "'Poor Story', cursive" }}
            >
              <div className="p-3 bg-purple-100 text-purple-800 text-xs font-bold">
                {event.status.toUpperCase()}
              </div>

              <div className="relative h-48">
                {event.images.length > 0 && (
                  <img
                    src={event.images[0].url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {event.title}
                </h3>
                <div className="flex items-center mt-2 text-sm text-gray-600">
                  <span>📍</span>
                  <span className="ml-1">Cafe Location</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllEvents;
