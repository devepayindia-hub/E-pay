'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Service Data ──
const services = [
  { id: 'EP-HOT-001', name: 'Hotel Booking', price: '₹850', time: '1 working day', docs: ['ID Proof', 'Address Proof', 'Employment/Student ID'] },
  { id: 'EP-PGS-002', name: 'PG Search Assistance', price: '₹1,000', time: '4 working days', docs: ['Address Proof', 'Employment/Student ID', 'Photographs'] },
  { id: 'EP-HOS-003', name: 'Hostel Search Assistance', price: '₹1,150', time: '7 working days', docs: ['Employment/Student ID', 'Photographs', 'Rental Agreement (if applicable)'] },
  { id: 'EP-REN-004', name: 'Rental Home Search Assistance', price: '₹1,250', time: '1 working day', docs: ['Photographs', 'Rental Agreement (if applicable)', 'Emergency Contact'] },
  { id: 'EP-TEM-005', name: 'Temporary Accommodation', price: '₹1,400', time: '4 working days', docs: ['Rental Agreement (if applicable)', 'Emergency Contact', 'ID Proof'] },
  { id: 'EP-STU-006', name: 'Student Accommodation', price: '₹1,550', time: '7 working days', docs: ['Emergency Contact', 'ID Proof', 'Address Proof'] },
  { id: 'EP-EMP-007', name: 'Employee Accommodation', price: '₹1,700', time: '1 working day', docs: ['ID Proof', 'Address Proof', 'Employment/Student ID'] },
  { id: 'EP-COR-008', name: 'Corporate Stay Coordination', price: '₹1,800', time: '4 working days', docs: ['Address Proof', 'Employment/Student ID', 'Photographs'] },
  { id: 'EP-CIT-009', name: 'City Relocation Assistance', price: '₹1,950', time: '7 working days', docs: ['Employment/Student ID', 'Photographs', 'Rental Agreement (if applicable)'] },
  { id: 'EP-MOV-010', name: 'Moving & Packing Coordination', price: '₹2,100', time: '1 working day', docs: ['Photographs', 'Rental Agreement (if applicable)', 'Emergency Contact'] },
  { id: 'EP-LOC-011', name: 'Local Area Orientation', price: '₹2,250', time: '4 working days', docs: ['Rental Agreement (if applicable)', 'Emergency Contact', 'ID Proof'] },
  { id: 'EP-ROO-012', name: 'Roommate Matching', price: '₹2,350', time: '7 working days', docs: ['Emergency Contact', 'ID Proof', 'Address Proof'] },
  { id: 'EP-REN-013', name: 'Rental Documentation Assistance', price: '₹2,500', time: '1 working day', docs: ['ID Proof', 'Address Proof', 'Employment/Student ID'] },
  { id: 'EP-PRO-014', name: 'Property Visit Coordination', price: '₹2,650', time: '4 working days', docs: ['Address Proof', 'Employment/Student ID', 'Photographs'] },
  { id: 'EP-ACC-015', name: 'Accommodation Booking Management', price: '₹2,800', time: '7 working days', docs: ['Employment/Student ID', 'Photographs', 'Rental Agreement (if applicable)'] },
  { id: 'EP-EPA-016', name: 'ePay Relocation Manager (Bundle)', price: '₹2,900', time: '1 working day', docs: ['Photographs', 'Rental Agreement (if applicable)', 'Emergency Contact'] }
];

const stages = [
  { num: '01', label: 'Requirement Captured' },
  { num: '02', label: 'Options Shortlisted' },
  { num: '03', label: 'Site/Virtual Visit' },
  { num: '04', label: 'Documentation Assisted' },
  { num: '05', label: 'Booking Confirmed' },
  { num: '06', label: 'Move-in Coordination' },
  { num: '07', label: 'Local Orientation' },
  { num: '08', label: 'Settled & Closed' }
];

