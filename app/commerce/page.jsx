'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Shield, CheckCircle2, ChevronRight, Star, 
  Store, Truck, HelpCircle, ArrowRight, X, Phone, User, 
  MapPin, Sparkles, Laptop, Smartphone, BookOpen, Building2, 
  Zap, Compass, Award, Percent, Filter, Search, DollarSign, Calculator
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'electronics',
    title: 'Electronics & Gadgets',
    desc: 'Laptops, smartphones, audio gear & accessories with local warranty.',
    icon: '💻',
    image: 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&q=80',
    popular: true,
    itemCount: '450+ Products'
  },
  {
    id: 'travel',
    title: 'Travel Products & Luggage',
    desc: 'Bags, travel gear, international adapters & holiday essentials.',
    icon: '✈️',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    popular: false,
    itemCount: '280+ Products'
  },
  {
    id: 'education',
    title: 'Education & Learning Kits',
    desc: 'Books, digital tablets, STEM kits & competitive exam material.',
    icon: '🎓',
    image: 'https://images.unsplash.com/photo-1507842723435-a35775d7b578?w=600&q=80',
    popular: false,
    itemCount: '350+ Products'
  },
  {
    id: 'office',
    title: 'Office Supplies & Stationery',
    desc: 'Bulk paper, printers, desks, ergonomics & MSME consumables.',
    icon: '📦',
    image: 'https://images.unsplash.com/photo-1589939705066-5ea266afb35f?w=600&q=80',
    popular: true,
    itemCount: '600+ Products'
  },
  {
    id: 'machinery',
    title: 'Business Equipment & Machinery',
    desc: 'POS machines, barcode scanners, packaging tools & POS systems.',
    icon: '🛠️',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    popular: true,
    itemCount: '190+ Products'
  },
  {
    id: 'digital',
    title: 'Digital Services & Subscriptions',
    desc: 'SaaS tools, accounting software, domain names & cloud subscriptions.',
    icon: '🌐',
    image: 'https://images.unsplash.com/photo-1560264357-8d9766d1b51e?w=600&q=80',
    popular: false,
    itemCount: '120+ Services'
  },
  {
    id: 'local',
    title: 'Local Services & Contracting',
    desc: 'Verified neighborhood repair, maintenance & logistics vendors.',
    icon: '🔧',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    popular: false,
    itemCount: '80+ Services'
  },
  {
    id: 'assisted',
    title: 'Assisted Commerce Center',
    desc: 'Dedicated human experts to assist you from selection to setup.',
    icon: '🤝',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80',
    popular: true,
    itemCount: 'All Categories'
  }
];

const FEATURED_PRODUCTS = [
  {
    name: 'HP ProBook 450 G10 (Core i5, 16GB)',
    category: 'Electronics',
    price: '₹58,990',
    rating: '4.9',
    badge: 'Best for MSME',
    img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'
  },
  {
    name: 'Smart All-in-One Thermal POS Printer',
    category: 'Business Equipment',
    price: '₹8,499',
    rating: '4.8',
    badge: 'Popular',
    img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'
  },
  {
    name: 'Ergonomic Mesh Office Chair',
    category: 'Office Supplies',
    price: '₹6,200',
    rating: '4.7',
    badge: 'Top Seller',
    img: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?w=400&q=80'
  },
  {
    name: 'Heavy Duty Travel Trolley Set (3-Piece)',
    category: 'Travel Products',
    price: '₹11,999',
    rating: '4.9',
    badge: 'Hot Deal',
    img: 'https://images.unsplash.com/photo-1565026057447-ba90a3d7b7ba?w=400&q=80'
  }
];

const TESTIMONIALS = [
  {
    quote: "I needed laptops and POS printers for my new retail store. The Gallery team guided me on specs, gave GST invoice support, and delivered in 24 hours.",
    author: "Vivek Sharma",
    role: "Retail Store Owner, Pune",
    rating: 5
  },
  {
    quote: "I don't feel comfortable buying high-value electronics online alone. Having a local ePay Gallery manager explain options gave me 100% peace of mind.",
    author: "Priya Murthy",
    role: "Educator & Homemaker",
    rating: 5
  },
  {
    quote: "From office supplies to digital subscriptions, our Gallery handles all procurement. It's like having our own corporate buying officer.",
    author: "Rahul Kulkarni",
    role: "MSME Founder",
    rating: 5
  }
];

