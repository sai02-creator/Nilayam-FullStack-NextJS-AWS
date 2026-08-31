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