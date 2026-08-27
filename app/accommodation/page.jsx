'use client';

import React, { useState, useEffect, useRef } from 'react';
import './Accommodation.css';

// ---------- Data ----------
const indiaProperties = [
  { id: 1, type: 'hostel', city: 'Mumbai', name: 'Mumbai Central Hostel', location: 'Andheri, Mumbai', price: '₹4,200/mo', priceNum: 4200, beds: '6-bed dorm', rating: 4.5, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', status: 'available', verified: true },
  { id: 2, type: 'pg', city: 'Delhi', name: 'PG Near South Campus', location: 'Hauz Khas, Delhi', price: '₹8,500/mo', priceNum: 8500, beds: 'Single room', rating: 4.2, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
  { id: 3, type: 'rental', city: 'Bangalore', name: '2BHK Apartment - Indiranagar', location: 'Indiranagar, Bangalore', price: '₹18,000/mo', priceNum: 18000, beds: '2 BHK', rating: 4.7, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'limited', verified: true },
  { id: 4, type: 'student', city: 'Pune', name: 'Student Housing - FC Road', location: 'FC Road, Pune', price: '₹6,500/mo', priceNum: 6500, beds: 'Shared room', rating: 4.0, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
  { id: 5, type: 'employee', city: 'Hyderabad', name: 'Employee Housing - HITEC City', location: 'HITEC City, Hyderabad', price: '₹12,000/mo', priceNum: 12000, beds: '1 BHK', rating: 4.4, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'available', verified: true },
  { id: 6, type: 'shared', city: 'Chennai', name: 'Shared Apartment - Mylapore', location: 'Mylapore, Chennai', price: '₹5,500/mo', priceNum: 5500, beds: 'Shared room', rating: 3.9, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', status: 'limited', verified: false },
  { id: 7, type: 'hostel', city: 'Delhi', name: 'Delhi Backpackers Hostel', location: 'Paharganj, Delhi', price: '₹3,200/mo', priceNum: 3200, beds: '8-bed dorm', rating: 4.1, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', status: 'available', verified: true },
  { id: 8, type: 'pg', city: 'Bangalore', name: 'PG for Women - Koramangala', location: 'Koramangala, Bangalore', price: '₹9,200/mo', priceNum: 9200, beds: 'Single room', rating: 4.6, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
  { id: 9, type: 'rental', city: 'Mumbai', name: 'Studio Apartment - Bandra', location: 'Bandra, Mumbai', price: '₹22,000/mo', priceNum: 22000, beds: 'Studio', rating: 4.8, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'limited', verified: true },
];

const intlProperties = [
  { id: 101, type: 'student-intl', country: 'UAE', name: 'Student Housing - Dubai', location: 'Dubai, UAE', price: '$650/mo', priceNum: 650, beds: 'Shared room', rating: 4.3, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'available', verified: true },
  { id: 102, type: 'employee-intl', country: 'UK', name: 'Corporate Housing - Canary Wharf', location: 'London, UK', price: '$1,200/mo', priceNum: 1200, beds: '1 BHK', rating: 4.7, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
  { id: 103, type: 'shared-intl', country: 'USA', name: 'Shared Housing - Brooklyn', location: 'New York, USA', price: '$750/mo', priceNum: 750, beds: 'Shared room', rating: 4.0, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', status: 'limited', verified: true },
  { id: 104, type: 'hotel', country: 'Canada', name: 'Temporary Hotel - Downtown', location: 'Toronto, Canada', price: '$450/wk', priceNum: 450, beds: 'Single room', rating: 4.2, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'available', verified: true },
  { id: 105, type: 'long-rental', country: 'Australia', name: 'Long-term Rental - CBD', location: 'Sydney, Australia', price: '$1,800/mo', priceNum: 1800, beds: '2 BHK', rating: 4.9, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
  { id: 106, type: 'student-intl', country: 'Singapore', name: 'Student Hostel - City Center', location: 'Singapore', price: '$580/mo', priceNum: 580, beds: 'Shared room', rating: 4.1, image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80', status: 'limited', verified: true },
  { id: 107, type: 'employee-intl', country: 'UAE', name: 'Employee Housing - Marina', location: 'Dubai, UAE', price: '$950/mo', priceNum: 950, beds: '1 BHK', rating: 4.6, image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80', status: 'available', verified: true },
  { id: 108, type: 'shared-intl', country: 'UK', name: 'Shared Flat - Shoreditch', location: 'London, UK', price: '$680/mo', priceNum: 680, beds: 'Shared room', rating: 4.3, image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80', status: 'available', verified: true },
];

// ---------- Sub-component: Property Card ----------
const PropertyCard = ({ property, onBook }) => {
  const typeLabels = {
    'hostel': 'Hostel', 'pg': 'PG', 'rental': 'Rental', 'shared': 'Shared',
    'student': 'Student Housing', 'employee': 'Employee Housing',
    'student-intl': 'Student Accommodation', 'employee-intl': 'Employee Housing',
    'shared-intl': 'Shared Housing', 'hotel': 'Temporary Hotel',
    'long-rental': 'Long-term Rental'
  };
  const statusClass = property.status === 'available' ? 'available' : 'limited';
  const statusLabel = property.status === 'available' ? 'Available' : 'Limited';
  const verifiedBadge = property.verified ? (
    <span className="badge-top verified">✓ Verified</span>
  ) : (
    <span className="badge-top">Verified</span>
  );

  return (
    <div className="property-card" onClick={() => onBook(property)}>
      <div className="img" style={{ backgroundImage: `url(${property.image})` }}>
        {verifiedBadge}
      </div>
      <div className="body">
        <div className="title">{property.name}</div>
        <div className="location"><i>📍</i> {property.location}</div>
        <div className="meta-grid">
          <div className="item"><i>🛏️</i> {property.beds}</div>
          <div className="item"><i>🏷️</i> {typeLabels[property.type] || property.type}</div>
          <div className="item"><i>⭐</i> {property.rating}</div>
          <div className="item"><i>✅</i> {property.verified ? 'Verified' : 'Unverified'}</div>
        </div>
        <div className="price-row">
          <div className="price">{property.price} <span>/month</span></div>
          <div className={`status ${statusClass}`}>{statusLabel}</div>
        </div>
      </div>
    </div>
  );
};

// ---------- Main Component ----------
const Accommodation = () => {
  // --- State for filters ---
  const [indiaFilter, setIndiaFilter] = useState({ type: 'all', city: 'all', budget: 'all' });
  const [intlFilter, setIntlFilter] = useState({ type: 'all', country: 'all', budget: 'all' });

  // --- State for filtered properties ---
  const [filteredIndia, setFilteredIndia] = useState(indiaProperties);
  const [filteredIntl, setFilteredIntl] = useState(intlProperties);

  // --- Modal states ---
  const [modalSearchOpen, setModalSearchOpen] = useState(false);
  const [modalBookOpen, setModalBookOpen] = useState(false);
  const [modalLoginOpen, setModalLoginOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // --- Toast messages ---
  const [toasts, setToasts] = useState([]);

  // --- Live metrics (mocked) ---
  const [metrics, setMetrics] = useState({ properties: '2,400+', bookings: '18,400+' });

  // --- Refs for nav and scroll ---
  const navRef = useRef(null);
  const indiaRef = useRef(null);

  // ---------- Filter functions ----------
  const applyIndiaFilter = () => {
    let filtered = [...indiaProperties];
    if (indiaFilter.type !== 'all') filtered = filtered.filter(p => p.type === indiaFilter.type);
    if (indiaFilter.city !== 'all') filtered = filtered.filter(p => p.city === indiaFilter.city);
    if (indiaFilter.budget !== 'all') {
      const [min, max] = indiaFilter.budget.split('-').map(Number);
      if (indiaFilter.budget === '20000+') filtered = filtered.filter(p => p.priceNum >= 20000);
      else filtered = filtered.filter(p => p.priceNum >= min && p.priceNum <= max);
    }
    setFilteredIndia(filtered);
  };

  const applyIntlFilter = () => {
    let filtered = [...intlProperties];
    if (intlFilter.type !== 'all') filtered = filtered.filter(p => p.type === intlFilter.type);
    if (intlFilter.country !== 'all') filtered = filtered.filter(p => p.country === intlFilter.country);
    if (intlFilter.budget !== 'all') {
      const [min, max] = intlFilter.budget.split('-').map(Number);
      if (intlFilter.budget === '2000+') filtered = filtered.filter(p => p.priceNum >= 2000);
      else filtered = filtered.filter(p => p.priceNum >= min && p.priceNum <= max);
    }
    setFilteredIntl(filtered);
  };

  // ---------- Handlers for filter changes ----------
  const handleIndiaFilterChange = (e) => {
    const { name, value } = e.target;
    setIndiaFilter(prev => ({ ...prev, [name]: value }));
  };

  const handleIntlFilterChange = (e) => {
    const { name, value } = e.target;
    setIntlFilter(prev => ({ ...prev, [name]: value }));
  };

  // ---------- Modal handlers ----------
  const openModal = (modalId) => {
    if (modalId === 'search') setModalSearchOpen(true);
    else if (modalId === 'book') setModalBookOpen(true);
    else if (modalId === 'login') setModalLoginOpen(true);
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
  };

  const closeModal = (modalId) => {
    if (modalId === 'search') setModalSearchOpen(false);
    else if (modalId === 'book') setModalBookOpen(false);
    else if (modalId === 'login') setModalLoginOpen(false);
    if (typeof document !== 'undefined') document.body.style.overflow = '';
  };

  const handleOverlayClick = (e, modalId) => {
    if (e.target === e.currentTarget) closeModal(modalId);
  };

  // ---------- Book handler ----------
  const handleBook = (property) => {
    setSelectedProperty(property);
    openModal('book');
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    closeModal('book');
    addToast(`✅ Reserved ${selectedProperty?.name} successfully! We'll send you the confirmation.`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    closeModal('search');
    addToast('🔍 Showing accommodations matching your search...');
    if (indiaRef.current) indiaRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    closeModal('login');
    addToast('🔓 Signed in successfully');
  };

  // ---------- Toast ----------
  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // ---------- Effects ----------
  useEffect(() => {
    applyIndiaFilter();
  }, [indiaFilter]);

  useEffect(() => {
    applyIntlFilter();
  }, [intlFilter]);

  // Live metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        properties: (2380 + Math.floor(Math.random() * 60)) + '+',
        bookings: (18300 + Math.floor(Math.random() * 400)) + '+'
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll effect for nav
  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 40);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close modals on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal('search');
        closeModal('book');
        closeModal('login');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---------- Render helper for property card list ----------
  const renderPropertyGrid = (properties) => {
    return properties.map(p => (
      <PropertyCard key={p.id} property={p} onBook={handleBook} />
    ));
  };

  // ---------- Render ----------
  return (
    <>
      {/* Ambient orbs */}
      <div className="ambient">
        <div className="orb o1"></div>
        <div className="orb o2"></div>
        <div className="orb o3"></div>
      </div>

      {/* NAV */}
      <nav className="nav" ref={navRef}>
        <div className="container nav-inner">
          <a href="#" className="logo">
            <div className="logo-mark">eA</div>
            <span>ePay Accommodation</span>
          </a>
          <ul className="nav-links" id="navLinks">
            <li><a href="#india" onClick={(e) => { e.preventDefault(); document.getElementById('india')?.scrollIntoView({ behavior: 'smooth' }); }}>India</a></li>
            <li><a href="#international" onClick={(e) => { e.preventDefault(); document.getElementById('international')?.scrollIntoView({ behavior: 'smooth' }); }}>International</a></li>
            <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>How It Works</a></li>
            <li><a href="#faq" onClick={(e) => { e.preventDefault(); document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' }); }}>FAQ</a></li>
          </ul>
          <div className="nav-cta">
            <button className="btn btn-ghost" onClick={() => openModal('login')}>Sign In</button>
            <button className="btn btn-primary" onClick={() => openModal('search')}>Find Accommodation</button>
            <button className="mobile-toggle" id="mobileToggle" aria-label="Menu" onClick={() => document.getElementById('navLinks')?.classList.toggle('open')}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <div className="hero-badge"><span className="dot"></span> Stay Before You Arrive</div>
            <h1>Find Your Perfect <span className="gradient">Home Away From Home</span></h1>
            <p className="hero-sub">Hostels, PGs, rentals, student housing, and employee accommodation in India and internationally. Reserve before you leave your home city.</p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => openModal('search')}>🏠 Find Accommodation</button>
              <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('india')?.scrollIntoView({ behavior: 'smooth' })}>🌍 Explore Options</button>
            </div>
            <p className="hero-tagline">Book before you arrive. Move in with confidence.</p>
          </div>
          <div className="hero-visual reveal">
            <div className="hero-card">
              <div className="hero-card-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80)' }}>
                <div className="overlay"></div>
              </div>
              <div className="metric-row">
                <div className="metric"><div className="label">Properties</div><div className="val" id="mProps">{metrics.properties}</div></div>
                <div className="metric"><div className="label">Cities</div><div className="val">120+</div></div>
                <div className="metric"><div className="label">Reservations</div><div className="val" id="mBookings">{metrics.bookings}</div></div>
                <div className="metric"><div className="label">Satisfaction</div><div className="val">94%</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <div className="trust">
        <div className="container">
          <h3>Trusted by Students, Employees, and Families</h3>
          <div className="trust-grid">
            <div className="trust-item"><div className="icon">🎓</div><span>Student Housing</span></div>
            <div className="trust-item"><div className="icon">💼</div><span>Employee Accommodation</span></div>
            <div className="trust-item"><div className="icon">🏠</div><span>Rentals &amp; PGs</span></div>
            <div className="trust-item"><div className="icon">🛏️</div><span>Hostels &amp; Shared</span></div>
            <div className="trust-item"><div className="icon">🌐</div><span>International Stays</span></div>
          </div>
        </div>
      </div>

      {/* INDIA PROPERTIES */}
      <section id="india" ref={indiaRef}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">India</span>
            <h2 className="section-title">Accommodation Across India</h2>
            <p className="section-sub">Hostels, PGs, rentals, shared housing, student housing, and employee accommodation in cities across India.</p>
          </div>

          <div className="filter-bar reveal">
            <div className="filter-group">
              <label>Type</label>
              <select name="type" value={indiaFilter.type} onChange={handleIndiaFilterChange}>
                <option value="all">All Types</option>
                <option value="hostel">Hostel</option>
                <option value="pg">PG</option>
                <option value="rental">Rental</option>
                <option value="shared">Shared</option>
                <option value="student">Student Housing</option>
                <option value="employee">Employee Housing</option>
              </select>
            </div>
            <div className="filter-group">
              <label>City</label>
              <select name="city" value={indiaFilter.city} onChange={handleIndiaFilterChange}>
                <option value="all">All Cities</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Pune">Pune</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Budget (/month)</label>
              <select name="budget" value={indiaFilter.budget} onChange={handleIndiaFilterChange}>
                <option value="all">Any</option>
                <option value="0-5000">Under 5,000</option>
                <option value="5000-10000">5,000-10,000</option>
                <option value="10000-20000">10,000-20,000</option>
                <option value="20000+">20,000+</option>
              </select>
            </div>
            <div className="filter-group" style={{ flex: '0.5', minWidth: '80px' }}>
              <label>&nbsp;</label>
              <button className="btn btn-primary btn-sm" onClick={applyIndiaFilter}>Apply</button>
            </div>
          </div>

          <div className="property-grid reveal">
            {renderPropertyGrid(filteredIndia)}
          </div>
        </div>
      </section>

      {/* INTERNATIONAL PROPERTIES */}
      <section id="international" style={{ background: 'rgba(240, 250, 245, 0.3)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">International</span>
            <h2 className="section-title">Global Accommodation</h2>
            <p className="section-sub">Student accommodation, employee housing, shared housing, temporary hotels, and long-term rentals worldwide.</p>
          </div>

          <div className="filter-bar reveal">
            <div className="filter-group">
              <label>Type</label>
              <select name="type" value={intlFilter.type} onChange={handleIntlFilterChange}>
                <option value="all">All Types</option>
                <option value="student-intl">Student Accommodation</option>
                <option value="employee-intl">Employee Accommodation</option>
                <option value="shared-intl">Shared Housing</option>
                <option value="hotel">Temporary Hotel</option>
                <option value="long-rental">Long-term Rental</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Country</label>
              <select name="country" value={intlFilter.country} onChange={handleIntlFilterChange}>
                <option value="all">All Countries</option>
                <option value="UAE">UAE</option>
                <option value="UK">UK</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Budget (/mo)</label>
              <select name="budget" value={intlFilter.budget} onChange={handleIntlFilterChange}>
                <option value="all">Any</option>
                <option value="0-500">Under 500</option>
                <option value="500-1000">500-1,000</option>
                <option value="1000-2000">1,000-2,000</option>
                <option value="2000+">2,000+</option>
              </select>
            </div>
            <div className="filter-group" style={{ flex: '0.5', minWidth: '80px' }}>
              <label>&nbsp;</label>
              <button className="btn btn-primary btn-sm" onClick={applyIntlFilter}>Apply</button>
            </div>
          </div>

          <div className="property-grid reveal">
            {renderPropertyGrid(filteredIntl)}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">How It Works</span>
            <h2 className="section-title">Book Before You Arrive</h2>
            <p className="section-sub">Find, reserve, and move in – all before you leave your home city.</p>
          </div>
          <div className="steps">
            <div className="step-card reveal"><div className="step-num">01</div><h3>Search</h3><p>Find accommodation in your target city – India or international.</p></div>
            <div className="step-card reveal reveal-d1"><div className="step-num">02</div><h3>Reserve</h3><p>Book your stay with a secure deposit before you arrive.</p></div>
            <div className="step-card reveal reveal-d2"><div className="step-num">03</div><h3>Arrive</h3><p>Move in on your arrival date – no last-minute stress.</p></div>
            <div className="step-card reveal"><div className="step-num">04</div><h3>Stay</h3><p>Enjoy your accommodation with full support from ePay.</p></div>
            <div className="step-card reveal reveal-d1"><div className="step-num">05</div><h3>Renew or Move</h3><p>Extend your stay or find a new place as you grow.</p></div>
            <div className="step-card reveal reveal-d2"><div className="step-num">06</div><h3>Refer &amp; Earn</h3><p>Refer friends and earn rewards on their bookings.</p></div>
          </div>
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="text-center" style={{ paddingBottom: '40px', background: 'rgba(240, 250, 245, 0.2)' }}>
        <div className="container reveal">
          <span className="section-label">For Everyone</span>
          <h2 className="section-title">Accommodation for Every Need</h2>
          <p className="section-sub" style={{ maxWidth: '640px' }}>Whether you're a student, an employee, a family, or a traveler – we have a place for you.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: '12px', marginTop: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #b8d9cc' }}><span style={{ fontSize: '1.8rem', display: 'block' }}>🎓</span> Students</div>
            <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #b8d9cc' }}><span style={{ fontSize: '1.8rem', display: 'block' }}>💼</span> Employees</div>
            <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #b8d9cc' }}><span style={{ fontSize: '1.8rem', display: 'block' }}>👨‍👩‍👧‍👦</span> Families</div>
            <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #b8d9cc' }}><span style={{ fontSize: '1.8rem', display: 'block' }}>✈️</span> Travelers</div>
            <div style={{ background: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-sm)', padding: '16px', border: '1px solid #b8d9cc' }}><span style={{ fontSize: '1.8rem', display: 'block' }}>🏢</span> Corporates</div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section>
        <div className="container">
          <div className="cta-band reveal">
            <span className="section-label">Reserve Now</span>
            <h2>Secure Your Stay Before You Arrive</h2>
            <p>Don't wait until you land. Find and reserve your accommodation now – and move in with peace of mind.</p>
            <button className="btn btn-primary btn-lg" onClick={() => openModal('search')}>🔍 Find Your Stay</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">FAQ</span>
            <h2 className="section-title">Questions, Answered</h2>
          </div>
          <div className="faq-list reveal">
            {[
              { q: 'Can I book before arriving in the city', a: 'Yes. You can search, reserve, and confirm your accommodation before you leave your home city.' },
              { q: 'What types of accommodation are available in India', a: 'Hostels, PGs, rentals, shared accommodation, student housing, and employee housing across major cities.' },
              { q: 'What international options are available', a: 'Student accommodation, employee housing, shared housing, temporary hotels, and long-term rentals worldwide.' },
              { q: 'Is there a deposit required', a: 'Most properties require a refundable security deposit, which is clearly mentioned before booking.' },
              { q: 'Can I extend my stay', a: 'Yes. You can request an extension directly through your dashboard.' },
              { q: 'Can I cancel my reservation', a: 'Cancellation policies vary by property. Please check the specific policy before booking.' }
            ].map((item, idx) => (
              <div className="faq-item" key={idx}>
                <button className="faq-q" onClick={(e) => {
                  const parent = e.currentTarget.parentElement;
                  const isOpen = parent.classList.contains('open');
                  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
                  if (!isOpen) parent.classList.add('open');
                }}>
                  {item.q} <span className="chev">▼</span>
                </button>
                <div className="faq-a">{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center" style={{ paddingBottom: '100px' }}>
        <div className="container reveal">
          <h2 className="section-title" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>Find Your Home Before You Arrive</h2>
          <p className="section-sub">Explore thousands of accommodations in India and internationally – and book with confidence.</p>
          <button className="btn btn-primary btn-lg" onClick={() => openModal('search')}>🔍 Start Searching</button>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="logo" style={{ marginBottom: '16px' }}><div className="logo-mark">eA</div> <span>ePay Accommodation</span></div>
          <p>© 2026 ePay Accommodation – Book Before You Arrive</p>
        </div>
      </footer>

      {/* MODALS */}

      {/* Search Modal */}
      <div className={`modal-overlay ${modalSearchOpen ? 'open' : ''}`} onClick={(e) => handleOverlayClick(e, 'search')}>
        <div className="modal">
          <button className="modal-close" onClick={() => closeModal('search')}>×</button>
          <h2>Find Your Accommodation</h2>
          <p className="sub">Search across India and international destinations.</p>
          <form onSubmit={handleSearchSubmit}>
            <div className="form-grid">
              <div className="form-group full">
                <label>Location *</label>
                <select name="location" required defaultValue="">
                  <option value="">Select city or country</option>
                  <option value="Mumbai, India">Mumbai, India</option>
                  <option value="Delhi, India">Delhi, India</option>
                  <option value="Bangalore, India">Bangalore, India</option>
                  <option value="Pune, India">Pune, India</option>
                  <option value="Dubai, UAE">Dubai, UAE</option>
                  <option value="London, UK">London, UK</option>
                  <option value="New York, USA">New York, USA</option>
                  <option value="Toronto, Canada">Toronto, Canada</option>
                  <option value="Sydney, Australia">Sydney, Australia</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>
              <div className="form-group">
                <label>Accommodation Type</label>
                <select name="type" defaultValue="Hostel">
                  <option value="Hostel">Hostel</option><option value="PG">PG</option><option value="Rental">Rental</option>
                  <option value="Shared">Shared</option><option value="Student Housing">Student Housing</option>
                  <option value="Employee Housing">Employee Housing</option><option value="Temporary Hotel">Temporary Hotel</option>
                  <option value="Long-term Rental">Long-term Rental</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget (monthly)</label>
                <select name="budget" defaultValue="any">
                  <option value="any">Any</option>
                  <option value="0-5000">Under 5,000</option>
                  <option value="5000-10000">5,000-10,000</option>
                  <option value="10000-20000">10,000-20,000</option>
                  <option value="20000+">20,000+</option>
                </select>
              </div>
              <div className="form-group"><label>Move-in Date</label><input type="date" name="movein" /></div>
              <div className="form-group">
                <label>Duration (months)</label>
                <select name="duration" defaultValue="6">
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
              <div className="form-group full"><button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>🔍 Find Accommodation</button></div>
            </div>
          </form>
        </div>
      </div>

      {/* Book Modal */}
      <div className={`modal-overlay ${modalBookOpen ? 'open' : ''}`} onClick={(e) => handleOverlayClick(e, 'book')}>
        <div className="modal">
          <button className="modal-close" onClick={() => closeModal('book')}>×</button>
          <h2>Reserve Your Stay</h2>
          <p className="sub" id="bookPropertyName">{selectedProperty ? `${selectedProperty.name} – ${selectedProperty.price}` : 'Property Name'}</p>
          <form onSubmit={handleBookingSubmit}>
            <div className="form-grid">
              <div className="form-group"><label>Full Name *</label><input name="name" required /></div>
              <div className="form-group"><label>Mobile *</label><input name="mobile" required type="tel" /></div>
              <div className="form-group full"><label>Email *</label><input name="email" required type="email" /></div>
              <div className="form-group"><label>Move-in Date *</label><input type="date" name="movein" required /></div>
              <div className="form-group">
                <label>Duration (months) *</label>
                <select name="duration" defaultValue="6">
                  <option value="1">1 month</option>
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                </select>
              </div>
              <div className="form-group full"><label>Special Requests</label><textarea name="requests" rows={2} placeholder="Any special requirements"></textarea></div>
              <div className="form-group full">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: '#1b4d3a' }}>
                  <input type="checkbox" required /> I agree to the <a href="#" style={{ color: '#059669' }}>terms and cancellation policy</a>
                </div>
              </div>
              <div className="form-group full"><button type="submit" className="btn btn-success btn-lg" style={{ width: '100%' }}>✅ Reserve Now</button></div>
            </div>
          </form>
        </div>
      </div>

      {/* Login Modal */}
      <div className={`modal-overlay ${modalLoginOpen ? 'open' : ''}`} onClick={(e) => handleOverlayClick(e, 'login')}>
        <div className="modal">
          <button className="modal-close" onClick={() => closeModal('login')}>×</button>
          <h2>Sign In</h2>
          <p className="sub">Access your bookings and manage your stays.</p>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-grid">
              <div className="form-group full"><label>Email</label><input name="email" required type="email" /></div>
              <div className="form-group full"><label>Password</label><input name="pass" type="password" required /></div>
              <div className="form-group full"><button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>Sign In</button></div>
              <div className="form-group full text-center" style={{ fontSize: '0.85rem', color: '#1b4d3a' }}>
                Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); closeModal('login'); openModal('search'); }} style={{ color: '#059669' }}>Find a place</a>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Toast container */}
      <div className="toast-box" id="toasts">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>
    </>
  );
};

export default Accommodation;
