'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ROLE_REDIRECTS } from '@/lib/rbac';
import { 
  ShieldCheck, Lock, Mail, Eye, EyeOff, LogIn, Sparkles, 
  UserCheck, AlertCircle, ArrowRight, CheckCircle2, 
  HelpCircle, ChevronDown, Building2, Briefcase, 
  Award, Globe, KeyRound
} from 'lucide-react';

export default function UnifiedLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  
  // Real world input states - empty by default
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOverlay, setSuccessOverlay] = useState(false);
  const [redirectProgress, setRedirectProgress] = useState(0);
  const [resolvedRoleName, setResolvedRoleName] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your work email address and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(cleanEmail, cleanPassword);
      setLoading(false);
      
      const roleKey = res?.role || 'superadmin';
      setResolvedRoleName((roleKey || '').toUpperCase().replace(/-/g, ' '));
      setSuccessOverlay(true);

      // Smooth progress animation then route to assigned dashboard
      let p = 0;
      const interval = setInterval(() => {
        p += 25;
        setRedirectProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          const targetUrl = ROLE_REDIRECTS[roleKey] || `/${roleKey}` || '/';
          if (typeof window !== 'undefined') {
            window.location.href = targetUrl;
          } else {
            router.push(targetUrl);
          }
        }
      }, 150);

    } catch (err) {
      setLoading(false);
      setError(err?.message || 'Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans antialiased">
      {/* Dynamic Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-emerald-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-teal-500/15 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Header Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img src="/assets/images/logo.png" alt="ePay Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                ePay <span className="text-emerald-400">Enterprise CRM</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Production Security Gateway v3.4</p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
            <Link href="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" /> Portal Home
            </Link>
            <Link href="/commerce" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Commerce Hub
            </Link>
            <Link href="/career-hub" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> Career Hub
            </Link>
            <Link href="/business-startup" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> Startup Center
            </Link>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-slate-900/85 border border-slate-800/90 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
            {/* Top Accent Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600" />

            {/* Brand Header */}
            <div className="text-center mb-8">
              <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 mb-4 shadow-lg shadow-emerald-500/10">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Staff <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Sign In</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-400 mt-1.5">
                Authorized access for executive, management & field personnel
              </p>
            </div>

            {/* Security Notice */}
            <div className="mb-6 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
              <p className="text-xs text-slate-400 leading-relaxed">
                User accounts and role permissions are managed exclusively by the <strong className="text-emerald-400 font-semibold">Super Administrator</strong>.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Work Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    autoComplete="email"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 bg-slate-800/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label htmlFor="login-remember" className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                  <input
                    id="login-remember"
                    name="rememberMe"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20"
                  />
                  <span>Keep me signed in</span>
                </label>
                <span className="text-slate-500 text-[11px]">Protected by 256-bit SSL</span>
              </div>

              {/* Error Box */}
              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating Credentials...
                  </span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to CRM Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                Need account provisioning? Contact your Super Administrator or IT Department.
              </p>
            </div>
          </div>

          {/* Security Features Strip */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold text-white">Bank-Grade SSL</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">End-to-end encrypted sessions</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <UserCheck className="w-5 h-5 text-teal-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold text-white">Role Governance</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Strict super-admin user provisioning</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <Sparkles className="w-5 h-5 text-green-400 mx-auto mb-1.5" />
              <h4 className="text-xs font-bold text-white">Realtime Telemetry</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Automated session & audit tracking</p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-8 p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              Authentication & Access FAQ
            </h3>
            <div className="space-y-2 text-xs">
              <div className="border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                  className="w-full text-left font-semibold text-slate-300 hover:text-emerald-400 flex justify-between items-center py-1"
                >
                  <span>How are user accounts created?</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeFaq === 1 ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {activeFaq === 1 && (
                  <p className="text-slate-400 mt-1 leading-relaxed pl-1">
                    Accounts are created and assigned to specific roles (Executive, Management, Field Sales, Operations, HR, Finance) exclusively by the Super Administrator via the Super Admin Governance Console.
                  </p>
                )}
              </div>

              <div className="border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                  className="w-full text-left font-semibold text-slate-300 hover:text-emerald-400 flex justify-between items-center py-1"
                >
                  <span>How does automatic portal redirection work?</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeFaq === 2 ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {activeFaq === 2 && (
                  <p className="text-slate-400 mt-1 leading-relaxed pl-1">
                    Once you authenticate with your verified work credentials, the system checks your role in the central user directory and routes you directly to your assigned portal view with appropriate access levels.
                  </p>
                )}
              </div>

              <div>
                <button
                  onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                  className="w-full text-left font-semibold text-slate-300 hover:text-emerald-400 flex justify-between items-center py-1"
                >
                  <span>What if I cannot access my account?</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeFaq === 3 ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {activeFaq === 3 && (
                  <p className="text-slate-400 mt-1 leading-relaxed pl-1">
                    Please contact your organization's Super Administrator or IT Operations help desk to verify your account status or request a password reset.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Modal Overlay */}
      {successOverlay && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center text-3xl mb-6 shadow-2xl shadow-emerald-500/40 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Authentication Success</h2>
          <p className="text-sm text-slate-300 font-medium max-w-sm mb-1">
            Welcome back to <span className="text-emerald-400 font-bold">{resolvedRoleName} Portal</span>
          </p>
          <p className="text-xs text-slate-400">Initializing your secure workspace session...</p>

          <div className="w-64 h-2 bg-slate-800 rounded-full mt-6 overflow-hidden border border-slate-700">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-300"
              style={{ width: `${redirectProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-emerald-400 mt-2">{redirectProgress}% Complete</span>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-slate-950 px-6 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 ePay Platform. All rights reserved. Authorised Personnel Only.</p>
          <div className="flex gap-4 text-slate-400 font-medium">
            <Link href="/" className="hover:text-emerald-400 transition-colors">Security Policy</Link>
            <span>•</span>
            <Link href="/" className="hover:text-emerald-400 transition-colors">Privacy Terms</Link>
            <span>•</span>
            <Link href="/" className="hover:text-emerald-400 transition-colors">Help Desk</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
