import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  Plus,
  Trash2,
  Upload,
  X,
  Loader2,
  Check,
  ChevronDown,
} from "lucide-react";
import { uploadToFirebase } from "@/utils/uploadToFirebase";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface ArtistDetail {
  username: string;
  bio: string;
}

interface EventImage {
  url: string;
  alt: string;
}

interface EventFormData {
  title: string;
  category: string;
  date: string;
  time: string; // Will be stored as "HH:MM AM/PM"
  hour: string;
  minute: string;
  period: "AM" | "PM";
  ageGroup: string;
  description: string;
  artistDetails: ArtistDetail[];
  totalTickets: string;
  price: string;
  petFriendly: "yes" | "no";
  languages: string[];
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  userId: string;
  images: EventImage[];
}

const EVENT_CATEGORIES = [
  "Music",
  "Art",
  "Food",
  "Sports",
  "Technology",
  "Business",
  "Health",
  "Education",
] as const;

const EVENT_LANGUAGES = {
  ENGLISH: "English",
  KANNADA: "Kannada",
  HINDI: "Hindi",
  TAMIL: "Tamil",
  OTHER: "Other",
} as const;

const EVENT_STATUSES = [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
] as const;

const AGE_GROUPS = [
  "All ages",
  "18+",
  "21+",
  "Kids (5-12)",
  "Teens (13-19)",
  "Adults (20+)",
  "Seniors (65+)",
];

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  i.toString().padStart(2, "0")
);

