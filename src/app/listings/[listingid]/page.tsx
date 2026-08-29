import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { fetchDemoProperties } from "@/lib/demo-properties";
import { syncDemoListingById } from "@/lib/sync-demo-listings";
import { ListingImageGallery } from "@/components/listing-image-gallery";
import { ListingHeaderInfo } from "@/components/listing/listing-header-info";
import { ListingAbout } from "@/components/listing/listing-about";
import { ListingBookedRanges } from "@/components/listing/listing-booked-ranges";
import { ListingMap } from "@/components/listing/listing-map";
import { ListingBookingSidebar } from "@/components/listing/listing-booking-sidebar";

type ListingPageProps = {
    params: Promise<{
        listingId: string;
    }>;
    searchParams: Promise<{
        booking?: string;
        message?: string;
        checkIn?: string;
        checkOut?: string;
        adults?: string;
        children?: string;
        infants?: string;
    }>;
};