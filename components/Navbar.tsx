"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Community', href: '/community' },
    { name: 'Events', href: '/events' },
    { name: 'Mallu Dial', href: '/mallu-dial', special: true },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 px-10 py-5 flex items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
      
      {/* 1. Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Puneri Mallus Logo" 
            width={400} 
            height={150} 
            className="h-[100px] w-auto object-contain" 
            priority 
          />
        </Link>
      </div>

      {/* 2. Navigation Links (Dynamic Highlighting) */}
      <div className="hidden lg:flex flex-grow justify-center items-center gap-12">
        {navLinks.map((link) => {
          // Dynamic check: Does the current URL match this link's destination?
          const isActive = pathname === link.href;

          return (
            <Link 
              key={link.name}
              href={link.href} 
              className={`text-[15px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${
                isActive 
                  ? 'text-brandRed' 
                  : 'text-zinc-200 hover:text-brandRed'
              } ${link.special && !isActive ? 'animate-pulse' : ''}`}
            >
              {link.name}
              
              {/* Animated Underline Indicator - only shows when active */}
              {isActive && (
                <div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-brandRed shadow-[0_0_12px_#FF0000]" 
                  style={{ transition: 'all 0.3s ease' }}
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* 3. Auth Button */}
      <div className="flex-shrink-0">
        <Link href="/auth/login" className="text-[14px] font-black uppercase tracking-widest border-2 border-brandRed/40 text-white px-10 py-3.5 rounded-full hover:bg-brandRed hover:border-brandRed transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.1)]">
          Login
        </Link>
      </div>
    </nav>
  );
}