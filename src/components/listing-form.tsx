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