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


export default function Home() {
  return (
    <div>Home</div>
  )
}
