'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Bot, User, Send, RefreshCw, Sparkles, Compass, Globe, 
  Briefcase, GraduationCap, Plane, Truck, Award, ShieldAlert, 
  CheckCircle2, ArrowRight, Save, Sliders, ChevronRight, FileText
} from 'lucide-react';

const JOURNEY_DB = {
  work_tech_de: {
    flag: '🇩🇪',
    country: 'Germany',
    role: 'Software Developer / IT Specialist',
    prep: '4–8 months',
    budgetFit: 'Moderate (₹4–6 Lakh)',
    path: [
      'Profile Review & Skills Mapping',
      'German Language Pathway (A1-B1)',
      'Employer Matching via Partner Network',
      'Interview & Offer Letter Formalities',
      'EU Blue Card / Skilled Worker Visa',
      'Relocation & Temporary Stay Setup'
    ],
    req: [
      'Valid Passport (>18 months validity)',
      'B.Tech / MCA Degree Transcript',
      'Proof of 2+ years IT experience',
      'Updated EU-format CV & Portfolio',
      'Proof of funds / employment offer'
    ]
  },
  work_health_uk: {
    flag: '🇬🇧',
    country: 'United Kingdom',
    role: 'Healthcare & Nursing Pathway',
    prep: '6–12 months',
    budgetFit: 'Moderate (₹5–8 Lakh)',
    path: [
      'Credential Recognition & NMC Assessment',
      'OET / IELTS English Preparation',
      'NHS Sponsor Employer Interview',
      'Job Offer & COS (Certificate of Sponsorship)',
      'Health & Care Worker Visa Application',
      'Flight, Airport Transfer & Accommodation'
    ],
    req: [
      'B.Sc Nursing / GNM Diploma',
      'Active Nursing Council Registration',
      '1+ Year Clinical Experience',
      'OET B grade / IELTS Academic 7.0',
      'Sponsor letter from NHS / Care Trust'
    ]
  },
  work_health_de: {
    flag: '🇩🇪',
    country: 'Germany',
    role: 'Nurse / Healthcare Specialist',
    prep: '8–14 months',
    budgetFit: 'Moderate (₹4–7 Lakh)',
    path: [
      'Qualification Verification (Defizitbescheid)',
      'German Language B1/B2 Course',
      'Hospital Matching Interview',
      'Adaptation Course / Knowledge Test Plan',
      'Work Visa Processing',
      'Flight & In-Country Settlement'
    ],
    req: [
      'Nursing Degree / Diploma',
      'State Nursing Council License',
      'German B1/B2 Certificate (Telc/Goethe)',
      'Medical Fitness & Police Clearance'
    ]
  },
  work_gulf: {
    flag: '🇦🇪',
    country: 'UAE / GCC Region',
    role: 'Skilled Trade / Hospitality / Operations',
    prep: '2–4 months',
    budgetFit: 'Lower (₹1.5–3 Lakh)',
    path: [
      'Trade Skill Assessment & CV Shortlist',
      'Employer Video Interview',
      'Formal Offer Letter & Medical Clearance',
      'Employment Visa Stamping',
      'Flight Ticket & On-Arrival Orientation'
    ],
    req: [
      'Valid Passport',
      'Diploma / Trade Certificate',
      'Experience Certificates',
      'GCC Medical Fitness Certificate'
    ]
  },
  study_ca: {
    flag: '🇨🇦',
    country: 'Canada',
    role: "Master's / Postgraduate Diploma",
    prep: '6–12 months',
    budgetFit: 'Higher (₹18–25 Lakh)',
    path: [
      'University / College Course Shortlisting',
      'Application & Letter of Acceptance (LOA)',
      'GIC Account Opening & Tuition Fee Pay',
      'Canada Study Permit Visa File',
      'Pre-departure Briefing & Arrival Support'
    ],
    req: [
      'Bachelor Degree Transcripts (min 65%)',
      'IELTS Academic Score 6.5+',
      'Statement of Purpose (SOP)',
      'Proof of Financial Support & GIC'
    ]
  },
  holiday_dxb: {
    flag: '🇦🇪',
    country: 'UAE (Dubai)',
    role: '7-Day Family Holiday Package',
    prep: '2–4 weeks',
    budgetFit: 'Flexible (₹1.5–3 Lakh total)',
    path: [
      'Travel Dates & Hotel Preference Selection',
      'Flight Ticket & Tourist Visa Issuance',
      'Sightseeing & Desert Safari Itinerary',
      'Travel Insurance & Forex Card Setup'
    ],
    req: [
      'Valid Passport (>6 months validity)',
      '30-Day UAE Tourist Visa',
      'Confirmed Hotel Booking',
      'Return Flight Tickets'
    ]
  },
  relocate_in: {
    flag: '🇮🇳',
    country: 'India (Domestic Move)',
    role: 'Inter-City Career Relocation',
    prep: '2–4 weeks',
    budgetFit: 'Budget Friendly (₹30k–70k)',
    path: [
      'Flight / Train Booking Assistance',
      'Temporary 15-Day Furnished Stay',
      'Luggage Packers & Movers Coordination',
      'Office Location Orientation & Local SIM'
    ],
    req: [
      'Job Joining Letter',
      'Government Photo ID Proof',
      'Relocation Allowance Claim Documents'
    ]
  },
  generic_work: {
    flag: '🌍',
    country: 'Global Career Destination',
    role: 'International Employment Path',
    prep: '4–10 months',
    budgetFit: 'Custom according to country',
    path: [
      'Career Goal Alignment & Assessment',
      'Country & Visa Eligibility Check',
      'Employer Matchmaking via Partner Network',
      'Visa File Preparation & Interview Guidance'
    ],
    req: [
      'Valid Passport',
      'Educational Degrees & CV',
      'Relevant Work Experience Proof'
    ]
  }
};

