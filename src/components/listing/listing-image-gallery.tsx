"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SafeImage } from "@/components/safe-image";
type ListingImageGalleryProps = {
    images: string[];
    altBase: string;
};