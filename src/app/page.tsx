'use client';

import { useState } from 'react';
import { SparklesCore } from "@/components/ui/sparkles";
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';
import { LogOut, Crown } from 'lucide-react';

const roasts = [
  "You bring everyone together… by leaving the room.",
  "You don't need enemies. Your decisions do enough damage.",
  "I've analyzed your potential. Results inconclusive.",
  "You're proof that participation trophies were a mistake.",
  "Your fashion sense is so unique… like a cry for help.",
  "You're like a software update. Nobody wants you, but you show up anyway.",
  "I'd agree with you, but then we'd both be wrong.",
  "You're not stupid. You just have bad luck when thinking.",
  "If I wanted to hear from you, I'd read your error logs.",
  "You're like a cloud. When you disappear, it's a beautiful day.",
  "Your code works? Must be a cosmic accident.",
  "You're living proof that evolution can go in reverse.",
  "I'd explain it to you, but I left my crayons at home.",
  "You're not lazy. You're just highly motivated to do nothing.",
  "Your ideas are like pop-up ads. Unwanted and easily blocked.",
  "You peaked in the tutorial.",
  "You're like a broken pencil… pointless.",
  "I've seen better decision-making from a Magic 8-Ball.",
  "You're the human equivalent of a loading screen.",
  "Your potential is like dark matter. Theoretically there, but undetectable."
];

export default function Home() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const [currentRoast, setCurrentRoast] = useState<string>('');
  const [intensity, setIntensity] = useState<'mild' | 'savage'>('mild');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  const getRandomRoast = () => {
    const randomIndex = Math.floor(Math.random() * roasts.length);
    return roasts[randomIndex];
  };

  const handleRoast = async () => {
    if (!profile) return;

    if (profile.credits <= 0) {
      setShowUpgrade(true);
      return;
    }

    setIsAnimating(true);
    const newRoast = getRandomRoast();
    setCurrentRoast(newRoast);

    const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAAA=');
    audio.play().catch(() => {});

    await supabase
      .from('profiles')
      .update({ credits: profile.credits - 1 })
      .eq('id', profile.id);

    await refreshProfile();

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

  const handleUpgrade = async () => {
    if (!user) return;

    setUpgradeLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const { url, error } = await response.json();

      if (error) {
        alert('Error creating checkout session. Please try again.');
        return;
      }

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden relative p-4">
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
        <div className="relative z-20">
          <h1 className="text-5xl md:text-7xl font-bold text-center text-white mb-8">
            Roast App
          </h1>
          <AuthForm />
        </div>
      </main>
    );
  }

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

      <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
          <span className="text-white font-bold">
            {profile?.credits} {profile?.is_pro ? '/ 100' : '/ 3'} credits
          </span>
          {profile?.is_pro && <Crown className="inline ml-2 text-yellow-500" size={16} />}
        </div>
        <button
          onClick={signOut}
          className="bg-white/10 backdrop-blur-lg p-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
          title="Sign Out"
        >
          <LogOut size={20} className="text-white" />
        </button>
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

      {showUpgrade && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 max-w-md">
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Out of Credits!</h2>
            <p className="text-white/80 text-center mb-6">
              Upgrade to Pro to get 100 credits per month
            </p>
            <div className="bg-orange-500/20 border-2 border-orange-500 rounded-xl p-6 mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-5xl font-bold text-white">£9.99</span>
                <span className="text-white/60">/month</span>
              </div>
              <p className="text-center text-white/80">100 credits monthly</p>
            </div>
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-4 rounded-lg transition-colors mb-4"
            >
              {upgradeLoading ? 'Loading...' : 'Upgrade to Pro'}
            </button>
            <button
              onClick={() => setShowUpgrade(false)}
              className="w-full text-white/60 hover:text-white transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

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
{currentRoast}
          </div>
        )}

        <div className="flex flex-col items-center gap-4 mt-4">
          <button
            onClick={handleRoast}
            disabled={!profile || profile.credits <= 0}
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-xl md:text-2xl px-12 py-6 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transition-all duration-200 transform"
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
