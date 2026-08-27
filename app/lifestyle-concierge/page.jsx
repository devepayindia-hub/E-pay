'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Service Data ──
const services = [
  { id: 'EP-BIR-001', name: 'Birthday Event Planning Coordination', price: '₹950', time: '7 working days', docs: ['Event Date & Venue Details', 'Guest Count', 'Budget Range'] },
  { id: 'EP-WED-002', name: 'Wedding Service Coordination', price: '₹1,100', time: '1 working day', docs: ['Guest Count', 'Budget Range', 'Reference Photos/Preferences'] },
  { id: 'EP-PHO-003', name: 'Photography Booking', price: '₹1,250', time: '4 working days', docs: ['Budget Range', 'Reference Photos/Preferences', 'Event Date & Venue Details'] },
  { id: 'EP-VID-004', name: 'Videography Booking', price: '₹1,350', time: '7 working days', docs: ['Reference Photos/Preferences', 'Event Date & Venue Details', 'Guest Count'] },
  { id: 'EP-CAT-005', name: 'Catering Coordination', price: '₹1,500', time: '1 working day', docs: ['Event Date & Venue Details', 'Guest Count', 'Budget Range'] },
  { id: 'EP-DEC-006', name: 'Decoration Coordination', price: '₹1,650', time: '4 working days', docs: ['Guest Count', 'Budget Range', 'Reference Photos/Preferences'] },
  { id: 'EP-EVE-007', name: 'Event Venue Booking', price: '₹1,800', time: '7 working days', docs: ['Budget Range', 'Reference Photos/Preferences', 'Event Date & Venue Details'] },
  { id: 'EP-FIT-008', name: 'Fitness Service Booking', price: '₹1,900', time: '1 working day', docs: ['Reference Photos/Preferences', 'Event Date & Venue Details', 'Guest Count'] },
  { id: 'EP-PER-009', name: 'Personal Trainer Coordination', price: '₹2,050', time: '4 working days', docs: ['Event Date & Venue Details', 'Guest Count', 'Budget Range'] },
  { id: 'EP-YOG-010', name: 'Yoga Class Booking', price: '₹2,200', time: '7 working days', docs: ['Guest Count', 'Budget Range', 'Reference Photos/Preferences'] },
  { id: 'EP-HOB-011', name: 'Hobby Course Discovery', price: '₹2,350', time: '1 working day', docs: ['Budget Range', 'Reference Photos/Preferences', 'Event Date & Venue Details'] },
  { id: 'EP-ELD-012', name: 'Elder Assistance Service Coordination', price: '₹2,450', time: '4 working days', docs: ['Reference Photos/Preferences', 'Event Date & Venue Details', 'Guest Count'] },
  { id: 'EP-HOM-013', name: 'Home Care Service Coordination', price: '₹2,600', time: '7 working days', docs: ['Event Date & Venue Details', 'Guest Count', 'Budget Range'] },
  { id: 'EP-PET-014', name: 'Pet Care Service Booking', price: '₹2,750', time: '1 working day', docs: ['Guest Count', 'Budget Range', 'Reference Photos/Preferences'] },
  { id: 'EP-PER-015', name: 'Personal Concierge Assistance', price: '₹2,900', time: '4 working days', docs: ['Budget Range', 'Reference Photos/Preferences', 'Event Date & Venue Details'] },
  { id: 'EP-GIF-016', name: 'Gift Delivery Coordination', price: '₹3,000', time: '7 working days', docs: ['Reference Photos/Preferences', 'Event Date & Venue Details', 'Guest Count'] },
  { id: 'EP-EME-017', name: 'Emergency Contact Assistance', price: '₹3,150', time: '1 working day', docs: ['Event Date & Venue Details', 'Guest Count', 'Budget Range'] },
  { id: 'EP-FAM-018', name: 'Family Travel Planning', price: '₹3,300', time: '4 working days', docs: ['Guest Count', 'Budget Range', 'Reference Photos/Preferences'] },
  { id: 'EP-PER-019', name: 'Personal Document Organizer', price: '₹3,400', time: '7 working days', docs: ['Budget Range', 'Reference Photos/Preferences', 'Event Date & Venue Details'] },
  { id: 'EP-DIG-020', name: 'Digital Family Vault', price: '₹3,550', time: '1 working day', docs: ['Reference Photos/Preferences', 'Event Date & Venue Details', 'Guest Count'] }
];

