'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Service Data ──
const services = [
  { id: 'EP-ELE-001', name: 'Electricity Bill Payment', price: '₹900', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-WAT-002', name: 'Water Bill Payment', price: '₹1,050', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-GAS-003', name: 'Gas Bill Payment', price: '₹1,200', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-BRO-004', name: 'Broadband Bill Payment', price: '₹1,300', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-MOB-005', name: 'Mobile Recharge', price: '₹1,450', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-DTH-006', name: 'DTH Recharge', price: '₹1,600', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-FAS-007', name: 'FASTag Recharge Assistance', price: '₹1,750', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-SUB-008', name: 'Subscription Management', price: '₹1,850', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-DOC-009', name: 'Doctor Appointment Booking', price: '₹2,000', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-DIA-010', name: 'Diagnostic Appointment Coordination', price: '₹2,150', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-SAL-011', name: 'Salon Booking', price: '₹2,300', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-HOM-012', name: 'Home Service Booking', price: '₹2,400', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-PLU-013', name: 'Plumber Booking Coordination', price: '₹2,550', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-ELE-014', name: 'Electrician Booking Coordination', price: '₹2,700', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-ACR-015', name: 'AC Repair Booking Coordination', price: '₹2,850', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-APP-016', name: 'Appliance Repair Coordination', price: '₹2,950', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-CLE-017', name: 'Cleaning Service Booking', price: '₹3,100', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] },
  { id: 'EP-PES-018', name: 'Pest Control Booking', price: '₹3,250', time: '1 working day', docs: ['Payment Method', 'Account/Consumer Number', 'Registered Mobile Number'] },
  { id: 'EP-EVE-019', name: 'Event Service Booking', price: '₹3,400', time: '4 working days', docs: ['Account/Consumer Number', 'Registered Mobile Number', 'Payment Method'] },
  { id: 'EP-LOC-020', name: 'Local Service Provider Booking', price: '₹3,500', time: '7 working days', docs: ['Registered Mobile Number', 'Payment Method', 'Account/Consumer Number'] }
];

const stages = [
  { num: '01', label: 'Service Selected' },
  { num: '02', label: 'Details Entered' },
  { num: '03', label: 'Payment Confirmed' },
  { num: '04', label: 'Booking/Recharge Processed' },
  { num: '05', label: 'Confirmation Sent' },
  { num: '06', label: 'Reminder Set for Next Cycle' }
];

const docItems = [
  'Account/Consumer Number',
  'Registered Mobile Number',
  'Payment Method'
];

function StatBox({ val, label }) {
  const [displayVal, setDisplayVal] = useState('0');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const match = val.match(/^([\d,]+)(.*)$/);
    if (!match) {
      setDisplayVal(val);
      return;
    }
    const target = parseInt(match[1].replace(/,/g, ''), 10);
    const suffix = match[2] || '';
    if (isNaN(target)) {
      setDisplayVal(val);
      return;
    }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
      cur += step;
      if (cur >= target) {
        cur = target;
        clearInterval(timer);
      }
      setDisplayVal(cur.toLocaleString('en-IN') + suffix);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, val]);

  return (
    <div ref={ref} className={`statbox reveal ${inView ? 'in' : ''}`}>
      <b>{displayVal}</b>
      <span>{label}</span>
    </div>
  );
}

