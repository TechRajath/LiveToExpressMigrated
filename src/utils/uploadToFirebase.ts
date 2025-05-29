// utils/uploadToFirebase.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const uploadToFirebase = async (
  files: FileList | null,
  folderPath: string
) => {
  if (!files) return [];

  const uploadPromises = Array.from(files)
    .filter((file) => file.type === "image/webp")
    .map(async (file) => {
      const storageRef = ref(storage, `${folderPath}/${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    });

  return await Promise.all(uploadPromises);
};
