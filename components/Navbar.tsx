import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 px-10 py-4 flex items-center bg-black/40 backdrop-blur-xl border-b border-white/5">
      {/* 1. Logo (Left) */}
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

      {/* 2. Navigation Links (Center) */}
      <div className="hidden lg:flex flex-grow justify-center items-center gap-10">
        {[
          { name: 'Home', href: '/' },
          { name: 'About Us', href: '/about' },
          { name: 'Community', href: '/community' },
          { name: 'Events', href: '/events' },
          { name: 'Mallu Dial', href: '/mallu-dial', special: true },
          { name: 'Contact', href: '/contact' },
        ].map((link) => (
          <Link 
            key={link.name}
            href={link.href} 
            className={`text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-300 hover:text-brandRed ${
              link.special ? 'text-brandRed animate-pulse' : 'text-zinc-300'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* 3. Auth Button (Right) */}
      <div className="flex-shrink-0">
        <Link href="/auth/login" className="text-[11px] font-bold uppercase tracking-widest border border-brandRed/40 text-white px-8 py-3 rounded-full hover:bg-brandRed hover:border-brandRed transition-all duration-500 shadow-lg">
          Login
        </Link>
      </div>
    </nav>
  );
}