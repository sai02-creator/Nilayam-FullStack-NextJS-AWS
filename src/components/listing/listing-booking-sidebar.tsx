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
export function ListingBookingSidebar({ listingId, pricePerNight, hostName, reservationCount, userActiveReservation, maxGuests, isLoggedIn, bookingStatus, bookingMessage, initialCheckIn, initialCheckOut, initialAdults, initialChildren, initialInfants, unavailableRanges }: ListingBookingSidebarProps) {
    return (<aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
      <section className="rounded-3xl border border-ink-200 bg-surface p-5 shadow-lg shadow-ink-900/5">
        <div className="flex items-baseline justify-between">
          <p className="text-2xl font-semibold text-ink-900">
            ${pricePerNight}
            <span className="ml-1 text-sm font-medium text-ink-600">/ night</span>
          </p>
          
          <p className="hidden text-xs text-ink-500 md:block">
            {reservationCount > 0
            ? `${reservationCount} booking${reservationCount > 1 ? "s" : ""} on StayScape`
            : "No bookings yet"}
          </p>
        </div>