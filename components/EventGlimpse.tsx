export default function EventGlimpse() {
  const images = [1, 2, 3]; // We'll add real images to public/gallery/ later
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {images.map((id) => (
        <div key={id} className="group relative aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10">
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700 font-bold italic">
            Glimpse_{id}.jpg
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6">
            <p className="text-red-600 font-black uppercase text-xs tracking-widest">Memories</p>
            <p className="text-white font-bold">Pune Gathering 2025</p>
          </div>
        </div>
      ))}
    </div>
  );
}