import { ListingReservationForm } from "@/components/listing-reservation-form";
import { CalendarCheck2 } from "lucide-react";
type ListingBookingSidebarProps = {
    listingId: string;
    pricePerNight: number;
    hostName: string;
    reservationCount: number;
    userActiveReservation?: {
        startDate: Date;
        endDate: Date;
    } | null;
    maxGuests: number;
    isLoggedIn: boolean;
    bookingStatus?: "success" | "error" | null;
    bookingMessage?: string | null;
    initialCheckIn?: string;
    initialCheckOut?: string;
    initialAdults?: string;
    initialChildren?: string;
    initialInfants?: string;
    unavailableRanges: Array<{
        startDate: Date;
        endDate: Date;
    }>;
};