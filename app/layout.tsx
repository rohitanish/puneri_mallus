import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import { AlertProvider } from "@/context/AlertContext"; // 1. Import the Provider
import Footer from "@/components/Footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Puneri Mallus | Kerala's Heart, Pune's Soul",
  description: "The official hub for the Malayali community in Pune. Events, Circles, and Tribe Connections.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased bg-black text-white selection:bg-brandRed/30`}>
        {/* 2. Wrap everything in AlertProvider to enable global cinematic alerts */}
        <AlertProvider>
          {/* Preloader handles the entrance animation */}
          <Preloader />
          
          {/* Main Navigation */}
          <Navbar />
          
          {/* Main Content Area */}
          <main className="min-h-screen">
            {children}
          </main>
          <Footer /> {/* Add here */}
          {/* TribeAlert component is automatically rendered by the Provider here */}
        </AlertProvider>
      </body>
    </html>
  );
}