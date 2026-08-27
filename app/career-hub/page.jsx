'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Globe, CheckCircle2, ChevronRight, Star, 
  MapPin, Phone, User, Calendar, ShieldCheck, ArrowRight, 
  X, Award, Plane, Home, HeartPulse, Laptop, Wrench, Utensils, 
  Truck, HelpCircle, FileText, Search, Sparkles
} from 'lucide-react';

const JOURNEY_STEPS = [
  'Find Job', 'Eligibility', 'Employer Matching', 'Interview', 
  'Offer Letter', 'Work Permit / Visa', 'Finance', 'Flight', 
  'Accommodation', 'Airport Pickup', 'Local Registration', 'Workplace Joining'
];

const ROLES = [
  {
    id: 'Skilled Trade',
    title: 'Skilled Trades & Technical',
    desc: 'Certified electricians, welders, technicians, drivers & industrial operators.',
    icon: '⚡',
    popular: true
  },
  {
    id: 'Healthcare',
    title: 'Healthcare & Nursing',
    desc: 'Registered nurses, caregivers, lab technicians & allied health staff.',
    icon: '🩺',
    popular: true
  },
  {
    id: 'Hospitality',
    title: 'Hospitality & Culinary',
    desc: 'Hotel front office, chefs, F&B service crew & resort staff.',
    icon: '🏨',
    popular: false
  },
  {
    id: 'IT',
    title: 'IT & Software Digital',
    desc: 'Software developers, QA testers, cloud engineers & technical support.',
    icon: '💻',
    popular: true
  },
  {
    id: 'Logistics',
    title: 'Logistics & Warehouse',
    desc: 'Warehouse associates, forklift operators & supply chain staff.',
    icon: '📦',
    popular: false
  },
  {
    id: 'Other',
    title: 'Other Professional Roles',
    desc: 'Talk to an ePay Gallery consultant about custom opportunities.',
    icon: '🎯',
    popular: false
  }
];

const SERVICES = [
  { icon: '🔎', title: 'Job Search & Matching', desc: 'Profile alignment with verified overseas employers.' },
  { icon: '📋', title: 'Eligibility Assessment', desc: 'Understand criteria for role, country, and visa path.' },
  { icon: '🤝', title: 'Employer Shortlisting', desc: 'Direct matching through ePay global partner network.' },
  { icon: '🎙️', title: 'Interview Coaching', desc: 'Mock interviews, CV formatting & employer expectations.' },
  { icon: '📜', title: 'Offer Letter Guidance', desc: 'Contract review, compensation clarity & next steps.' },
  { icon: '🛂', title: 'Work Permit / Visa', desc: 'Document checklist, application filing & status tracking.' },
  { icon: '💰', title: 'Finance Assistance', desc: 'Cost estimates & partner financial guidance options.' },
  { icon: '✈️', title: 'Flight & Relocation', desc: 'Travel booking aid, initial stay & airport pickup.' },
  { icon: '🏢', title: 'Workplace Joining', desc: 'Local registration tips and smooth day-one onboarding.' }
];

