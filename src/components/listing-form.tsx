"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { ImageUp } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { SafeImage } from "@/components/safe-image";
type ListingFormProps = {
    action: (formData: FormData) => Promise<void>;
    submitLabel?: string;
    submittingLabel?: string;
    initialValues?: {
        title: string;
        category: string;
        description: string;
        locationValue: string;
        pricePerNight: number;
        guestCount: number;
        roomCount: number;
        bathroomCount: number;
        imageSrc: string;
        imageGallery: string[];
    };
};
export function ListingForm({ action, submitLabel = "Publish listing", submittingLabel = "Publishing...", initialValues }: ListingFormProps) {
    const [galleryImages, setGalleryImages] = useState<string[]>(initialValues
        ? Array.from(new Set([
            ...(initialValues.imageGallery ?? []),
            ...(initialValues.imageSrc ? [initialValues.imageSrc] : [])
        ].filter(Boolean))).slice(0, 10)
        : []);
    const [uploadError, setUploadError] = useState("");
    const [isDragActive, setIsDragActive] = useState(false);
    const { startUpload, isUploading } = useUploadThing("imageUploader", {
        onClientUploadComplete: (res) => {
            const urls = (res ?? [])
                .map((item) => item?.ufsUrl || item?.url || "")
                .filter(Boolean);
            setGalleryImages((prev) => Array.from(new Set([...prev, ...urls])).slice(0, 10));
            setUploadError("");
        },
        onUploadError: (error) => {
            setUploadError(error.message);
        }
    });
     async function handleFileUpload(files: FileList | File[] | null) {
        const list = files ? Array.from(files) : [];
        if (list.length === 0)
            return;
        if (galleryImages.length + list.length > 10) {
            setUploadError("You can upload up to 10 images per listing.");
            return;
        }
        if (list.some((file) => !file.type.startsWith("image/"))) {
            setUploadError("Please upload an image file.");
            return;
        }
        if (list.some((file) => file.size > 4 * 1024 * 1024)) {
            setUploadError("Image must be 4MB or smaller.");
            return;
        }
        setUploadError("");
        await startUpload(list.slice(0, 10 - galleryImages.length));
    }
    function removeImage(imageUrl: string) {
        setGalleryImages((prev) => prev.filter((image) => image !== imageUrl));
    }
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        if (galleryImages.length === 0) {
            event.preventDefault();
            setUploadError("Upload at least one image. The first image is used as the cover photo.");
        }
    }