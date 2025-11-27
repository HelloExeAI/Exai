'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FcGoogle } from 'react-icons/fc';
import { signIn } from 'next-auth/react';
import bcrypt from 'bcryptjs';

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Calculate trial end date (1 month from now)
      const trialEndsAt = new Date();
      trialEndsAt.setMonth(trialEndsAt.getMonth() + 1);

      // Create user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: hashedPassword,
          trialEndsAt,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create account');
      }

      // Sign in automatically
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Account created, but sign in failed. Please sign in manually.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] p-4">
      <div className="w-full max-w-md p-8 bg-[#2a2a2a] rounded-2xl shadow-2xl border border-[#F4B000]/20">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#F4B000] mb-2">EXEAI</h1>
          <p className="text-gray-400 text-sm">Start Your Free Trial</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F4B000] transition-colors"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F4B000] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#F4B000] transition-colors"
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F4B000] text-black font-semibold rounded-lg hover:bg-[#F4B000]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Start Free Trial'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full py-3 bg-white text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            href="/auth/signin"
            className="text-[#F4B000] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>

        {/* Trial Info */}
        <div className="mt-6 p-4 bg-[#F4B000]/10 border border-[#F4B000]/30 rounded-lg">
          <p className="text-xs text-gray-300 text-center">
            🎉 Get 1 month free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}