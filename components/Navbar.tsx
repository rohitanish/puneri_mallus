"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Instagram, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <>
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-700 ${
        scrolled 
          ? 'py-3 bg-black/90 backdrop-blur-xl border-none' 
          : 'py-0 bg-transparent border-none'
      }`}>
        <div className="w-full flex items-start relative min-h-[80px]">
          
          {/* MOBILE HAMBURGER - LEFT SIDE */}
          <div className="lg:hidden pt-8 pl-6 z-[110]">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-white hover:text-brandRed transition-all"
            >
              <Menu size={28} />
            </button>
          </div>

          {/* LOGO - EXTREME TOP LEFT (Main Header) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 p-0 m-0 z-[105]">
            <Link href="/#hero" className="block group">
              <Image 
                src="/logo.png" 
                alt="Puneri Mallus" 
                width={500} 
                height={180} 
                className={`object-contain transition-all duration-500 group-hover:scale-105 ${
                  scrolled 
                    ? 'h-20 md:h-28 ml-0 lg:ml-4' 
                    : 'h-32 md:h-52 ml-0' 
                } drop-shadow-[0_0_35px_rgba(255,0,0,0.6)]`} 
                priority
              />
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden lg:flex flex-1 justify-center items-center gap-10 pt-10 pl-40 lg:pl-60">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className="group relative py-1">
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

          {/* JOIN TRIBE */}
          <div className="hidden sm:block pt-8 pr-8 md:pr-12 lg:pr-16">
            <Link href="/auth/login">
              <button className="px-10 py-3.5 rounded-full bg-brandRed text-white font-black uppercase text-[11px] tracking-widest hover:scale-105 transition-all duration-500 shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                Join Tribe
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-[150] lg:hidden"
            />

            {/* Sidebar */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-zinc-950 z-[160] p-8 border-r border-white/10 lg:hidden flex flex-col"
            >
              {/* TOP SECTION: BRAND LOGO + CLOSE BUTTON */}
              <div className="flex justify-between items-start mb-12">
                <div className="flex flex-col gap-2">
                  <Image 
                    src="/logo.png" 
                    alt="Puneri Mallus" 
                    width={180} 
                    height={60} 
                    className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.4)]"
                  />
                  <span className="text-[8px] font-black tracking-[0.5em] text-brandRed uppercase ml-1">
                    The Tribe Menu
                  </span>
                </div>
                
                <button 
                  onClick={() => setIsMobileMenuOpen(false)} 
                  className="p-2 text-white/50 hover:text-brandRed transition-colors"
                >
                  <X size={32} />
                </button>
              </div>

              {/* Sidebar Links */}
              <div className="flex flex-col gap-6 flex-1 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-3xl font-black italic tracking-tighter transition-all ${
                        isActive ? 'text-brandRed translate-x-4' : 'text-white hover:text-brandRed'
                      }`}
                    >
                      {link.name.toUpperCase()}
                    </Link>
                  );
                })}
              </div>

              {/* Sidebar Footer */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brandRed transition-colors cursor-pointer text-white">
                    <Instagram size={18} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brandRed transition-colors cursor-pointer text-white">
                    <MessageCircle size={18} />
                  </div>
                </div>
                <p className="text-[9px] font-black text-zinc-600 tracking-[0.3em] uppercase">
                  Puneri Mallus Community © 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}