export default function Events() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [files, setFiles] = useState<FileList | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const useridfetch = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => useridfetch();
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<EventFormData>({
    defaultValues: {
      petFriendly: "no",
      status: "upcoming",
      artistDetails: [{ username: "", bio: "" }],
      languages: [],
      userId: currentUser?.email?.split("@")[0] || "User",
      hour: "12",
      minute: "00",
      period: "AM",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "artistDetails",
  });

  const selectedLanguages = watch("languages");
  const selectedDate = watch("date");
  const hour = watch("hour");
  const minute = watch("minute");
  const period = watch("period");

  useEffect(() => {
    // Combine time components into a single time string
    setValue("time", `${hour}:${minute} ${period}`);
  }, [hour, minute, period, setValue]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFiles(e.target.files);
  };

  const handleUpload = async (): Promise<void> => {
    if (!files) return;

    setIsSubmitting(true);
    try {
      const urls: string[] = await uploadToFirebase(files, "Events");
      setImageUrls(urls);
      setValue(
        "images",
        urls.map((url: string) => ({ url, alt: "" }))
      );
    } catch (error) {
      console.error("Upload failed:", error);
      setApiErrors(["Image upload failed. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = (data: EventFormData): string | null => {
    if (!data.title?.trim()) return "Title is required";
    if (!data.category?.trim()) return "Category is required";
    if (!data.date) return "Date is required";

    // Validate date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.date);
    if (selectedDate < today) return "Date cannot be in the past";

    if (!data.time) return "Time is required";
    if (!data.ageGroup?.trim()) return "Age Group is required";
    if (!data.description?.trim()) return "Description is required";

    // Validate tickets
    const ticketsNum = parseInt(data.totalTickets);
    if (isNaN(ticketsNum)) return "Total tickets must be a valid number";
    if (ticketsNum <= 0) return "Total tickets must be greater than 0";

    // Validate price
    const priceNum = parseFloat(data.price);
    if (isNaN(priceNum)) return "Price must be a valid number";
    if (priceNum < 0) return "Price must be 0 or greater";

    if (data.artistDetails.length === 0)
      return "At least one artist is required";

    for (let i = 0; i < data.artistDetails.length; i++) {
      if (!data.artistDetails[i].username?.trim()) {
        return `Artist ${i + 1} username is required`;
      }
    }

    if (!data.images || data.images.length === 0) {
      return "At least one image is required";
    }

    return null;
  };

  const onSubmit = async (data: EventFormData): Promise<void> => {
    const validationError = validateForm(data);
    if (validationError) {
      setApiErrors([validationError]);
      return;
    }

    if (imageUrls.length === 0) {
      setApiErrors(["Please upload at least one image"]);
      return;
    }

    setIsSubmitting(true);
    setApiErrors([]);

    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "e484b3f8-c6bd-4e0d-ae58-7ae402fadba4",
        },
        body: JSON.stringify({
          ...data,
          // Convert string numbers to actual numbers for the API
          totalTickets: parseInt(data.totalTickets),
          price: parseFloat(data.price),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessages = Array.isArray(errorData.errors)
          ? errorData.errors
          : [errorData.message || "An error occurred"];
        setApiErrors(errorMessages);
        return;
      }

      setSubmitSuccess(true);
      reset();
      setImageUrls([]);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Submission failed:", error);
      setApiErrors(["An unexpected error occurred. Please try again."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = selectedLanguages.includes(language)
      ? selectedLanguages.filter((lang) => lang !== language)
      : [...selectedLanguages, language];
    setValue("languages", newLanguages);
  };

  // Get minimum date (today) for date picker
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          <Calendar className="inline mr-2" size={28} />
          Events
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center text-lg"
        >
          <Plus size={20} className="mr-2" />
          Create Event
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Event</h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    reset();
                    setImageUrls([]);
                    setApiErrors([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  disabled={isSubmitting}
                >
                  <X size={28} />
                </button>
              </div>

              {apiErrors.length > 0 && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
                  <h3 className="font-bold mb-2 text-lg">Errors:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {apiErrors.map((error, index) => (
                      <li key={index}>
                        {typeof error === "string"
                          ? error
                          : JSON.stringify(error)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("title", { required: "Title is required" })}
                      className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                        errors.title ? "border-red-500" : "border"
                      }`}
                    />
                    {errors.title?.message && (
                      <p className="mt-2 text-base text-red-600">
                        {errors.title.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("category", {
                        required: "Category is required",
                      })}
                      className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                        errors.category ? "border-red-500" : "border"
                      }`}
                    >
                      <option value="">Select a category</option>
                      {EVENT_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category?.message && (
                      <p className="mt-2 text-base text-red-600">
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      min={getMinDate()}
                      {...register("date", { required: "Date is required" })}
                      className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                        errors.date ? "border-red-500" : "border"
                      }`}
                    />
                    {errors.date?.message && (
                      <p className="mt-2 text-base text-red-600">
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Time <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        {...register("hour")}
                        className="mt-1 block w-1/3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                      >
                        {HOURS.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="flex items-center">:</span>
                      <select
                        {...register("minute")}
                        className="mt-1 block w-1/3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                      >
                        {MINUTES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                      <select
                        {...register("period")}
                        className="mt-1 block w-1/3 rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <input type="hidden" {...register("time")} />
                  </div>

                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Age Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("ageGroup", {
                        required: "Age Group is required",
                      })}
                      className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                        errors.ageGroup ? "border-red-500" : "border"
                      }`}
                    >
                      <option value="">Select age group</option>
                      {AGE_GROUPS.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.ageGroup?.message && (
                      <p className="mt-2 text-base text-red-600">
                        {errors.ageGroup.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    rows={4}
                    className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                      errors.description ? "border-red-500" : "border"
                    }`}
                  />
                  {errors.description && (
                    <p className="mt-2 text-base text-red-600">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Artist Details Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Artist Details</h3>
                  {fields.map(
                    (field: ArtistDetail & { id: string }, index: number) => (
                      <div
                        key={field.id}
                        className="border-2 p-6 rounded-lg relative space-y-4"
                      >
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={20} />
                          </button>
                        )}
                        <h4 className="font-medium text-lg">
                          Artist {index + 1}
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                              Username <span className="text-red-500">*</span>
                            </label>
                            <input
                              {...register(`artistDetails.${index}.username`, {
                                required: "Username is required",
                              })}
                              className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                                errors.artistDetails?.[index]?.username
                                  ? "border-red-500"
                                  : "border"
                              }`}
                            />
                            {errors.artistDetails?.[index]?.username && (
                              <p className="mt-2 text-base text-red-600">
                                {
                                  errors.artistDetails?.[index]?.username
                                    ?.message
                                }
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">
                              Bio
                            </label>
                            <textarea
                              {...register(`artistDetails.${index}.bio`)}
                              rows={2}
                              className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                            />
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => append({ username: "", bio: "" })}
                    className="flex items-center text-lg text-blue-600 hover:text-blue-800 font-medium"
                  >
                    <Plus size={20} className="mr-2" />
                    Add Another Artist
                  </button>
                </div>

                {/* Ticketing Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Ticketing Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Total Tickets <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text" // Changed from number to text
                        inputMode="numeric" // Shows numeric keyboard on mobile
                        {...register("totalTickets", {
                          required: "Total tickets is required",
                        })}
                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                          errors.totalTickets ? "border-red-500" : "border"
                        }`}
                      />
                      {errors.totalTickets && (
                        <p className="mt-2 text-base text-red-600">
                          {errors.totalTickets.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        inputMode="numeric" // Shows numeric keyboard on mobile
                        //step="0.01"
                        {...register("price", {
                          required: "Price is required",
                          pattern: {
                            value: /^\d+(\.\d{1,2})?$/, // Validates decimal numbers with up to 2 decimal places
                            message:
                              "Please enter a valid price (e.g. 100 or 99.99)",
                          },
                          min: {
                            value: 0,
                            message: "Price cannot be negative",
                          },
                        })}
                        className={`mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 ${
                          errors.price ? "border-red-500" : "border"
                        }`}
                      />
                      {errors.price && (
                        <p className="mt-2 text-base text-red-600">
                          {errors.price.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Image Upload Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Event Images</h3>
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Upload Images (At least 1 required){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <p className="text-gray-600 mb-3 text-base">
                      Upload high-quality images that represent your event.
                      Maximum 5 images allowed (WEBP).
                    </p>

                    {/* Drag and drop area */}
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.add(
                          "border-blue-500",
                          "bg-blue-50"
                        );
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-blue-50"
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-blue-500",
                          "bg-blue-50"
                        );
                        if (e.dataTransfer.files) {
                          setFiles(e.dataTransfer.files);
                        }
                      }}
                    >
                      <Upload
                        className="mx-auto mb-3 text-gray-400"
                        size={40}
                      />
                      <p className="text-lg font-medium text-gray-600">
                        Drag & drop images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Recommended size: 1200x800px or larger
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      multiple
                      accept="image/jpeg,image/png"
                      className="hidden"
                    />

                    <div className="flex items-center gap-3 mt-4">
                      {files && (
                        <button
                          type="button"
                          onClick={handleUpload}
                          disabled={isSubmitting}
                          className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center"
                        >
                          {isSubmitting ? (
                            <Loader2
                              className="inline mr-2 animate-spin"
                              size={18}
                            />
                          ) : (
                            <Upload className="inline mr-2" size={18} />
                          )}
                          Upload {files.length} Selected File(s)
                        </button>
                      )}
                      {files && (
                        <button
                          type="button"
                          onClick={() => {
                            setFiles(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                          className="px-4 py-2.5 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Clear Selection
                        </button>
                      )}
                    </div>

                    {/* Preview of selected files before upload */}
                    {files && !isSubmitting && (
                      <div className="mt-4">
                        <h4 className="text-base font-medium text-gray-700 mb-2">
                          Selected Files:
                        </h4>
                        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {Array.from(files).map((file, index) => (
                            <li key={index} className="border rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6 text-gray-400"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {file.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Preview of uploaded images */}
                    {imageUrls.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-base font-medium text-gray-700 mb-3">
                          Uploaded Images:
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {imageUrls.map((url, index) => (
                            <div
                              key={index}
                              className="relative group rounded-lg overflow-hidden border"
                            >
                              <img
                                src={url}
                                alt={`Event preview ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newUrls = [...imageUrls];
                                    newUrls.splice(index, 1);
                                    setImageUrls(newUrls);
                                    setValue(
                                      "images",
                                      newUrls.map((url) => ({ url, alt: "" }))
                                    );
                                  }}
                                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                  title="Remove image"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-green-600">
                          {imageUrls.length} image(s) uploaded successfully
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Options Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Pet Friendly
                    </label>
                    <select
                      {...register("petFriendly")}
                      className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Languages
                    </label>
                    <div
                      className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3 cursor-pointer"
                      onClick={() =>
                        setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                      }
                    >
                      <div className="flex justify-between items-center">
                        <span>
                          {selectedLanguages.length > 0
                            ? selectedLanguages.join(", ")
                            : "Select languages"}
                        </span>
                        <ChevronDown
                          className={`transition-transform ${
                            isLanguageDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                    {isLanguageDropdownOpen && (
                      <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-2 max-h-60 overflow-auto">
                        {Object.values(EVENT_LANGUAGES).map((language) => (
                          <div
                            key={language}
                            className="flex items-center p-2 hover:bg-gray-100 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLanguage(language);
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedLanguages.includes(language)}
                              readOnly
                              className="mr-2 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-lg">{language}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Section */}
                <div>
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg p-3"
                  >
                    {EVENT_STATUSES.map((status: string) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* User ID (hidden) */}
                <input
                  type="hidden"
                  {...register("userId")}
                  value="current_user_id" // Replace with actual user ID
                />

                {/* Submit Section */}
                <div className="pt-6 flex flex-col sm:flex-row justify-end gap-4 border-t border-gray-200">
                  <div className="flex-1">
                    {apiErrors.length > 0 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <h4 className="font-medium text-red-800 mb-1">
                          Please fix these errors:
                        </h4>
                        <ul className="list-disc pl-5 text-sm text-red-700">
                          {apiErrors.map((error, index) => (
                            <li key={index}>
                              {typeof error === "string"
                                ? error
                                : JSON.stringify(error)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        reset();
                        setImageUrls([]);
                        setApiErrors([]);
                      }}
                      className="px-6 py-3 border-2 border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || imageUrls.length === 0}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-medium hover:bg-blue-700 disabled:bg-blue-400 flex items-center justify-center transition-colors min-w-[150px]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={18} />
                          Creating...
                        </>
                      ) : (
                        "Create Event"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center text-lg">
          <Check className="mr-3" size={22} />
          Event created successfully!
        </div>
      )}
    </div>
  );
}
