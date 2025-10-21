"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api/auth';
import { toast } from 'react-toastify';

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { token } = await loginUser({ email, password });
      localStorage.setItem('token', token);
      toast.success('Logged in successfully')
      router.push('/dashboard'); 
    } catch (err: any) {
      console.error('Login failed:', err);
      setErrorMsg(
        err?.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-primary-100 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-black-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-black-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-8 transform hover:scale-[1.02] transition-all duration-300"
        >
          {/* Header */}
          <div className="text-center mb-5 flex flex-col items-center justify-center">
            <Image src={'/images/logos/logo.png'} alt="GoChinaMarket" height={10} width={70} className=''/>
            <p className="text-gray-400 text-sm mt-3">Admin Portal Access</p>
          </div>

          {/* Error message */}
          {errorMsg && (
            <div className="mb-4 text-red-400 bg-red-500/10 border border-red-400/20 p-3 rounded-md text-sm">
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300"
                placeholder="admin@kudiswap.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-100 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-100 bg-gray-700 border-gray-600 rounded focus:ring-primary-100 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-sm text-primary-100 hover:text-primary-100 transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-100 to-primary-100 hover:from-primary-100 hover:to-primary-100 text-black py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In to Admin Panel'
              )}
            </button>
          </div>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-xs text-yellow-400 text-center">
              🔒 Secure admin access. All activities are monitored and logged.
            </p>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-700 text-sm">© 2025 GoChinaMarket. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
