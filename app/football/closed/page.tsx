"use client";
import { motion } from 'framer-motion';
import { Trophy, Phone, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function FootballRegistration() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden text-white selection:bg-brandRed/30 pt-32">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-[url('/events/footback.png')] bg-cover bg-center opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-0" />
      
      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-10">
          <Trophy size={40} className="text-brandRed mx-auto mb-4 opacity-50" />
          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none text-zinc-300">
            Tournament <span className="text-brandRed">Entry</span>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Registration Status</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950/80 backdrop-blur-2xl border border-brandRed/20 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Status Icon */}
          <div className="w-20 h-20 bg-brandRed/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,0,0,0.15)]">
            <Lock size={32} className="text-brandRed" />
          </div>

          <h2 className="text-3xl font-black uppercase italic text-white mb-4">
            Registrations Closed
          </h2>
          
          <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed mb-8">
           Thanks for your interest! Registrations are currently full, but we will reach out to you directly if any registered team cancels their spot.
          </p>

          {/* Contact Box */}
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl mb-8">
            <p className="text-zinc-300 text-sm mb-4 font-medium">
              For further information or inquiries, please contact us:
            </p>
            <a 
              href="tel:+919175981863" 
              className="inline-flex items-center gap-3 text-brandRed font-black text-xl md:text-2xl hover:text-white transition-colors duration-300"
            >
              <Phone size={24} /> +91 9175981863
            </a>
            <p className="text-zinc-500 text-xs mt-4 italic">
              We will guide you at the earliest.
            </p>
          </div>

          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-[0.2em] hover:text-brandRed transition-colors"
          >
            <ArrowLeft size={14} /> Return to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}