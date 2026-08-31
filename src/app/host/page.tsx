import Link from "next/link";
import { createListing } from "@/app/actions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ListingForm } from "@/components/listing-form";
import { HostSection } from "@/components/host/host-section";
import { HostListingItem } from "@/components/host/host-listing-item";
import { BadgeCheck, Building2, DollarSign, Sparkles } from "lucide-react";
import { PageIntro } from "@/components/ui/page-intro";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import { uiShell } from "@/lib/ui-classes";

export default async function HostDashboardPage() {
  const user = await requireUser();
  const listings = await prisma.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  const listingCount = listings.length;
  const avgNightlyRate = listingCount
    ? Math.round(
        listings.reduce((total, listing) => total + listing.pricePerNight, 0) /
          listingCount,
      )
    : 0;
  const totalCapacity = listings.reduce(
    (total, listing) => total + listing.guestCount,
    0,
  );