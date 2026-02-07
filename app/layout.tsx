import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Setting up the modern font
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Puneri Mallus | Community Hub",
  description: "The home for Pune Malayalis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      {/* Changed bg-white to bg-black to match our theme. 
        Added inter.className for the modern font style.
      */}
      <body className={`${inter.className} antialiased bg-black text-white`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}