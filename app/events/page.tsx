"use client";
import Image from 'next/image';

export default function EventsPage() {
  const allEvents = [
    { name: "Vishu Sadhya", year: "2026", img: "/events/vishu.jpg" },
    { name: "Monsoon Football", year: "2025", img: "/events/football.jpg" },
    { name: "Agam Live", year: "2025", img: "/events/agam.jpg" },
    { name: "Onam Carnival", year: "2025", img: "/events/onam.jpg" },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-32 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-7xl font-black uppercase tracking-tighter mb-20">
          The <span className="text-brandRed">Gallery</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {allEvents.map((event, i) => (
            <div key={i} className="relative group aspect-video overflow-hidden rounded-[40px] border border-white/5">
              <Image src={event.img} alt={event.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10">
                <span className="text-brandRed font-mono text-sm">{event.year}</span>
                <h3 className="text-3xl font-black uppercase italic">{event.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}