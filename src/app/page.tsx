'use client';

import { useState } from 'react';
import { SparklesCore } from "@/components/ui/sparkles";

const roasts = [
  "You bring everyone together… by leaving the room.",
  "You don&apos;t need enemies. Your decisions do enough damage.",
  "I&apos;ve analyzed your potential. Results inconclusive.",
  "You&apos;re proof that participation trophies were a mistake.",
  "Your fashion sense is so unique… like a cry for help.",
  "You&apos;re like a software update. Nobody wants you, but you show up anyway.",
  "I&apos;d agree with you, but then we&apos;d both be wrong.",
  "You&apos;re not stupid. You just have bad luck when thinking.",
  "If I wanted to hear from you, I&apos;d read your error logs.",
  "You&apos;re like a cloud. When you disappear, it&apos;s a beautiful day.",
  "Your code works? Must be a cosmic accident.",
  "You&apos;re living proof that evolution can go in reverse.",
  "I&apos;d explain it to you, but I left my crayons at home.",
  "You&apos;re not lazy. You&apos;re just highly motivated to do nothing.",
  "Your ideas are like pop-up ads. Unwanted and easily blocked.",
  "You peaked in the tutorial.",
  "You&apos;re like a broken pencil… pointless.",
  "I&apos;ve seen better decision-making from a Magic 8-Ball.",
  "You&apos;re the human equivalent of a loading screen.",
  "Your potential is like dark matter. Theoretically there, but undetectable."
];

export default function Home() {
  const [currentRoast, setCurrentRoast] = useState<string>('');
  const [intensity, setIntensity] = useState<'mild' | 'savage'>('mild');
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomRoast = () => {
    const randomIndex = Math.floor(Math.random() * roasts.length);
    return roasts[randomIndex];
  };

  const handleRoast = () => {
    setIsAnimating(true);
    const newRoast = getRandomRoast();
    setCurrentRoast(newRoast);

    const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAAA=');
    audio.play().catch(() => {});

    setTimeout(() => setIsAnimating(false), 500);
  };

  const shareRoast = () => {
    if (currentRoast && navigator.share) {
      navigator.share({
        text: `🔥 I got roasted: "${currentRoast}" 🔥`,
      }).catch(() => {});
    } else if (currentRoast) {
      navigator.clipboard.writeText(`🔥 I got roasted: "${currentRoast}" 🔥`);
      alert('Roast copied to clipboard!');
    }
  };

  return (
    <main className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative">
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
      </div>

      <div className="absolute top-8 right-8 flex items-center gap-3 z-20">
        <span className="text-white/60 text-sm">Intensity:</span>
        <button
          onClick={() => setIntensity('mild')}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            intensity === 'mild'
              ? 'bg-orange-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Mild 🌶️
        </button>
        <button
          onClick={() => setIntensity('savage')}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            intensity === 'savage'
              ? 'bg-orange-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Savage 🔥
        </button>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 relative z-20">
        <h1 className="md:text-7xl text-5xl lg:text-9xl font-bold text-center text-white">
          Roast App
        </h1>

        {currentRoast && (
          <div
            className={`text-white/90 text-xl md:text-2xl text-center font-light leading-relaxed max-w-3xl px-8 transition-all duration-500 ${
              isAnimating ? 'scale-110 opacity-100' : 'scale-100 opacity-90'
            }`}
          >
            &ldquo;{currentRoast}&rdquo;
          </div>
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={handleRoast}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transition-all duration-200 transform"
          >
            ROAST ME
          </button>

          {currentRoast && (
            <button
              onClick={shareRoast}
              className="text-white/60 hover:text-white/90 text-sm underline transition-colors"
            >
              Share this roast
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-8 text-white/40 text-sm z-20">
        Press the button if you dare 🔥
      </div>
    </main>
  );
}