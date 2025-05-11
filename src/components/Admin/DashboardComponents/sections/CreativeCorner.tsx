"use client";

import { useState, useEffect, useCallback } from "react";
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
import { Trash2 } from "lucide-react";

interface CreativeItem {
  id: string;
  imageUrl: string;
  description: string;
  uploadedAt: any;
}

export default function CreativeCorner() {
  const [items, setItems] = useState<CreativeItem[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [description, setDescription] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch items in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "CreativeCorner"),
      (snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as CreativeItem[];
        setItems(itemsData);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = useCallback(async (id: string, url: string) => {
    try {
      // Delete from Firestore
      await deleteDoc(doc(db, "CreativeCorner", id));

      // Delete from Storage
      const storageRef = ref(
        storage,
        decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0])
      );
      await deleteObject(storageRef);

      setSuccessMessage("Item deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting item:", error);
      setSuccessMessage("Error deleting item.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setConfirmDelete(null);
  }, []);

  const handleDeleteAll = useCallback(async () => {
    setDeletingAll(true);
    try {
      for (const item of items) {
        await handleDelete(item.id, item.imageUrl);
      }
      setSuccessMessage("All items deleted successfully.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error deleting all items:", error);
      setSuccessMessage("Error deleting all items.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
    setDeletingAll(false);
  }, [items, handleDelete]);

  const handleUpload = useCallback(async () => {
    if (!files || files.length === 0) return;

    try {
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
      setFiles(null);
      setDescription("");
      setSuccessMessage("Items uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error uploading items:", error);
      setSuccessMessage("Error uploading items.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  }, [files, description]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Creative Corner</h1>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Content</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Images - image should be in webp format
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setFiles(e.target.files)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Enter a description for your content..."
          />
        </div>

        <button
          onClick={handleUpload}
          disabled={!files || files.length === 0}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Upload Content
        </button>
      </div>

      {/* Content Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={item.imageUrl}
              alt={item.description}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-gray-700 mb-4">{item.description}</p>
              <div className="flex justify-end">
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Delete item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete All Button (only shown when there are items) */}
      {items.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center gap-2"
            disabled={deletingAll}
          >
            {deletingAll ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={18} />
                Delete All
              </>
            )}
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded shadow max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Are you sure you want to delete this item?
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
                  if (confirmDelete) {
                    const item = items.find((i) => i.id === confirmDelete);
                    if (item) {
                      handleDelete(item.id, item.imageUrl);
                    }
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {successMessage}
        </div>
      )}
    </div>
  );
}
