"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Instagram, MessageCircle, User, LogOut, Facebook, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMobileMenuOpen(false);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Events', href: '/events' },
    { name: 'Partners', href: '/partners' },
    { name: 'Community', href: '/community' },
    { name: 'Mallu Mart', href: '/directory' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'py-3 bg-black/80 backdrop-blur-xl border-b border-white/5'
          : 'py-5 bg-transparent border-none'
      }`}>
        <div className="max-w-[1800px] mx-auto px-3 sm:px-5 md:px-8 xl:px-10 flex items-center justify-between gap-4">

          {/* 1. LOGO - Left Aligned */}
          <div className="flex-shrink-0">
            <Link href="/" className="block group">
              <Image
                src="/logo.png"
                alt="Puneri Mallus"
                width={360}
                height={100}
                className={`object-contain object-left transition-all duration-500 group-hover:scale-105 drop-shadow-[0_0_20px_rgba(255,0,0,0.4)] w-auto ${
                  scrolled
                    ? 'h-20 md:h-24'
                    : 'h-28 md:h-36'
                }`}
                priority
              />
            </Link>
          </div>

          {/* 2. DESKTOP LINKS - Centered, responsive gaps */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-8 2xl:gap-10">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.name} href={link.href} className="group relative py-2">
                  <span className={`text-[10px] xl:text-[11px] 2xl:text-[12px] font-black uppercase tracking-[0.2em] xl:tracking-[0.25em] transition-all duration-300 whitespace-nowrap ${
                    isActive ? 'text-brandRed' : 'text-white/70 group-hover:text-white'
                  }`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 w-full h-[2px] bg-brandRed shadow-[0_0_12px_#FF0000]"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. AUTH/ACTION SECTION - Right Aligned */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4 relative group">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 p-1.5 pr-4 xl:pr-5 rounded-full hover:border-brandRed transition-all"
                  >
                    <div className="w-8 h-8 xl:w-9 xl:h-9 bg-brandRed rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.4)]">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[7px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Active Member</span>
                      <span className="text-[10px] font-black text-white uppercase italic leading-none truncate max-w-[80px] xl:max-w-[100px]">
                        {user.user_metadata?.full_name || 'Tribe User'}
                      </span>
                    </div>
                  </Link>

                  {/* Floating Logout Tooltip */}
                  <button
                    onClick={handleLogout}
                    className="absolute -bottom-12 right-0 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black uppercase text-zinc-400 hover:text-brandRed opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2"
                  >
                    <LogOut size={12} /> Sign Out
                  </button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <button className="px-5 xl:px-8 py-3 xl:py-3.5 rounded-full bg-brandRed text-white font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.3)] active:scale-95 whitespace-nowrap">
                    Join Tribe
                  </button>
                </Link>
              )}
            </div>

            {/* Mobile: show Join Tribe button too if not logged in */}
            {!user && (
              <Link href="/auth/login" className="sm:hidden">
                <button className="px-4 py-2.5 rounded-full bg-brandRed text-white font-black uppercase text-[9px] tracking-widest active:scale-95 whitespace-nowrap">
                  Join
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 sm:p-3 bg-white/5 rounded-2xl border border-white/10 text-white hover:text-brandRed transition-all"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[150] lg:hidden"
            />

            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-[340px] bg-zinc-950 z-[160] p-6 sm:p-8 border-r border-white/10 lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-12 sm:mb-16">
                <Image src="/logo.png" alt="Logo" width={240} height={80} className="object-contain object-left w-auto h-20 sm:h-24" />
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-zinc-500 hover:text-brandRed flex-shrink-0">
                  <X size={28} />
                </button>
              </div>

              <div className="flex flex-col gap-5 sm:gap-6 flex-1">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name} href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-2xl sm:text-3xl font-black italic tracking-tighter transition-all ${
                        isActive ? 'text-brandRed translate-x-4' : 'text-white'
                      }`}
                    >
                      {link.name.toUpperCase()}
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Auth */}
              <div className="pt-6 sm:pt-8 border-t border-white/10 space-y-4">
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-zinc-400 hover:text-brandRed transition-all"
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                ) : (
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-3 rounded-full bg-brandRed text-white font-black uppercase text-[10px] tracking-widest">
                      Join Tribe
                    </button>
                  </Link>
                )}
                <div className="flex gap-4 pt-2">
                  <Instagram size={20} className="text-zinc-500 hover:text-brandRed cursor-pointer transition-colors" />
                  <Facebook size={20} className="text-zinc-500 hover:text-brandRed cursor-pointer transition-colors" />
                  <MessageCircle size={20} className="text-zinc-500 hover:text-brandRed cursor-pointer transition-colors" />
                </div>
                <p className="text-[8px] font-black text-zinc-700 tracking-[0.3em] uppercase">© 2026 Puneri Mallus Hub</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}