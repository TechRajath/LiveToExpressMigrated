"use client";

import { useState, useEffect } from "react";
import { PulseLoader } from "react-spinners";
import { Dialog } from "@headlessui/react";
import { Trash2, Download } from "lucide-react";
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

const SingleEvent = ({ eventId }: { eventId: string }) => {
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
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

  const handleDeleteEvent = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/events/${eventId}`,
        {
          method: "DELETE",
          headers: {
            "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      // Redirect or show success message
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-4">
          <PulseLoader color="#6b7280" size={15} />
          <span className="text-lg">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center text-red-500 text-xl">{error}</div>
    );
  }

  if (!eventData) {
    return <div className="py-12 text-center text-xl">Event not found</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      {/* Header with title and delete button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{eventData.title}</h1>
        <button
          onClick={() => setIsDeleteDialogOpen(true)}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Trash2 size={18} />
          Delete Event
        </button>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-xl font-bold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <Dialog.Description className="mb-6">
              Are you sure you want to delete this event? This action cannot be
              undone.
            </Dialog.Description>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300 flex items-center gap-2"
              >
                {isDeleting ? (
                  <PulseLoader color="#ffffff" size={8} />
                ) : (
                  <Trash2 size={16} />
                )}
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Image Carousel */}
      {eventData.images?.length ? (
        <div className="relative h-96 mb-8 rounded-xl overflow-hidden">
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
                      index === currentImageIndex
                        ? "bg-purple-600"
                        : "bg-gray-300"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-24 mb-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
          No images available
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="lg:col-span-2 space-y-6">
          {eventData.description && (
            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b border-gray-200 pb-2">
                Description
              </h2>
              <p className="text-gray-600">{eventData.description}</p>
            </section>
          )}

          {eventData.artistDetails?.length ? (
            <section>
              <h2 className="text-2xl font-semibold mb-3 border-b border-gray-200 pb-2">
                Artists
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {eventData.artistDetails.map((artist, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {artist.avatar ? (
                          <img
                            src={artist.avatar}
                            alt={artist.username}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FaUserAlt className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{artist.username}</h3>
                        {artist.bio && (
                          <p className="text-sm text-gray-500">{artist.bio}</p>
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
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-200 pb-2">
              Event Details
            </h2>
            <div className="space-y-4">
              {(eventData.day || eventData.date) && (
                <div className="flex items-start space-x-3">
                  <FaCalendarAlt className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Date</p>
                    <p>
                      {eventData.day && `${eventData.day}, `}
                      {eventData.date &&
                        new Date(eventData.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {eventData.time && (
                <div className="flex items-start space-x-3">
                  <FaClock className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Time</p>
                    <p>{eventData.time}</p>
                  </div>
                </div>
              )}

              {(eventData.ticketsSold !== undefined ||
                eventData.totalTickets !== undefined ||
                eventData.price !== undefined) && (
                <div className="flex items-start space-x-3">
                  <FaTicketAlt className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Tickets</p>
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

              {(eventData.totalMembers || eventData.ageGroup) && (
                <div className="flex items-start space-x-3">
                  <FaUsers className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Group Size</p>
                    {eventData.totalMembers && (
                      <p>Up to {eventData.totalMembers} members</p>
                    )}
                    {eventData.ageGroup && <p>Ages: {eventData.ageGroup}</p>}
                  </div>
                </div>
              )}

              {eventData.languages?.length ? (
                <div className="flex items-start space-x-3">
                  <FaLanguage className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Languages</p>
                    <p>{eventData.languages.join(", ")}</p>
                  </div>
                </div>
              ) : null}

              {eventData.petFriendly && (
                <div className="flex items-start space-x-3">
                  <FaPaw className="text-gray-500 mt-1" />
                  <div>
                    <p className="text-gray-500 text-sm">Pet Friendly</p>
                    <p>{eventData.petFriendly === "yes" ? "Yes" : "No"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
