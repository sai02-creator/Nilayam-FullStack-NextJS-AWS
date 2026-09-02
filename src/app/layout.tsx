import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";




export const metadata: Metadata = {
  title: "Nilayam",
  description: "Book curated stays with a modern, professional booking experience.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        
        {children}</body>
    </html>
  );
}