function ServiceCard({ s }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty('--gx', `${e.clientX - r.left}px`);
    cardRef.current.style.setProperty('--gy', `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="scard reveal in"
      data-id={s.id}
    >
      <div className="scard-glow"></div>
      <div className="scard-top">
        <span className="scard-id">{s.id}</span>
        <span className="scard-spark">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l1.9 6.3L20 10l-6.1 1.7L12 18l-1.9-6.3L4 10l6.1-1.7L12 2z" />
          </svg>
        </span>
      </div>
      <h4>{s.name}</h4>
      <div className="scard-meta">
        <span className="tagp">{s.price}</span>
        <span className="tags">{s.time}</span>
      </div>
      <div className="scard-docs">
        {s.docs.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="scard-corner tl"></div>
      <div className="scard-corner tr"></div>
      <div className="scard-corner bl"></div>
      <div className="scard-corner br"></div>
    </div>
  );
}

export default function UtilityBookingPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = (s.id + ' ' + s.name + ' ' + s.price + ' ' + s.time + ' ' + s.docs.join(' ')).toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="utility-page-wrapper">
      <style>{`
        .utility-page-wrapper {
          --bg: #0b1115;
          --panel: #151e26;
          --ink: #eef2f5;
          --teal: #2dd4b0;
          --teal-glow: rgba(45, 212, 176, 0.25);
          --orange: #f2a341;
          --line: #263038;
          --shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.7);
          --radius: 16px;
          --display: 'Rubik', 'Segoe UI', sans-serif;
          --body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --mono: 'Roboto Mono', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.65;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .utility-page-wrapper #bggrid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.08;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
        }

        .utility-page-wrapper .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .utility-page-wrapper .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .utility-page-wrapper .topnav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(11, 17, 21, 0.88);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 100;
          scrollbar-width: thin;
        }
        .utility-page-wrapper .navlink {
          flex-shrink: 0;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 30px;
          color: #9ab0c0;
          opacity: 0.5;
          white-space: nowrap;
          transition: all 0.25s;
          border: 1px solid transparent;
        }
        .utility-page-wrapper .navlink:hover {
          opacity: 1;
          background: rgba(45, 212, 176, 0.08);
          border-color: rgba(45, 212, 176, 0.25);
          color: #fff;
        }
        .utility-page-wrapper .navlink.current {
          opacity: 1;
          background: var(--teal);
          color: #0b1115;
          border-color: var(--teal);
          font-weight: 600;
          box-shadow: 0 4px 24px rgba(45, 212, 176, 0.3);
        }

        .utility-page-wrapper .hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 8vw 60px;
          overflow: hidden;
          isolation: isolate;
          z-index: 1;
        }
        .utility-page-wrapper .hero-media {
          position: absolute;
          inset: 0;
          z-index: -2;
        }
        .utility-page-wrapper .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: saturate(1.05) contrast(1.06) brightness(0.75);
        }
        .utility-page-wrapper .hero-media::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, #0b1115e6 65%, #0b1115 100%),
            linear-gradient(90deg, #0b1115ee 0%, transparent 60%);
        }

        .utility-page-wrapper .eyebrow {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--teal);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .utility-page-wrapper .eyebrow::before {
          content: "";
          width: 32px;
          height: 2px;
          background: var(--teal);
          box-shadow: 0 0 16px var(--teal);
        }
        .utility-page-wrapper .eyebrow .blink {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--teal);
          box-shadow: 0 0 18px var(--teal);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.7); }
        }

        .utility-page-wrapper h1.pagetitle {
          font-family: var(--display);
          font-size: clamp(2.8rem, 7.5vw, 5.6rem);
          margin: 0 0 14px;
          line-height: 1.04;
          max-width: 16ch;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, #eef2f5 30%, var(--teal) 55%, #eef2f5 80%);
          background-size: 280% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .utility-page-wrapper .tagline {
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          max-width: 52ch;
          opacity: 0.9;
          margin: 0 0 10px;
          color: #c8dce0;
        }
        .utility-page-wrapper .introtext {
          max-width: 60ch;
          opacity: 0.5;
          font-size: 0.98rem;
          color: #8aa8b8;
        }

        .utility-page-wrapper .numlabel {
          position: absolute;
          top: 10vh;
          right: 6vw;
          font-family: var(--display);
          font-size: clamp(6rem, 18vw, 14rem);
          opacity: 0.03;
          line-height: 1;
          z-index: -1;
          user-select: none;
          color: var(--teal);
        }

        .utility-page-wrapper .statrow {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 34px;
          border-radius: var(--radius);
          overflow: hidden;
          max-width: 860px;
          background: rgba(21, 30, 38, 0.7);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(45, 212, 176, 0.12);
          box-shadow: var(--shadow);
        }
        .utility-page-wrapper .statbox {
          flex: 1;
          min-width: 140px;
          padding: 18px 22px;
          border-right: 1px solid rgba(45, 212, 176, 0.06);
          position: relative;
          background: rgba(255, 255, 255, 0.02);
        }
        .utility-page-wrapper .statbox:last-child {
          border-right: none;
        }
        .utility-page-wrapper .statbox::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: var(--teal);
          transition: height 0.8s ease;
          box-shadow: 0 0 16px var(--teal);
        }
        .utility-page-wrapper .statbox.in::before {
          height: 100%;
        }
        .utility-page-wrapper .statbox b {
          display: block;
          font-family: var(--display);
          font-size: 1.7rem;
          color: var(--teal);
          text-shadow: 0 0 24px rgba(45, 212, 176, 0.25);
        }
        .utility-page-wrapper .statbox span {
          font-family: var(--mono);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.45;
          display: block;
          margin-top: 2px;
          color: #9ab0c0;
        }

        .utility-page-wrapper .section {
          padding: 70px 8vw;
          position: relative;
          z-index: 1;
        }
        .utility-page-wrapper .section-head {
          margin-bottom: 32px;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .utility-page-wrapper .section-head h2 {
          font-family: var(--display);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          margin: 0;
          color: var(--teal);
        }
        .utility-page-wrapper .section-head .count {
          font-family: var(--mono);
          font-size: 0.68rem;
          opacity: 0.35;
          border: 1px solid var(--line);
          padding: 3px 14px;
          border-radius: 30px;
          color: #9ab0c0;
        }
        .utility-page-wrapper .section.alt {
          background: rgba(21, 30, 38, 0.35);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .utility-page-wrapper .searchbar {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }
        .utility-page-wrapper .searchbar input {
          flex: 1;
          min-width: 240px;
          padding: 14px 20px;
          border: 1.5px solid var(--line);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.03);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.25s;
        }
        .utility-page-wrapper .searchbar input:focus {
          outline: none;
          border-color: var(--teal);
          background: rgba(255, 255, 255, 0.06);
          box-shadow: 0 0 0 5px rgba(45, 212, 176, 0.06);
        }

        .utility-page-wrapper .sgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }
        .utility-page-wrapper .scard {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 22px 24px 24px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s;
          position: relative;
          overflow: hidden;
        }
        .utility-page-wrapper .scard-glow {
          position: absolute;
          inset: -1px;
          opacity: 0;
          border-radius: var(--radius);
          background: radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(45, 212, 176, 0.08), transparent 70%);
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .utility-page-wrapper .scard:hover .scard-glow { opacity: 1; }
        .utility-page-wrapper .scard:hover {
          transform: translateY(-6px);
          border-color: var(--teal);
          box-shadow: 0 24px 56px -18px rgba(0, 0, 0, 0.8);
        }
        .utility-page-wrapper .scard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .utility-page-wrapper .scard-id {
          font-family: var(--mono);
          font-size: 0.62rem;
          opacity: 0.25;
          color: #8aa8b8;
        }
        .utility-page-wrapper .scard-spark {
          width: 16px;
          height: 16px;
          color: var(--teal);
          opacity: 0.4;
        }
        .utility-page-wrapper .scard h4 {
          font-family: var(--display);
          font-size: 1.08rem;
          margin: 10px 0;
          color: #eef2f5;
        }
        .utility-page-wrapper .scard-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .utility-page-wrapper .tagp, .utility-page-wrapper .tags {
          font-family: var(--mono);
          font-size: 0.68rem;
          padding: 3px 12px;
          border-radius: 30px;
        }
        .utility-page-wrapper .tagp {
          background: var(--teal);
          color: #0b1115;
          font-weight: 600;
        }
        .utility-page-wrapper .tags {
          border: 1px solid var(--line);
          opacity: 0.5;
          color: #9ab0c0;
        }
        .utility-page-wrapper .scard-docs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .utility-page-wrapper .scard-docs span {
          font-size: 0.62rem;
          opacity: 0.3;
          margin: 2px 10px 2px 0;
          font-family: var(--mono);
          color: #8aa8b8;
        }
        .utility-page-wrapper .scard-docs span::before {
          content: "▸ ";
          color: var(--teal);
        }

        .utility-page-wrapper .pipeline-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .utility-page-wrapper .pnode {
          padding: 18px 18px 20px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
        }
        .utility-page-wrapper .pnum {
          font-family: var(--mono);
          color: var(--teal);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .utility-page-wrapper .pnode p {
          margin: 0 0 10px;
          font-size: 0.84rem;
          opacity: 0.75;
          color: #c8dce0;
        }
        .utility-page-wrapper .pnode-bar {
          height: 3px;
          background: var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .utility-page-wrapper .pnode-bar span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--teal);
          box-shadow: 0 0 16px var(--teal);
        }

        .utility-page-wrapper .docwrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .utility-page-wrapper .dchip {
          font-family: var(--mono);
          font-size: 0.76rem;
          padding: 10px 20px;
          border: 1px solid var(--line);
          border-radius: 40px;
          opacity: 0.8;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--panel);
          color: #c8dce0;
        }

        .utility-page-wrapper footer {
          padding: 36px 8vw;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          background: rgba(11, 17, 21, 0.6);
        }
        .utility-page-wrapper .backlink {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--teal);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
      `}</style>

      <div id="bggrid"></div>

      {/* NAV */}
      <nav className="topnav">
        <Link className="navlink" href="/citizen-public-services">Citizen &amp; Public Services</Link>
        <Link className="navlink" href="/finance-insurance">Finance &amp; Insurance</Link>
        <Link className="navlink" href="/accommodation-relocation">Accommodation &amp; Relocation</Link>
        <Link className="navlink current" href="/utility-booking">Utility &amp; Booking</Link>
        <Link className="navlink" href="/lifestyle-concierge">Lifestyle &amp; Concierge</Link>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070&auto=format&fit=crop"
            alt="Utility and booking concept with connected devices"
          />
        </div>
        <div className="numlabel">14</div>

        <div className="eyebrow">
          <span className="blink"></span>
          The Dial Pad · 📱
        </div>

        <h1 className="pagetitle">Utility &amp; Booking</h1>
        <p className="tagline">The bills and bookings that keep a household running.</p>
        <p className="introtext">
          Electricity, water, gas, broadband, DTH and the everyday services you already pay for. One calm place to manage connections, payments and the small logistics of modern Indian life.
        </p>

        <div className="statrow">
          <StatBox val="100+" label="Billers Supported" />
          <StatBox val="Instant" label="Avg. Processing Time" />
          <StatBox val="500+" label="Local Providers" />
          <StatBox val="Monthly" label="Reminder Cycle" />
        </div>
      </header>

      {/* SERVICE CATALOGUE */}
      <section className="section">
        <div className="section-head">
          <h2>Service Catalogue</h2>
          <span className="count">{filteredServices.length} services</span>
        </div>

        <div className="searchbar">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within Utility &amp; Booking…"
          />
        </div>

        {filteredServices.length > 0 ? (
          <div className="sgrid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: 0.35, padding: '32px 0', fontFamily: 'serif', color: 'var(--teal)' }}>
            No services match that search.
          </p>
        )}
      </section>

      {/* PIPELINE */}
      <section className="section alt">
        <div className="section-head">
          <h2>CRM Service Pipeline</h2>
          <span className="count">{stages.length} stages</span>
        </div>
        <div className="pipeline-row">
          {stages.map((st, idx) => (
            <div key={idx} className="pnode">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="pnum">{st.num}</span>
                {idx === stages.length - 1 && <span>✓</span>}
              </div>
              <p>{st.label}</p>
              <div className="pnode-bar">
                <span></span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DOCS REQUIRED */}
      <section className="section">
        <div className="section-head">
          <h2>Standard Documents Required</h2>
          <span className="count">varies per service</span>
        </div>
        <div className="docwrap">
          {docItems.map((d, i) => (
            <span key={i} className="dchip">
              📱 {d}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link className="backlink" href="/">
          ← Back to full ePay Gallery index
        </Link>
        <span style={{ fontSize: '0.68rem', opacity: 0.25, fontFamily: 'monospace', color: '#8aa8b8' }}>
          ePay Gallery · Utility &amp; Booking Desk · Session-only demo
        </span>
      </footer>
    </div>
  );
}
