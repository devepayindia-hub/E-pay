'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Service Data ──
const services = [
  { id: 'EP-GOV-001', name: 'Government Scheme Information', price: '₹750', time: '4 working days', docs: ['Aadhaar Card', 'Address Proof', 'Income Certificate (if required)'] },
  { id: 'EP-GOV-002', name: 'Government Application Assistance', price: '₹900', time: '7 working days', docs: ['Address Proof', 'Income Certificate (if required)', 'Photograph'] },
  { id: 'EP-ONL-003', name: 'Online Government Form Assistance', price: '₹1,050', time: '1 working day', docs: ['Income Certificate (if required)', 'Photograph', 'Category Certificate (if applicable)'] },
  { id: 'EP-CER-004', name: 'Certificate Application Assistance', price: '₹1,200', time: '4 working days', docs: ['Photograph', 'Category Certificate (if applicable)', 'Aadhaar Card'] },
  { id: 'EP-APP-005', name: 'Appointment Booking Assistance', price: '₹1,300', time: '7 working days', docs: ['Category Certificate (if applicable)', 'Aadhaar Card', 'Address Proof'] },
  { id: 'EP-PUB-006', name: 'Public Service Status Tracking', price: '₹1,450', time: '1 working day', docs: ['Aadhaar Card', 'Address Proof', 'Income Certificate (if required)'] },
  { id: 'EP-PEN-007', name: 'Pension Information Assistance', price: '₹1,600', time: '4 working days', docs: ['Address Proof', 'Income Certificate (if required)', 'Photograph'] },
  { id: 'EP-SCH-008', name: 'Scholarship Application Assistance', price: '₹1,750', time: '7 working days', docs: ['Income Certificate (if required)', 'Photograph', 'Category Certificate (if applicable)'] },
  { id: 'EP-VOT-009', name: 'Voter Service Guidance', price: '₹1,850', time: '1 working day', docs: ['Photograph', 'Category Certificate (if applicable)', 'Aadhaar Card'] },
  { id: 'EP-DIG-010', name: 'Digital Document Assistance', price: '₹2,000', time: '4 working days', docs: ['Category Certificate (if applicable)', 'Aadhaar Card', 'Address Proof'] },
  { id: 'EP-PUB-011', name: 'Public Grievance Filing Guidance', price: '₹2,150', time: '7 working days', docs: ['Aadhaar Card', 'Address Proof', 'Income Certificate (if required)'] },
  { id: 'EP-UTI-012', name: 'Utility Service Application Assistance', price: '₹2,300', time: '1 working day', docs: ['Address Proof', 'Income Certificate (if required)', 'Photograph'] },
  { id: 'EP-GOV-013', name: 'Government Job Application Assistance', price: '₹2,400', time: '4 working days', docs: ['Income Certificate (if required)', 'Photograph', 'Category Certificate (if applicable)'] },
  { id: 'EP-EXA-014', name: 'Examination Application Assistance', price: '₹2,550', time: '7 working days', docs: ['Photograph', 'Category Certificate (if applicable)', 'Aadhaar Card'] },
  { id: 'EP-GOV-015', name: 'Government Portal Navigation Assistance', price: '₹2,700', time: '1 working day', docs: ['Category Certificate (if applicable)', 'Aadhaar Card', 'Address Proof'] }
];

const stages = [
  { num: '01', label: 'Enquiry Registered' },
  { num: '02', label: 'Scheme/Form Identified' },
  { num: '03', label: 'Documents Verified' },
  { num: '04', label: 'Application Assisted' },
  { num: '05', label: 'Submitted to Authority' },
  { num: '06', label: 'Status Tracking' },
  { num: '07', label: 'Outcome Received' },
  { num: '08', label: 'Case Closed' }
];

