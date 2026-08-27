'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ── Service Data ──
const services = [
  { id: 'EP-INS-001', name: 'Insurance Comparison Assistance', price: '₹800', time: '7 working days', docs: ['ID Proof', 'Address Proof', 'Income Proof'] },
  { id: 'EP-INS-002', name: 'Insurance Renewal Assistance', price: '₹950', time: '1 working day', docs: ['Address Proof', 'Income Proof', 'Bank Statement'] },
  { id: 'EP-TRA-003', name: 'Travel Insurance', price: '₹1,100', time: '4 working days', docs: ['Income Proof', 'Bank Statement', 'Existing Policy Documents (if any)'] },
  { id: 'EP-HEA-004', name: 'Health Insurance Assistance', price: '₹1,250', time: '7 working days', docs: ['Bank Statement', 'Existing Policy Documents (if any)', 'PAN Card'] },
  { id: 'EP-VEH-005', name: 'Vehicle Insurance Assistance', price: '₹1,350', time: '1 working day', docs: ['Existing Policy Documents (if any)', 'PAN Card', 'ID Proof'] },
  { id: 'EP-LIF-006', name: 'Life Insurance Lead Assistance', price: '₹1,500', time: '4 working days', docs: ['PAN Card', 'ID Proof', 'Address Proof'] },
  { id: 'EP-LOA-007', name: 'Loan Eligibility Assistance', price: '₹1,650', time: '7 working days', docs: ['ID Proof', 'Address Proof', 'Income Proof'] },
  { id: 'EP-PER-008', name: 'Personal Loan Assistance', price: '₹1,800', time: '1 working day', docs: ['Address Proof', 'Income Proof', 'Bank Statement'] },
  { id: 'EP-BUS-009', name: 'Business Loan Assistance', price: '₹1,900', time: '4 working days', docs: ['Income Proof', 'Bank Statement', 'Existing Policy Documents (if any)'] },
  { id: 'EP-EDU-010', name: 'Education Loan Assistance', price: '₹2,050', time: '7 working days', docs: ['Bank Statement', 'Existing Policy Documents (if any)', 'PAN Card'] },
  { id: 'EP-HOM-011', name: 'Home Loan Assistance', price: '₹2,200', time: '1 working day', docs: ['Existing Policy Documents (if any)', 'PAN Card', 'ID Proof'] },
  { id: 'EP-CRE-012', name: 'Credit Score Information Assistance', price: '₹2,300', time: '4 working days', docs: ['PAN Card', 'ID Proof', 'Address Proof'] },
  { id: 'EP-EMI-013', name: 'EMI Calculation', price: '₹2,450', time: '7 working days', docs: ['ID Proof', 'Address Proof', 'Income Proof'] },
  { id: 'EP-FIN-014', name: 'Financial Document Organization', price: '₹2,600', time: '1 working day', docs: ['Address Proof', 'Income Proof', 'Bank Statement'] },
  { id: 'EP-INV-015', name: 'Invoice Payment Assistance', price: '₹2,750', time: '4 working days', docs: ['Income Proof', 'Bank Statement', 'Existing Policy Documents (if any)'] },
  { id: 'EP-DIG-016', name: 'Digital Payment Assistance', price: '₹2,850', time: '7 working days', docs: ['Bank Statement', 'Existing Policy Documents (if any)', 'PAN Card'] },
  { id: 'EP-SUB-017', name: 'Subscription Payment Management', price: '₹3,000', time: '1 working day', docs: ['Existing Policy Documents (if any)', 'PAN Card', 'ID Proof'] },
  { id: 'EP-BIL-018', name: 'Bill Payment', price: '₹3,150', time: '4 working days', docs: ['PAN Card', 'ID Proof', 'Address Proof'] },
  { id: 'EP-MOB-019', name: 'Mobile Recharge', price: '₹3,300', time: '7 working days', docs: ['ID Proof', 'Address Proof', 'Income Proof'] },
  { id: 'EP-DTH-020', name: 'DTH Recharge', price: '₹3,400', time: '1 working day', docs: ['Address Proof', 'Income Proof', 'Bank Statement'] }
];

const stages = [
  { num: '01', label: 'Enquiry' },
  { num: '02', label: 'Eligibility / Comparison' },
  { num: '03', label: 'Documents Collected' },
  { num: '04', label: 'Application via Partner' },
  { num: '05', label: 'Verification' },
  { num: '06', label: 'Approval / Policy Issued' },
  { num: '07', label: 'Payment Confirmation' },
  { num: '08', label: 'Renewal Reminder Set' }
];

