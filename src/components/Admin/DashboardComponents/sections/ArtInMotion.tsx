"use client";

import { useEffect, useState } from "react";
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
  id?: string; // Document ID from Firestore (auto-generated)
  videoId: string; // YouTube Video ID
  title: string;
  description: string;
  createdAt?: string;
}

export default function ArtInMotion() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [newVideo, setNewVideo] = useState<Video>({
    videoId: "",
    title: "",
    description: "",
  });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

  const fetchVideos = async () => {
    const snapshot = await getDocs(collection(db, "ArtInMotion"));
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // Firestore document ID
      ...doc.data(),
    })) as Video[];
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.videoId || !newVideo.title || !newVideo.description) {
      alert("All fields are required.");
      return;
    }
    try {
      await addDoc(collection(db, "ArtInMotion"), {
        videoId: newVideo.videoId,
        title: newVideo.title,
        description: newVideo.description,
        createdAt: serverTimestamp(),
      });
      setSuccessMessage("Video added successfully.");
      setNewVideo({ videoId: "", title: "", description: "" });
      fetchVideos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "ArtInMotion", docId));
      setSuccessMessage("Video deleted successfully.");
      setConfirmDelete(null);
      fetchVideos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    try {
      for (const video of videos) {
        if (video.id) {
          await deleteDoc(doc(db, "ArtInMotion", video.id));
        }
      }
      setSuccessMessage("All videos deleted successfully.");
      setConfirmDeleteAll(false);
      setDeletingAll(false);
      fetchVideos();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting all videos:", error);
      setDeletingAll(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">
        Website Content of "Art in Motion" Section
      </h2>

      <h3 className="text-xl">Contents Already on Website</h3>
      {videos.length === 0 ? (
        <p>No content present.</p>
      ) : (
        <>
          <button
            onClick={() => setConfirmDeleteAll(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            disabled={deletingAll}
          >
            {deletingAll ? "Deleting..." : "Delete All"}
          </button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="relative bg-gray-100 p-4 rounded shadow hover:shadow-md transition-shadow"
              >
                <h4 className="text-lg font-semibold">{video.title}</h4>
                <p className="text-sm text-gray-600 mb-2">
                  YouTube Video ID: {video.videoId}
                </p>
                <p className="text-sm text-gray-600">{video.description}</p>
                <button
                  onClick={() => video.id && setConfirmDelete(video.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  aria-label="Delete video"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Delete Single Video Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Are you sure?
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete) handleDelete(confirmDelete);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete All Videos Confirmation Dialog */}
      <Dialog
        open={confirmDeleteAll}
        onClose={() => setConfirmDeleteAll(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Are you sure you want to delete all videos?
            </Dialog.Title>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                disabled={deletingAll}
              >
                {deletingAll ? "Deleting..." : "Delete All"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <h3 className="text-xl">Add Content to Website</h3>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <label htmlFor="videoId" className="block font-medium">
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="block font-medium">
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
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Add Video
        </button>
      </form>

      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
    </div>
  );
}
