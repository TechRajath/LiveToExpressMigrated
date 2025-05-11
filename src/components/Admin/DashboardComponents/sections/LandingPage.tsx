"use client";

import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { Trash2 } from "lucide-react";
import { Dialog } from "@headlessui/react";

export default function LandingPage() {
  const [images, setImages] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<null | string>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);

  const fetchImages = async () => {
    const snapshot = await getDocs(collection(db, "LandingPage"));
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setImages(data);
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async () => {
    if (!files) return;
    const uploads = Array.from(files).map(async (file) => {
      if (file.type !== "image/webp") return;
      const storageRef = ref(storage, `LandingPage/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await addDoc(collection(db, "LandingPage"), {
        imageUrl: url,
        uploadedAt: serverTimestamp(),
      });
    });
    await Promise.all(uploads);
    setFiles(null);
    setSuccessMessage("Images uploaded successfully.");
    fetchImages();
  };

  const handleDelete = async (id: string, url: string) => {
    await deleteDoc(doc(db, "LandingPage", id));
    const storageRef = ref(
      storage,
      decodeURIComponent(new URL(url).pathname.split("/o/")[1].split("?")[0])
    );
    await deleteObject(storageRef);
    setConfirmDelete(null);
    fetchImages();
  };

  const handleDeleteAll = async () => {
    setDeletingAll(true);
    for (const img of images) {
      await handleDelete(img.id, img.imageUrl);
    }
    setDeletingAll(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold">#LiveToExpress Landing Page</h2>

      <h3 className="text-xl">Contents Already on Website</h3>
      {images.length === 0 ? (
        <p>No content present.</p>
      ) : (
        <>
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={deletingAll}
          >
            Delete All
          </button>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((img) => (
              <div key={img.id} className="relative">
                <img src={img.imageUrl} alt="" className="rounded shadow" />
                <button
                  onClick={() => setConfirmDelete(img.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirm Delete Modal */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Are you sure?</h3>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const item = images.find((i) => i.id === confirmDelete);
                  if (item) handleDelete(item.id, item.imageUrl);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </Dialog>

      <h3 className="text-xl">Upload Content into Website</h3>
      <p className="text-sm text-gray-600">* Only upload .webp images</p>

      <input
        type="file"
        multiple
        accept="image/webp"
        onChange={(e) => setFiles(e.target.files)}
        className="mt-2 block"
      />

      <button
        onClick={handleUpload}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>

      {successMessage && (
        <p className="text-green-600 mt-2">{successMessage}</p>
      )}
    </div>
  );
}