const docItems = [
  'ID Proof',
  'Address Proof',
  'Income Proof',
  'Bank Statement',
  'Existing Policy Documents (if any)',
  'PAN Card'
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

export default function FinanceInsurancePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter((s) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const haystack = (s.id + ' ' + s.name + ' ' + s.price + ' ' + s.time + ' ' + s.docs.join(' ')).toLowerCase();
    return haystack.includes(q);
  });

  return (
    <div className="finance-page-wrapper">
      <style>{`
        .finance-page-wrapper {
          --bg: #0b1710;
          --panel: #16261d;
          --ink: #e8f1ea;
          --gold: #d4af37;
          --gold-light: #f0d080;
          --gold-dark: #b8952a;
          --green-accent: #4c9a6b;
          --line: #2a3f30;
          --shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.7);
          --radius: 18px;
          --display: 'Playfair Display', Georgia, serif;
          --body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          --mono: 'IBM Plex Mono', monospace;

          background: var(--bg);
          color: var(--ink);
          font-family: var(--body);
          line-height: 1.65;
          min-height: 100vh;
          overflow-x: hidden;
        }

        .finance-page-wrapper #bggrid {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          opacity: 0.12;
          background-image:
            linear-gradient(var(--line) 1px, transparent 1px),
            linear-gradient(90deg, var(--line) 1px, transparent 1px);
          background-size: 56px 56px;
          mask-image: radial-gradient(ellipse 70% 50% at 50% 20%, #000 30%, transparent 80%);
        }

        .finance-page-wrapper .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .finance-page-wrapper .reveal.in {
          opacity: 1;
          transform: translateY(0);
        }

        .finance-page-wrapper .topnav {
          display: flex;
          overflow-x: auto;
          gap: 4px;
          padding: 12px 24px;
          background: rgba(11, 23, 16, 0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--line);
          position: sticky;
          top: 0;
          z-index: 100;
          scrollbar-width: thin;
        }
        .finance-page-wrapper .navlink {
          flex-shrink: 0;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 30px;
          color: #c0d6c0;
          opacity: 0.55;
          white-space: nowrap;
          transition: all 0.25s;
          border: 1px solid transparent;
        }
        .finance-page-wrapper .navlink:hover {
          opacity: 1;
          background: rgba(212, 175, 55, 0.12);
          border-color: var(--gold);
          color: #fff;
        }
        .finance-page-wrapper .navlink.current {
          opacity: 1;
          background: var(--gold);
          color: #0b1710;
          border-color: var(--gold);
          font-weight: 600;
          box-shadow: 0 4px 20px rgba(212, 175, 55, 0.35);
        }

        .finance-page-wrapper .hero {
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
        .finance-page-wrapper .hero-media {
          position: absolute;
          inset: 0;
          z-index: -2;
        }
        .finance-page-wrapper .hero-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.05);
          filter: saturate(1.1) contrast(1.05) brightness(0.85);
        }
        .finance-page-wrapper .hero-media::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background:
            linear-gradient(180deg, rgba(0, 0, 0, 0.3) 0%, #0b1710e6 65%, #0b1710 100%),
            linear-gradient(90deg, #0b1710ee 0%, transparent 60%);
        }

        .finance-page-wrapper .eyebrow {
          font-family: var(--mono);
          font-size: 0.7rem;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: var(--gold);
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }
        .finance-page-wrapper .eyebrow::before {
          content: "";
          width: 32px;
          height: 2px;
          background: var(--gold);
          box-shadow: 0 0 16px var(--gold);
        }
        .finance-page-wrapper .eyebrow .blink {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--gold);
          box-shadow: 0 0 18px var(--gold);
          animation: pulse 1.6s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(0.7); }
        }

        .finance-page-wrapper h1.pagetitle {
          font-family: var(--display);
          font-size: clamp(2.8rem, 7.5vw, 5.6rem);
          margin: 0 0 14px;
          line-height: 1.04;
          max-width: 16ch;
          letter-spacing: -0.02em;
          background: linear-gradient(110deg, #f0e6c0 30%, var(--gold-light) 55%, #f0e6c0 80%);
          background-size: 280% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .finance-page-wrapper .tagline {
          font-size: clamp(1.05rem, 1.5vw, 1.3rem);
          max-width: 52ch;
          opacity: 0.9;
          margin: 0 0 10px;
          color: #d4e0d4;
        }
        .finance-page-wrapper .introtext {
          max-width: 60ch;
          opacity: 0.6;
          font-size: 0.98rem;
          color: #b0c8b0;
        }

        .finance-page-wrapper .numlabel {
          position: absolute;
          top: 10vh;
          right: 6vw;
          font-family: var(--display);
          font-size: clamp(6rem, 18vw, 14rem);
          opacity: 0.035;
          line-height: 1;
          z-index: -1;
          user-select: none;
          color: var(--gold);
        }

        .finance-page-wrapper .statrow {
          display: flex;
          flex-wrap: wrap;
          gap: 0;
          margin-top: 34px;
          border-radius: var(--radius);
          overflow: hidden;
          max-width: 860px;
          background: rgba(22, 38, 29, 0.65);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          box-shadow: var(--shadow);
        }
        .finance-page-wrapper .statbox {
          flex: 1;
          min-width: 140px;
          padding: 18px 22px;
          border-right: 1px solid rgba(212, 175, 55, 0.08);
          position: relative;
          background: rgba(255, 255, 255, 0.02);
        }
        .finance-page-wrapper .statbox:last-child {
          border-right: none;
        }
        .finance-page-wrapper .statbox::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 3px;
          height: 0;
          background: var(--gold);
          transition: height 0.8s ease;
          box-shadow: 0 0 16px var(--gold);
        }
        .finance-page-wrapper .statbox.in::before {
          height: 100%;
        }
        .finance-page-wrapper .statbox b {
          display: block;
          font-family: var(--display);
          font-size: 1.7rem;
          color: var(--gold);
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }
        .finance-page-wrapper .statbox span {
          font-family: var(--mono);
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.55;
          display: block;
          margin-top: 2px;
          color: #b0c8b0;
        }

        .finance-page-wrapper .section {
          padding: 70px 8vw;
          position: relative;
          z-index: 1;
        }
        .finance-page-wrapper .section-head {
          margin-bottom: 32px;
          display: flex;
          align-items: baseline;
          gap: 16px;
          flex-wrap: wrap;
        }
        .finance-page-wrapper .section-head h2 {
          font-family: var(--display);
          font-size: clamp(1.6rem, 2.6vw, 2.2rem);
          margin: 0;
          color: var(--gold-light);
        }
        .finance-page-wrapper .section-head .count {
          font-family: var(--mono);
          font-size: 0.68rem;
          opacity: 0.4;
          border: 1px solid var(--line);
          padding: 3px 14px;
          border-radius: 30px;
          color: #b0c8b0;
        }
        .finance-page-wrapper .section.alt {
          background: rgba(22, 38, 29, 0.4);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }

        .finance-page-wrapper .searchbar {
          display: flex;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
          align-items: center;
        }
        .finance-page-wrapper .searchbar input {
          flex: 1;
          min-width: 240px;
          padding: 14px 20px;
          border: 1.5px solid var(--line);
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.04);
          color: var(--ink);
          font-size: 0.95rem;
          transition: all 0.25s;
        }
        .finance-page-wrapper .searchbar input:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 5px rgba(212, 175, 55, 0.08);
        }

        .finance-page-wrapper .sgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 18px;
        }
        .finance-page-wrapper .scard {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: var(--radius);
          padding: 22px 24px 24px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.4s;
          position: relative;
          overflow: hidden;
        }
        .finance-page-wrapper .scard-glow {
          position: absolute;
          inset: -1px;
          opacity: 0;
          border-radius: var(--radius);
          background: radial-gradient(220px circle at var(--gx, 50%) var(--gy, 50%), rgba(212, 175, 55, 0.12), transparent 70%);
          transition: opacity 0.5s;
          pointer-events: none;
        }
        .finance-page-wrapper .scard:hover .scard-glow { opacity: 1; }
        .finance-page-wrapper .scard:hover {
          transform: translateY(-6px);
          border-color: var(--gold);
          box-shadow: 0 24px 56px -18px rgba(0, 0, 0, 0.8);
        }
        .finance-page-wrapper .scard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .finance-page-wrapper .scard-id {
          font-family: var(--mono);
          font-size: 0.62rem;
          opacity: 0.3;
          color: #b0c8b0;
        }
        .finance-page-wrapper .scard-spark {
          width: 16px;
          height: 16px;
          color: var(--gold);
          opacity: 0.5;
        }
        .finance-page-wrapper .scard h4 {
          font-family: var(--display);
          font-size: 1.08rem;
          margin: 10px 0;
          color: var(--gold-light);
        }
        .finance-page-wrapper .scard-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .finance-page-wrapper .tagp, .finance-page-wrapper .tags {
          font-family: var(--mono);
          font-size: 0.68rem;
          padding: 3px 12px;
          border-radius: 30px;
        }
        .finance-page-wrapper .tagp {
          background: var(--gold);
          color: #0b1710;
          font-weight: 600;
        }
        .finance-page-wrapper .tags {
          border: 1px solid var(--line);
          opacity: 0.6;
          color: #b0c8b0;
        }
        .finance-page-wrapper .scard-docs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 0;
        }
        .finance-page-wrapper .scard-docs span {
          font-size: 0.62rem;
          opacity: 0.35;
          margin: 2px 10px 2px 0;
          font-family: var(--mono);
          color: #b0c8b0;
        }
        .finance-page-wrapper .scard-docs span::before {
          content: "▸ ";
          color: var(--gold);
        }

        .finance-page-wrapper .pipeline-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 14px;
        }
        .finance-page-wrapper .pnode {
          padding: 18px 18px 20px;
          border: 1px solid var(--line);
          border-radius: var(--radius);
          background: var(--panel);
        }
        .finance-page-wrapper .pnum {
          font-family: var(--mono);
          color: var(--gold);
          font-weight: 700;
          font-size: 0.8rem;
        }
        .finance-page-wrapper .pnode p {
          margin: 0 0 10px;
          font-size: 0.84rem;
          opacity: 0.8;
          color: #d4e0d4;
        }
        .finance-page-wrapper .pnode-bar {
          height: 3px;
          background: var(--line);
          border-radius: 4px;
          overflow: hidden;
        }
        .finance-page-wrapper .pnode-bar span {
          display: block;
          height: 100%;
          width: 100%;
          background: var(--gold);
          box-shadow: 0 0 16px var(--gold);
        }

        .finance-page-wrapper .docwrap {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .finance-page-wrapper .dchip {
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
          color: #d4e0d4;
        }

        .finance-page-wrapper footer {
          padding: 36px 8vw;
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 14px;
          align-items: center;
          background: rgba(11, 23, 16, 0.6);
        }
        .finance-page-wrapper .backlink {
          font-family: var(--mono);
          font-size: 0.78rem;
          color: var(--gold);
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
        <Link className="navlink current" href="/finance-insurance">Finance &amp; Insurance</Link>
        <Link className="navlink" href="/accommodation-relocation">Accommodation &amp; Relocation</Link>
        <Link className="navlink" href="/utility-booking">Utility &amp; Booking</Link>
        <Link className="navlink" href="/lifestyle-concierge">Lifestyle &amp; Concierge</Link>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-media">
          <img
            src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2070&auto=format&fit=crop"
            alt="Finance and insurance concept with coins and documents"
          />
        </div>
        <div className="numlabel">12</div>

        <div className="eyebrow">
          <span className="blink"></span>
          The Ledger Room · 💳
        </div>

        <h1 className="pagetitle">Finance &amp; Insurance</h1>
        <p className="tagline">Insurance, loans and the financial decisions that protect a household.</p>
        <p className="introtext">
          Health, term and motor cover, loan paperwork and the practical guidance people need before they sign. Clear options, real documents, no jargon walls.
        </p>

        <div className="statrow">
          <StatBox val="20" label="Products Compared" />
          <StatBox val="Always" label="Authorised Partners Only" />
          <StatBox val="Built in" label="EMI Calculator" />
          <StatBox val="Automatic" label="Renewal Reminders" />
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
            placeholder="Search within Finance &amp; Insurance…"
          />
        </div>

        {filteredServices.length > 0 ? (
          <div className="sgrid">
            {filteredServices.map((s) => (
              <ServiceCard key={s.id} s={s} />
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', opacity: 0.4, padding: '32px 0', fontFamily: 'serif', color: 'var(--gold)' }}>
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
              💳 {d}
            </span>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <Link className="backlink" href="/">
          ← Back to full ePay Gallery index
        </Link>
        <span style={{ fontSize: '0.68rem', opacity: 0.3, fontFamily: 'monospace', color: '#b0c8b0' }}>
          ePay Gallery · Finance &amp; Insurance Desk · Session-only demo
        </span>
      </footer>
    </div>
  );
}
