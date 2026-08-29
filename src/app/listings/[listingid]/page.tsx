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

export default async function ListingPage({ params, searchParams }: ListingPageProps) {
    const { listingId } = await params;
    const query = await searchParams;
    const demoProperties = await fetchDemoProperties();
    const demoListingSeed = demoProperties.find((property) => property.id === listingId);
    let dbListing = await prisma.listing.findUnique({
        where: { id: listingId },
        include: { user: true }
    });
    const shouldSyncDemoRows = Boolean(demoListingSeed) &&
        (!dbListing || dbListing.category === "Demo Stay");
    if (shouldSyncDemoRows) {
        await syncDemoListingById(listingId);
        dbListing = await prisma.listing.findUnique({
            where: { id: listingId },
            include: { user: true }
        });
    }
    const user = await getCurrentUser();
    const isDemoListing = Boolean(demoListingSeed && dbListing?.category === "Demo Stay");
    const demoListing = demoListingSeed;
    const hostRating = demoListing?.rating ?? 4.9;
    if (!dbListing && !demoListing)
        notFound();
    if (demoListing && !dbListing)
        notFound();
    const listing = dbListing
        ? {
            id: dbListing.id,
            title: dbListing.title,
            description: dbListing.description,
            locationValue: dbListing.locationValue,
            imageSrc: dbListing.imageSrc,
            imageGallery: dbListing.imageGallery,
            pricePerNight: dbListing.pricePerNight,
            category: dbListing.category,
            guestCount: dbListing.guestCount,
            roomCount: dbListing.roomCount,
            bathroomCount: dbListing.bathroomCount,
            hostName: dbListing.user?.name ?? "Verified Host"
        }
        : {
            id: demoListing!.id,
            title: demoListing!.title,
            description: `A curated demo stay in ${demoListing!.city} with a modern setup ideal for short trips and long weekends.`,
            locationValue: demoListing!.city,
            imageSrc: demoListing!.image,
            imageGallery: [demoListing!.image],
            pricePerNight: demoListing!.pricePerNight,
            category: "Demo Stay",
            guestCount: demoListing!.maxGuests,
            roomCount: Math.max(1, Math.round(demoListing!.maxGuests / 2)),
            bathroomCount: Math.max(1, Math.round(demoListing!.maxGuests / 3)),
            hostName: demoListing!.hostName
        };
    const [reservationCount, recentReservations, userActiveReservation] = await Promise.all([
        prisma.reservation.count({
            where: { listingId }
        }),
        prisma.reservation.findMany({
            where: { listingId },
            orderBy: { createdAt: "desc" },
            take: 6
        }),
        user
            ? prisma.reservation.findFirst({
                where: {
                    listingId,
                    userId: user.id,
                    endDate: { gte: new Date() }
                },
                orderBy: { startDate: "asc" },
                select: { startDate: true, endDate: true }
            })
            : Promise.resolve(null)
    ]);