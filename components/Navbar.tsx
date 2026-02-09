"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Community', href: '/community' },
    { name: 'Mallu Dial', href: '/directory' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 ${
      scrolled 
        ? 'py-3 bg-black/90 backdrop-blur-xl border-none' // BORDER REMOVED HERE
        : 'py-0 bg-transparent border-none'
    }`}>
      {/* Container with items-start to keep elements pushed to the top */}
      <div className="w-full flex items-start relative min-h-[80px]">
        
        {/* LOGO - EXTREME TOP LEFT */}
        <div className="absolute top-0 left-0 p-0 m-0">
          <Link href="/#hero" className="block group">
            <Image 
              src="/logo.png" 
              alt="Puneri Mallus" 
              width={500} 
              height={180} 
              className={`object-contain transition-all duration-500 group-hover:scale-105 ${
                // Maintained the massive size you liked
                scrolled ? 'h-24 md:h-28 ml-4' : 'h-40 md:h-52 ml-0' 
              } drop-shadow-[0_0_35px_rgba(255,0,0,0.6)]`} 
              priority
            />
          </Link>
        </div>

        {/* NAVIGATION - PUSHED RIGHT & TOP ALIGNED */}
        <div className="flex-1 flex justify-center items-center gap-10 pt-10 pl-40 lg:pl-60">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href}
                className="group relative py-1"
              >
                <span className={`text-[13px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                  isActive ? 'text-brandRed' : 'text-white/80 group-hover:text-white'
                }`}>
                  {link.name}
                </span>
                <span className={`absolute -bottom-1 left-0 h-[2px] bg-brandRed transition-all duration-500 ${
                  isActive ? 'w-full shadow-[0_0_10px_#FF0000]' : 'w-0 group-hover:w-full'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* JOIN TRIBE - TOP RIGHT */}
        <div className="pt-8 pr-8 md:pr-12 lg:pr-16">
          <Link href="/auth/login">
            <button className="px-10 py-3.5 rounded-full bg-brandRed text-white font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]">
              Join Tribe
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}