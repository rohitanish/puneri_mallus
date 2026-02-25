export default function SectionDivider() {
  return (
    <div className="relative w-full h-[1px] flex items-center justify-center overflow-visible">
      {/* 1. The "Base" dark red line across the whole screen */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-brandRed/40 to-transparent" />
      
      {/* 2. The "Hot Core" - a very bright, thin center line */}
      <div className="absolute w-[40%] h-[2px] bg-brandRed shadow-[0_0_15px_#FF0000] z-10" />
      
      {/* 3. The "Lens Flare" - an extremely wide but short horizontal glow */}
      <div className="absolute w-full h-[60px] bg-brandRed/10 blur-[40px] opacity-60 pointer-events-none" />
      
      {/* 4. The "Glare" - a tiny white-hot center point */}
      <div className="absolute w-20 h-px bg-white blur-[1px] opacity-40 z-20" />
    </div>
  );
}