const docItems = [
  'ID Proof',
  'Address Proof',
  'Employment/Student ID',
  'Photographs',
  'Rental Agreement (if applicable)',
  'Emergency Contact'
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

export default function AccommodationRelocationPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = (s.id + ' ' + s.name + ' ' + s.price + ' ' + s.time + ' ' + s.docs.join(' ')).toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="acc-rel-page-wrapper">
      <style>{`
        .acc-rel-page-wrapper {
          --bg: #faf3ea;
          --panel: #ffffff;
          --ink: #2c1f14;
          --warm: #b5651d;
          --warm-light: #d99c6a;
          --warm-dark: #8a4e14;
          --blue-accent: #2f6690;
          --line: #e3d3bd;
          --shadow: 0 20px 48px -14px rgba(44, 31, 20, 0.12);
          --radius: 18px;
          --display: 'DM Serif Display', Georgia, serif;
          --body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --mono: 'Space Mono', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.65;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .acc-rel-page-wrapper #bggrid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.25;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 52px 52px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
        }

        .acc-rel-page-wrapper .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .acc-rel-page-wrapper .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .acc-rel-page-wrapper .topnav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(255, 248, 240, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 100;
          scrollbar-width: thin;
        }
        .acc-rel-page-wrapper .navlink {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 30px;
          color: var(--ink);
          opacity: 0.55;
          white-space: nowrap;
          transition: all 0.25s;
          border: 1px solid transparent;
        }
        .acc-rel-page-wrapper .navlink:hover {
          opacity: 0.9;
          background: rgba(181, 101, 29, 0.08);
          border-color: var(--warm-light);
        }
        .acc-rel-page-wrapper .navlink.current {
          opacity: 1;
          background: var(--warm);
          color: #fff;
          border-color: var(--warm);
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(181, 101, 29, 0.3);
        }

        .acc-rel-page-wrapper .hero {
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
        .acc-rel-page-wrapper .hero-media {
          position: absolute;
          inset: 0;
          z-index: -2;
        }
        .acc-rel-page-wrapper .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: saturate(1.08) contrast(1.04) brightness(0.92);
        }
        .acc-rel-page-wrapper .hero-media::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, #faf3eae6 60%, #faf3ea 100%),
            linear-gradient(90deg, #faf3eaee 0%, transparent 60%);
        }

        .acc-rel-page-wrapper .eyebrow {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--warm);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .acc-rel-page-wrapper .eyebrow::before {
          content: "";
          width: 32px;
          height: 2px;
          background: var(--warm);
          box-shadow: 0 0 14px var(--warm-light);
        }
        .acc-rel-page-wrapper .eyebrow .blink {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--warm);
          box-shadow: 0 0 16px var(--warm-light);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.7); }
        }

        .acc-rel-page-wrapper h1.pagetitle {
          font-family: var(--display);
          font-size: clamp(2.8rem, 7.5vw, 5.6rem);
          margin: 0 0 14px;
          line-height: 1.04;
          max-width: 16ch;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, var(--ink) 30%, var(--warm) 55%, var(--ink) 80%);
          background-size: 280% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .acc-rel-page-wrapper .tagline {
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          max-width: 52ch;
          opacity: 0.88;
          margin: 0 0 10px;
          font-weight: 400;
        }
        .acc-rel-page-wrapper .introtext {
          max-width: 60ch;
          opacity: 0.6;
          font-size: 0.98rem;
        }

        .acc-rel-page-wrapper .numlabel {
          position: absolute;
          top: 10vh;
          right: 6vw;
          font-family: var(--display);
          font-size: clamp(6rem, 18vw, 14rem);
          opacity: 0.045;
          line-height: 1;
          z-index: -1;
          user-select: none;
          color: var(--warm);
        }

        .acc-rel-page-wrapper .statrow {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 34px;
          border-radius: var(--radius);
          overflow: hidden;
          max-width: 860px;
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: var(--shadow);
        }
        .acc-rel-page-wrapper .statbox {
          flex: 1;
          min-width: 140px;
          padding: 18px 22px;
          border-right: 1px solid rgba(181, 101, 29, 0.08);
          position: relative;
          background: rgba(255, 255, 255, 0.15);
        }
        .acc-rel-page-wrapper .statbox:last-child {
          border-right: none;
        }
        .acc-rel-page-wrapper .statbox::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: var(--warm);
          transition: height 0.8s ease;
          box-shadow: 0 0 16px var(--warm-light);
        }
        .acc-rel-page-wrapper .statbox.in::before {
          height: 100%;
        }
        .acc-rel-page-wrapper .statbox b {
          display: block;
          font-family: var(--display);
          font-size: 1.7rem;
          color: var(--warm);
        }
        .acc-rel-page-wrapper .statbox span {
          font-family: var(--mono);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.5;
          display: block;
          margin-top: 2px;
        }

        .acc-rel-page-wrapper .section {
          padding: 70px 8vw;
          position: relative;
          z-index: 1;
        }
        .acc-rel-page-wrapper .section-head {
          margin-bottom: 32px;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .acc-rel-page-wrapper .section-head h2 {
          font-family: var(--display);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          margin: 0;
          color: var(--ink);
        }
        .acc-rel-page-wrapper .section-head .count {
          font-family: var(--mono);
          font-size: 0.68rem;
          opacity: 0.4;
          border: 1px solid var(--line);
          padding: 3px 14px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.4);
        }
        .acc-rel-page-wrapper .section.alt {
          background: rgba(227, 211, 189, 0.15);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .acc-rel-page-wrapper .searchbar {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }
        .acc-rel-page-wrapper .searchbar input {
          flex: 1;
          min-width: 240px;
          padding: 14px 20px;
          border: 1.5px solid var(--line);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.5);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.25s;
        }
        .acc-rel-page-wrapper .searchbar input:focus {
          outline: none;
          border-color: var(--warm);
          background: #ffffff;
          box-shadow: 0 0 0 5px rgba(181, 101, 29, 0.08);
        }

        .acc-rel-page-wrapper .sgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }
        .acc-rel-page-wrapper .scard {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 22px 24px 24px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s;
          position: relative;
          overflow: hidden;
        }
        .acc-rel-page-wrapper .scard-glow {
          position: absolute;
          inset: -1px;
          opacity: 0;
          border-radius: var(--radius);
          background: radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(181, 101, 29, 0.08), transparent 70%);
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .acc-rel-page-wrapper .scard:hover .scard-glow { opacity: 1; }
        .acc-rel-page-wrapper .scard:hover {
          transform: translateY(-6px);
          border-color: var(--warm-light);
          box-shadow: 0 24px 56px -18px rgba(44, 31, 20, 0.12);
        }
        .acc-rel-page-wrapper .scard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .acc-rel-page-wrapper .scard-id {
          font-family: var(--mono);
          font-size: 0.62rem;
          opacity: 0.35;
        }
        .acc-rel-page-wrapper .scard-spark {
          width: 16px;
          height: 16px;
          color: var(--warm);
          opacity: 0.5;
        }
        .acc-rel-page-wrapper .scard h4 {
          font-family: var(--display);
          font-size: 1.08rem;
          margin: 10px 0;
          color: var(--ink);
        }
        .acc-rel-page-wrapper .scard-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .acc-rel-page-wrapper .tagp, .acc-rel-page-wrapper .tags {
          font-family: var(--mono);
          font-size: 0.68rem;
          padding: 3px 12px;
          border-radius: 30px;
        }
        .acc-rel-page-wrapper .tagp {
          background: var(--warm);
          color: #fff;
          font-weight: 600;
        }
        .acc-rel-page-wrapper .tags {
          border: 1px solid var(--line);
          opacity: 0.6;
          background: rgba(255, 255, 255, 0.3);
        }
        .acc-rel-page-wrapper .scard-docs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .acc-rel-page-wrapper .scard-docs span {
          font-size: 0.62rem;
          opacity: 0.35;
          margin: 2px 10px 2px 0;
          font-family: var(--mono);
        }
        .acc-rel-page-wrapper .scard-docs span::before {
          content: "▸ ";
          color: var(--warm);
        }

        .acc-rel-page-wrapper .pipeline-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .acc-rel-page-wrapper .pnode {
          padding: 18px 18px 20px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
        }
        .acc-rel-page-wrapper .pnum {
          font-family: var(--mono);
          color: var(--warm);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .acc-rel-page-wrapper .pnode p {
          margin: 0 0 10px;
          font-size: 0.84rem;
          opacity: 0.8;
        }
        .acc-rel-page-wrapper .pnode-bar {
          height: 3px;
          background: var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .acc-rel-page-wrapper .pnode-bar span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--warm);
        }

        .acc-rel-page-wrapper .docwrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .acc-rel-page-wrapper .dchip {
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

        .acc-rel-page-wrapper footer {
          padding: 36px 8vw;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          background: rgba(255, 248, 240, 0.4);
        }
        .acc-rel-page-wrapper .backlink {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--warm);
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
        <Link className="navlink current" href="/accommodation-relocation">Accommodation &amp; Relocation</Link>
        <Link className="navlink" href="/utility-booking">Utility &amp; Booking</Link>
        <Link className="navlink" href="/lifestyle-concierge">Lifestyle &amp; Concierge</Link>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
            alt="Warm living room interior with plants and natural light"
          />
        </div>
        <div className="numlabel">13</div>

        <div className="eyebrow">
          <span className="blink"></span>
          Moving Map · 🏠
        </div>

        <h1 className="pagetitle">Accommodation &amp; Relocation</h1>
        <p className="tagline">Finding a home and settling into a new city without the chaos.</p>
        <p className="introtext">
          House hunting, rental agreements, packers &amp; movers and the first-week logistics of a move. Designed for people relocating for work, studies or family.
        </p>

        <div className="statrow">
          <StatBox val="8" label="Accommodation Types" />
          <StatBox val="8 services" label="Relocation Bundle Items" />
          <StatBox val="24–48 hrs" label="Avg. Match Time" />
          <StatBox val="60+" label="Cities Covered" />
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
            placeholder="Search within Accommodation &amp; Relocation…"
          />
        </div>

        {filteredServices.length > 0 ? (
          <div className="sgrid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: 0.4, padding: '32px 0', fontFamily: 'serif', color: 'var(--warm)' }}>
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
              🏠 {d}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link className="backlink" href="/">
          ← Back to full ePay Gallery index
        </Link>
        <span style={{ fontSize: '0.68rem', opacity: 0.35, fontFamily: 'monospace' }}>
          ePay Gallery · Accommodation &amp; Relocation Desk · Session-only demo
        </span>
      </footer>
    </div>
  );
}
