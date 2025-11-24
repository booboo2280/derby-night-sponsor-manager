import React from "react";

export default function DerbyHero() {
  return (
    <section className="relative w-full mb-10 rounded-2xl overflow-hidden shadow-xl">

      {/* Background image */}
      <img
        src="/images/derby-roses.webp"
        alt="Derby roses in front of the racetrack"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Content container */}
      <div className="relative px-6 py-16 sm:px-10 sm:py-24 lg:px-16 lg:py-32 text-white">
        <div className="max-w-3xl">

          {/* Badge */}
          <p className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4">
            🌹 Derby Night • School Fundraiser
          </p>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-4">
            Derby Night
          </h1>

          {/* Description */}
          <p className="text-sm sm:text-lg lg:text-xl text-slate-100/90 max-w-xl mb-6">
            A night at the races to support our students, teachers, and classrooms.
            Join us for horse-race games and raffle baskets.
          </p>

          {/* Event info */}
          <div className="flex flex-col gap-1 text-xs sm:text-sm mb-8">
            <span>📅 <strong>Saturday • March 14, 2026</strong></span>
            <span>⏰ Doors 6:30 PM • First race 7:00 PM</span>
            <span>📍 The Glendale Lyceum : Glendale, Oh</span>
          </div>        

          {/* Dress code */}
          <p className="text-xs sm:text-sm text-slate-100/80">
            Dress code: <strong>Derby Chic</strong> — hats, bow ties, and spring colors encouraged.  
          </p>
        </div>
      </div>
    </section>
  );
}
