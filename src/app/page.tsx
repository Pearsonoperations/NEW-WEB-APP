'use client';

import { useState, useEffect } from 'react';
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signup' | 'create-account'>('signup');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [anonymousCredits, setAnonymousCredits] = useState(3);
  const [shouldRedirectToCheckout, setShouldRedirectToCheckout] = useState(false);

  useEffect(() => {
    // Load anonymous credits from localStorage
    const savedCredits = localStorage.getItem('anonymousCredits');
    if (savedCredits) {
      setAnonymousCredits(parseInt(savedCredits, 10));
    }
  }, []);

  // Handle redirect to checkout after signup
  useEffect(() => {
    if (shouldRedirectToCheckout && user && !loading) {
      setShouldRedirectToCheckout(false);
      handleUpgrade();
    }
  }, [shouldRedirectToCheckout, user, loading]);

  const getRandomRoast = () => {
    const randomIndex = Math.floor(Math.random() * roasts.length);
    return roasts[randomIndex];
  };

  const handleRoast = async () => {
    // If user is logged in, use their profile credits
    if (user && profile) {
      if (profile.credits <= 0) {
        setAuthMode('signup');
        setShowAuthModal(true);
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
    } else {
      // Anonymous user
      if (anonymousCredits <= 0) {
        setAuthMode('signup');
        setShowAuthModal(true);
        return;
      }

      setIsAnimating(true);
      const newRoast = getRandomRoast();
      setCurrentRoast(newRoast);

      const audio = new Audio('data:audio/wav;base64,UklGRhIAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU4AAAA=');
      audio.play().catch(() => {});

      const newCredits = anonymousCredits - 1;
      setAnonymousCredits(newCredits);
      localStorage.setItem('anonymousCredits', newCredits.toString());

      setTimeout(() => setIsAnimating(false), 500);
    }
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
    if (!user) {
      setAuthMode('signup');
      setShowAuthModal(true);
      return;
    }

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

  const getCurrentCredits = () => {
    if (user && profile) {
      return profile.credits;
    }
    return anonymousCredits;
  };

  const getMaxCredits = () => {
    if (user && profile?.is_pro) {
      return 100;
    }
    return 3;
  };

  if (loading) {
    return (
      <main className="h-screen w-full bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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

      {/* Top left - Credits and Sign Out */}
      <div className="absolute top-8 left-8 flex items-center gap-4 z-20">
        <div className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20">
          <span className="text-white font-bold">
            {getCurrentCredits()} / {getMaxCredits()} credits
          </span>
          {user && profile?.is_pro && <Crown className="inline ml-2 text-yellow-500" size={16} />}
        </div>
        {user && (
          <button
            onClick={signOut}
            className="bg-white/10 backdrop-blur-lg p-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} className="text-white" />
          </button>
        )}
      </div>

      {/* Top right - Create Account button (only for anonymous users) */}
      {!user && (
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => {
              setAuthMode('create-account');
              setShowAuthModal(true);
            }}
            className="bg-white/10 backdrop-blur-lg px-4 py-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-white text-sm"
          >
            Create Account
          </button>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-30 p-4">
          <div className="relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-lg p-2 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-white z-10"
            >
              ✕
            </button>
            <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-white/20">
              {authMode === 'signup' && (
                <div className="mb-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Out of Credits!</h2>
                  <p className="text-white/60">Create an account to continue</p>
                </div>
              )}
              <AuthForm
                onSuccess={() => {
                  setShowAuthModal(false);
                  if (authMode === 'signup') {
                    // After signup for upgrade, set flag to redirect to checkout
                    setShouldRedirectToCheckout(true);
                  }
                }}
              />
            </div>
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

          {/* Upgrade to Pro button (shown when credits are low or used up) */}
          {getCurrentCredits() === 0 && user && !profile?.is_pro && (
            <button
              onClick={handleUpgrade}
              disabled={upgradeLoading}
              className="mt-4 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-lg transition-all flex items-center gap-2"
            >
              <Crown size={20} />
              {upgradeLoading ? 'Loading...' : 'Upgrade to Pro - £9.99/month'}
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
