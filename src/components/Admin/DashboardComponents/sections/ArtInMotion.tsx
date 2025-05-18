"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Dialog } from "@headlessui/react";
import { Trash2 } from "lucide-react";

interface Video {
  id?: string;
  videoId: string;
  title: string;
  description: string;
  createdAt?: any;
}

export default function ArtInMotion() {
  const queryClient = useQueryClient();
  const [newVideo, setNewVideo] = useState<Omit<Video, "id">>({
    videoId: "",
    title: "",
    description: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch videos with React Query
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["art-in-motion"],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, "ArtInMotion"));
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Video[];
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours cache
  });

  // Add video mutation
  const addMutation = useMutation({
    mutationFn: async (video: Omit<Video, "id">) => {
      await addDoc(collection(db, "ArtInMotion"), {
        ...video,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["art-in-motion"] });
      setNewVideo({ videoId: "", title: "", description: "" });
      setSuccessMessage("Video added successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error adding video.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  // Delete video mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "ArtInMotion", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["art-in-motion"] });
      setSuccessMessage("Video deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error deleting video.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  // Delete all videos mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const deletePromises = videos.map((video) =>
        video.id
          ? deleteDoc(doc(db, "ArtInMotion", video.id))
          : Promise.resolve()
      );
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["art-in-motion"] });
      setSuccessMessage("All videos deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error deleting videos.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.videoId || !newVideo.title || !newVideo.description) {
      setSuccessMessage("All fields are required.");
      setTimeout(() => setSuccessMessage(""), 3000);
      return;
    }
    addMutation.mutate(newVideo);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
    setConfirmDelete(null);
  };

  const handleDeleteAll = () => {
    deleteAllMutation.mutate();
    setConfirmDeleteAll(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Art in Motion Section
        </h1>
        <p className="text-lg text-gray-600">
          Manage YouTube videos for the Art in Motion section
        </p>
      </div>

      {/* Add Video Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Video
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto">
          <div className="space-y-2">
            <label
              htmlFor="videoId"
              className="block font-medium text-gray-700"
            >
              YouTube Video ID
            </label>
            <input
              id="videoId"
              type="text"
              placeholder="e.g., dQw4w9WgXcQ"
              value={newVideo.videoId}
              onChange={(e) =>
                setNewVideo({ ...newVideo, videoId: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="block font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Video title"
              value={newVideo.title}
              onChange={(e) =>
                setNewVideo({ ...newVideo, title: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="block font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              placeholder="Video description"
              value={newVideo.description}
              onChange={(e) =>
                setNewVideo({ ...newVideo, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={addMutation.isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {addMutation.isPending ? "Adding..." : "Add Video"}
            </button>
          </div>
        </form>
      </div>

      {/* Current Videos Section */}
      <div className="bg-white p-6 rounded-lg shadow-md ">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Current Videos
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No videos yet.</p>
          </div>
        ) : (
          <>
            {/* Delete All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setConfirmDeleteAll(true)}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
              >
                {deleteAllMutation.isPending ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete All
                  </>
                )}
              </button>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="relative bg-gray-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <h4 className="text-lg font-semibold">{video.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    YouTube ID: {video.videoId}
                  </p>
                  <p className="text-sm text-gray-600">{video.description}</p>
                  <button
                    onClick={() => video.id && setConfirmDelete(video.id)}
                    disabled={deleteMutation.isPending}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors disabled:bg-red-400 disabled:cursor-not-allowed"
                    aria-label="Delete video"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Confirm Deletion
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this video? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete && handleDelete(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete All Confirmation Dialog */}
      <Dialog
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Delete All Videos?
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              This will permanently delete all videos. This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400"
              >
                {deleteAllMutation.isPending ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete All
                  </>
                )}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
    </div>
  );
}