export default function CommercePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInterest, setSelectedInterest] = useState('Electronics');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculator State
  const [monthlySpend, setMonthlySpend] = useState(25000);

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    interest: 'Electronics',
    notes: ''
  });

  const handleOpenModal = (interestName = 'Electronics') => {
    setSelectedInterest(interestName);
    setFormData(prev => ({ ...prev, interest: interestName }));
    setFormSubmitted(false);
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem('epay-center-leads') || '[]');
      existing.push({
        ...formData,
        page: 'commerce-marketplace',
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('epay-center-leads', JSON.stringify(existing));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
    setFormSubmitted(true);
  };

  const filteredCategories = CATEGORIES.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Top Banner Navigation */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              eP
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                ePay <span className="text-emerald-600">Marketplace</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Assisted Commerce
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
            <a href="#categories" className="hover:text-emerald-700 transition-colors">Categories</a>
            <a href="#featured" className="hover:text-emerald-700 transition-colors">Trending</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#pricing" className="hover:text-emerald-700 transition-colors">Plans</a>
            <Link href="/business-startup" className="hover:text-emerald-700 transition-colors">Startup Center</Link>
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
              onClick={() => handleOpenModal('General Inquiry')}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs md:text-sm font-bold rounded-full shadow-md shadow-emerald-600/25 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Get Assisted Order</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
              <Store className="w-3.5 h-3.5 text-emerald-600" />
              <span>Gallery Assisted Commerce Center</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Shop Anything with <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
                100% Local Gallery Assistance
              </span>
            </h1>

            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              Electronics, travel gear, educational kits, office supplies, business equipment, and digital services – backed by human guidance, GST invoicing, and local Gallery support.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleOpenModal('Assisted Shopping')}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <span>Request Guided Purchase</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#categories"
                className="px-6 py-3.5 bg-white border-2 border-emerald-200 hover:border-emerald-500 text-slate-800 font-bold text-sm rounded-full shadow-sm hover:bg-emerald-50/50 transition-all flex items-center gap-2"
              >
                <span>Explore Catalog</span>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </a>
            </div>

            {/* Key Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200">
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">100%</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Human Assisted</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">2,500+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Verified Products</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-black text-emerald-700">120+</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Gallery Centers</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80"
                alt="Assisted E-commerce Marketplace"
                className="w-full h-[380px] sm:h-[440px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                      🤝
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">Personal Buying Consultant</h4>
                      <p className="text-xs text-slate-500">Visit your local Gallery or order via WhatsApp</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Search & Filter Section */}
      <section id="categories" className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
                Browse Marketplace
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
                What Can You Buy At Your Local Gallery?
              </h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                From daily enterprise essentials to specialized equipment – all backed by dedicated Gallery purchase support.
              </p>
            </div>

            <div className="w-full md:w-72 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search categories or items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => handleOpenModal(cat.title)}
                className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden mb-4 bg-slate-100">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold shadow-sm">
                      {cat.icon} {cat.itemCount}
                    </div>
                    {cat.popular && (
                      <div className="absolute top-2.5 right-2.5 bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                        Popular
                      </div>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Enquire With Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Trending Products */}
      <section id="featured" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              High Demand Electronics & Gear
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Top Trending Gallery Items
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Ready for immediate order with local warranty, demo at Gallery, and corporate tax billing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all p-4 flex flex-col justify-between">
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {prod.badge}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{prod.category}</span>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-0.5 line-clamp-2">{prod.name}</h4>
                  <div className="flex items-center gap-1 text-amber-500 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold text-slate-700">{prod.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-black text-emerald-700">{prod.price}</span>
                  <button
                    onClick={() => handleOpenModal(prod.name)}
                    className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    Get Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Savings Calculator */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">
              Assisted Savings Engine
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white">
              Calculate Time & Money Saved With Gallery Buying
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              When buying enterprise laptops, POS machines, office furniture, or digital software, buying through ePay Gallery saves research time, provides GST credit, and eliminates fake vendor risks.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200">100% Tax Compliant GST Input Claim</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200">Local Warranty Claim Handling By Gallery</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs text-slate-200">Bulk Sourcing & Group Buying Discounts</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white/10 backdrop-blur-xl border border-white/15 p-6 md:p-8 rounded-3xl space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2 text-xs font-bold text-slate-200">
                <span>Estimated Monthly Procurement Spend</span>
                <span className="text-emerald-400 text-sm">₹{monthlySpend.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="200000"
                step="5000"
                value={monthlySpend}
                onChange={(e) => setMonthlySpend(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-[11px] text-slate-300">Estimated GST Credit</span>
                <div className="text-xl font-black text-emerald-400 mt-1">
                  ₹{Math.round(monthlySpend * 0.18).toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/10 border border-white/10">
                <span className="text-[11px] text-slate-300">Hours Saved / Month</span>
                <div className="text-xl font-black text-teal-300 mt-1">
                  ~{Math.round(monthlySpend / 3000)} Hours
                </div>
              </div>
            </div>

            <button
              onClick={() => handleOpenModal('Bulk Order Savings')}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              Consult Gallery Buying Desk
            </button>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Simple 3-Step Process
            </span>
            <h2 class="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              How Assisted Shopping Works
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Skip confusion. Let your local Gallery manager guide your purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20">
                1
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">Tell Us What You Need</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Visit your nearest ePay Gallery in person or submit an online request with your required items.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20">
                2
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">Get Curated Options</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Our team compares prices, checks warranty, and recommends verified products matching your exact budget.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-xl flex items-center justify-center mb-4 shadow-md shadow-emerald-600/20">
                3
              </div>
              <h3 className="font-extrabold text-base text-slate-900 mb-2">Purchase & Setup Support</h3>
              <p className="text-slate-600 text-xs leading-relaxed">
                Complete payment securely, get local doorstep delivery, GST invoice, and hands-on installation support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / Commerce Membership Plans */}
      <section id="pricing" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Flexible Buying Plans
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Commerce Plans for Individual & Business Buyers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Casual */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Casual Shopper</h3>
                <p className="text-xs text-slate-500 mt-1">For personal electronics & travel buying</p>
                <div className="text-3xl font-black text-slate-900 mt-4 mb-6">
                  Free <span className="text-xs font-medium text-slate-400">/ forever</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Access to all product categories</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Assisted in-gallery browsing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Standard doorstep delivery</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenModal('Casual Shopper Plan')}
                className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Business Shopper - Popular */}
            <div className="bg-gradient-to-b from-emerald-900 to-slate-900 text-white p-8 rounded-3xl border-2 border-emerald-500 shadow-2xl relative flex flex-col justify-between">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                Most Popular for MSMEs
              </span>
              <div>
                <h3 className="font-extrabold text-lg text-white">Business Shopper</h3>
                <p className="text-xs text-slate-300 mt-1">For retailers, offices & growing teams</p>
                <div className="text-3xl font-black text-emerald-400 mt-4 mb-6">
                  ₹999 <span className="text-xs font-medium text-slate-300">/ month</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Everything in Casual plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Bulk order discount & group buying</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Priority same-day Gallery dispatch</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Dedicated Gallery account manager</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>GST tax credit invoicing support</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenModal('Business Shopper Plan')}
                className="w-full mt-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/30"
              >
                Join Business Plan
              </button>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">Enterprise Procurement</h3>
                <p className="text-xs text-slate-500 mt-1">For multi-location corporate buying</p>
                <div className="text-3xl font-black text-slate-900 mt-4 mb-6">
                  Custom <span className="text-xs font-medium text-slate-400">/ volume based</span>
                </div>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Custom equipment & machinery sourcing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Credit period & invoice billing terms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Dedicated corporate desk manager</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleOpenModal('Enterprise Procurement')}
                className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
              >
                Contact Corporate Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Verified Feedback
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              What Our Gallery Shoppers Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <h4 className="font-extrabold text-xs text-slate-900">{t.author}</h4>
                  <p className="text-[11px] text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-widest">
              Marketplace Guidance
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What product categories are available at ePay Gallery?",
                a: "You can purchase laptops, electronics, travel luggage, educational kits, office stationery, POS machines, business equipment, and digital software subscriptions."
              },
              {
                q: "Do I need to visit the Gallery in person to order?",
                a: "No! You can start your order online or via phone/WhatsApp, and your assigned local Gallery manager will handle selection, billing, and doorstep delivery."
              },
              {
                q: "How do returns and replacements work?",
                a: "You get direct local Gallery return and replacement support. If there's any defect or discrepancy, simply walk into your local Gallery."
              },
              {
                q: "Do you provide GST invoices for business purchases?",
                a: "Yes! All business purchases come with valid GST tax invoices so you can claim 100% tax credit for your business."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left p-4 font-bold text-xs md:text-sm text-slate-900 flex justify-between items-center hover:text-emerald-700"
                >
                  <span>{faq.q}</span>
                  <ChevronRight className={`w-4 h-4 text-emerald-600 transition-transform ${activeFaq === i ? 'rotate-90' : ''}`} />
                </button>
                {activeFaq === i && (
                  <div className="px-4 pb-4 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Banner */}
      <footer className="bg-slate-950 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <p>© 2026 ePay Marketplace. Assisted Commerce Network & Partner Hub.</p>
          <div className="flex justify-center gap-6 text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-400">Home</Link>
            <span>•</span>
            <Link href="/business-startup" className="hover:text-emerald-400">Startup Center</Link>
            <span>•</span>
            <Link href="/career-hub" className="hover:text-emerald-400">Career Hub</Link>
            <span>•</span>
            <Link href="/login" className="hover:text-emerald-400">Staff Login</Link>
          </div>
        </div>
      </footer>

      {/* Interactive Order / Inquiry Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 relative shadow-2xl animate-scaleIn">
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
                    🛒
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">Request Assisted Order</h3>
                    <p className="text-xs text-slate-500">Local Gallery manager will call you within 2 hours</p>
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
                      placeholder="e.g. Ramesh Patil"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your City / Location</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Pune / Nashik"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product Category / Item</label>
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
                    Submit Order Request
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold flex items-center justify-center mx-auto">
                  ✓
                </div>
                <h3 className="text-xl font-extrabold text-slate-900">Request Received!</h3>
                <p className="text-xs text-slate-600">
                  Your reference ID is <code className="text-emerald-700 font-bold">CTR-{Date.now().toString().slice(-6)}</code>.
                  An ePay Gallery consultant will reach out shortly.
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
