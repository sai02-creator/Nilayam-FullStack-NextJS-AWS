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


export default function Home() {
  return (
    <div>Home</div>
  )
}