const DESTINATIONS = [
  { country: 'UAE (Dubai)', sector: 'Hospitality • Trade • Logistics', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
  { country: 'United Kingdom', sector: 'Healthcare • Care • Hospitality', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { country: 'Germany', sector: 'Skilled Trades • Nursing • IT', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80' },
  { country: 'Canada', sector: 'Healthcare • Trade • Logistics', img: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&q=80' },
  { country: 'Australia', sector: 'Trade • Healthcare • Hospitality', img: 'https://images.unsplash.com/photo-1523482580745-af32f7f3f9ee?w=600&q=80' },
  { country: 'Singapore', sector: 'Hospitality • Marine • Services', img: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
  { country: 'Poland', sector: 'Manufacturing • Logistics', img: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=600&q=80' },
  { country: 'Japan', sector: 'Caregiver • Manufacturing • Hospitality', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' }
];

const SAMPLE_JOBS = [
  {
    tag: 'UAE',
    title: 'Hotel Front Office Executive',
    location: 'Dubai, UAE',
    sector: 'Hospitality',
    type: 'Full-time',
    desc: 'Experience preferred • Employer interview • Work permit after offer'
  },
  {
    tag: 'Germany',
    title: 'Certified Electrician & Technician',
    location: 'Munich / Berlin, Germany',
    sector: 'Skilled Trade',
    type: 'Full-time',
    desc: 'Qualification recognition • Language pathway support'
  },
  {
    tag: 'UK',
    title: 'Healthcare & Care Assistant',
    location: 'Birmingham / London, UK',
    sector: 'Healthcare',
    type: 'Full-time',
    desc: 'Care experience valued • NHS / Private trust sponsor pathway'
  },
  {
    tag: 'Canada',
    title: 'Warehouse & Logistics Associate',
    location: 'Toronto, Canada',
    sector: 'Logistics',
    type: 'Full-time',
    desc: 'Physical role • Employer screening • Permit pathway guidance'
  },
  {
    tag: 'Singapore',
    title: 'F&B Senior Service Staff',
    location: 'Marina Bay, Singapore',
    sector: 'Hospitality',
    type: 'Full-time',
    desc: 'Shift-based • Employer interview • Work pass process'
  },
  {
    tag: 'Australia',
    title: 'Aged Care Specialist Worker',
    location: 'Melbourne, Australia',
    sector: 'Healthcare',
    type: 'Full-time',
    desc: 'Certification pathways • Employer assessment required'
  }
];

export default function CareerHubPage() {
  const [modalType, setModalType] = useState(null); // 'career' | 'gallery' | 'appointment' | null
  const [selectedRole, setSelectedRole] = useState('Skilled Trade');
  const [selectedCountry, setSelectedCountry] = useState('Germany');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Readiness Calculator
  const [readinessScore, setReadinessScore] = useState(68);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    role: 'Skilled Trade',
    country: 'Germany',
    notes: '',
    city: '',
    date: ''
  });

  const handleOpenModal = (type, roleName = 'Skilled Trade', countryName = 'Germany') => {
    setModalType(type);
    setSelectedRole(roleName);
    setSelectedCountry(countryName);
    setFormData(prev => ({ ...prev, role: roleName, country: countryName }));
    setFormSubmitted(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('epay-career-leads') || '[]');
      existing.push({
        ...formData,
        type: modalType,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('epay-career-leads', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    setFormSubmitted(true);
  };

  const handleCalculateScore = () => {
    const newScore = 60 + Math.floor(Math.random() * 30);
    setReadinessScore(newScore);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              eP
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                ePay <span className="text-emerald-600">Career Hub</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Work Abroad
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <a href="#journey" className="hover:text-emerald-700 transition-colors">Candidate Journey</a>
            <a href="#roles" className="hover:text-emerald-700 transition-colors">Roles</a>
            <a href="#destinations" className="hover:text-emerald-700 transition-colors">Destinations</a>
            <a href="#jobs" className="hover:text-emerald-700 transition-colors">Openings</a>
            <Link href="/commerce" className="hover:text-emerald-700 transition-colors">Marketplace</Link>
            <Link href="/business-startup" className="hover:text-emerald-700 transition-colors">Startup Center</Link>
            <Link href="/ai-assistant" className="hover:text-emerald-700 transition-colors">AI Assistant</Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-1.5 border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-bold rounded-full transition-colors"
            >
              Sign In
            </Link>

            <button
              onClick={() => handleOpenModal('career')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-bold rounded-full shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Start Career Journey</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/80 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>International Career Hub • Gallery Assisted</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.12] tracking-tight">
              Not Just A Job Search. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
                A Complete Journey Abroad.
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              From finding the right opening to eligibility check, interview prep, work permit, visa filing, flight, accommodation, and day-one workplace joining – ePay Gallery supports your full career pathway.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleOpenModal('career')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Start My Career Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenModal('appointment')}
                className="px-6 py-3.5 bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800 font-bold text-sm rounded-full shadow-sm hover:bg-emerald-50/50 transition-all flex items-center gap-2"
              >
                <span>Book Gallery Consultation</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </button>
            </div>

            {/* Trust Pill Strip */}
            <div className="flex flex-wrap gap-2 pt-4">
              {['💼 Job Matching', '📜 Eligibility Check', '🛂 Work Permit & Visa', '✈️ Relocation & Stay', '🤝 Gallery Desk Guidance'].map((pill, i) => (
                <span key={i} className="px-3 py-1 bg-white border border-emerald-200 rounded-full text-xs font-semibold text-emerald-800 shadow-sm">
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl space-y-5">
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80"
                  alt="International Candidate Consultation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                  Verified Pathway
                </div>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Destinations</span>
                  <div className="text-xl font-black text-emerald-800">25+ Countries</div>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Active Openings</span>
                  <div className="text-xl font-black text-emerald-800">1,200+ Roles</div>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Placed Candidates</span>
                  <div className="text-xl font-black text-emerald-800">4,800+</div>
                </div>
                <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">ePay Galleries</span>
                  <div className="text-xl font-black text-emerald-800">120+ Desks</div>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                * Placement depends on employer interview decisions, qualification verification, and government visa rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Journey Flow (12 Steps) */}
      <section id="journey" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              End-To-End Support
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              One Path From Offer To First Day At Work
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Instead of just showing job listings, we guide your full relocation lifecycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {JOURNEY_STEPS.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="px-4 py-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 shadow-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-extrabold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
                {idx < JOURNEY_STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 hidden sm:inline-block" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection Grid */}
      <section id="roles" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Role Alignments
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              What Sector Are You Looking For?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROLES.map((r) => (
              <div
                key={r.id}
                onClick={() => handleOpenModal('career', r.title)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{r.icon}</span>
                    {r.popular && (
                      <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        High Demand
                      </span>
                    )}
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {r.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                    {r.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Explore Openings</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Services Grid (9 Modules) */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Assistance Modules
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              9 Pillars Of Relocation Assistance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <span className="text-2xl mb-2 block">{s.icon}</span>
                  <h3 className="font-extrabold text-sm text-slate-900">{s.title}</h3>
                  <p className="text-slate-600 text-xs mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Photo Cards */}
      <section id="destinations" className="py-16 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
              Global Options
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1">
              Popular Work Destinations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DESTINATIONS.map((d, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenModal('career', 'General Role', d.country)}
                className="relative h-56 rounded-2xl overflow-hidden shadow-lg group cursor-pointer border border-white/10"
              >
                <img
                  src={d.img}
                  alt={d.country}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="font-black text-lg text-white group-hover:text-emerald-300 transition-colors">
                    {d.country}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">{d.sector}</p>
                  <div className="mt-2 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <span>View Visa Requirements</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Open Roles */}
      <section id="jobs" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Live Openings
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Sample Open Positions Abroad
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Illustrative listings – active vacancies updated continuously at your Gallery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAMPLE_JOBS.map((j, idx) => (
              <div
                key={idx}
                onClick={() => handleOpenModal('career', j.title, j.tag)}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {j.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{j.type}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1">{j.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{j.location} • {j.sector}</p>
                  <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                    {j.desc}
                  </p>
                </div>

                <button className="mt-5 py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors w-full">
                  Apply via Gallery
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Readiness Score & Custom Calculator */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
              Path Readiness Evaluator
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Evaluate Your Overseas Career Readiness
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Before applying for international roles, assess your degree verification status, passport validity, language certifications, and financial readiness.
            </p>

            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span>Calculated Profile Score</span>
                <span className="text-emerald-400 text-sm font-extrabold">{readinessScore} / 100</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{ width: `${readinessScore}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-300">
                {readinessScore > 75
                  ? 'High Readiness! Ready for direct employer interview matching.'
                  : 'Moderate Readiness. Complete language or document verification via Gallery.'}
              </p>
            </div>

            <button
              onClick={handleCalculateScore}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md"
            >
              Re-Calculate Score
            </button>
          </div>

          <div className="lg:col-span-5 bg-white/10 backdrop-blur-xl border border-white/15 p-6 rounded-3xl space-y-4">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Document Preparation Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Valid Passport (min 18 months validity)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Education Marksheets & Degree Certificates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Work Experience Letters / Payslips</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Language Certificate (IELTS / OET / German B1)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Assistance Packages */}
      <section id="packages" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Assistance Packages
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Select Your Support Tier
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Profile Start</h3>
                <p className="text-xs text-slate-500 mt-1">Basic orientation & eligibility review</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Career consultation at Gallery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Basic country & visa eligibility check</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Document requirement checklist</li>
                </ul>
              </div>
              <button onClick={() => handleOpenModal('career')} className="w-full mt-8 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold text-xs rounded-xl">
                Get Started
              </button>
            </div>

            <div className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl relative flex flex-col justify-between">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full">
                Recommended
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-white">Career Path Package</h3>
                <p className="text-xs text-slate-300 mt-1">Full employer matching & visa assistance</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Employer match & interview coaching</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Work permit & visa filing checklist</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Dedicated ePay Gallery consultant</li>
                </ul>
              </div>
              <button onClick={() => handleOpenModal('career')} className="w-full mt-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg">
                Choose Career Path
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Relocation Pro</h3>
                <p className="text-xs text-slate-500 mt-1">End-to-end flight, stay & joining aid</p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Everything in Career Path</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Flight booking & initial stay setup</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Airport pickup & local orientation</li>
                </ul>
              </div>
              <button onClick={() => handleOpenModal('career')} className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl">
                Talk to Consultant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Candidate Reviews */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Candidate Feedback
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Candidate Testimonials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "I only knew I wanted to work abroad. The Gallery team helped me understand documents and the steps after getting an offer.",
                author: "Sanjay",
                location: "Pune • Electrician in UAE"
              },
              {
                quote: "Interview prep and checklist support made the nursing visa process less confusing than trying to do everything alone.",
                author: "Neha",
                location: "Mumbai • Healthcare in UK"
              },
              {
                quote: "I started online and continued at my local Gallery. Having one dedicated team for guidance made all the difference.",
                author: "Arjun",
                location: "Hyderabad • Software in Germany"
              }
            ].map((rev, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{rev.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <h4 className="font-extrabold text-xs text-slate-900">{rev.author}</h4>
                  <p className="text-[11px] text-slate-500">{rev.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Career Hub FAQ
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Does ePay guarantee a job abroad?",
                a: "No. Employment decisions are made solely by hiring employers. ePay assists with guidance, matching support where available, documentation, and relocation coordination."
              },
              {
                q: "Does ePay guarantee a work visa or permit?",
                a: "No. Visas and work permits are decided by embassy authorities and government immigration departments. ePay provides document preparation assistance only."
              },
              {
                q: "Can I start my career application without visiting a Gallery?",
                a: "Yes! You can submit your details online, and later visit a Gallery for document verification or in-person consultation if required."
              },
              {
                q: "What documents will I need to start?",
                a: "Typically your passport, educational marksheets, experience certificates, and passport-size photos. Your Gallery consultant will provide an exact checklist."
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

      {/* Footer Banner CTA */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 text-xs text-center space-y-4">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-xl font-extrabold text-white">Ready To Start Your International Career Journey?</h3>
          <p className="text-slate-400 max-w-lg mx-auto text-xs mt-1">
            Connect with your nearest ePay Gallery or start your guided application online.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={() => handleOpenModal('career')}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-full shadow-lg"
            >
              Start Application
            </button>
            <button
              onClick={() => handleOpenModal('appointment')}
              className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-full border border-white/20"
            >
              Book Gallery Appointment
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!formSubmitted ? (
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {modalType === 'gallery' ? 'Find ePay Gallery' : modalType === 'appointment' ? 'Book Consultation' : 'Start Career Application'}
                    </h3>
                    <p className="text-xs text-slate-500">ePay consultant will reach out via mobile/WhatsApp</p>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-3.5 mt-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Deshmukh"
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

                  {modalType === 'career' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Role / Sector Interest</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 font-medium"
                        >
                          <option>Skilled Trade</option>
                          <option>Healthcare</option>
                          <option>Hospitality</option>
                          <option>IT</option>
                          <option>Logistics</option>
                          <option>Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Target Country</label>
                        <input
                          type="text"
                          value={formData.country}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          placeholder="e.g. Germany / UK / UAE"
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </>
                  )}

                  {modalType === 'appointment' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Consultation Date</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  )}

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

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-600/20"
                  >
                    Submit Application
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Application Received!</h3>
                <p className="text-xs text-slate-600">
                  Your reference ID is <code className="text-emerald-700 font-bold">CRR-{Date.now().toString().slice(-6)}</code>.
                  Your assigned Gallery advisor will reach out.
                </p>
                <button
                  onClick={() => setModalType(null)}
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
