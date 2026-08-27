'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, Sparkles, TrendingUp, Building2, Globe, Users, 
  CheckCircle2, Rocket, Zap, Laptop, Plane, ShoppingBag, Award, 
  ArrowRight, Lock, Star, Play, PhoneCall, Layers, Calculator, 
  HelpCircle, ChevronRight, Store, ArrowUpRight, Cloud, Cpu, 
  HeartPulse, Briefcase, Smile, Check, MapPin, Landmark, DollarSign,
  Compass, CreditCard, ChevronDown, CheckCircle, Search, Clock, FileText
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  // Navigation & Scroll State
  const [navScrolled, setNavScrolled] = useState(false);
  const [stickyCtaShow, setStickyCtaShow] = useState(false);
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const navCategories = [
    {
      title: 'Perfection Section',
      items: [
        { label: 'Citizen & Public Services', path: '/citizen-public-services' },
        { label: 'Finance & Insurance', path: '/finance-insurance' },
        { label: 'Accommodation & Relocation', path: '/accommodation-relocation' },
        { label: 'Utility & Booking', path: '/utility-booking' },
        { label: 'Lifestyle & Concierge', path: '/lifestyle-concierge' }
      ]
    },
    {
      title: 'AI Assistant',
      items: [
        { label: 'AI Business', path: '/ai-assistant' },
        { label: 'Journey Score', path: '/ai-assistant' },
        { label: 'Emergency Assistant', path: '/ai-assistant' },
        { label: 'Business & Franchise', path: '/business-startup' },
        { label: 'AI Control Room', path: '/ai-assistant' }
      ]
    },
    {
      title: 'Business Startup',
      items: [
        { label: 'Franchise Discovery', path: '/franchise' },
        { label: 'Franchise SaaS', path: '/business-startup' },
        { label: 'MSME Digitalization', path: '/business-startup' },
        { label: 'Career & Talent', path: '/career-hub' },
        { label: 'Startup & Business Launch', path: '/business-startup' }
      ]
    },
    {
      title: 'Career Hub',
      items: [
        { label: 'Job Portal', path: '/career-hub' },
        { label: 'Skill Academy', path: '/head-training' },
        { label: 'Commerce & Marketplace', path: '/commerce' },
        { label: 'Jobs & Career', path: '/career-hub' }
      ]
    },
    {
      title: 'Commerce',
      items: [
        { label: 'Services Marketplace', path: '/commerce' },
        { label: 'Institution Marketplace', path: '/commerce' },
        { label: 'Lifestyle & Concierge', path: '/lifestyle-concierge' }
      ]
    },
    {
      title: 'Utility & Booking',
      items: [
        { label: 'Utility & Booking Services', path: '/utility-booking' }
      ]
    },
    {
      title: 'Travel & Relocation',
      items: [
        { label: 'Citizen & Public Services', path: '/citizen-public-services' },
        { label: 'Accommodation & Relocation', path: '/accommodation-relocation' },
        { label: 'Travel & Arrival', path: '/accommodation' }
      ]
    },
    {
      title: 'Finance & Safety',
      items: [
        { label: 'Finance & Insurance', path: '/finance-insurance' },
        { label: 'Finance System', path: '/finance' }
      ]
    }
  ];

  // Modals
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [leadType, setLeadType] = useState('franchise'); // franchise | demo | ai
  const [leadFormView, setLeadFormView] = useState(true);
  const [leadForm, setLeadForm] = useState({ first: '', last: '', phone: '', email: '', city: '', state: 'Maharashtra', interest: 'franchise' });
  const [leadError, setLeadError] = useState('');

  // ROI Calculator
  const [inv, setInv] = useState(75000);
  const [cust, setCust] = useState(45);
  const [bill, setBill] = useState(420);
  const [comm, setComm] = useState(2.8);

  // Live Metrics Ticker
  const [metrics, setMetrics] = useState({ revenue: 32450, tx: 1458, comm: 8520, members: 15, wallet: 85440, tickets: 2 });

  // Service Explorer
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState('all');

  // FAQ Accordion
  const [openFaq, setOpenFaq] = useState(null);

  // ePay Travel Vertical
  const [travelTab, setTravelTab] = useState('packages');
  const [tvDest, setTvDest] = useState('Dubai');
  const [tvDate, setTvDate] = useState('2026-10-15');
  const [tvPax, setTvPax] = useState('2 Adults');
  const [tvBudget, setTvBudget] = useState('Any');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResults, setAiResults] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const [quoteForm, setQuoteForm] = useState({ name: '', mobile: '', email: '', dest: 'Dubai', date: '', returnDate: '', adults: 2, children: 0, budget: '1,50,000', hotel: 'Any', notes: '' });
  const [expertForm, setExpertForm] = useState({ name: '', mobile: '', interest: 'Dubai', contact: 'Call' });

  // Map state
  const [selectedMapState, setSelectedMapState] = useState('mh');
  const [mapTooltip, setMapTooltip] = useState({ visible: false, text: '', sub: '', x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState('');
  const mapContainerRef = useRef(null);

  const stateNames = {
    an: 'Andaman & Nicobar Islands', ap: 'Andhra Pradesh', ar: 'Arunachal Pradesh', as: 'Assam',
    br: 'Bihar', ch: 'Chandigarh', ct: 'Chhattisgarh', dn: 'Dadra & Nagar Haveli', dd: 'Daman & Diu',
    dl: 'Delhi', ga: 'Goa', gj: 'Gujarat', hr: 'Haryana', hp: 'Himachal Pradesh', jk: 'Jammu & Kashmir',
    jh: 'Jharkhand', ka: 'Karnataka', kl: 'Kerala', ld: 'Lakshadweep', mp: 'Madhya Pradesh',
    mh: 'Maharashtra', mn: 'Manipur', ml: 'Meghalaya', mz: 'Mizoram', nl: 'Nagaland', or: 'Odisha',
    py: 'Puducherry', pb: 'Punjab', rj: 'Rajasthan', sk: 'Sikkim', tn: 'Tamil Nadu', tg: 'Telangana',
    tr: 'Tripura', up: 'Uttar Pradesh', ut: 'Uttarakhand', wb: 'West Bengal'
  };

  const franchiseData = {
    mh: { status: 'live', galleries: 52, slots: 8, revenue: '2.1 Cr', partners: 48, cities: ['Pune', 'Mumbai', 'Nagpur', 'Nashik', 'Aurangabad'] },
    gj: { status: 'live', galleries: 38, slots: 6, revenue: '1.4 Cr', partners: 34, cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'] },
    ka: { status: 'live', galleries: 41, slots: 10, revenue: '1.6 Cr', partners: 37, cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubli'] },
    tn: { status: 'live', galleries: 35, slots: 9, revenue: '1.3 Cr', partners: 31, cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'] },
    tg: { status: 'available', galleries: 22, slots: 14, revenue: '78 L', partners: 19, cities: ['Hyderabad', 'Warangal', 'Nizamabad'] },
    ap: { status: 'available', galleries: 18, slots: 12, revenue: '62 L', partners: 16, cities: ['Visakhapatnam', 'Vijayawada', 'Guntur'] },
    dl: { status: 'filling', galleries: 28, slots: 3, revenue: '1.1 Cr', partners: 25, cities: ['New Delhi', 'Dwarka', 'Rohini', 'Saket'] },
    up: { status: 'live', galleries: 48, slots: 15, revenue: '1.8 Cr', partners: 44, cities: ['Lucknow', 'Noida', 'Kanpur', 'Varanasi', 'Agra'] },
    rj: { status: 'available', galleries: 26, slots: 11, revenue: '95 L', partners: 23, cities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota'] },
    mp: { status: 'available', galleries: 24, slots: 13, revenue: '88 L', partners: 21, cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'] },
    wb: { status: 'live', galleries: 31, slots: 7, revenue: '1.05 Cr', partners: 28, cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'] },
    kl: { status: 'filling', galleries: 19, slots: 4, revenue: '72 L', partners: 17, cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode'] },
    pb: { status: 'available', galleries: 16, slots: 9, revenue: '58 L', partners: 14, cities: ['Chandigarh', 'Ludhiana', 'Amritsar'] },
    hr: { status: 'available', galleries: 20, slots: 8, revenue: '70 L', partners: 18, cities: ['Gurugram', 'Faridabad', 'Panipat'] },
    br: { status: 'available', galleries: 14, slots: 16, revenue: '42 L', partners: 12, cities: ['Patna', 'Gaya', 'Muzaffarpur'] },
    or: { status: 'available', galleries: 12, slots: 11, revenue: '38 L', partners: 10, cities: ['Bhubaneswar', 'Cuttack', 'Rourkela'] },
    ct: { status: 'available', galleries: 11, slots: 10, revenue: '35 L', partners: 9, cities: ['Raipur', 'Bhilai', 'Bilaspur'] },
    jh: { status: 'soon', galleries: 6, slots: 14, revenue: '18 L', partners: 5, cities: ['Ranchi', 'Jamshedpur'] },
    as: { status: 'soon', galleries: 5, slots: 12, revenue: '15 L', partners: 4, cities: ['Guwahati', 'Dibrugarh'] },
    ut: { status: 'available', galleries: 9, slots: 7, revenue: '28 L', partners: 8, cities: ['Dehradun', 'Haridwar'] },
    hp: { status: 'soon', galleries: 4, slots: 8, revenue: '12 L', partners: 3, cities: ['Shimla', 'Dharamshala'] },
    ga: { status: 'filling', galleries: 8, slots: 2, revenue: '32 L', partners: 7, cities: ['Panaji', 'Margao'] },
    jk: { status: 'soon', galleries: 3, slots: 10, revenue: '9 L', partners: 2, cities: ['Srinagar', 'Jammu'] },
    ch: { status: 'filling', galleries: 7, slots: 1, revenue: '28 L', partners: 6, cities: ['Chandigarh'] },
    py: { status: 'available', galleries: 5, slots: 4, revenue: '14 L', partners: 4, cities: ['Puducherry'] },
    sk: { status: 'soon', galleries: 1, slots: 5, revenue: '3 L', partners: 1, cities: ['Gangtok'] },
    mn: { status: 'soon', galleries: 2, slots: 6, revenue: '5 L', partners: 2, cities: ['Imphal'] },
    ml: { status: 'soon', galleries: 1, slots: 5, revenue: '3 L', partners: 1, cities: ['Shillong'] },
    mz: { status: 'soon', galleries: 1, slots: 4, revenue: '2 L', partners: 1, cities: ['Aizawl'] },
    nl: { status: 'soon', galleries: 1, slots: 5, revenue: '3 L', partners: 1, cities: ['Kohima'] },
    tr: { status: 'soon', galleries: 2, slots: 5, revenue: '4 L', partners: 2, cities: ['Agartala'] },
    ar: { status: 'soon', galleries: 1, slots: 6, revenue: '2 L', partners: 1, cities: ['Itanagar'] },
    an: { status: 'soon', galleries: 1, slots: 3, revenue: '2 L', partners: 1, cities: ['Port Blair'] },
    ld: { status: 'soon', galleries: 0, slots: 2, revenue: '—', partners: 0, cities: ['Kavaratti'] },
    dn: { status: 'soon', galleries: 1, slots: 2, revenue: '2 L', partners: 1, cities: ['Silvassa'] },
    dd: { status: 'soon', galleries: 1, slots: 2, revenue: '2 L', partners: 1, cities: ['Daman'] }
  };

  const statusColors = {
    live:      { fill: '#059669', hover: '#047857', stroke: '#10b981', label: 'Strong Presence', cls: 'bg-emerald-100 text-emerald-800' },
    available: { fill: '#34d399', hover: '#10b981', stroke: '#6ee7b7', label: 'Slots Available', cls: 'bg-teal-100 text-teal-800' },
    filling:   { fill: '#fbbf24', hover: '#f59e0b', stroke: '#fcd34d', label: 'Filling Fast', cls: 'bg-amber-100 text-amber-800' },
    soon:      { fill: '#d1d5db', hover: '#9ca3af', stroke: '#e5e7eb', label: 'Coming Soon', cls: 'bg-slate-100 text-slate-700' }
  };

  const travelPackages = [
    { id:1, title:'ePay Dubai Premium 5N/6D', dest:'Dubai', nights:5, price:149999, rating:4.9, tags:['5★ Hotel','Breakfast','Desert Safari','Burj Khalifa'], badge:'ePay Exclusive', img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
    { id:2, title:'Dubai Best Value 4N/5D', dest:'Dubai', nights:4, price:99999, rating:4.6, tags:['3★ Hotel','Breakfast','City Tour'], badge:'Best Value', img:'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80' },
    { id:3, title:'Dubai Luxury 6N/7D', dest:'Dubai', nights:6, price:185000, rating:4.95, tags:['5★ Resort','Private Transfer','Safari','Marina'], badge:'Luxury', img:'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=600&q=80' },
    { id:4, title:'Thailand Explorer 5N', dest:'Thailand', nights:5, price:78999, rating:4.7, tags:['4★ Hotel','Island Hopping','Breakfast'], badge:'Popular', img:'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80' },
    { id:5, title:'Bali Honeymoon Villa 6N', dest:'Bali', nights:6, price:112000, rating:4.85, tags:['Private Pool Villa','Couple Spa','Sunset Cruise'], badge:'Honeymoon', img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
    { id:6, title:'Maldives Romance 4N', dest:'Maldives', nights:4, price:165000, rating:4.9, tags:['Water Villa','All Meals Included','Snorkel'], badge:'Luxury', img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
    { id:7, title:'Singapore Universal 4N', dest:'Singapore', nights:4, price:89999, rating:4.75, tags:['Universal Studios','Sentosa Cable Car'], badge:'Family Favorite', img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
    { id:8, title:'Goa Beach Escape 3N', dest:'Goa', nights:3, price:24999, rating:4.5, tags:['Beach Resort','Water Sports','Breakfast'], badge:'Domestic Special', img:'https://images.unsplash.com/photo-1512343879784-a9601113816b?w=600&q=80' },
    { id:9, title:'Kashmir Paradise 5N', dest:'Kashmir', nights:5, price:42999, rating:4.8, tags:['Dal Lake Houseboat','Gulmarg','Pahalgam'], badge:'Domestic Hit', img:'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&q=80' },
    { id:10, title:'Kerala Backwaters 4N', dest:'Kerala', nights:4, price:35999, rating:4.7, tags:['Houseboat Cruise','Ayurvedic Spa'], badge:'Monsoon Retreat', img:'https://images.unsplash.com/photo-1602216056337-9bdedfdc26c3?w=600&q=80' },
    { id:11, title:'Rajasthan Royal 6N', dest:'Rajasthan', nights:6, price:54999, rating:4.65, tags:['Heritage Palaces','Camel Safari','Jaipur'], badge:'Royal Heritage', img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80' },
    { id:12, title:'Himachal Hills 5N', dest:'Himachal', nights:5, price:38999, rating:4.6, tags:['Manali Snow Valley','Solang Paragliding'], badge:'Summer Escape', img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' }
  ];

  const travelDestinations = {
    domestic: [
      { name:'Kashmir', flag:'🏔️', from:38999, img:'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&q=80' },
      { name:'Goa', flag:'🏖️', from:19999, img:'https://images.unsplash.com/photo-1512343879784-a9601113816b?w=600&q=80' },
      { name:'Kerala', flag:'🌴', from:29999, img:'https://images.unsplash.com/photo-1602216056337-9bdedfdc26c3?w=600&q=80' },
      { name:'Rajasthan', flag:'🏰', from:44999, img:'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&q=80' },
      { name:'Himachal', flag:'⛰️', from:32999, img:'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80' },
      { name:'Andaman', flag:'🏝️', from:42999, img:'https://images.unsplash.com/photo-1589553416260-f586c8f1514f?w=600&q=80' }
    ],
    international: [
      { name:'Dubai', flag:'🏙️', from:99999, img:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80' },
      { name:'Thailand', flag:'⛩️', from:78999, img:'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&q=80' },
      { name:'Bali', flag:'🗿', from:95000, img:'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80' },
      { name:'Singapore', flag:'🦁', from:89999, img:'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80' },
      { name:'Maldives', flag:'🌊', from:145000, img:'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80' },
      { name:'Europe', flag:'🏰', from:175000, img:'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80' }
    ]
  };

  // Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 30);
      setStickyCtaShow(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live Metrics Ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => ({
        revenue: Math.round(32450 * (1 + (Math.random() * 0.08 - 0.04))),
        tx: Math.round(1458 * (1 + (Math.random() * 0.06 - 0.03))),
        comm: Math.round(8520 * (1 + (Math.random() * 0.1 - 0.05))),
        members: Math.round(15 + (Math.random() * 3 - 1)),
        wallet: 85440,
        tickets: 2
      }));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // SVG Map Loader
  useEffect(() => {
    let isMounted = true;
    async function loadMap() {
      if (!mapContainerRef.current) return;
      try {
        const res = await fetch('https://cdn.jsdelivr.net/npm/@svg-maps/india@2.0.0/india.svg');
        const svgText = await res.text();
        if (!isMounted) return;
        mapContainerRef.current.innerHTML = svgText;
        setMapLoaded(true);

        const svg = mapContainerRef.current.querySelector('svg');
        if (!svg) return;

        svg.removeAttribute('width');
        svg.removeAttribute('height');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

        const paths = svg.querySelectorAll('path');
        paths.forEach((path) => {
          const id = path.getAttribute('id');
          const data = franchiseData[id];
          const status = data ? data.status : 'soon';
          const colors = statusColors[status] || statusColors.soon;

          path.style.fill = colors.fill;
          path.style.stroke = 'rgba(255,255,255,0.7)';
          path.style.strokeWidth = '0.9';
          path.style.cursor = 'pointer';
          path.style.transition = 'all 0.25s ease';

          const name = stateNames[id] || path.getAttribute('aria-label') || id;

          path.addEventListener('mouseenter', (e) => {
            path.style.fill = colors.hover;
            path.style.stroke = colors.stroke;
            path.style.strokeWidth = '1.6';
            path.style.filter = 'drop-shadow(0 0 8px rgba(5,150,105,0.35))';

            const rect = mapContainerRef.current.getBoundingClientRect();
            setMapTooltip({
              visible: true,
              text: name,
              sub: data ? `${data.slots} open · ${data.galleries} live` : 'Coming soon',
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            });
          });

          path.addEventListener('mousemove', (e) => {
            if (!mapContainerRef.current) return;
            const rect = mapContainerRef.current.getBoundingClientRect();
            setMapTooltip((prev) => ({
              ...prev,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top
            }));
          });

          path.addEventListener('mouseleave', () => {
            path.style.fill = colors.fill;
            path.style.stroke = 'rgba(255,255,255,0.7)';
            path.style.strokeWidth = '0.9';
            path.style.filter = 'none';
            setMapTooltip((prev) => ({ ...prev, visible: false }));
          });

          path.addEventListener('click', () => {
            setSelectedMapState(id);
          });
        });
      } catch (err) {
        if (isMounted) {
          setMapError('Unable to load interactive map.');
          console.error(err);
        }
      }
    }
    loadMap();
    return () => { isMounted = false; };
  }, []);

  // ROI Calculations
  const daily = cust * bill;
  const monthly = daily * 30;
  const commission = monthly * (comm / 100);
  const yearly = commission * 12;
  const breakeven = commission > 0 ? Math.ceil(inv / commission) : '-';

  const formatINR = (n) => {
    if (typeof n !== 'number' || isNaN(n)) return n;
    if (n >= 100000) return '₹' + (n / 100000).toFixed(2) + ' L';
    return '₹' + Math.round(n).toLocaleString('en-IN');
  };

  // Handlers
  const openLeadModal = (type = 'franchise') => {
    setLeadType(type);
    setLeadFormView(true);
    setLeadError('');
    setLeadForm((prev) => ({
      ...prev,
      interest: type === 'demo' ? 'demo' : type === 'ai' ? 'callback' : 'franchise'
    }));
    setLeadModalOpen(true);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!leadForm.first || !leadForm.phone || !leadForm.city) {
      setLeadError('Please fill First Name, Mobile and City.');
      return;
    }
    if (leadForm.phone.replace(/\D/g, '').length < 10) {
      setLeadError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLeadError('');
    setLeadFormView(false);
  };

  const runTravelAI = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      setAiResults([
        { title: 'Dubai Luxury 6N/7D', price: 185000, tier: '💎 Luxury Tier' },
        { title: 'ePay Dubai Premium 5N/6D', price: 149999, tier: '⭐ Recommended' },
        { title: 'Dubai Best Value 4N/5D', price: 99999, tier: '🏷️ Best Value' }
      ]);
      setAiLoading(false);
    }, 600);
  };

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    if (!quoteForm.name || !quoteForm.mobile) {
      alert('Please enter name and mobile number.');
      return;
    }
    alert(`Quote request submitted successfully!\nRef: TVQ-${Date.now().toString().slice(-6)}\nA Travel Expert will contact you shortly.`);
  };

  const handleExpertSubmit = (e) => {
    e.preventDefault();
    if (!expertForm.name || !expertForm.mobile) {
      alert('Please enter name and mobile number.');
      return;
    }
    alert(`Travel Expert request sent! We will reach you via ${expertForm.contact}.`);
  };

  // Services Directory
  const serviceCategories = [
    { id: 'all', label: 'All Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'utility', label: 'Utilities & Banking', icon: <Zap className="w-4 h-4" /> },
    { id: 'travel', label: 'Travel & Tourism', icon: <Plane className="w-4 h-4" /> },
    { id: 'commerce', label: 'Digital Commerce', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'gov', label: 'Govt & Tax Services', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'growth', label: 'Business & CRM', icon: <TrendingUp className="w-4 h-4" /> }
  ];

  const serviceList = [
    { name: 'Aadhaar / e-KYC Verification', cat: 'gov', desc: 'Real-time demographic and biometric verification services' },
    { name: 'PAN Card New & Correction', cat: 'gov', desc: 'Instant e-PAN generation and physical card application' },
    { name: 'GST Filing & Registration', cat: 'gov', desc: 'Complete business tax registration and monthly return filing' },
    { name: 'Electricity & Water Bill Pay', cat: 'utility', desc: 'BBPS integrated bill payments with instant cashback' },
    { name: 'Mobile & DTH Recharge', cat: 'utility', desc: 'All national telecom operators with high margin commission' },
    { name: 'AEPS & Micro-ATM Cashout', cat: 'utility', desc: 'Aadhaar enabled payment system for cash withdrawal & balance enquiry' },
    { name: 'Health & Vehicle Insurance', cat: 'utility', desc: 'Instant policy issuance for bike, car, commercial & term life' },
    { name: 'Flight, Train & Bus Bookings', cat: 'travel', desc: 'Zero cancellation convenience fees on national & global routes' },
    { name: 'Luxury Holiday Tour Packages', cat: 'travel', desc: 'Curated 5★ domestic & international custom vacation packages' },
    { name: 'VIP Fast-Track Visa Services', cat: 'travel', desc: 'Express tourist and business visa processing for 60+ countries' },
    { name: 'E-Commerce Marketplace Hub', cat: 'commerce', desc: 'Sell or buy lifestyle, electronics and daily consumer goods' },
    { name: 'Brand Gift Vouchers & Cards', cat: 'commerce', desc: 'Amazon, Flipkart, Myntra & 250+ instant digital gift cards' },
    { name: 'Petro Card & Fleet Fueling', cat: 'commerce', desc: 'Digital fuel discount cards with monthly loyalty rewards' },
    { name: 'Commercial Property Discovery', cat: 'growth', desc: 'Buy, sell or lease retail galleries, offices and prime commercial spaces' },
    { name: 'Business Loans & Credit Lines', cat: 'growth', desc: 'Paperless digital loan approvals from leading partner banks' },
    { name: 'AI-Powered Business CRM', cat: 'growth', desc: 'Automated lead tracking, customer follow-up and ledger management' }
  ];

  const filteredServices = serviceList.filter(s => {
    const matchCategory = selectedCategoryTab === 'all' || s.cat === selectedCategoryTab;
    const matchSearch = !serviceSearch || s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || s.desc.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCategory && matchSearch;
  });

  const selectedStateData = franchiseData[selectedMapState] || { status: 'soon', galleries: 0, slots: 5, revenue: '—', partners: 0, cities: [] };
  const selectedStateName = stateNames[selectedMapState] || selectedMapState;
  const stateColorObj = statusColors[selectedStateData.status] || statusColors.soon;

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navScrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/images/logo.png" alt="ePay Logo" className="h-10 w-auto object-contain" />
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">ePay <span className="text-emerald-600">Digital</span></span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">India's Business Network</span>
            </div>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden lg:flex items-center gap-5 text-[11px] font-extrabold text-slate-600">
            {navCategories.map((cat, idx) => (
              <div
                key={idx}
                className="relative"
                onMouseEnter={() => setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-0.5 hover:text-emerald-600 transition-colors uppercase tracking-wider py-3">
                  <span>{cat.title}</span>
                  <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${activeDropdown === idx ? 'rotate-180' : ''}`} />
                </button>

                {activeDropdown === idx && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-64 bg-white/95 backdrop-blur-lg border border-emerald-100/90 rounded-2xl p-2.5 shadow-2xl animate-fadeIn space-y-1 z-50">
                    <div style={{ padding: '4px 8px', borderBottom: '1px solid #ecfdf5', marginBottom: 4 }}>
                      <span style={{ fontSize: 9, color: '#047857', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {cat.title} Services
                      </span>
                    </div>
                    {cat.items.map((sub, sidx) => {
                      const isObj = typeof sub === 'object' && sub !== null;
                      const label = isObj ? sub.label : sub;
                      const path = isObj ? sub.path : null;

                      if (path) {
                        return (
                          <Link
                            key={sidx}
                            href={path}
                            onClick={() => setActiveDropdown(null)}
                            className="block px-3 py-1.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all font-semibold text-[11.5px]"
                          >
                            {label}
                          </Link>
                        );
                      }

                      return (
                        <a
                          key={sidx}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            openLeadModal('demo');
                          }}
                          className="block px-3 py-1.5 rounded-xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/70 transition-all font-semibold text-[11.5px]"
                        >
                          {label}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => openLeadModal('franchise')} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Become Partner
            </button>
            <Link href="/login" className="px-4 py-2.5 rounded-full border border-slate-300 hover:border-emerald-500 text-slate-700 hover:text-emerald-700 bg-white/80 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Unified Login
            </Link>
            <button className="lg:hidden p-2 text-slate-700" onClick={() => setMobileNavActive(!mobileNavActive)}>
              <ChevronDown className={`w-5 h-5 transition-transform ${mobileNavActive ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {mobileNavActive && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto shadow-2xl animate-fadeIn">
            {navCategories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[10px] font-black text-emerald-800 uppercase tracking-widest border-b border-emerald-50 pb-1">
                  {cat.title}
                </div>
                <div className="pl-2 space-y-1">
                  {cat.items.map((sub, sidx) => {
                    const isObj = typeof sub === 'object' && sub !== null;
                    const label = isObj ? sub.label : sub;
                    const path = isObj ? sub.path : null;

                    if (path) {
                      return (
                        <Link
                          key={sidx}
                          href={path}
                          onClick={() => setMobileNavActive(false)}
                          className="block py-1.5 text-xs text-slate-600 hover:text-emerald-600 transition-colors font-semibold"
                        >
                          {label}
                        </Link>
                      );
                    }

                    return (
                      <a
                        key={sidx}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setMobileNavActive(false);
                          openLeadModal('demo');
                        }}
                        className="block py-1.5 text-xs text-slate-600 hover:text-emerald-600 transition-colors font-semibold"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="pt-36 pb-20 bg-gradient-to-b from-emerald-50/60 via-slate-50 to-white relative overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 -left-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-teal-300/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-xs font-extrabold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Empowering Entrepreneurs Across India · 1,200+ Live Galleries
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Launch Your Own <span className="bg-gradient-to-r from-emerald-600 via-green-500 to-teal-700 bg-clip-text text-transparent">Digital Business</span> with ePay Gallery
            </h1>

            <p className="text-base md:text-lg text-slate-600 max-w-2xl leading-relaxed">
              Join India's fastest-growing multi-service franchise network. Deliver bill payments, insurance, AEPS banking, e-commerce, international travel & 150+ daily services from one AI-powered CRM platform.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button onClick={() => openLeadModal('franchise')} className="px-7 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Become a Gallery Partner
              </button>
              <a href="#roi" className="px-6 py-3.5 rounded-full bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-600" />
                Calculate ROI
              </a>
              <button onClick={() => openLeadModal('demo')} className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-all flex items-center gap-2">
                <Play className="w-4 h-4 text-slate-600" />
                Book Consultation
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
              {[
                'PAN India Expansion',
                '150+ Digital Services',
                'AI Powered CRM',
                'Zero Tech Experience Required',
                'Complete Training & Kit'
              ].map((feature, idx) => (
                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-emerald-200 text-xs font-bold text-slate-700 shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* LIVE TELEMETRY DASHBOARD PREVIEW */}
          <div className="lg:col-span-5">
            <div className="bg-white/95 backdrop-blur-xl border border-emerald-200/80 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="font-extrabold text-slate-900 text-sm">Live Gallery Terminal</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Telemetry Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Today's Revenue</div>
                  <div className="text-xl font-black text-emerald-700">₹{metrics.revenue.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Live Transactions</div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Transactions</div>
                  <div className="text-xl font-black text-slate-900">{metrics.tx.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Across Counter</div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">Commission Earned</div>
                  <div className="text-xl font-black text-emerald-600">₹{metrics.comm.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Instant Credit</div>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">New Members</div>
                  <div className="text-xl font-black text-slate-900">{metrics.members}</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Today Joined</div>
                </div>
              </div>

              <div className="space-y-2 text-xs font-semibold text-slate-700 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Utility Bill Payments · BBPS · Fastag · AEPS Cashout</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> ePay Travel · Holiday Packages · Visa Processing</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> Insurance Policies · Instant Digital Account Openings</div>
                <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-600" /> AI Business CRM · Automated Customer Retargeting</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          <div><p className="text-3xl font-black text-emerald-600">1,200+</p><p className="text-xs text-slate-500 font-bold mt-1">Live Galleries</p></div>
          <div><p className="text-3xl font-black text-emerald-600">₹18 Cr+</p><p className="text-xs text-slate-500 font-bold mt-1">Monthly GMV</p></div>
          <div><p className="text-3xl font-black text-emerald-600">28</p><p className="text-xs text-slate-500 font-bold mt-1">States Covered</p></div>
          <div><p className="text-3xl font-black text-emerald-600">150+</p><p className="text-xs text-slate-500 font-bold mt-1">Digital Services</p></div>
          <div><p className="text-3xl font-black text-emerald-600">99.4%</p><p className="text-xs text-slate-500 font-bold mt-1">Customer Uptime</p></div>
          <div><p className="text-3xl font-black text-emerald-600">AI CRM</p><p className="text-xs text-slate-500 font-bold mt-1">Automated Operations</p></div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              About ePay Digital
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              India's Next-Generation Multi-Service Business Ecosystem
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              ePay Digital Gallery is an initiative by <strong className="text-emerald-700 font-bold">ePay Digital India Pvt. Ltd.</strong> designed to bring modern digital services, commerce, travel, and financial solutions to every neighbourhood across tier 1, 2, and 3 cities.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed">
              Rather than running an isolated single-service shop, ePay Gallery franchise owners get access to 150+ high-demand revenue streams under one trusted national brand with full backend compliance, bank tie-ups, and automated commission reconciliations.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Full Training Support</h4>
                <p className="text-xs text-slate-600">Dedicated operational training, CRM tutorials, and marketing display kit provided.</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">Territory Protection</h4>
                <p className="text-xs text-slate-600">Guaranteed exclusive pin-code coverage for authorized gallery partners.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Cloud className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Enterprise Cloud Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bank-grade 256-bit SSL encrypted infrastructure capable of processing millions of concurrent transactions with 99.9% uptime and zero ledger errors.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4 hover:border-emerald-300 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">AI Customer Retention Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Automatically alerts gallery staff when customer insurance, bills, or recharge renewals are due, generating repeat footfall and recurring commissions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 150+ SERVICES EXPLORER */}
      <section id="ecosystem" className="py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              Multi-Service Catalog
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              150+ Digital Services Under One Roof
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Provide everything your community needs on a daily basis from one easy-to-use digital dashboard.
            </p>

            {/* SEARCH BOX */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search services (e.g. Aadhaar, Flight, Bill, GST)..."
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-full border border-slate-200 text-xs outline-none focus:border-emerald-500 bg-white shadow-sm"
              />
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2 justify-center">
            {serviceCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${selectedCategoryTab === cat.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'}`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          {/* SERVICE CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredServices.map((srv, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs mb-3">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">{srv.name}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{srv.desc}</p>
                </div>
                <button onClick={() => openLeadModal('franchise')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 pt-2">
                  Offer this service <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NETWORK MAP LOCATOR */}
      <section id="map" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              Pan-India Presence
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Interactive Gallery Network & Territory Openings
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Select any state on the map to explore active gallery hubs, open franchise positions, and monthly volume.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 relative min-h-[420px]">
              <div ref={mapContainerRef} className="w-full h-full relative" />
              {mapTooltip.visible && (
                <div
                  className="map-tooltip"
                  style={{ left: `${mapTooltip.x}px`, top: `${mapTooltip.y}px` }}
                >
                  {mapTooltip.text}<br />
                  <small className="text-[10px] text-slate-500">{mapTooltip.sub}</small>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <div className="font-black text-2xl text-slate-900">{selectedStateName}</div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${stateColorObj.cls}`}>
                  {stateColorObj.label}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-center">
                  <p className="text-2xl font-black text-emerald-700">{selectedStateData.galleries}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Live Galleries</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-slate-900">{selectedStateData.slots}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Available Slots</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-emerald-600">₹{selectedStateData.revenue}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Monthly GMV</p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-center">
                  <p className="text-2xl font-black text-slate-900">{selectedStateData.partners}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Active Partners</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Major Cities Covered in {selectedStateName}:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedStateData.cities.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <button onClick={() => openLeadModal('franchise')} className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2">
                <Store className="w-4 h-4" />
                Apply for Franchise in {selectedStateName}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section id="roi" className="py-24 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" />
              Earnings Potential
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Interactive Franchise ROI Calculator
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Adjust footfall, bill values and investment to calculate your estimated monthly net commission and break-even period.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Initial Gallery Setup Investment</span>
                  <span className="text-emerald-600 font-extrabold">{formatINR(inv)}</span>
                </div>
                <input type="range" min="50000" max="300000" step="5000" value={inv} onChange={(e) => setInv(+e.target.value)} className="w-full accent-emerald-600 h-2 bg-emerald-100 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Daily Customer Footfall</span>
                  <span className="text-emerald-600 font-extrabold">{cust} customers / day</span>
                </div>
                <input type="range" min="10" max="120" step="5" value={cust} onChange={(e) => setCust(+e.target.value)} className="w-full accent-emerald-600 h-2 bg-emerald-100 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Average Transaction / Bill Value</span>
                  <span className="text-emerald-600 font-extrabold">₹{bill}</span>
                </div>
                <input type="range" min="150" max="1200" step="10" value={bill} onChange={(e) => setBill(+e.target.value)} className="w-full accent-emerald-600 h-2 bg-emerald-100 rounded-lg cursor-pointer" />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Blended Service Commission Rate</span>
                  <span className="text-emerald-600 font-extrabold">{comm}%</span>
                </div>
                <input type="range" min="1.5" max="5" step="0.1" value={comm} onChange={(e) => setComm(+e.target.value)} className="w-full accent-emerald-600 h-2 bg-emerald-100 rounded-lg cursor-pointer" />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl text-[11px] text-slate-500 leading-relaxed border border-slate-100">
                <span className="font-bold text-slate-700">Note:</span> Figures are indicative simulations. High-value services like international holiday bookings, flight tickets, and loans offer significantly larger single-transaction commissions.
              </div>
            </div>

            <div className="lg:col-span-5 bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 rounded-2xl p-8 text-white space-y-5 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-black text-xl text-emerald-300 mb-6 border-b border-emerald-700/60 pb-3 flex items-center justify-between">
                  <span>Financial Projection</span>
                  <span className="text-xs bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200">Monthly Run-Rate</span>
                </h3>
                <div className="space-y-4 text-xs">
                  <div className="flex justify-between py-1 border-b border-emerald-800/50"><span className="text-emerald-200">Daily Transaction Volume</span><strong className="text-white font-bold">{formatINR(daily)}</strong></div>
                  <div className="flex justify-between py-1 border-b border-emerald-800/50"><span className="text-emerald-200">Monthly Gross Volume (GMV)</span><strong className="text-white font-bold">{formatINR(monthly)}</strong></div>
                  <div className="flex justify-between py-1 border-b border-emerald-800/50"><span className="text-emerald-200">Your Monthly Commission</span><strong className="text-emerald-400 font-extrabold text-lg">{formatINR(commission)}</strong></div>
                  <div className="flex justify-between py-1 border-b border-emerald-800/50"><span className="text-emerald-200">Estimated Annual Earnings</span><strong className="text-white font-bold">{formatINR(yearly)}</strong></div>
                  <div className="flex justify-between py-1"><span className="text-emerald-200">Estimated Break-Even</span><strong className="text-amber-300 font-bold">{breakeven} Months</strong></div>
                </div>
              </div>

              <button onClick={() => openLeadModal('franchise')} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all">
                Lock In Your Gallery Location
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EPAY TRAVEL VERTICAL */}
      <section id="travel" className="py-24 bg-gradient-to-b from-sky-50 to-emerald-50/50 border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider">
              <Plane className="w-3.5 h-3.5" />
              ePay Travel & Tour Packages
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Domestic & International Holiday Packages
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              Book curated luxury holidays directly online or through your nearest ePay Digital Gallery travel desk.
            </p>
          </div>

          {/* TRAVEL TABS */}
          <div className="flex flex-wrap gap-2 justify-center">
            {['packages', 'destinations', 'ai', 'quote', 'expert'].map((t) => (
              <button
                key={t}
                onClick={() => setTravelTab(t)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${travelTab === t ? 'bg-sky-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300'}`}
              >
                {t === 'ai' ? '🤖 AI Travel Advisor' : t === 'packages' ? 'Trending Packages' : t === 'destinations' ? 'Popular Destinations' : t === 'quote' ? 'Get Custom Quote' : 'Talk to Expert'}
              </button>
            ))}
          </div>

          {/* PACKAGES TAB */}
          {travelTab === 'packages' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {travelPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-sky-400 transition-all flex flex-col justify-between">
                  <div className="h-44 bg-cover bg-center relative" style={{ backgroundImage: `url(${pkg.img})` }}>
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow">
                      {pkg.badge}
                    </span>
                  </div>
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-sm">{pkg.title}</h3>
                    <div className="text-xs text-slate-500 font-semibold">{pkg.dest} · {pkg.nights} Nights · ★ {pkg.rating}</div>
                    <div className="flex flex-wrap gap-1">
                      {pkg.tags.map((tg, i) => (
                        <span key={i} className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-semibold">{tg}</span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t">
                      <strong className="text-base text-slate-900 font-black">₹{pkg.price.toLocaleString('en-IN')}</strong>
                      <button onClick={() => setTravelTab('quote')} className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DESTINATIONS TAB */}
          {travelTab === 'destinations' && (
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="font-black text-slate-900 text-lg">Top Domestic Destinations</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {travelDestinations.domestic.map((d, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-cover bg-center p-3.5 text-white flex flex-col justify-end relative overflow-hidden group shadow-md" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), transparent), url(${d.img})` }}>
                      <div className="font-extrabold text-xs">{d.flag} {d.name}</div>
                      <div className="text-[10px] opacity-90 font-semibold">From ₹{d.from.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <h3 className="font-black text-slate-900 text-lg">Popular International Tours</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {travelDestinations.international.map((d, i) => (
                    <div key={i} className="h-32 rounded-2xl bg-cover bg-center p-3.5 text-white flex flex-col justify-end relative overflow-hidden group shadow-md" style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.75), transparent), url(${d.img})` }}>
                      <div className="font-extrabold text-xs">{d.flag} {d.name}</div>
                      <div className="text-[10px] opacity-90 font-semibold">From ₹{d.from.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* AI ADVISOR TAB */}
          {travelTab === 'ai' && (
            <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-5 max-w-3xl mx-auto shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base">ePay AI Travel Planner</h3>
                  <p className="text-xs text-slate-400">Describe your vacation intent and our AI will recommend exact inventory with transparent pricing.</p>
                </div>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder='e.g. "Couple honeymoon in Bali, 6 nights in November with private pool villa under 1.2 lakh"'
                className="w-full p-4 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white outline-none focus:border-sky-400"
                rows={3}
              />
              <button onClick={runTravelAI} className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg">
                {aiLoading ? 'Matching with live inventory...' : 'Generate Itinerary Recommendations'}
              </button>

              {aiResults && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3">
                  {aiResults.map((r, i) => (
                    <div key={i} className="p-4 bg-white/10 rounded-2xl border border-white/10 space-y-2">
                      <div className="text-[10px] text-sky-400 font-bold">{r.tier}</div>
                      <div className="font-bold text-xs">{r.title}</div>
                      <div className="text-base font-black text-amber-400">₹{r.price.toLocaleString('en-IN')}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUOTE FORM TAB */}
          {travelTab === 'quote' && (
            <form onSubmit={handleQuoteSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto shadow-lg">
              <div><label className="text-xs font-bold text-slate-700">Full Name *</label><input required className="w-full p-3 border rounded-xl text-xs mt-1" value={quoteForm.name} onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-700">Mobile Number *</label><input required className="w-full p-3 border rounded-xl text-xs mt-1" value={quoteForm.mobile} onChange={(e) => setQuoteForm({ ...quoteForm, mobile: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-700">Email Address</label><input type="email" className="w-full p-3 border rounded-xl text-xs mt-1" value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-700">Destination</label><input className="w-full p-3 border rounded-xl text-xs mt-1" value={quoteForm.dest} onChange={(e) => setQuoteForm({ ...quoteForm, dest: e.target.value })} /></div>
              <div className="md:col-span-2"><button type="submit" className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md">Request Custom Tour Proposal</button></div>
            </form>
          )}

          {/* EXPERT TAB */}
          {travelTab === 'expert' && (
            <form onSubmit={handleExpertSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 space-y-4 max-w-md mx-auto shadow-lg">
              <h3 className="font-black text-slate-900 text-base">Speak with a Certified Travel Specialist</h3>
              <div><label className="text-xs font-bold text-slate-700">Your Name *</label><input required className="w-full p-3 border rounded-xl text-xs mt-1" value={expertForm.name} onChange={(e) => setExpertForm({ ...expertForm, name: e.target.value })} /></div>
              <div><label className="text-xs font-bold text-slate-700">Mobile Number *</label><input required className="w-full p-3 border rounded-xl text-xs mt-1" value={expertForm.mobile} onChange={(e) => setExpertForm({ ...expertForm, mobile: e.target.value })} /></div>
              <button type="submit" className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md">Request Priority Callback</button>
            </form>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              The ePay Advantage
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Why Over 1,200+ Partners Chose ePay Digital
            </h2>
            <p className="text-xs md:text-sm text-slate-600">
              A proven franchise model combining software, banking, multi-channel commerce, and local brand authority.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Layers className="w-5 h-5 text-emerald-600" />, title: 'Integrated 150+ Services', desc: 'Eliminates the hassle of dealing with dozens of separate vendors. Utilities, insurance, banking, and travel in one wallet.' },
              { icon: <Cpu className="w-5 h-5 text-emerald-600" />, title: 'Smart AI Automation', desc: 'Automated CRM, commission reconciliation, and instant customer notifications keep your operational overheads near zero.' },
              { icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />, title: 'Recognized National Brand', desc: 'Operate with high credibility and customer trust under ePay Digital India Private Limited.' },
              { icon: <Globe className="w-5 h-5 text-emerald-600" />, title: 'Guaranteed Pin-Code Exclusivity', desc: 'Secure protected local radius so you grow without internal competition from other gallery partners.' },
              { icon: <Laptop className="w-5 h-5 text-emerald-600" />, title: 'Mobile & Cloud-Ready', desc: 'Run your business from desktop or Android POS terminals with real-time receipt printing and ledger sync.' },
              { icon: <PhoneCall className="w-5 h-5 text-emerald-600" />, title: 'Dedicated Partner Support Desk', desc: 'Direct relationship manager support, prompt dispute resolution, and continuous marketing kits provided.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50/70 p-8 rounded-3xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center font-bold">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Clear Answers to Common Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'What is the minimum investment to start an ePay Digital Gallery?', a: 'Initial franchise setup packages start from ₹50,000 to ₹1,00,000 depending on your location, hardware terminal selection, and territory tier.' },
              { q: 'Do I need prior technical or software experience?', a: 'No prior technical background is needed. Our team conducts full operational training on our easy-to-use software and provides step-by-step guides.' },
              { q: 'How quickly can my gallery go live and start generating income?', a: 'Once KYC documents and verification are completed, your gallery terminal and software access are activated within 5 to 7 business days.' },
              { q: 'Is territory protection and pin-code exclusivity guaranteed?', a: 'Yes. Authorized ePay Gallery partners receive defined territory boundaries to prevent overlap and ensure healthy local margins.' },
              { q: 'How are commissions calculated and paid?', a: 'Commissions on utility bills, insurance, recharges, travel, and banking are credited instantly into your secure master wallet.' },
              { q: 'Can I add ePay Gallery services to my existing retail store or travel agency?', a: 'Yes! Many existing grocery stores, cyber cafes, travel agencies, and digital service points integrate ePay Gallery into their existing premises.' }
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-5 font-extrabold text-sm text-slate-900 flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-emerald-600 font-black text-lg">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section id="contact" className="py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 space-y-6 relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Limited Pin-Code Openings
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            Build Your Profitable Digital Business Today
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join more than 1,200+ successful gallery partners across India. Get your territory assigned and launch with complete training.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button onClick={() => openLeadModal('franchise')} className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-xl transition-all flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Apply for Gallery Franchise
            </button>
            <a href="#roi" className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-all flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              Recalculate Earnings
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">eP</div>
              <span className="font-black text-xl text-white">ePay <span className="text-emerald-500">Digital Gallery</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering local entrepreneurs across India with a complete multi-service digital business platform and AI-powered CRM.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              CIN: U72900PN2024PTC229812<br />
              GSTIN: 27AABCE1234F1Z8
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">About ePay Network</a></li>
              <li><a href="#ecosystem" className="hover:text-emerald-400 transition-colors">150+ Digital Services</a></li>
              <li><a href="#map" className="hover:text-emerald-400 transition-colors">Franchise Territory Map</a></li>
              <li><a href="#roi" className="hover:text-emerald-400 transition-colors">ROI Calculator</a></li>
              <li><a href="#travel" className="hover:text-emerald-400 transition-colors">ePay Travel Vertical</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">Partner FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Popular Verticals</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#ecosystem" className="hover:text-emerald-400 transition-colors">Utility & Bill Payments</a></li>
              <li><a href="#ecosystem" className="hover:text-emerald-400 transition-colors">AEPS & Banking Services</a></li>
              <li><a href="#ecosystem" className="hover:text-emerald-400 transition-colors">Insurance Policy Issuance</a></li>
              <li><a href="#travel" className="hover:text-emerald-400 transition-colors">International Tour Packages</a></li>
              <li><a href="#ecosystem" className="hover:text-emerald-400 transition-colors">GST & PAN Registration</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Corporate Headquarters</h4>
            <p className="text-xs text-slate-500 leading-relaxed space-y-2">
              <strong className="text-white block">ePay Digital India Private Limited</strong>
              Office No. 516, 5th Floor, The Pavillion Mall,<br />
              Senapati Bapat Road, Pune - 411016<br />
              Helpline: Mon - Sat | 9:00 AM - 6:00 PM<br />
              Email: support@epaygallery.com
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-900 flex flex-wrap justify-between items-center text-xs text-slate-600 gap-4">
          <div className="flex items-center gap-4">
            <Link href="/login" className="px-3 py-1 rounded bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-bold hover:bg-emerald-900 transition-colors">
              Staff Portal Access
            </Link>
            <span>© 2026 ePay Digital India Pvt. Ltd. All rights reserved.</span>
          </div>
          <span>Designed for Indian Entrepreneurs · Built with Security & Speed</span>
        </div>
      </footer>

      {/* STICKY BOTTOM CTA */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-emerald-200 py-3 px-6 shadow-2xl transition-transform duration-300 ${stickyCtaShow ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Launch an authorized ePay Digital Gallery in your town · <strong className="text-emerald-600">Setup starting ₹50K+</strong></span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openLeadModal('franchise')} className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all">
              Book Free Consultation
            </button>
            <a href="#roi" className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all">
              Calculate ROI
            </a>
          </div>
        </div>
      </div>

      {/* LEAD CAPTURE MODAL */}
      {leadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setLeadModalOpen(false)}>
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button onClick={() => setLeadModalOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 text-xl font-bold">×</button>

            {leadFormView ? (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <div>
                  <div className="font-black text-xl text-slate-900">
                    {leadType === 'demo' ? 'Schedule a Product Demo' : 'Join as Gallery Partner'}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Provide your details to receive immediate consultation and business deck.</p>
                </div>

                {leadError && <p className="text-xs text-red-600 font-bold bg-red-50 p-2 rounded-lg">{leadError}</p>}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh"
                      value={leadForm.first}
                      onChange={(e) => setLeadForm({ ...leadForm, first: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs mt-1 outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-500">Last Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Patil"
                      value={leadForm.last}
                      onChange={(e) => setLeadForm({ ...leadForm, last: e.target.value })}
                      className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs mt-1 outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs mt-1 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">City / Town *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Nagpur, Nashik"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs mt-1 outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500">Interested In</label>
                  <select
                    value={leadForm.interest}
                    onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs mt-1 outline-none focus:border-emerald-500"
                  >
                    <option value="franchise">New Gallery Franchise Setup</option>
                    <option value="demo">Software & Terminal Demo</option>
                    <option value="travel">Travel Desk Integration</option>
                    <option value="callback">General Consultation Callback</option>
                  </select>
                </div>

                <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all">
                  Submit & Get Callback
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 font-black flex items-center justify-center mx-auto text-2xl">
                  ✓
                </div>
                <h3 className="font-extrabold text-slate-900 text-xl">Thank You for Your Interest!</h3>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Our regional franchise advisor for {leadForm.city || 'your area'} will reach out to you on <strong>{leadForm.phone}</strong> shortly.
                </p>
                <button onClick={() => setLeadModalOpen(false)} className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl">
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
