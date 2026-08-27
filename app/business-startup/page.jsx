'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Rocket, ShieldCheck, CheckCircle2, ChevronRight, Star, 
  Building, FileText, Globe, CreditCard, PieChart, TrendingUp, 
  HelpCircle, ArrowRight, X, Phone, User, MapPin, Sparkles, 
  Calculator, CheckSquare, Award, Compass, Layers, Users
} from 'lucide-react';

const LAUNCH_STEPS = [
  { step: '01', title: 'Idea & Consultation', desc: 'Brainstorm business model & structure.' },
  { step: '02', title: 'Business Plan', desc: 'Financial forecast & market strategy.' },
  { step: '03', title: 'Legal Registration', desc: 'GST, MSME, Pvt Ltd or Firm setup.' },
  { step: '04', title: 'Brand Identity', desc: 'Logo, color palette & business card.' },
  { step: '05', title: 'Website & Email', desc: 'Domain, corporate email & 5-page site.' },
  { step: '06', title: 'Payment Gateway', desc: 'POS machine & online payment link.' },
  { step: '07', title: 'Accounting & CRM', desc: 'Invoice software & customer database.' },
  { step: '08', title: 'Digital Marketing', desc: 'Social media pages & launch ad strategy.' },
  { step: '09', title: 'Finance Assistance', desc: 'Bank account & loan application guidance.' },
  { step: '10', title: 'Official Launch', desc: 'First customer acquisition & scaling.' }
];

const SERVICES = [
  {
    id: 'registration',
    icon: '🏛️',
    title: 'Business Registration',
    desc: 'Complete assistance for Proprietorship, Partnership, LLP, or Pvt Ltd incorporation.',
    turnaround: '3 - 7 Days',
    popular: true
  },
  {
    id: 'gst',
    icon: '📑',
    title: 'GST & Tax Orientation',
    desc: 'GST registration, HSN code mapping, tax filing guidance, and compliance assistance.',
    turnaround: '2 - 4 Days',
    popular: true
  },
  {
    id: 'msme',
    icon: '🎖️',
    title: 'MSME / Udyam Certification',
    desc: 'Government MSME registration to unlock interest subsidies, tenders, and schemes.',
    turnaround: '24 Hours',
    popular: false
  },
  {
    id: 'bizplan',
    icon: '📊',
    title: 'Business Plan & Projection',
    desc: 'Professional 3-year financial projections and bankable project report.',
    turnaround: '3 Days',
    popular: false
  },
  {
    id: 'web',
    icon: '🌐',
    title: 'Website & Corporate Email',
    desc: 'Custom domain registration, business emails (@company.com), and responsive website.',
    turnaround: '5 Days',
    popular: true
  },
  {
    id: 'branding',
    icon: '🎨',
    title: 'Logo & Brand Identity',
    desc: '3 logo concepts, brand guidelines, letterhead design, and digital visiting cards.',
    turnaround: '2 Days',
    popular: false
  },
  {
    id: 'marketing',
    icon: '📢',
    title: 'Digital Marketing & Social',
    desc: 'Google Business Profile, Instagram/Facebook pages, and starter lead campaign.',
    turnaround: '3 Days',
    popular: true
  },
  {
    id: 'payments',
    icon: '💳',
    title: 'Payments & POS Machines',
    desc: 'QR code stands, thermal billing machine, and UPI/Card payment gateway setup.',
    turnaround: '48 Hours',
    popular: false
  },
  {
    id: 'accounting',
    icon: '📈',
    title: 'Accounting & CRM Tools',
    desc: 'Cloud billing software setup, GST invoice templates, and CRM integration.',
    turnaround: '2 Days',
    popular: false
  }
];

const PACKAGES = [
  {
    name: 'Starter Launch',
    price: '₹4,999',
    period: 'one-time setup',
    desc: 'Ideal for local shops, freelancers & individual startups',
    popular: false,
    features: [
      'Business Plan Template & Consultation',
      'Proprietorship / MSME Guidance',
      'Logo Design (3 Concepts)',
      'Domain Name & 2 Corporate Emails',
      'WhatsApp Business Setup',
      'Basic Billing Software Orientation'
    ]
  },
  {
    name: 'Business Launch',
    price: '₹19,999',
    period: 'one-time complete package',
    desc: 'Most popular for retail outlets, firms & service companies',
    popular: true,
    features: [
      'Everything in Starter Plan',
      'Complete Registration (GST + MSME + Firm)',
      '5-Page Responsive Business Website',
      'Payment Gateway & QR Billing Setup',
      'Social Media Launch (3 Platforms)',
      '1 Month Digital Marketing Strategy Support',
      'Dedicated Gallery Launch Consultant'
    ]
  },
  {
    name: 'Growth Launch',
    price: '₹49,999',
    period: 'full corporate launch',
    desc: 'For scalable startups, franchises & manufacturing units',
    popular: false,
    features: [
      'Everything in Business Plan',
      'Pvt Ltd / LLP Incorporation Assistance',
      'Custom CRM & Cloud ERP Setup',
      'Advanced SEO & Meta Ads Campaign',
      'Bank Loan Project Report Preparation',
      'Quarterly Performance & Tax Review'
    ]
  }
];

