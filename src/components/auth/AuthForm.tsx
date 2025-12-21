'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthFormProps {
  onSuccess?: () => void;
}

export function AuthForm({ onSuccess }: AuthFormProps = {}) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (showForgotPassword) {
        await resetPassword(email);
        setResetEmailSent(true);
        setLoading(false);
        return;
      }

      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (errorMessage.includes('already registered')) {
        setError('This email is already registered. Try signing in instead.');
        setIsLogin(true);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
    }
  };

  if (resetEmailSent) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Check Your Email</h2>
        <p className="text-white/60 text-center mb-6">
          We&apos;ve sent a password reset link to {email}
        </p>
        <button
          onClick={() => {
            setResetEmailSent(false);
            setShowForgotPassword(false);
            setEmail('');
          }}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        {showForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-white/60 text-center mb-6">
        {showForgotPassword
          ? 'Enter your email to receive a reset link'
          : isLogin ? 'Sign in to get roasted' : 'Sign up for 3 free roasts'}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-white/80 text-sm mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors"
            placeholder="you@example.com"
            required
          />
        </div>

        {!showForgotPassword && (
          <div>
            <label htmlFor="password" className="block text-white/80 text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-500 transition-colors pr-12"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {isLogin && !showForgotPassword && (
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              Forgot password?
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Loading...' : showForgotPassword ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Sign Up'}
        </button>
      </form>

      {!showForgotPassword && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black/40 text-white/60">or</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white hover:bg-gray-100 disabled:bg-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </>
      )}

      <div className="mt-6 text-center">
        {showForgotPassword ? (
          <button
            onClick={() => {
              setShowForgotPassword(false);
              setError('');
            }}
            className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
          >
            Back to Sign In
          </button>
        ) : (
          <>
            <span className="text-white/60 text-sm">
              {isLogin ? "Don&apos;t have an account? " : 'Already have an account? '}
            </span>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
