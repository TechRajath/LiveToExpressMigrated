"use client";

import { useState } from "react";
import SingleEvent from "../SingleEvent/SingleEvent";
import BookingForm from "../BookingForm/BookingForm";
interface EventPageLayoutProps {
  eventId: string;
}

export default function EventPageLayout({ eventId }: EventPageLayoutProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <SingleEvent
          eventId={eventId}
          onBookNow={() => setShowBookingModal(true)}
        />

        {showBookingModal && (
          <BookingForm
            eventId={eventId}
            onSuccess={() => {
              setShowBookingModal(false);
              //alert("Booking successful!");
            }}
            onCancel={() => setShowBookingModal(false)}
          />
        )}
      </div>
    </div>
  );
}