const EXAMPLES = [
  {
    title: '🌍 Work Abroad',
    text: 'I am 23, B.Tech graduate, budget ₹5 lakh, want to work abroad in software.',
    icon: '💻'
  },
  {
    title: '🏥 Healthcare UK/Germany',
    text: 'I am 26, nurse with 3 years experience, want to move to UK or Germany for healthcare jobs.',
    icon: '🩺'
  },
  {
    title: '🎓 Study Masters Canada',
    text: 'I want to study masters in Canada, budget around ₹25 lakh, completed BBA.',
    icon: '📚'
  },
  {
    title: '✈️ Dubai Family Holiday',
    text: 'Family of 4 planning holiday to Dubai for 7 days in December, budget ₹3 lakh.',
    icon: '🌴'
  },
  {
    title: '🚚 Domestic Job Move',
    text: 'Got a job offer in Hyderabad, relocating from Pune next month, need stay & move help.',
    icon: '🏢'
  },
  {
    title: '🛠️ Skilled Gulf Trade',
    text: 'Diploma in electrical, 2 years factory experience, interested in Gulf skilled jobs.',
    icon: '⚡'
  }
];

export default function AiAssistantPage() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [profile, setProfile] = useState({
    goal: null,
    education: null,
    experience: null,
    budget: null,
    countries: [],
    field: null
  });

  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Initial welcome message
    setMessages([
      {
        id: 1,
        sender: 'bot',
        text: `👋 Hi! I am the <b>ePay AI Career & Travel Assistant</b>.<br/><br/>Tell me about yourself in one line or select an example below.<br/><br/>For example: <i>"I am 23, B.Tech graduate, budget ₹5 lakh, want to work abroad in software."</i>`,
        chips: [
          { label: '💼 Work Abroad', value: 'goal:work' },
          { label: '🎓 Study Abroad', value: 'goal:study' },
          { label: '✈️ Holiday Trip', value: 'goal:holiday' },
          { label: '🚚 Relocate City', value: 'goal:relocate' }
        ]
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Parse text for profile parameters
  const parseUserProfile = (text) => {
    const t = text.toLowerCase();
    let updated = { ...profile };

    // Goal
    if (t.includes('work') || t.includes('job') || t.includes('career')) updated.goal = 'work';
    else if (t.includes('study') || t.includes('master') || t.includes('degree')) updated.goal = 'study';
    else if (t.includes('holiday') || t.includes('vacation') || t.includes('trip')) updated.goal = 'holiday';
    else if (t.includes('relocate') || t.includes('moving') || t.includes('shift')) updated.goal = 'relocate';

    // Education & Field
    if (t.includes('btech') || t.includes('b.tech') || t.includes('software') || t.includes('developer') || t.includes('engineer')) {
      updated.education = 'B.Tech / IT';
      updated.field = 'IT / Tech';
    } else if (t.includes('nurse') || t.includes('nursing') || t.includes('health')) {
      updated.education = 'Healthcare Degree';
      updated.field = 'Healthcare';
    } else if (t.includes('diploma') || t.includes('electrical') || t.includes('trade')) {
      updated.education = 'Diploma / Trade';
      updated.field = 'Trade';
    } else if (t.includes('bba') || t.includes('mba') || t.includes('business')) {
      updated.education = 'Business Degree';
      updated.field = 'Business';
    }

    // Country
    if (t.includes('germany')) updated.countries.push('Germany');
    if (t.includes('uk') || t.includes('england')) updated.countries.push('UK');
    if (t.includes('canada')) updated.countries.push('Canada');
    if (t.includes('dubai') || t.includes('gulf') || t.includes('uae')) updated.countries.push('Gulf');

    // Budget
    const matchBudget = t.match(/(\d+)\s*(lakh|lac|lacs|k)/i);
    if (matchBudget) {
      let val = parseInt(matchBudget[1], 10);
      if (matchBudget[2].toLowerCase() === 'k') val = val / 100;
      updated.budget = val;
    }

    setProfile(updated);
    return updated;
  };

  const selectJourney = (prof) => {
    const goal = prof.goal || 'work';
    const field = (prof.field || '').toLowerCase();
    const countries = prof.countries || [];

    if (goal === 'holiday') return JOURNEY_DB.holiday_dxb;
    if (goal === 'relocate') return JOURNEY_DB.relocate_in;
    if (goal === 'study') return JOURNEY_DB.study_ca;

    if (goal === 'work') {
      if (field.includes('health')) {
        if (countries.includes('UK')) return JOURNEY_DB.work_health_uk;
        return JOURNEY_DB.work_health_de;
      }
      if (field.includes('trade') || countries.includes('Gulf')) return JOURNEY_DB.work_gulf;
      if (field.includes('tech') || field.includes('it') || countries.includes('Germany')) return JOURNEY_DB.work_tech_de;
    }
    return JOURNEY_DB.generic_work;
  };

  const handleSendMessage = (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputText('');

    const updatedProfile = parseUserProfile(textToSend);

    // Bot Typing
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const journey = selectJourney(updatedProfile);

      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Based on your details, I have generated a <b>Custom Journey Blueprint</b> for you. Check out the pathway below:`,
        journeyCard: journey
      };

      setMessages(prev => [...prev, botReply]);
    }, 1000);
  };

  const handleChipClick = (chipValue, chipLabel) => {
    handleSendMessage(chipLabel);
  };

  const handleReset = () => {
    setProfile({
      goal: null,
      education: null,
      experience: null,
      budget: null,
      countries: [],
      field: null
    });
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: `New conversation started! Tell me your target country, background, or budget to plan your journey.`,
        chips: [
          { label: '💼 Work in Germany', value: 'Germany' },
          { label: '🏥 Healthcare in UK', value: 'UK' },
          { label: '🎓 Study in Canada', value: 'Canada' },
          { label: '✈️ Dubai Holiday', value: 'Dubai' }
        ]
      }
    ]);
  };

  const handleSaveJourney = (journey) => {
    try {
      const saved = JSON.parse(localStorage.getItem('epay-ai-journeys') || '[]');
      saved.push({
        journey,
        profile,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('epay-ai-journeys', JSON.stringify(saved));
      alert(`🚀 Journey saved! Ref ID: AIJ-${Date.now().toString().slice(-6)}\nYour assigned ePay Gallery consultant will follow up with exact document checklists.`);
    } catch (err) {
      console.warn('Storage error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white text-slate-900 font-sans antialiased flex flex-col justify-between">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              AI
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                ePay <span className="text-emerald-600">AI Assistant</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Career + Travel
              </span>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <Link href="/commerce" className="hover:text-emerald-700 transition-colors">Marketplace</Link>
            <Link href="/business-startup" className="hover:text-emerald-700 transition-colors">Startup Center</Link>
            <Link href="/career-hub" className="hover:text-emerald-700 transition-colors">Career Hub</Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-1.5 border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-bold rounded-full transition-colors"
            >
              Sign In
            </Link>

            <button
              onClick={handleReset}
              className="px-3.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Chat</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        {/* Intro Banner */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Journey Architect</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Map Your International Career & Travel Journey
          </h1>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
            Tell us your age, qualification, budget, and goal. The ePay AI instantly generates your visa path, document checklist, and Gallery next steps.
          </p>
        </div>

        {/* Chat Box Shell */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[580px] md:h-[620px] mb-8">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center font-bold text-lg shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">ePay AI Journey Planner</h3>
                <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online • Guided Assistance
                </p>
              </div>
            </div>
            <div className="text-[11px] text-slate-300 bg-white/10 px-2.5 py-1 rounded-full border border-white/10 font-mono">
              v3.2 AI Core
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[90%] ${
                  m.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                    m.sender === 'user'
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {m.sender === 'user' ? 'You' : '🤖'}
                </div>

                <div className="space-y-3">
                  <div
                    className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />

                  {/* Preset Chips */}
                  {m.chips && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.chips.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChipClick(chip.value, chip.label)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Generated Journey Card */}
                  {m.journeyCard && (
                    <div className="bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-500/30 space-y-4 max-w-lg">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{m.journeyCard.flag}</span>
                          <div>
                            <h4 className="font-extrabold text-base text-white">{m.journeyCard.country}</h4>
                            <p className="text-xs text-emerald-300 font-medium">{m.journeyCard.role}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                          <span className="text-[10px] text-slate-300 uppercase block font-bold">Preparation Time</span>
                          <span className="font-extrabold text-emerald-300 text-sm">{m.journeyCard.prep}</span>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                          <span className="text-[10px] text-slate-300 uppercase block font-bold">Budget Estimation</span>
                          <span className="font-extrabold text-teal-200 text-sm">{m.journeyCard.budgetFit}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1.5">
                          📋 Key Document Requirements
                        </span>
                        <ul className="space-y-1 text-xs text-slate-200">
                          {m.journeyCard.req.map((r, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-emerald-400">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block mb-1.5">
                          🛤️ Step-by-Step Pathway
                        </span>
                        <div className="space-y-1 text-xs text-slate-300">
                          {m.journeyCard.path.map((step, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white/5 p-1.5 rounded-lg">
                              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                                {i + 1}
                              </span>
                              <span className="truncate">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 flex flex-wrap gap-2">
                        <button
                          onClick={() => handleSaveJourney(m.journeyCard)}
                          className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save My Journey</span>
                        </button>
                        <Link
                          href="/career-hub"
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-1"
                        >
                          <span>Gallery Hub</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 items-center text-slate-400 text-xs font-medium">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  🤖
                </div>
                <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="ml-2 text-slate-500">AI is analyzing profile & visa rules...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Bar */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="e.g. I am 25, GNM Nurse, budget ₹4 lakh, want UK or Germany healthcare job..."
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              onClick={() => handleSendMessage()}
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs md:text-sm rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Prompt Examples */}
        <div className="space-y-3 mb-10">
          <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest text-center">
            🚀 Click Any Example To Try Instantly
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAMPLES.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(ex.text)}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{ex.icon}</span>
                  <span className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700 transition-colors">{ex.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{ex.text}</p>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer Disclaimer */}
      <footer className="bg-slate-950 text-slate-400 py-8 border-t border-slate-800 text-xs text-center space-y-2">
        <p className="max-w-2xl mx-auto text-[11px] text-slate-400 px-4">
          Disclaimer: This AI Assistant provides planning orientation and documentation checklists only. Actual job offers and visas are determined by employers and government authorities.
        </p>
        <div className="flex justify-center gap-6 text-slate-400 font-medium pt-2">
          <Link href="/" className="hover:text-emerald-400">Home</Link>
          <span>•</span>
          <Link href="/career-hub" className="hover:text-emerald-400">Career Hub</Link>
          <span>•</span>
          <Link href="/commerce" className="hover:text-emerald-400">Commerce Hub</Link>
          <span>•</span>
          <Link href="/business-startup" className="hover:text-emerald-400">Startup Center</Link>
        </div>
      </footer>
    </div>
  );
}
