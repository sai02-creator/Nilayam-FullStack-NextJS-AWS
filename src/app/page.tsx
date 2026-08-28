import Link from "next/link";
import { format } from "date-fns";
import { ChevronRight, Flame, Home, Landmark, Mountain, Palmtree, Snowflake, Star, TreePalm, Users, Waves, } from "lucide-react";
import { fetchDemoProperties } from "@/lib/demo-properties";

type HomePageProps = {
    searchParams: Promise<{
        location?: string;
        category?: string;
        checkIn?: string;
        checkOut?: string;
        guests?: string;
        adults?: string;
        children?: string;
        infants?: string;
    }>;
}; 

const categoryItems = [
    { label: "Scenic views", icon: Mountain },
    { label: "Beachfront", icon: Palmtree },
    { label: "Guest favorites", icon: Flame },
    { label: "Cabins", icon: Home },
    { label: "Countryside stays", icon: TreePalm },
    { label: "Lakefront", icon: Waves },
    { label: "Historic homes", icon: Landmark },
    { label: "Ski-in/out", icon: Snowflake },
];

type UnifiedCard = {
    id: string;
    title: string;
    image: string;
    city: string;
    category: string;
    hostName: string;
    rating: number;
    price: number;
    maxGuests: number;
    availableDates: string[];
    isExternal: boolean;
};


export default function Home() {
  return (
    <div>Home</div>
  )
}
