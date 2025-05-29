"use client";
import Script from "next/script";
import { useState } from "react";
import Swal from "sweetalert2";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaTicketAlt,
  FaTimes,
} from "react-icons/fa";

interface BookingFormProps {
  eventId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BookingForm({
  eventId,
  onSuccess,
  onCancel,
}: BookingFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    ticketCount: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "ticketCount"
          ? Math.min(10, Math.max(1, parseInt(value) || 1))
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/events/book", {
        method: "POST",
        headers: {
          "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Booking failed.");
        setIsSubmitting(false);
        return;
      }

      console.log("Booking successful:", data);

      const razorpayOptions = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Event Ticket",
        description: `Booking for event ${eventId}`,
        order_id: data.order.id,
        handler: async function (response: any) {
          console.log("Payment Success:", response);

          try {
            const res = await fetch(
              "http://localhost:3000/api/events/payment-verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
                },
                body: JSON.stringify({
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                  receipt: data.order.receipt, //This is Event Booking ID , we placed it in receipt for track
                  ticketCount: formData.ticketCount,
                }),
              }
            );

            const result = await res.json();

            if (!res.ok) {
              throw new Error(result.message || "Verification failed");
            }

            console.log("Verification successful:", result);
            Swal.fire({
              icon: "success",
              title: "🎉 Event Booked Successfully!",
              html: `
    <div style="font-size: 16px; color: #4a4a4a;">
      <p>Your ticket details have been sent via <strong style="color: #6a0dad;">WhatsApp</strong> or <strong style="color: #6a0dad;">Email</strong>.</p>
      <p>Feel free to book more tickets and explore exciting events!</p>
      <p><em>Redirecting you shortly...</em></p>
    </div>
  `,
              background: "#f4f4f9",
              color: "#333",
              timer: 5000,
              timerProgressBar: true,
              showConfirmButton: false,
              customClass: {
                popup: "custom-swal-popup",
              },
              willClose: () => {
                window.location.href = "/"; // Redirect after modal closes
              },
            });

            onSuccess();
          } catch (err) {
            console.error("Verification error:", err);
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment window closed by user");
            Swal.fire({
              icon: "info",
              title: "Payment Cancelled",
              text: "You closed the payment window. No payment was made.",
              background: "#f8f8fb",
              color: "#555",
            });
          },
          escape: true,
          backdropclose: false,
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#7e22ce",
        },
      };

      const razorpay = new (window as any).Razorpay(razorpayOptions);
      razorpay.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      razorpay.open();

      setIsSubmitting(false);
    } catch (error) {
      console.error("Booking error:", error);
      setError("Something went wrong during payment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-800 w-full max-w-md relative">
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>

          <h2 className="text-2xl font-bold mb-6">Book Tickets</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-300">
                <FaUser className="text-gray-400" />
                <span>Full Name*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="John Doe"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-300">
                <FaEnvelope className="text-gray-400" />
                <span>Email*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="john@example.com"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-300">
                <FaPhone className="text-gray-400" />
                <span>Phone Number*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="+1 (555) 123-4567"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-gray-300">
                <FaTicketAlt className="text-gray-400" />
                <span>Number of Tickets* (Max 10)</span>
              </label>
              <input
                type="number"
                name="ticketCount"
                min="1"
                max="10"
                value={formData.ticketCount}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
                disabled={isSubmitting}
              />
            </div>

            <p className="text-sm text-gray-400">
              Note: We will send ticket details to either email or WhatsApp
            </p>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  "Pay & Confirm Booking"
                )}
              </button>
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
