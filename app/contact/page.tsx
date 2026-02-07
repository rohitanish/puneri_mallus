"use client";
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
        <div className="md:w-1/2 space-y-10">
          <h1 className="text-8xl font-black uppercase tracking-tighter leading-none">Get In <br /><span className="text-brandRed">Touch.</span></h1>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xl">
              <Mail className="text-brandRed" /> punerimallus@gmail.com
            </div>
            <div className="flex items-center gap-4 text-xl">
              <MapPin className="text-brandRed" /> Pune, Maharashtra
            </div>
          </div>
        </div>

        <div className="md:w-1/2 bg-zinc-900/30 p-12 rounded-[50px] border border-white/5">
          <form className="space-y-6">
            <input type="text" placeholder="YOUR NAME" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition" />
            <input type="email" placeholder="YOUR EMAIL" className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition" />
            <textarea placeholder="YOUR MESSAGE" rows={5} className="w-full bg-black border border-white/10 p-5 rounded-2xl outline-none focus:border-brandRed transition"></textarea>
            <button className="w-full bg-brandRed py-6 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,0,0,0.3)]">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
}