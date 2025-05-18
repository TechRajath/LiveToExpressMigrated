"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  doc,
  deleteDoc,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Dialog } from "@headlessui/react";
import { Trash2, Upload } from "lucide-react";

interface CreativeItem {
  id: string;
  imageUrl: string;
  description: string;
  uploadedAt: any;
}

export default function CreativeCorner() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch items with React Query
  const { data: items = [], isLoading } = useQuery<CreativeItem[]>({
    queryKey: ["creative-corner"],
    queryFn: () => {
      return new Promise((resolve) => {
        const unsubscribe = onSnapshot(
          collection(db, "CreativeCorner"),
          (snapshot) => {
            const itemsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as CreativeItem[];
            resolve(itemsData);
          }
        );
        return () => unsubscribe();
      });
    },
    staleTime: 12 * 60 * 60 * 1000, // 12 hours
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      // Delete from Firestore
      await deleteDoc(doc(db, "CreativeCorner", id));

      // Delete from Storage
      const storageRef = ref(
        storage,
        decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0])
      );
      await deleteObject(storageRef);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creative-corner"] });
      setSuccessMessage("Item deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error deleting item.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!files || files.length === 0) return;

      const uploads = Array.from(files).map(async (file) => {
        // Check if file is an image
        if (file.type !== "image/webp") return;

        // Upload to Storage
        const storageRef = ref(storage, `CreativeCorner/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        // Add to Firestore
        await addDoc(collection(db, "CreativeCorner"), {
          imageUrl: url,
          description: description,
          uploadedAt: serverTimestamp(),
        });
      });

      await Promise.all(uploads);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creative-corner"] });
      setFiles(null);
      setDescription("");
      setSuccessMessage("Items uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error uploading items.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  // Delete all mutation
  const deleteAllMutation = useMutation({
    mutationFn: async () => {
      const deletePromises = items.map((item: any) =>
        deleteMutation.mutateAsync({ id: item.id, url: item.imageUrl })
      );
      await Promise.all(deletePromises);
    },
    onSuccess: () => {
      setSuccessMessage("All items deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
    onError: () => {
      setSuccessMessage("Error deleting all items.");
      setTimeout(() => setSuccessMessage(""), 3000);
    },
  });

  const handleDelete = useCallback(
    (id: string, url: string) => {
      deleteMutation.mutate({ id, url });
      setConfirmDelete(null);
    },
    [deleteMutation]
  );

  const handleDeleteAll = useCallback(() => {
    deleteAllMutation.mutate();
    setConfirmDeleteAll(false);
  }, [deleteAllMutation]);

  const handleUpload = useCallback(() => {
    uploadMutation.mutate();
  }, [uploadMutation]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Creative Corner
        </h1>
        <p className="text-lg text-gray-600">
          Showcase your creative work with the community
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 relative">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add Creative Corner Images
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
            Choose Images (WEBP format only, you can choose multiple Images)
          </label>
          <input
            type="file"
            multiple
            accept="image/webp"
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-gray-500 cursor-pointer
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-text"
            rows={3}
            placeholder="Tell us about your creation..."
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={!files || files.length === 0 || uploadMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors flex items-center gap-2"
          >
            {uploadMutation.isPending ? (
              "Uploading..."
            ) : (
              <>
                <Upload size={18} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 ">
          Current Creations
        </h2>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading creations...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">
              No creations yet. Be the first to share!
            </p>
          </div>
        ) : (
          <>
            {/* Delete All Button */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setConfirmDeleteAll(true)}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2 transition-colors cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed"
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

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item: any) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-default"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.description}
                    className="w-full h-48 object-cover cursor-pointer"
                    onClick={() => window.open(item.imageUrl, "_blank")}
                  />
                  <div className="p-4">
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    <div className="flex justify-end">
                      <button
                        onClick={() => setConfirmDelete(item.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:text-red-800 transition-colors cursor-pointer disabled:text-red-300 disabled:cursor-not-allowed"
                        aria-label="Delete item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Single Item Confirmation Dialog */}
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
              Are you sure you want to delete this item? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDelete) {
                    const item = items.find((i: any) => i.id === confirmDelete);
                    if (item) {
                      handleDelete(item.id, item.imageUrl);
                    }
                  }
                }}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed"
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
              Delete All Items?
            </Dialog.Title>
            <p className="text-gray-600 mb-6">
              This will permanently delete all items in the Creative Corner.
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAll}
                disabled={deleteAllMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-2"
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
