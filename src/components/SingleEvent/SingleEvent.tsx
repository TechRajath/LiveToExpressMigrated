"use client";

import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaLanguage,
  FaPaw,
  FaUserAlt,
  FaImage,
  FaBook,
} from "react-icons/fa";
import { PulseLoader } from "react-spinners";

interface Artist {
  username: string;
  bio: string;
  avatar: string;
}

interface Image {
  url: string;
  alt: string;
}

interface EventData {
  title: string;
  description: string;
  date: string;
  day: string;
  time: string;
  category: string;
  artistDetails?: Artist[];
  totalTickets?: number;
  ticketsSold?: number;
  price?: number;
  totalMembers?: number;
  ageGroup?: string;
  images?: Image[];
  petFriendly?: string;
  languages?: string[];
  userId?: string;
  status?: string;
}

interface EventProps {
  eventId: string;
}
interface SingleEventProps {
  eventId: string;
  onBookNow: () => void;
}
const SingleEvent: React.FC<SingleEventProps> = ({ eventId, onBookNow }) => {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        console.log("Event id is", eventId);
        const response = await fetch(
          `http://localhost:3000/api/events/${eventId}`,
          {
            method: "GET",
            headers: {
              "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event data");
        }

        const eventResponse = await response.json();

        setEventData(eventResponse.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (eventData?.images && eventData.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % eventData.images?.length
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [eventData?.images]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <PulseLoader color="#ffffff" size={15} />
          <span className="text-lg">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {eventData?.title && (
          <h1 className="text-4xl font-bold mb-8 text-center">
            {eventData.title}
          </h1>
        )}

        {/* Image Carousel - Only show if images exist */}
        {eventData?.images?.length ? (
          <div className="relative h-96 mb-10 rounded-xl overflow-hidden">
            <div className="relative h-full w-full">
              <img
                src={eventData.images[currentImageIndex]?.url}
                alt={eventData.images[currentImageIndex]?.alt || "Event image"}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {eventData.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {eventData.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2 w-2 rounded-full ${
                        index === currentImageIndex ? "bg-white" : "bg-gray-500"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-24 mb-10"></div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-8">
            {eventData?.description && (
              <section>
                <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  Description
                </h2>
                <p className="text-gray-300">{eventData.description}</p>
              </section>
            )}

            {eventData?.artistDetails?.length ? (
              <section>
                <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">
                  Artists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventData.artistDetails.map((artist, index) => (
                    <div key={index} className="bg-gray-900 p-4 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {artist.avatar ? (
                            <img
                              src={artist.avatar}
                              alt={artist.username}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <FaUserAlt className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{artist.username}</h3>
                          {artist.bio && (
                            <p className="text-sm text-gray-400">
                              {artist.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          {/* Right Column - Event Info */}
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
                Event Details
              </h2>
              <div className="space-y-4">
                {(eventData?.day || eventData?.date) && (
                  <div className="flex items-start space-x-3">
                    <FaCalendarAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Date</p>
                      <p>
                        {eventData.day && `${eventData.day}, `}
                        {eventData.date &&
                          new Date(eventData.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {eventData?.time && (
                  <div className="flex items-start space-x-3">
                    <FaClock className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Time</p>
                      <p>{eventData.time}</p>
                    </div>
                  </div>
                )}

                {(eventData?.ticketsSold !== undefined ||
                  eventData?.totalTickets !== undefined ||
                  eventData?.price !== undefined) && (
                  <div className="flex items-start space-x-3">
                    <FaTicketAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Tickets</p>
                      {eventData.ticketsSold !== undefined &&
                        eventData.totalTickets !== undefined && (
                          <p>
                            {eventData.ticketsSold} / {eventData.totalTickets}{" "}
                            sold
                          </p>
                        )}
                      {eventData.price !== undefined && (
                        <p>₹{eventData.price} per ticket</p>
                      )}
                    </div>
                  </div>
                )}

                {(eventData?.totalMembers || eventData?.ageGroup) && (
                  <div className="flex items-start space-x-3">
                    <FaUsers className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Group Size</p>
                      {eventData.totalMembers && (
                        <p>Up to {eventData.totalMembers} members</p>
                      )}
                      {eventData.ageGroup && <p>Ages: {eventData.ageGroup}</p>}
                    </div>
                  </div>
                )}

                {eventData?.languages?.length ? (
                  <div className="flex items-start space-x-3">
                    <FaLanguage className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Languages</p>
                      <p>{eventData.languages.join(", ")}</p>
                    </div>
                  </div>
                ) : null}

                {eventData?.petFriendly && (
                  <div className="flex items-start space-x-3">
                    <FaPaw className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-gray-400">Pet Friendly</p>
                      <p>{eventData.petFriendly === "yes" ? "Yes" : "No"}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              onClick={onBookNow}
            >
              <FaBook />
              <span>Book Event</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
