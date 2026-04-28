"use client"; // 🔥 Must be a client component to use usePathname

import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { AlertProvider } from "@/context/AlertContext";
import Footer from "@/components/Footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { WhatsAppTribe } from '@/components/ui/WhatsappTribe';
import GlobalEntryGate from '@/components/GlobalEntryGate';
import { usePathname } from 'next/navigation'; // 🔥 Import this

const inter = Inter({ subsets: ["latin"] });

// Note: Metadata must be moved to a separate layout-metadata.ts file 
// or defined in a server component if you need SEO, because "use client" 
// layouts cannot export metadata. 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // 🔥 Define the "No-Fly Zone" for the Global Gatekeeper
  const isAuthOrAdmin = 
    pathname?.includes('/login') || 
    pathname?.includes('/auth') || 
    pathname?.includes('/admin');

  return (
    <html lang="en" className="dark scroll-smooth overflow-x-hidden">
      <body className={`${inter.className} antialiased bg-black text-white selection:bg-brandRed/30 overflow-x-hidden w-full`}>
        <AlertProvider>
          <Preloader />
          <Navbar />
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
            
            {/* 🔥 ONLY render the Gatekeeper if we are NOT on an Admin/Auth page */}
            {!isAuthOrAdmin && <GlobalEntryGate />}
            
            <Script
              id="razorpay-checkout-js"
              src="https://checkout.razorpay.com/v1/checkout.js"
              strategy="lazyOnload"
            />
            <SpeedInsights />
            <Analytics/>
          </main>
          <Footer />
        </AlertProvider>
        <WhatsAppTribe 
          label="JOIN OUR WHATSAPP COMMUNITY FOR EXCLUSIVE UPDATES" 
        />
      </body>
    </html>
  );
}