const stages = [
  { num: '01', label: 'Occasion Enquiry' },
  { num: '02', label: 'Requirements Discussed' },
  { num: '03', label: 'Vendors/Options Shared' },
  { num: '04', label: 'Booking Confirmed' },
  { num: '05', label: 'Coordination in Progress' },
  { num: '06', label: 'Day-of Support' },
  { num: '07', label: 'Occasion Completed' },
  { num: '08', label: 'Feedback Shared' }
];

const docItems = [
  'Event Date & Venue Details',
  'Guest Count',
  'Budget Range',
  'Reference Photos/Preferences'
];

// Animated Stat Counter Component
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

// Service Card Component with Hover Glow
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

export default function LifestyleConciergePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = (s.id + ' ' + s.name + ' ' + s.price + ' ' + s.time + ' ' + s.docs.join(' ')).toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="lifestyle-page-wrapper">
      <style>{`
        .lifestyle-page-wrapper {
          --bg: #fbf2f5;
          --panel: #ffffff;
          --ink: #3a1620;
          --accent: #c23b6b;
          --accent-light: #e07a9f;
          --accent-glow: rgba(194, 59, 107, 0.12);
          --accent2: #4a3b8c;
          --line: #f0d3da;
          --shadow-soft: 0 8px 32px -12px rgba(58, 22, 32, 0.06);
          --shadow-hover: 0 24px 48px -16px rgba(194, 59, 107, 0.15);
          --radius: 18px;
          --display: 'Cormorant Garamond', Georgia, serif;
          --body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --mono: 'Space Mono', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.65;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .lifestyle-page-wrapper #bggrid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.15;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
        }

        .lifestyle-page-wrapper .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .lifestyle-page-wrapper .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .lifestyle-page-wrapper .topnav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid rgba(194, 59, 107, 0.1);
          position: sticky;
          top: 0;
          z-index: 100;
          scrollbar-width: thin;
        }
        .lifestyle-page-wrapper .navlink {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 6px 16px;
          border-radius: 30px;
          color: var(--ink);
          opacity: 0.55;
          white-space: nowrap;
          transition: all 0.25s;
          border: 1px solid transparent;
        }
        .lifestyle-page-wrapper .navlink:hover {
          opacity: 0.9;
          background: rgba(194, 59, 107, 0.04);
          border-color: var(--accent-light);
          color: var(--accent);
        }
        .lifestyle-page-wrapper .navlink.current {
          opacity: 1;
          background: var(--accent);
          color: #fff;
          border-color: var(--accent);
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(194, 59, 107, 0.25);
        }

        .lifestyle-page-wrapper .hero {
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
        .lifestyle-page-wrapper .hero-media {
          position: absolute;
          inset: 0;
          z-index: -2;
        }
        .lifestyle-page-wrapper .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: saturate(1.08) contrast(1.04) brightness(0.94);
        }
        .lifestyle-page-wrapper .hero-media::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.15) 0%, #fbf2f5e6 60%, #fbf2f5 100%),
            linear-gradient(90deg, #fbf2f5ee 0%, transparent 60%);
        }
        .lifestyle-page-wrapper .scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          z-index: -1;
          background: linear-gradient(90deg, transparent, var(--accent), transparent);
          opacity: 0.25;
          animation: scan 9s linear infinite;
        }
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }

        .lifestyle-page-wrapper .eyebrow {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .lifestyle-page-wrapper .eyebrow::before {
          content: "";
          width: 32px;
          height: 2px;
          background: var(--accent);
          box-shadow: 0 0 14px var(--accent-light);
        }
        .lifestyle-page-wrapper .eyebrow .blink {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 18px var(--accent-light);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.7); }
        }

        .lifestyle-page-wrapper h1.pagetitle {
          font-family: var(--display);
          font-size: clamp(2.8rem, 7.5vw, 5.6rem);
          margin: 0 0 14px;
          line-height: 1.04;
          max-width: 16ch;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, var(--ink) 30%, var(--accent) 55%, var(--ink) 80%);
          background-size: 280% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .lifestyle-page-wrapper .tagline {
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          max-width: 52ch;
          opacity: 0.85;
          margin: 0 0 10px;
          font-weight: 400;
        }
        .lifestyle-page-wrapper .introtext {
          max-width: 60ch;
          opacity: 0.55;
          font-size: 0.98rem;
        }

        .lifestyle-page-wrapper .numlabel {
          position: absolute;
          top: 10vh;
          right: 6vw;
          font-family: var(--display);
          font-size: clamp(6rem, 18vw, 14rem);
          opacity: 0.035;
          line-height: 1;
          z-index: -1;
          user-select: none;
          color: var(--accent);
        }

        .lifestyle-page-wrapper .statrow {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 34px;
          border-radius: var(--radius);
          overflow: hidden;
          max-width: 860px;
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 12px 40px -12px rgba(58, 22, 32, 0.06);
        }
        .lifestyle-page-wrapper .statbox {
          flex: 1;
          min-width: 140px;
          padding: 18px 22px;
          border-right: 1px solid rgba(194, 59, 107, 0.06);
          position: relative;
          background: rgba(255, 255, 255, 0.15);
          transition: background 0.3s;
        }
        .lifestyle-page-wrapper .statbox:last-child {
          border-right: none;
        }
        .lifestyle-page-wrapper .statbox::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: var(--accent);
          transition: height 0.8s ease;
          box-shadow: 0 0 16px var(--accent-light);
        }
        .lifestyle-page-wrapper .statbox.in::before {
          height: 100%;
        }
        .lifestyle-page-wrapper .statbox b {
          display: block;
          font-family: var(--display);
          font-size: 1.7rem;
          color: var(--accent);
        }
        .lifestyle-page-wrapper .statbox span {
          font-family: var(--mono);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.5;
          display: block;
          margin-top: 2px;
        }

        .lifestyle-page-wrapper .section {
          padding: 70px 8vw;
          position: relative;
          z-index: 1;
        }
        .lifestyle-page-wrapper .section-head {
          margin-bottom: 32px;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .lifestyle-page-wrapper .section-head h2 {
          font-family: var(--display);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          margin: 0;
          letter-spacing: -0.01em;
          color: var(--ink);
        }
        .lifestyle-page-wrapper .section-head .count {
          font-family: var(--mono);
          font-size: 0.68rem;
          opacity: 0.4;
          border: 1px solid var(--line);
          padding: 3px 14px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.4);
        }
        .lifestyle-page-wrapper .section.alt {
          background: rgba(240, 211, 218, 0.12);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .lifestyle-page-wrapper .searchbar {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }
        .lifestyle-page-wrapper .searchbar input {
          flex: 1;
          min-width: 240px;
          padding: 14px 20px;
          border: 1.5px solid rgba(240, 211, 218, 0.6);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.6);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.25s;
        }
        .lifestyle-page-wrapper .searchbar input:focus {
          outline: none;
          border-color: var(--accent);
          background: #ffffff;
          box-shadow: 0 0 0 5px rgba(194, 59, 107, 0.06);
        }
        .lifestyle-page-wrapper .hint {
          font-family: var(--mono);
          font-size: 0.66rem;
          opacity: 0.4;
        }

        .lifestyle-page-wrapper .sgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }
        .lifestyle-page-wrapper .scard {
          background: var(--panel);
          border: 1px solid rgba(240, 211, 218, 0.6);
          border-radius: var(--radius);
          padding: 22px 24px 24px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }
        .lifestyle-page-wrapper .scard-glow {
          position: absolute;
          inset: -1px;
          opacity: 0;
          border-radius: var(--radius);
          background: radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(194, 59, 107, 0.06), transparent 70%);
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .lifestyle-page-wrapper .scard:hover .scard-glow { opacity: 1; }
        .lifestyle-page-wrapper .scard:hover {
          transform: translateY(-8px);
          border-color: var(--accent);
          box-shadow: var(--shadow-hover);
        }
        .lifestyle-page-wrapper .scard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .lifestyle-page-wrapper .scard-id {
          font-family: var(--mono);
          font-size: 0.62rem;
          opacity: 0.35;
        }
        .lifestyle-page-wrapper .scard-spark {
          width: 16px;
          height: 16px;
          color: var(--accent);
          opacity: 0.5;
        }
        .lifestyle-page-wrapper .scard h4 {
          font-family: var(--display);
          font-size: 1.08rem;
          margin: 10px 0;
          color: var(--ink);
        }
        .lifestyle-page-wrapper .scard-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .lifestyle-page-wrapper .tagp, .lifestyle-page-wrapper .tags {
          font-family: var(--mono);
          font-size: 0.68rem;
          padding: 3px 12px;
          border-radius: 30px;
        }
        .lifestyle-page-wrapper .tagp {
          background: var(--accent);
          color: #fff;
          font-weight: 600;
        }
        .lifestyle-page-wrapper .tags {
          border: 1px solid var(--line);
          opacity: 0.6;
          background: rgba(255, 255, 255, 0.3);
        }
        .lifestyle-page-wrapper .scard-docs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .lifestyle-page-wrapper .scard-docs span {
          font-size: 0.62rem;
          opacity: 0.45;
          margin: 2px 10px 2px 0;
          font-family: var(--mono);
        }
        .lifestyle-page-wrapper .scard-docs span::before {
          content: "▸ ";
          color: var(--accent);
        }

        .lifestyle-page-wrapper .pipeline-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .lifestyle-page-wrapper .pnode {
          padding: 18px 18px 20px;
          border: 1px solid rgba(240, 211, 218, 0.6);
          border-radius: var(--radius);
          background: var(--panel);
          box-shadow: var(--shadow-soft);
        }
        .lifestyle-page-wrapper .pnum {
          font-family: var(--mono);
          color: var(--accent);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .lifestyle-page-wrapper .pnode p {
          margin: 0 0 10px;
          font-size: 0.84rem;
          opacity: 0.8;
        }
        .lifestyle-page-wrapper .pnode-bar {
          height: 3px;
          background: var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .lifestyle-page-wrapper .pnode-bar span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--accent);
        }

        .lifestyle-page-wrapper .docwrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .lifestyle-page-wrapper .dchip {
          font-family: var(--mono);
          font-size: 0.76rem;
          padding: 10px 20px;
          border: 1px solid var(--line);
          border-radius: 40px;
          opacity: 0.85;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--panel);
        }

        .lifestyle-page-wrapper footer {
          padding: 36px 8vw;
          border-top: 1px solid rgba(255, 255, 255, 0.5);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          background: rgba(255, 255, 255, 0.4);
        }
        .lifestyle-page-wrapper .backlink {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--accent);
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
        <Link className="navlink" href="/utility-booking">Utility &amp; Booking</Link>
        <Link className="navlink current" href="/lifestyle-concierge">Lifestyle &amp; Concierge</Link>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=2070&auto=format&fit=crop"
            alt="Celebratory lifestyle and concierge concept with flowers and gifts"
          />
        </div>
        <div className="scanline"></div>
        <div className="numlabel">15</div>

        <div className="eyebrow">
          <span className="blink"></span>
          The Guestbook · 👨‍👩‍👧
        </div>

        <h1 className="pagetitle">Lifestyle &amp; Concierge</h1>
        <p className="tagline">Birthdays, housewarmings and the moments that make a house feel looked after.</p>
        <p className="introtext">
          Event planning, family travel, pet care and the small celebrations that matter. Concierge support designed for real Indian households — not luxury theatre, just reliable help.
        </p>

        <div className="statrow">
          <StatBox val="10+" label="Occasion Types" />
          <StatBox val="200+" label="Vendor Network" />
          <StatBox val="Included" label="Day-of Support" />
          <StatBox val="7 days/wk" label="Concierge Availability" />
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
            placeholder="Search within Lifestyle &amp; Concierge…"
          />
          <span className="hint">IDs follow EP-BIR-### format</span>
        </div>

        {filteredServices.length > 0 ? (
          <div className="sgrid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '32px 0', fontFamily: 'serif' }}>
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
              📄 {d}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link className="backlink" href="/">
          ← Back to full ePay Gallery index
        </Link>
        <span style={{ fontSize: '0.68rem', opacity: 0.4, fontFamily: 'monospace' }}>
          ePay Gallery · Lifestyle &amp; Concierge Desk · Session-only demo
        </span>
      </footer>
    </div>
  );
}
