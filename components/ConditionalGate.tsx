"use client";

import { usePathname } from 'next/navigation';
import GlobalEntryGate from '@/components/GlobalEntryGate';

export default function ConditionalGate() {
  const pathname = usePathname();

  // 🔥 Define the "No-Fly Zone"
  const isAuthOrAdmin = 
    pathname?.includes('/login') || 
    pathname?.includes('/auth') || 
    pathname?.includes('/admin');

  // Only render the gate if we are NOT on an Admin/Auth page
  if (isAuthOrAdmin) return null;

  return <GlobalEntryGate />;
}