function EventCard({ title, date, image, category, isUpcoming }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group relative"
    >
      <div className={`relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 transition-all duration-500 ${isUpcoming ? 'hover:border-brandRed' : 'hover:border-white/20'}`}>
        
        {/* IMAGE */}
        <div className={`relative w-full ${isUpcoming ? 'aspect-video' : 'aspect-square'}`}>
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100" 
          />
          <div className="absolute top-4 left-4">
             <span className="bg-black/80 backdrop-blur-md text-white font-black text-[9px] px-3 py-1 rounded-full border border-white/10 tracking-widest uppercase">
                {category}
             </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          <p className="text-brandRed font-mono text-[10px] mb-2 tracking-tighter">{date}</p>
          <h3 className={`font-black uppercase italic tracking-tight leading-tight mb-4 ${isUpcoming ? 'text-2xl' : 'text-lg text-zinc-300'}`}>
            {title}
          </h3>

          {isUpcoming && (
            <Link href="/tickets">
              <button className="w-full py-3 bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-brandRed hover:text-white transition-all duration-300 rounded-xl">
                Book Tickets
              </button>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}