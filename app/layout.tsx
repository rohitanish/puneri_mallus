import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader"; // 1. Import the Preloader

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Puneri Mallus",
  description: "The home for Pune Malayalis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased bg-black text-white`}>
        {/* 2. Place Preloader at the top of the body */}
        <Preloader />
        
        <Navbar />
        {children}
      </body>
    </html>
  );
}