export default function BusinessStartupPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Business Launch');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Interactive Quiz State
  const [quizState, setQuizState] = useState({
    type: 'Retail',
    budget: '50k-1L',
    readyScore: 65
  });

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    interest: 'Business Launch',
    notes: ''
  });

  const handleOpenModal = (planName = 'Business Launch') => {
    setSelectedPlan(planName);
    setFormData(prev => ({ ...prev, interest: planName }));
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('epay-center-leads') || '[]');
      existing.push({
        ...formData,
        page: 'business-startup',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('epay-center-leads', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    setFormSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              eP
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                ePay <span className="text-emerald-600">Startup Center</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Business Launch
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <a href="#launch-path" className="hover:text-emerald-700 transition-colors">Launch Path</a>
            <a href="#services" className="hover:text-emerald-700 transition-colors">Services</a>
            <a href="#calculator" className="hover:text-emerald-700 transition-colors">Readiness Quiz</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Plans</a>
            <Link href="/commerce" className="hover:text-emerald-700 transition-colors">Marketplace</Link>
            <Link href="/ai-assistant" className="hover:text-emerald-700 transition-colors">AI Assistant</Link>
            <Link href="/career-hub" className="hover:text-emerald-700 transition-colors">Career Hub</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-1.5 border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-bold rounded-full transition-colors"
            >
              Sign In
            </Link>

            <button
              onClick={() => handleOpenModal('Startup Consultation')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-bold rounded-full shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
            >
              <Rocket className="w-4 h-4" />
              <span>Book Launch Desk</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Rocket className="w-3.5 h-3.5 text-emerald-600" />
              <span>ePay Business Launch Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Walk In With An Idea. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
                Walk Out Ready To Launch.
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              From GST registration and business plan to branding, website, payment gateway, accounting software, and marketing – your local ePay Gallery becomes your single-desk business launch center.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleOpenModal('Full Business Launch')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#launch-path"
                className="px-6 py-3.5 bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800 font-bold text-sm rounded-full shadow-sm hover:bg-emerald-50/50 transition-all flex items-center gap-2"
              >
                <span>Explore 10-Step Path</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            {/* Key Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">1,400+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Businesses Launched</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">3 Weeks</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Average Turnaround</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">1 Desk</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Single Contact Point</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Business Startup Team Consultation"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                      🏬
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Your Local Startup Desk</h4>
                      <p className="text-xs text-slate-500">Legal, Tech & Marketing experts at your Gallery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10-Step Launch Path Flow */}
      <section id="launch-path" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Guided Journey
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              The 10-Step Business Launch Path
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              From initial idea validation to customer acquisition – zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {LAUNCH_STEPS.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 hover:border-emerald-400 hover:bg-white transition-all shadow-sm flex flex-col justify-between group">
                <div>
                  <div className="text-xs font-black text-emerald-600 mb-2 font-mono">{s.step}</div>
                  <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">{s.title}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section id="services" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Comprehensive Modules
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Everything Needed To Build Your Company
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((svc) => (
              <div key={svc.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{svc.icon}</span>
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                      ⏱ {svc.turnaround}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-2">{svc.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{svc.desc}</p>
                </div>

                <button
                  onClick={() => handleOpenModal(svc.title)}
                  className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>Request Module Guidance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Startup Readiness Quiz */}
      <section id="calculator" className="py-16 bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
              Instant Assessment
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Check Your Business Launch Readiness Score
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Answer a quick 2-question assessment to estimate your launch timeline, legal requirements, and recommended starter package.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero vendor coordination hassle</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Single invoice for registration + tech + marketing</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Local Gallery in-person support desk</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/10 backdrop-blur-xl border border-white/15 p-6 md:p-8 rounded-3xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">1. Select Your Business Type</label>
              <select
                value={quizState.type}
                onChange={(e) => setQuizState({ ...quizState, type: e.target.value })}
                className="w-full p-3 bg-slate-900/80 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Retail">Retail Shop / Store Outlet</option>
                <option value="Service">Service Agency / Consulting</option>
                <option value="Tech">E-commerce / Tech App</option>
                <option value="Mfg">Manufacturing / Assembly</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-2">2. Planned Starting Budget</label>
              <select
                value={quizState.budget}
                onChange={(e) => setQuizState({ ...quizState, budget: e.target.value })}
                className="w-full p-3 bg-slate-900/80 border border-white/20 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="Under 25k">Under ₹25,000</option>
                <option value="50k-1L">₹50,000 - ₹1,000,000</option>
                <option value="Above 1L">Above ₹1,00,000</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-center">
              <span className="text-[11px] text-slate-300">Estimated Launch Readiness</span>
              <div className="text-3xl font-black text-emerald-400 mt-1">78 / 100</div>
              <p className="text-[11px] text-slate-300 mt-1">Recommended Plan: <span className="text-white font-bold">Business Launch (₹19,999)</span></p>
            </div>

            <button
              onClick={() => handleOpenModal(`Plan for ${quizState.type}`)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Get Custom Startup Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="pricing" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Transparent Pricing
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Choose Your Launch Plan
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              No hidden fees. Full support from idea to launch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PACKAGES.map((pkg, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                  pkg.popular
                    ? 'bg-gradient-to-b from-emerald-900 to-slate-900 text-white border-2 border-emerald-500 shadow-2xl relative'
                    : 'bg-white border border-slate-200 shadow-sm text-slate-900'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <div>
                  <h3 className="font-extrabold text-lg">{pkg.name}</h3>
                  <p className={`text-xs mt-1 ${pkg.popular ? 'text-slate-300' : 'text-slate-500'}`}>{pkg.desc}</p>
                  
                  <div className="mt-4 mb-6">
                    <span className={`text-3xl font-black ${pkg.popular ? 'text-emerald-400' : 'text-slate-900'}`}>{pkg.price}</span>
                    <span className={`text-xs font-medium ml-1 ${pkg.popular ? 'text-slate-300' : 'text-slate-400'}`}>{pkg.period}</span>
                  </div>

                  <ul className="space-y-3 text-xs">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={pkg.popular ? 'text-slate-200' : 'text-slate-700'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenModal(pkg.name)}
                  className={`w-full mt-8 py-3 font-bold text-xs rounded-xl transition-all ${
                    pkg.popular
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Select {pkg.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Testimonials */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Founder Success Stories
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Real Founders Who Launched With ePay
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I walked into my Pune Gallery with just a boutique idea. Within 3 weeks, I had my GST certificate, logo, Instagram page, and first 5 customers.",
                author: "Anjali R.",
                role: "Boutique Owner, Pune"
              },
              {
                quote: "The Gallery team handled everything from Pvt Ltd registration to payment gateway integration. Saved me at least 2 months of running around.",
                author: "Vikram S.",
                role: "Tech Startup Founder, Bengaluru"
              },
              {
                quote: "I had no clue about GST filings or invoice software. ePay made it so simple that I launched my design firm in under 10 days.",
                author: "Priya M.",
                role: "Freelance Design Agency, Nashik"
              }
            ].map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-xs text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Startup Desk Guidance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What types of businesses can ePay Startup Center help launch?",
                a: "All kinds! Retail shops, e-commerce stores, manufacturing units, service agencies, freelance setups, and tech startups."
              },
              {
                q: "Do I need prior business experience?",
                a: "No! We guide you step-by-step from idea structuring to legal registration and your first marketing campaign."
              },
              {
                q: "How fast can my business be registered and online?",
                a: "Depending on the package, basic setup takes 3-7 days, while full website and digital launch takes 2-3 weeks."
              },
              {
                q: "Will I get ongoing assistance after launch?",
                a: "Yes! Your local Gallery remains your ongoing desk for GST filing, hardware supplies, and digital marketing scaling."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-4 font-bold text-xs md:text-sm text-slate-900 flex justify-between items-center hover:text-emerald-700"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-emerald-600 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-200 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs text-center space-y-3">
        <p>© 2026 ePay Business Startup Center. Single Desk Business Launch Network.</p>
        <div className="flex justify-center gap-6 text-slate-500 font-medium">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>•</span>
          <Link href="/commerce" className="hover:text-emerald-400">Commerce Hub</Link>
          <span>•</span>
          <Link href="/career-hub" className="hover:text-emerald-400">Career Hub</Link>
          <span>•</span>
          <Link href="/login" className="hover:text-emerald-400">Staff Login</Link>
        </div>
      </footer>

      {/* Interactive Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!formSubmitted ? (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    🚀
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Book Startup Consultation</h3>
                    <p className="text-xs text-slate-500">ePay Gallery expert will contact you within 24 hours</p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 mt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Aniket Deshmukh"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      placeholder="10-digit mobile"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / Location</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune / Mumbai"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Selected Package / Module</label>
                    <input
                      type="text"
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Confirm Consultation Request
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Consultation Booked!</h3>
                <p className="text-xs text-slate-600">
                  Your reference ID is <code className="text-emerald-700 font-bold">CTR-{Date.now().toString().slice(-6)}</code>.
                  Your nearest Gallery Startup Advisor will call you.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