const docItems = [
  'Aadhaar Card',
  'Address Proof',
  'Income Certificate (if required)',
  'Photograph',
  'Category Certificate (if applicable)'
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

export default function CitizenPublicServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = (s.id + ' ' + s.name + ' ' + s.price + ' ' + s.time + ' ' + s.docs.join(' ')).toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="citizen-page-wrapper">
      <style>{`
        .citizen-page-wrapper {
          --bg: #f6f9f4;
          --panel: #ffffff;
          --ink: #1a2e1a;
          --green-900: #1b4d1b;
          --green-700: #2e7d32;
          --green-600: #388e3c;
          --green-500: #4caf50;
          --green-400: #66bb6a;
          --green-300: #81c784;
          --green-100: #c8e6c9;
          --green-50: #e8f5e9;
          --line: #d4e0d4;
          --shadow: 0 12px 40px -12px rgba(30, 60, 30, 0.12);
          --radius: 18px;
          --display: 'Merriweather', Georgia, serif;
          --body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --mono: 'Courier Prime', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.6;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .citizen-page-wrapper #bggrid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.18;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
        }

        .citizen-page-wrapper .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .citizen-page-wrapper .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .citizen-page-wrapper .topnav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 100;
          scrollbar-width: thin;
        }
        .citizen-page-wrapper .navlink {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 30px;
          color: var(--ink);
          opacity: 0.55;
          white-space: nowrap;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .citizen-page-wrapper .navlink:hover {
          opacity: 0.9;
          background: var(--green-50);
          border-color: var(--green-100);
        }
        .citizen-page-wrapper .navlink.current {
          opacity: 1;
          background: var(--green-700);
          color: #fff;
          border-color: var(--green-700);
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(46, 125, 50, 0.25);
        }

        .citizen-page-wrapper .hero {
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
        .citizen-page-wrapper .hero-media {
          position: absolute;
          inset: 0;
          z-index: -2;
        }
        .citizen-page-wrapper .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.06);
          filter: saturate(1.05) contrast(1.02) brightness(0.9);
        }
        .citizen-page-wrapper .hero-media::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.18) 0%, #f6f9f4e0 60%, #f6f9f4 100%),
            linear-gradient(90deg, #f6f9f4e6 0%, transparent 70%);
        }

        .citizen-page-wrapper .eyebrow {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--green-700);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .citizen-page-wrapper .eyebrow::before {
          content: "";
          width: 32px;
          height: 2px;
          background: var(--green-500);
          box-shadow: 0 0 12px var(--green-300);
        }
        .citizen-page-wrapper .eyebrow .blink {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--green-500);
          box-shadow: 0 0 14px var(--green-300);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(0.7); }
        }

        .citizen-page-wrapper h1.pagetitle {
          font-family: var(--display);
          font-size: clamp(2.8rem, 7.5vw, 5.6rem);
          margin: 0 0 14px;
          line-height: 1.04;
          max-width: 16ch;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, var(--green-900) 30%, var(--green-600) 55%, var(--green-900) 80%);
          background-size: 280% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .citizen-page-wrapper .tagline {
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          max-width: 52ch;
          opacity: 0.88;
          margin: 0 0 10px;
          font-weight: 500;
        }
        .citizen-page-wrapper .introtext {
          max-width: 60ch;
          opacity: 0.6;
          font-size: 0.98rem;
        }

        .citizen-page-wrapper .numlabel {
          position: absolute;
          top: 10vh;
          right: 6vw;
          font-family: var(--display);
          font-size: clamp(6rem, 18vw, 14rem);
          opacity: 0.04;
          line-height: 1;
          z-index: -1;
          user-select: none;
          color: var(--green-900);
        }

        .citizen-page-wrapper .statrow {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 34px;
          border-radius: var(--radius);
          overflow: hidden;
          max-width: 860px;
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: var(--shadow);
        }
        .citizen-page-wrapper .statbox {
          flex: 1;
          min-width: 140px;
          padding: 18px 22px;
          border-right: 1px solid rgba(46, 125, 50, 0.1);
          position: relative;
          background: rgba(255, 255, 255, 0.2);
        }
        .citizen-page-wrapper .statbox:last-child {
          border-right: none;
        }
        .citizen-page-wrapper .statbox::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: var(--green-500);
          transition: height 0.7s ease;
          box-shadow: 0 0 12px var(--green-300);
        }
        .citizen-page-wrapper .statbox.in::before {
          height: 100%;
        }
        .citizen-page-wrapper .statbox b {
          display: block;
          font-family: var(--display);
          font-size: 1.7rem;
          color: var(--green-700);
        }
        .citizen-page-wrapper .statbox span {
          font-family: var(--mono);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.5;
          display: block;
          margin-top: 2px;
        }

        .citizen-page-wrapper .section {
          padding: 70px 8vw;
          position: relative;
          z-index: 1;
        }
        .citizen-page-wrapper .section-head {
          margin-bottom: 32px;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .citizen-page-wrapper .section-head h2 {
          font-family: var(--display);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          margin: 0;
          color: var(--green-900);
        }
        .citizen-page-wrapper .section-head .count {
          font-family: var(--mono);
          font-size: 0.68rem;
          opacity: 0.5;
          border: 1px solid var(--line);
          padding: 3px 14px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.4);
        }
        .citizen-page-wrapper .section.alt {
          background: rgba(200, 230, 201, 0.15);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .citizen-page-wrapper .searchbar {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }
        .citizen-page-wrapper .searchbar input {
          flex: 1;
          min-width: 240px;
          padding: 14px 20px;
          border: 1.5px solid var(--line);
          border-radius: 14px;
          background: var(--panel);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.25s;
        }
        .citizen-page-wrapper .searchbar input:focus {
          outline: none;
          border-color: var(--green-500);
          box-shadow: 0 0 0 5px rgba(76, 175, 80, 0.12);
        }

        .citizen-page-wrapper .sgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }
        .citizen-page-wrapper .scard {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 22px 24px 24px;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.35s;
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.02);
        }
        .citizen-page-wrapper .scard-glow {
          position: absolute;
          inset: -1px;
          opacity: 0;
          border-radius: var(--radius);
          background: radial-gradient(200px circle at var(--gx, 50%) var(--gy, 50%), rgba(76, 175, 80, 0.1), transparent 70%);
          transition: opacity 0.4s;
          pointer-events: none;
        }
        .citizen-page-wrapper .scard:hover .scard-glow { opacity: 1; }
        .citizen-page-wrapper .scard:hover {
          transform: translateY(-6px);
          border-color: var(--green-300);
          box-shadow: 0 20px 48px -16px rgba(30, 70, 30, 0.16);
        }
        .citizen-page-wrapper .scard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .citizen-page-wrapper .scard-id {
          font-family: var(--mono);
          font-size: 0.62rem;
          opacity: 0.4;
        }
        .citizen-page-wrapper .scard-spark {
          width: 16px;
          height: 16px;
          color: var(--green-500);
          opacity: 0.5;
        }
        .citizen-page-wrapper .scard h4 {
          font-family: var(--display);
          font-size: 1.08rem;
          margin: 10px 0;
          color: var(--green-900);
        }
        .citizen-page-wrapper .scard-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .citizen-page-wrapper .tagp, .citizen-page-wrapper .tags {
          font-family: var(--mono);
          font-size: 0.68rem;
          padding: 3px 12px;
          border-radius: 30px;
        }
        .citizen-page-wrapper .tagp {
          background: var(--green-700);
          color: #fff;
          font-weight: 600;
        }
        .citizen-page-wrapper .tags {
          border: 1px solid var(--line);
          opacity: 0.7;
          background: rgba(255, 255, 255, 0.3);
        }
        .citizen-page-wrapper .scard-docs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .citizen-page-wrapper .scard-docs span {
          font-size: 0.62rem;
          opacity: 0.4;
          margin: 2px 10px 2px 0;
          font-family: var(--mono);
        }
        .citizen-page-wrapper .scard-docs span::before {
          content: "▸ ";
          color: var(--green-400);
        }

        .citizen-page-wrapper .pipeline-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .citizen-page-wrapper .pnode {
          padding: 18px 18px 20px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
        }
        .citizen-page-wrapper .pnum {
          font-family: var(--mono);
          color: var(--green-600);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .citizen-page-wrapper .pnode p {
          margin: 0 0 10px;
          font-size: 0.84rem;
          opacity: 0.85;
          font-weight: 500;
        }
        .citizen-page-wrapper .pnode-bar {
          height: 3px;
          background: var(--green-100);
          border-radius: 4px;
          overflow: hidden;
        }
        .citizen-page-wrapper .pnode-bar span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--green-500);
        }

        .citizen-page-wrapper .docwrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .citizen-page-wrapper .dchip {
          font-family: var(--mono);
          font-size: 0.76rem;
          padding: 10px 20px;
          border: 1px solid var(--line);
          border-radius: 40px;
          opacity: 0.9;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--panel);
        }

        .citizen-page-wrapper footer {
          padding: 36px 8vw;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          background: rgba(255, 255, 255, 0.3);
        }
        .citizen-page-wrapper .backlink {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--green-700);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
        }
      `}</style>

      <div id="bggrid"></div>

      {/* NAV */}
      <nav className="topnav">
        <Link className="navlink current" href="/citizen-public-services">Citizen &amp; Public Services</Link>
        <Link className="navlink" href="/finance-insurance">Finance &amp; Insurance</Link>
        <Link className="navlink" href="/accommodation-relocation">Accommodation &amp; Relocation</Link>
        <Link className="navlink" href="/utility-booking">Utility &amp; Booking</Link>
        <Link className="navlink" href="/lifestyle-concierge">Lifestyle &amp; Concierge</Link>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=2070&auto=format&fit=crop"
            alt="Citizen services building and public hall"
          />
        </div>
        <div className="numlabel">11</div>

        <div className="eyebrow">
          <span className="blink"></span>
          Public Register · 🏛️
        </div>

        <h1 className="pagetitle">Citizen &amp; Public Services</h1>
        <p className="tagline">A plain-language register for government forms, filed the right way, once.</p>
        <p className="introtext">
          The Citizen &amp; Public Services desk is a register, kept plainly: what scheme applies, what form is needed, what status to check next — offered strictly through authorised, legal channels.
        </p>

        <div className="statrow">
          <StatBox val="15" label="Services Listed" />
          <StatBox val="Always" label="Authorised Channels Only" />
          <StatBox val="Same day" label="Avg. Filing Assistance" />
          <StatBox val="Included" label="Status Tracking" />
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
            placeholder="Search within Citizen &amp; Public Services…"
          />
        </div>

        {filteredServices.length > 0 ? (
          <div className="sgrid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: 0.5, padding: '32px 0', fontFamily: 'serif', color: 'var(--green-700)' }}>
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
              🏛️ {d}
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
          ePay Gallery · Citizen &amp; Public Services Desk · Session-only demo
        </span>
      </footer>
    </div>
  );
}
