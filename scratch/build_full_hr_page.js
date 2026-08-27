const fs = require('fs');

const cssRaw = fs.readFileSync('scratch/hr_styles.css', 'utf8');

const code = `'use client';

import React, { useState, useEffect } from 'react';

const cssContent = ${JSON.stringify(cssRaw)};

// Default Database Generator
function getDefaultDB() {
  return {
    companySettings: {
      companyName: 'HR+ Solutions Pvt Ltd',
      companyLogo: '',
      companyEmail: 'hr@epay.com',
      companyPhone: '+91 98765 43210',
      companyWebsite: 'www.epay.com',
      companyAddress: 'ePay Digital Gallery HQ, Sector 62, Noida, UP, India',
      companyPAN: 'ABCDE1234F',
      companyGST: '09ABCDE1234F1Z5',
      authorizedSignatory: 'Admin User',
      hrName: 'Priya Sharma',
      hrSignature: '',
      companySeal: '',
      offerExpiryDays: 7,
      offerPrefix: 'OFF',
      offerNumberLength: 6
    },
    users: [
      { id: 1, name: 'Admin User', email: 'admin@epay.com', role: 'admin', avatar: 'A' },
      { id: 2, name: 'Priya Sharma', email: 'hr@epay.com', role: 'hr', avatar: 'P' },
      { id: 3, name: 'Emily Chen', email: 'emily@epay.com', role: 'employee', avatar: 'E' },
      { id: 4, name: 'Michael Torres', email: 'michael@epay.com', role: 'employee', avatar: 'M' },
      { id: 5, name: 'Sarah Kim', email: 'sarah@epay.com', role: 'employee', avatar: 'S' },
      { id: 6, name: 'Raj Patel', email: 'raj@epay.com', role: 'employee', avatar: 'R' },
      { id: 7, name: 'Lisa Wong', email: 'lisa@epay.com', role: 'employee', avatar: 'L' }
    ],
    employees: [
      { id: 1, name: 'Emily Chen', email: 'emily@epay.com', department: 'Technology', position: 'Senior Developer', status: 'active', joined: '2023-06-01', phone: '+91 98765 11111', dob: '1992-05-15', gender: 'Female', bloodGroup: 'A+', maritalStatus: 'Single', address: 'Flat 402, Highrise Apts, Noida', city: 'Noida', state: 'UP', country: 'India', pin: '201301', pan: 'ABCDE1234F', aadhaar: '1234 5678 9012', bankName: 'HDFC Bank', accountNumber: '50100012345678', ifsc: 'HDFC0001234', salary: 85000, basic: 42500, hra: 21250, conveyance: 5000, special: 16250, pf: 5100, netSalary: 79900, designation: 'Senior Developer', employeeCode: 'EMP001', role: 'developer' },
      { id: 2, name: 'Michael Torres', email: 'michael@epay.com', department: 'Sales', position: 'Sales Manager', status: 'active', joined: '2022-11-15', phone: '+91 98765 22222', dob: '1988-08-20', gender: 'Male', bloodGroup: 'O+', maritalStatus: 'Married', address: 'Suite 12, Park View, Delhi', city: 'New Delhi', state: 'Delhi', country: 'India', pin: '110001', pan: 'FGHIJ5678K', aadhaar: '5678 9012 3456', bankName: 'ICICI Bank', accountNumber: '000401500123', ifsc: 'ICIC0000004', salary: 75000, basic: 37500, hra: 18750, conveyance: 4000, special: 14750, pf: 4500, netSalary: 70500, designation: 'Sales Manager', employeeCode: 'EMP002', role: 'sales' },
      { id: 3, name: 'Sarah Kim', email: 'sarah@epay.com', department: 'Marketing', position: 'Marketing Lead', status: 'active', joined: '2023-09-10', phone: '+91 98765 33333', dob: '1994-11-25', gender: 'Female', bloodGroup: 'B+', maritalStatus: 'Single', address: 'B-45, Green Park, Delhi', city: 'New Delhi', state: 'Delhi', country: 'India', pin: '110016', pan: 'LMNOP9012Q', aadhaar: '9012 3456 7890', bankName: 'Axis Bank', accountNumber: '9180100123456', ifsc: 'UTIB0000011', salary: 68000, basic: 34000, hra: 17000, conveyance: 4000, special: 13000, pf: 4080, netSalary: 63920, designation: 'Marketing Lead', employeeCode: 'EMP003', role: 'marketing' },
      { id: 4, name: 'Raj Patel', email: 'raj@epay.com', department: 'Sales', position: 'Telecaller Agent', status: 'active', joined: '2024-02-01', phone: '+91 98765 44444', dob: '1996-09-05', gender: 'Male', bloodGroup: 'O-', maritalStatus: 'Single', address: '102 Sector 18, Noida', city: 'Noida', state: 'UP', country: 'India', pin: '201301', pan: 'ABCDE5678F', aadhaar: '5678 1234 9012', bankName: 'SBI', accountNumber: '30001234567', ifsc: 'SBIN0001234', salary: 35000, basic: 17500, hra: 8750, conveyance: 3000, special: 5750, pf: 2100, netSalary: 32900, designation: 'Telecaller Agent', employeeCode: 'EMP004', role: 'telecaller' },
      { id: 5, name: 'Lisa Wong', email: 'lisa@epay.com', department: 'Marketing', position: 'Social Media Specialist', status: 'active', joined: '2023-11-15', phone: '+91 98765 55555', dob: '1995-02-28', gender: 'Female', bloodGroup: 'AB-', maritalStatus: 'Single', address: 'Cyber Hub Residency, Gurugram', city: 'Gurugram', state: 'Haryana', country: 'India', pin: '122002', pan: 'FGHIJ9012K', aadhaar: '9012 5678 3456', bankName: 'Kotak Bank', accountNumber: '6011223344', ifsc: 'KKBK0000123', salary: 45000, basic: 22500, hra: 11250, conveyance: 3500, special: 7750, pf: 2700, netSalary: 42300, designation: 'Social Media Specialist', employeeCode: 'EMP005', role: 'socialmedia' }
    ],
    jobProfiles: [
      { id: 1, name: 'HR', department: 'Human Resources', category: 'HR Operations', designation: 'HR Executive', defaultFullTimeSalary: 35000, defaultInternSalary: 15000, reportingTo: 'HR Manager', status: 'active', jobSummary: 'Manage human resources operations, employee lifecycle, onboarding, and organizational culture.', responsibilities: ['Manage end-to-end employee onboarding, joining formalities, documentation, and employee records.', 'Maintain accurate and updated employee information, attendance, leave, salary, and HR records.', 'Coordinate recruitment activities including candidate screening, interview scheduling, and offer letters.'], requiredSkills: ['HR Management', 'Recruitment', 'Employee Relations', 'Payroll'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of all company, employee, and client information.', terminationClause: 'Either party may terminate employment with 30 days written notice or salary in lieu thereof.' },
      { id: 2, name: 'Admin', department: 'Administration', category: 'Operations', designation: 'Administrative Executive', defaultFullTimeSalary: 30000, defaultInternSalary: 12000, reportingTo: 'Admin Manager', status: 'active', jobSummary: 'Manage office administration, facility requirements, inventory, and vendor management.', responsibilities: ['Manage day-to-day administrative activities and ensure smooth office functioning.', 'Maintain office records, registers, correspondence, and facility maintenance.'], requiredSkills: ['Office Management', 'Vendor Management', 'Record Keeping'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of all company office records.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 3, name: 'Telecaller', department: 'Sales', category: 'Customer Engagement', designation: 'Telecaller / Telemarketing Executive', defaultFullTimeSalary: 25000, defaultInternSalary: 10000, reportingTo: 'Sales Manager', status: 'active', jobSummary: 'Engage with customers via phone to promote digital services, franchise opportunities, and qualify leads.', responsibilities: ['Make outbound calls to prospective leads, franchise applicants, and retail partners.', 'Handle inbound inquiries regarding ePay services, digital gallery models, and commissions.'], requiredSkills: ['Tele-calling', 'Sales Communication', 'Lead Qualification'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Saturday)', weeklyOff: 'Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of all customer leads and call databases.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 4, name: 'BDE', department: 'Sales', category: 'Business Development', designation: 'Business Development Executive', defaultFullTimeSalary: 45000, defaultInternSalary: 18000, reportingTo: 'VP Business Development', status: 'active', jobSummary: 'Drive expansion of ePay Digital Gallery franchises across PAN India regions.', responsibilities: ['Identify and acquire potential franchise partners and merchant nodes.', 'Conduct product presentations, ROI calculator walkthroughs, and agreement closings.'], requiredSkills: ['Franchise Sales', 'B2B Sales', 'Negotiation'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Saturday)', weeklyOff: 'Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of partner contracts.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 5, name: 'Finance', department: 'Finance', category: 'Accounting & Finance', designation: 'Finance Associate', defaultFullTimeSalary: 50000, defaultInternSalary: 20000, reportingTo: 'Finance Head', status: 'active', jobSummary: 'Manage financial accounting, merchant payouts, GST compliance, and invoice verification.', responsibilities: ['Process daily merchant settlements, gateway payouts, and franchise commission disburser.', 'Maintain ledger entries, GST invoices, bank reconciliations, and vendor bills.'], requiredSkills: ['Accounting', 'GST Compliance', 'Tally/ERP'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of financial records and accounts.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 6, name: 'Social Media & Digital Marketing', department: 'Marketing', category: 'Digital Marketing', designation: 'Digital Marketing Specialist', defaultFullTimeSalary: 45000, defaultInternSalary: 18000, reportingTo: 'Marketing Lead', status: 'active', jobSummary: 'Execute digital marketing campaigns, social media branding, and lead generation ads.', responsibilities: ['Design and run Meta & Google Ad campaigns targeting franchise leads.', 'Manage social media handles, post graphics, video reels, and brand updates.'], requiredSkills: ['Social Media Ads', 'Content Strategy', 'SEO'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of marketing assets.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 7, name: 'Android Developer', department: 'Technology', category: 'Development', designation: 'Android Engineer', defaultFullTimeSalary: 70000, defaultInternSalary: 25000, reportingTo: 'CTO', status: 'active', jobSummary: 'Develop and maintain ePay mobile application for Android users and Gallery partners.', responsibilities: ['Design and build advanced ePay mobile applications using Kotlin & Android SDK.', 'Integrate RESTful APIs, AEPS biometric SDKs, and payment gateways.'], requiredSkills: ['Kotlin', 'Android SDK', 'REST APIs'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of application source code.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 8, name: 'Full Stack Developer', department: 'Technology', category: 'Development', designation: 'Full Stack Developer', defaultFullTimeSalary: 85000, defaultInternSalary: 30000, reportingTo: 'Engineering Manager', status: 'active', jobSummary: 'Build and architect web application dashboards, APIs, and microservices.', responsibilities: ['Develop web features using Next.js, React, Node.js, and SQL databases.', 'Implement secure API endpoints, authentication, and CRM module workflows.'], requiredSkills: ['Next.js', 'React', 'Node.js', 'PostgreSQL'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of source code and credentials.', terminationClause: 'Either party may terminate employment with 30 days notice.' },
      { id: 9, name: 'AI/ML Engineer', department: 'Technology', category: 'Development', designation: 'AI / ML Engineer', defaultFullTimeSalary: 95000, defaultInternSalary: 35000, reportingTo: 'Head of AI', status: 'active', jobSummary: 'Build intelligent AI recommendation models, predictive analytics, and automated CRM bots.', responsibilities: ['Develop predictive models for lead scoring, customer churn, and transaction forecasting.', 'Integrate Generative AI & LLM APIs into the ePay CRM platform.'], requiredSkills: ['Python', 'TensorFlow', 'LLMs', 'Scikit-Learn'], probationPeriod: '3 months', noticePeriod: '30 days', workingHours: '9:30 AM – 6:30 PM (Monday–Friday)', weeklyOff: 'Saturday & Sunday', leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.', confidentialityClause: 'You shall maintain strict confidentiality of proprietary algorithms.', terminationClause: 'Either party may terminate employment with 30 days notice.' }
    ],
    offerLetters: [
      { id: 1, offerId: 'OFF-2026-000001', employeeName: 'Rahul Sharma', interviewedDate: '2026-08-10', joiningDate: '2026-08-25', profileId: 8, employmentType: 'Full-Time', salary: 85000, incentive: 'No Incentive', incentiveType: 'No Incentive', incentiveRaw: 0, status: 'draft', offerDate: '2026-08-12', offerExpiry: '2026-08-19', approvedBy: '', approvedAt: '' },
      { id: 2, offerId: 'OFF-2026-000002', employeeName: 'Priya Menon', interviewedDate: '2026-08-11', joiningDate: '2026-09-01', profileId: 1, employmentType: 'Full-Time', salary: 35000, incentive: '₹5,000', incentiveType: 'Fixed', incentiveRaw: 5000, status: 'approved', offerDate: '2026-08-13', offerExpiry: '2026-08-20', approvedBy: 'Admin User', approvedAt: '2026-08-14' },
      { id: 3, offerId: 'OFF-2026-000003', employeeName: 'Arjun Nair', interviewedDate: '2026-08-14', joiningDate: '2026-08-28', profileId: 7, employmentType: 'Intern', salary: 25000, incentive: 'No Incentive', incentiveType: 'No Incentive', incentiveRaw: 0, status: 'accepted', offerDate: '2026-08-15', offerExpiry: '2026-08-22', approvedBy: 'Priya Sharma', approvedAt: '2026-08-15' }
    ],
    leaves: [
      { id: 1, employeeId: 1, type: 'Casual Leave', startDate: '2026-08-10', endDate: '2026-08-12', totalDays: 3, reason: 'Family function in hometown', status: 'approved', appliedDate: '2026-08-01', approvedBy: 'Priya Sharma' },
      { id: 2, employeeId: 2, type: 'Sick Leave', startDate: '2026-08-18', endDate: '2026-08-19', totalDays: 2, reason: 'Viral fever and doctor consultation', status: 'pending', appliedDate: '2026-08-18', approvedBy: '' }
    ],
    attendance: [
      { id: 1, employeeId: 1, date: '2026-08-22', checkIn: '09:15 AM', checkOut: '06:30 PM', totalHours: '9.2 hrs', status: 'present', shift: 'Morning' },
      { id: 2, employeeId: 2, date: '2026-08-22', checkIn: '09:25 AM', checkOut: '06:30 PM', totalHours: '9.0 hrs', status: 'present', shift: 'Morning' },
      { id: 3, employeeId: 3, date: '2026-08-22', checkIn: '09:00 AM', checkOut: '06:15 PM', totalHours: '9.25 hrs', status: 'present', shift: 'Morning' },
      { id: 4, employeeId: 4, date: '2026-08-22', checkIn: '09:45 AM', checkOut: '06:45 PM', totalHours: '9.0 hrs', status: 'late', shift: 'Morning' },
      { id: 5, employeeId: 5, date: '2026-08-22', checkIn: '—', checkOut: '—', totalHours: '0 hrs', status: 'leave', shift: 'Morning' }
    ],
    requisitions: [
      { id: 1, department: 'Technology', position: 'Senior React Developer', vacancies: 2, hiringManager: 'Admin User', recruiter: 'Priya Sharma', experience: '4-6 years', qualification: 'B.Tech / MCA', skills: 'React, Next.js, Node.js', salaryRange: '₹80,000 - ₹1,20,000', employmentType: 'Full Time', location: 'Noida', status: 'open' },
      { id: 2, department: 'Sales', position: 'Franchise Sales Executive', vacancies: 4, hiringManager: 'Michael Torres', recruiter: 'Priya Sharma', experience: '2-4 years', qualification: 'Any Graduate', skills: 'Franchise Sales, Negotiation', salaryRange: '₹35,000 - ₹50,000', employmentType: 'Full Time', location: 'Delhi NCR', status: 'interviewing' }
    ],
    candidates: [
      { id: 1, name: 'Vikram Singh', mobile: '+91 98765 88888', email: 'vikram@gmail.com', location: 'Delhi', qualification: 'M.Tech', experience: '5 years', currentCompany: 'TechSoft', currentSalary: 80000, expectedSalary: 105000, noticePeriod: '30 days', skills: 'React, TypeScript, Node', status: 'interviewed', score: 88 },
      { id: 2, name: 'Ananya Verma', mobile: '+91 98765 99999', email: 'ananya@gmail.com', location: 'Noida', qualification: 'MBA Sales', experience: '3 years', currentCompany: 'DigitalCorp', currentSalary: 40000, expectedSalary: 52000, noticePeriod: '15 days', skills: 'B2B Sales, Lead Conversion', status: 'shortlisted', score: 82 }
    ],
    interviews: [
      { id: 1, candidateId: 1, candidateName: 'Vikram Singh', position: 'Senior React Developer', round: 'Technical Round 1', interviewer: 'Emily Chen', date: '2026-08-20', time: '02:00 PM', technicalScore: 9, communicationScore: 8, overallScore: 8.8, recommendation: 'Proceed to HR', status: 'completed' }
    ],
    onboarding: [
      { id: 1, candidateId: 1, candidateName: 'Vikram Singh', position: 'Senior React Developer', joiningDate: '2026-09-01', joiningLocation: 'Noida HQ', reportingManager: 'Emily Chen', completion: 65, status: 'in-progress' }
    ],
    documents: [
      { id: 1, title: 'Employee Code of Conduct Policy 2026', category: 'Policy', format: 'PDF', size: '2.4 MB', updated: '2026-08-01', status: 'active' },
      { id: 2, title: 'POSH & Workplace Safety Guidelines', category: 'Compliance', format: 'PDF', size: '1.8 MB', updated: '2026-08-05', status: 'active' },
      { id: 3, title: 'Standard Employment Agreement Template', category: 'Legal', format: 'DOCX', size: '450 KB', updated: '2026-08-10', status: 'active' }
    ],
    assets: [
      { id: 1, employeeId: 1, assetType: 'Laptop', assetName: 'MacBook Pro M2 16"', serialNumber: 'C02GX999MD6M', assetTag: 'AST-001', purchaseDate: '2023-06-01', cost: 195000, assignedDate: '2023-06-01', condition: 'Excellent', status: 'assigned' },
      { id: 2, employeeId: 2, assetType: 'Phone', assetName: 'Samsung Galaxy S23', serialNumber: 'R58M900XYZ', assetTag: 'AST-002', purchaseDate: '2023-11-15', cost: 65000, assignedDate: '2023-11-15', condition: 'Good', status: 'assigned' }
    ],
    expenses: [
      { id: 1, employeeId: 2, category: 'Travel & Client Visit', expenseDate: '2026-08-15', amount: 4500, purpose: 'Client meeting & Franchise Gallery inspection in Jaipur', status: 'approved', approvedBy: 'Priya Sharma' }
    ],
    grievances: [
      { id: 1, employeeId: 4, category: 'Workplace & Equipment', description: 'Headset mic volume low during customer telecalling calls.', date: '2026-08-16', priority: 'Medium', assignedHR: 'Priya Sharma', status: 'in-progress' }
    ],
    shifts: [
      { id: 1, name: 'Morning General Shift', startTime: '09:30 AM', endTime: '06:30 PM', gracePeriod: '15 mins', weeklyOff: 'Sunday', allowance: 0, status: 'active' },
      { id: 2, name: 'Night Operations Shift', startTime: '10:00 PM', endTime: '06:00 AM', gracePeriod: '15 mins', weeklyOff: 'Monday', allowance: 5000, status: 'active' }
    ],
    timeEvents: [
      { id: 1, employeeId: 1, type: 'CHECK_IN', timestamp: '2026-08-22 09:15:12', location: 'Noida HQ (Geofenced)', device: 'Web/Chrome', status: 'verified' },
      { id: 2, employeeId: 2, type: 'CHECK_IN', timestamp: '2026-08-22 09:25:04', location: 'Noida HQ (Geofenced)', device: 'Mobile/Android', status: 'verified' }
    ],
    breaks: [
      { id: 1, employeeId: 1, breakType: 'Tea Break', startTime: '11:15 AM', endTime: '11:30 AM', duration: '15 mins', allowed: '15 mins', status: 'normal' },
      { id: 2, employeeId: 2, breakType: 'Lunch Break', startTime: '01:30 PM', endTime: '02:15 PM', duration: '45 mins', allowed: '45 mins', status: 'normal' }
    ],
    fieldSessions: [
      { id: 1, employeeId: 2, date: '2026-08-21', startLoc: 'Noida HQ', endLoc: 'Jaipur Gallery Node', distanceKm: 280, visitCount: 4, status: 'approved' }
    ],
    overtimeRequests: [
      { id: 1, employeeId: 1, date: '2026-08-20', regularHrs: 9, extraHrs: 2.5, reason: 'Sprint release deployment', status: 'approved', rate: 450 }
    ],
    geofences: [
      { id: 1, name: 'Noida HQ Campus', lat: 28.6273, lng: 77.3725, radius: 150, locationType: 'Head Office', status: 'active' },
      { id: 2, name: 'Delhi Regional Office', lat: 28.6139, lng: 77.2090, radius: 100, locationType: 'Branch Office', status: 'active' }
    ],
    kpiTemplates: [
      { id: 1, role: 'telecaller', metric: 'Daily Calls Made', target: 100, weightage: '30%', score: 88 },
      { id: 2, role: 'developer', metric: 'Sprint Tickets Delivered', target: 15, weightage: '40%', score: 95 }
    ],
    appraisals: [
      { id: 1, employeeId: 1, cycle: 'FY 2025-26 Q1', rating: 4.8, grade: 'A+', managerComments: 'Outstanding execution and code quality.', recommendation: '15% Salary Increment', status: 'approved' }
    ],
    incentives: [
      { id: 1, employeeId: 2, plan: 'Q1 Franchise Acquisition Bonus', target: 10, achieved: 12, pct: '120%', amount: 15000, status: 'paid', paymentDate: '2026-08-05' }
    ],
    promotions: [
      { id: 1, employeeId: 1, currentDesignation: 'Senior Developer', proposedDesignation: 'Lead Architect', readiness: 'Ready Now', score: 4.8, status: 'approved' }
    ],
    pips: [
      { id: 1, employeeId: 4, manager: 'Michael Torres', startDate: '2026-08-01', endDate: '2026-09-30', issue: 'Outbound call conversion below target', target: 'Achieve 20 conversions/week', progress: '65%', status: 'in-progress' }
    ],
    helpdeskTickets: [
      { id: 1, employeeId: 3, category: 'Payroll & Allowance', subject: 'Tax Deduction clarification for HRA component', priority: 'Medium', status: 'open', assignedTo: 'Priya Sharma' }
    ],
    announcements: [
      { id: 1, title: 'Q3 All-Hands Townhall Meeting', category: 'Company Event', publishDate: '2026-08-20', priority: 'High', message: 'Join us live on Aug 28 for Q3 milestones & award ceremony.', status: 'active' }
    ],
    trainings: [
      { id: 1, employeeId: 1, course: 'Advanced Next.js App Router & Server Actions', provider: 'Vercel Academy', duration: '20 Hours', score: '96%', status: 'completed', certCode: 'NX-2026-99' }
    ],
    rules: [
      { id: 1, ruleName: 'Auto Probation Confirmation', trigger: 'Probation Days >= 90', action: 'Generate Confirmation Letter', status: 'active' }
    ],
    exceptions: [
      { id: 1, type: 'Attendance', description: 'Check-out missing for Michael Torres on Aug 21', priority: 'High', status: 'open' }
    ],
    auditLogs: [
      { id: 1, timestamp: '2026-08-22 09:15:12', user: 'Priya Sharma', action: 'LOGIN', module: 'Authentication', reference: 'hr@epay.com' },
      { id: 2, timestamp: '2026-08-22 10:30:45', user: 'Admin User', action: 'OFFER_APPROVED', module: 'Offer Letters', reference: 'OFF-2026-000002' }
    ],
    nextId: { employee: 6, jobProfile: 10, offerLetter: 4, leave: 3, candidate: 3, requisition: 3, asset: 3, expense: 2, grievance: 2, shift: 3, rule: 2 }
  };
}

export default function HRPage() {
  const [db, setDb] = useState(getDefaultDB());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToast, setActiveToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedEmp360Id, setSelectedEmp360Id] = useState(1);
  const [mounted, setMounted] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('crm_hr_erp_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        const def = getDefaultDB();
        setDb({ ...def, ...parsed });
      }
    } catch (e) {
      console.error('Error loading DB', e);
    }
  }, []);

  // Save DB helper
  const saveDb = (updated) => {
    setDb(updated);
    try {
      localStorage.setItem('crm_hr_erp_data', JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving DB', e);
    }
  };

  const showToast = (message, type = 'success') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 4000);
  };

  // ALL 40 NAV SIDEBAR ITEMS EXACTLY MATCHING USER SCREENSHOT
  const navSections = [
    {
      group: 'COMMAND CENTER',
      items: [
        { id: 'dashboard', label: 'HR Dashboard', icon: 'fa-chart-pie' },
        { id: 'ai', label: 'AI Command Center', icon: 'fa-robot' },
        { id: 'controlCenter', label: 'HR Control Center', icon: 'fa-tachometer-alt' },
        { id: 'automation', label: 'HR Automation', icon: 'fa-cogs' }
      ]
    },
    {
      group: 'EMPLOYEE',
      items: [
        { id: 'employees', label: 'Employee Master', icon: 'fa-users' },
        { id: 'employee360', label: 'Employee 360°', icon: 'fa-user-circle' },
        { id: 'documents', label: 'Documents', icon: 'fa-file-alt' },
        { id: 'assets', label: 'Asset Assignment', icon: 'fa-laptop' },
        { id: 'expenses', label: 'Employee Expenses', icon: 'fa-receipt' }
      ]
    },
    {
      group: 'TIME & ATTENDANCE',
      items: [
        { id: 'attendance', label: 'Time Dashboard', icon: 'fa-calendar-check' },
        { id: 'timeEvents', label: 'Time Event Ledger', icon: 'fa-stream' },
        { id: 'breaks', label: 'Break Management', icon: 'fa-coffee' },
        { id: 'fieldTime', label: 'Field & Travel', icon: 'fa-map-marker-alt' },
        { id: 'overtime', label: 'Overtime Engine', icon: 'fa-hourglass-half' },
        { id: 'timesheet', label: 'Timesheets', icon: 'fa-table' },
        { id: 'timeExceptions', label: 'Time Exceptions', icon: 'fa-exclamation-circle' },
        { id: 'geofences', label: 'Geofences', icon: 'fa-draw-polygon' },
        { id: 'timeSettings', label: 'Time Policies', icon: 'fa-sliders-h' },
        { id: 'shifts', label: 'Shift Management', icon: 'fa-clock' },
        { id: 'leaves', label: 'Leave Management', icon: 'fa-umbrella-beach' }
      ]
    },
    {
      group: 'RECRUITMENT',
      items: [
        { id: 'requisitions', label: 'Job Requisitions', icon: 'fa-briefcase' },
        { id: 'candidates', label: 'Candidate Master', icon: 'fa-user-plus' },
        { id: 'interviews', label: 'Interview Management', icon: 'fa-comments' },
        { id: 'onboarding', label: 'Onboarding', icon: 'fa-rocket' }
      ]
    },
    {
      group: 'PERFORMANCE',
      items: [
        { id: 'kpi', label: 'KPI / Performance', icon: 'fa-chart-line' },
        { id: 'appraisal', label: 'Appraisal', icon: 'fa-arrow-trend-up' },
        { id: 'incentives', label: 'Incentive Management', icon: 'fa-coins' },
        { id: 'promotions', label: 'Promotion & Career', icon: 'fa-arrow-up' },
        { id: 'pip', label: 'PIP', icon: 'fa-triangle-exclamation' }
      ]
    },
    {
      group: 'HR OPERATIONS',
      items: [
        { id: 'grievances', label: 'Grievance', icon: 'fa-scale-balanced' },
        { id: 'exit', label: 'Exit Management', icon: 'fa-sign-out-alt' },
        { id: 'helpdesk', label: 'HR Help Desk', icon: 'fa-headset' },
        { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' }
      ]
    },
    {
      group: 'OFFER LETTERS',
      items: [
        { id: 'jobProfiles', label: 'Job Profiles', icon: 'fa-briefcase' },
        { id: 'offerLetters', label: 'Offer Letters', icon: 'fa-file-signature' }
      ]
    },
    {
      group: 'AUTOMATION & GOVERNANCE',
      items: [
        { id: 'ruleBuilder', label: 'Rule Builder', icon: 'fa-project-diagram' },
        { id: 'exceptions', label: 'Exception Queue', icon: 'fa-exclamation-triangle' },
        { id: 'audit', label: 'HR Audit', icon: 'fa-history' }
      ]
    },
    {
      group: 'LEARNING',
      items: [
        { id: 'trainings', label: 'Training & Development', icon: 'fa-graduation-cap' }
      ]
    },
    {
      group: 'REPORTS',
      items: [
        { id: 'reports', label: 'Report Engine', icon: 'fa-file-pdf' }
      ]
    }
  ];

  const getBadgeCount = (id) => {
    if (id === 'employees') return db.employees?.length || 0;
    if (id === 'leaves') return db.leaves?.filter(l => l.status === 'pending').length || 0;
    if (id === 'offerLetters') return db.offerLetters?.filter(o => o.status === 'draft').length || 0;
    if (id === 'requisitions') return db.requisitions?.filter(r => r.status === 'open').length || 0;
    if (id === 'candidates') return db.candidates?.length || 0;
    if (id === 'grievances') return db.grievances?.filter(g => g.status === 'in-progress').length || 0;
    if (id === 'helpdesk') return db.helpdeskTickets?.filter(t => t.status === 'open').length || 0;
    if (id === 'attendance') return db.attendance?.filter(a => a.status === 'present').length || 0;
    return 0;
  };

  // ACTION HANDLERS
  const handleOnboardEmployee = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const department = fd.get('department');
    const position = fd.get('position');
    const salary = parseFloat(fd.get('salary')) || 35000;

    const newEmp = {
      id: db.nextId.employee++,
      name,
      email,
      department,
      position,
      status: 'active',
      joined: new Date().toISOString().slice(0, 10),
      phone: fd.get('phone') || '+91 98765 00000',
      pan: fd.get('pan') || 'ABCDE1234F',
      aadhaar: fd.get('aadhaar') || '1234 5678 9012',
      bankName: fd.get('bankName') || 'HDFC Bank',
      accountNumber: fd.get('accountNumber') || '50100099999',
      ifsc: fd.get('ifsc') || 'HDFC0001234',
      salary,
      basic: salary * 0.5,
      hra: salary * 0.25,
      conveyance: 3000,
      special: salary * 0.25 - 3000,
      pf: salary * 0.06,
      netSalary: salary * 0.94,
      designation: position,
      employeeCode: 'EMP' + String(db.nextId.employee).padStart(3, '0'),
      role: 'staff'
    };

    saveDb({ ...db, employees: [...db.employees, newEmp] });
    setActiveModal(null);
    showToast('Employee ' + name + ' onboarded successfully!', 'success');
  };

  const handleCreateOffer = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const employeeName = fd.get('employeeName');
    const interviewedDate = fd.get('interviewedDate');
    const joiningDate = fd.get('joiningDate');
    const profileId = parseInt(fd.get('profileId'));
    const employmentType = fd.get('employmentType');
    const incentiveType = fd.get('incentiveType');
    const incentiveVal = fd.get('incentiveVal');

    const prof = db.jobProfiles.find(p => p.id === profileId);
    if (!prof) return alert('Profile not found');

    const salary = employmentType === 'Intern' ? prof.defaultInternSalary : prof.defaultFullTimeSalary;
    let incentive = 'No Incentive';
    if (incentiveType === 'Fixed' && incentiveVal) incentive = '₹' + parseFloat(incentiveVal).toLocaleString();
    else if (incentiveType === 'Percentage' && incentiveVal) incentive = incentiveVal + '%';

    const offerId = db.companySettings.offerPrefix + '-2026-' + String(db.nextId.offerLetter++).padStart(6, '0');

    const newOffer = {
      id: db.nextId.offerLetter,
      offerId,
      employeeName,
      interviewedDate,
      joiningDate,
      profileId,
      employmentType,
      salary,
      incentive,
      incentiveType,
      incentiveRaw: parseFloat(incentiveVal) || 0,
      status: 'draft',
      offerDate: new Date().toISOString().slice(0, 10),
      offerExpiry: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10),
      approvedBy: '',
      approvedAt: ''
    };

    saveDb({ ...db, offerLetters: [...db.offerLetters, newOffer] });
    setActiveModal(null);
    showToast('Offer letter ' + offerId + ' created!', 'success');
    openPreviewOfferModal(newOffer, prof);
  };

  const openPreviewOfferModal = (offer, prof) => {
    setModalData({ offer, prof });
    setActiveModal('preview_offer');
  };

  const handleApplyLeave = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const type = fd.get('type');
    const startDate = fd.get('startDate');
    const endDate = fd.get('endDate');
    const reason = fd.get('reason');

    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diff = Math.max(1, Math.ceil((d2 - d1) / (1000 * 3600 * 24)) + 1);

    const newLeave = {
      id: db.nextId.leave++,
      employeeId: empId,
      type,
      startDate,
      endDate,
      totalDays: diff,
      reason,
      status: 'pending',
      appliedDate: new Date().toISOString().slice(0, 10),
      approvedBy: ''
    };

    saveDb({ ...db, leaves: [...db.leaves, newLeave] });
    setActiveModal(null);
    showToast('Leave request submitted!', 'success');
  };

  const handleAddJobProfile = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const department = fd.get('department');
    const designation = fd.get('designation');
    const defaultFullTimeSalary = parseFloat(fd.get('defaultFullTimeSalary')) || 30000;
    const defaultInternSalary = parseFloat(fd.get('defaultInternSalary')) || 12000;
    const summary = fd.get('jobSummary');

    const newProfile = {
      id: db.nextId.jobProfile++,
      name,
      department,
      category: department,
      designation,
      defaultFullTimeSalary,
      defaultInternSalary,
      reportingTo: 'Department Manager',
      status: 'active',
      jobSummary: summary || 'Standard job profile summary.',
      responsibilities: ['Manage core department deliverables.'],
      requiredSkills: ['Communication', 'Domain Knowledge', 'Problem Solving'],
      probationPeriod: '3 months',
      noticePeriod: '30 days',
      workingHours: '9:30 AM – 6:30 PM (Monday–Friday)',
      weeklyOff: 'Saturday & Sunday',
      leavePolicy: '12 Casual Leave, 10 Sick Leave, 15 Earned Leave per year.',
      confidentialityClause: 'You shall maintain strict confidentiality of all company assets and data.',
      terminationClause: 'Either party may terminate employment with 30 days notice.'
    };

    saveDb({ ...db, jobProfiles: [...db.jobProfiles, newProfile] });
    setActiveModal(null);
    showToast('Job profile "' + name + '" created!', 'success');
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const mobile = fd.get('mobile');
    const experience = fd.get('experience');
    const skills = fd.get('skills');

    const newCand = {
      id: db.nextId.candidate++,
      name,
      email,
      mobile,
      location: 'Noida / Delhi',
      qualification: 'Graduate',
      experience,
      currentCompany: 'Tech Corp',
      currentSalary: 45000,
      expectedSalary: 60000,
      noticePeriod: '30 days',
      skills,
      status: 'shortlisted',
      score: 85
    };

    saveDb({ ...db, candidates: [...db.candidates, newCand] });
    setActiveModal(null);
    showToast('Candidate ' + name + ' added to pipeline!', 'success');
  };

  const handleAddRequisition = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const position = fd.get('position');
    const department = fd.get('department');
    const vacancies = parseInt(fd.get('vacancies')) || 1;
    const salaryRange = fd.get('salaryRange');

    const newReq = {
      id: db.nextId.requisition++,
      department,
      position,
      vacancies,
      hiringManager: 'Priya Sharma',
      recruiter: 'HR Team',
      experience: '2-5 years',
      qualification: 'Graduate',
      skills: 'Domain Skills',
      salaryRange,
      employmentType: 'Full Time',
      location: 'Noida HQ',
      status: 'open'
    };

    saveDb({ ...db, requisitions: [...db.requisitions, newReq] });
    setActiveModal(null);
    showToast('Requisition for ' + position + ' created!', 'success');
  };

  const handleAssignAsset = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const assetType = fd.get('assetType');
    const assetName = fd.get('assetName');
    const tag = fd.get('assetTag');

    const newAsset = {
      id: db.nextId.asset++,
      employeeId: empId,
      assetType,
      assetName,
      serialNumber: 'SN-' + Math.floor(Math.random() * 100000),
      assetTag: tag || ('AST-' + db.nextId.asset),
      purchaseDate: newDateStr(),
      cost: 55000,
      assignedDate: newDateStr(),
      condition: 'Excellent',
      status: 'assigned'
    };

    saveDb({ ...db, assets: [...db.assets, newAsset] });
    setActiveModal(null);
    showToast('Asset assigned to staff member!', 'success');
  };

  const handleLogGrievance = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const category = fd.get('category');
    const desc = fd.get('description');

    const newG = {
      id: db.nextId.grievance++,
      employeeId: empId,
      category,
      description: desc,
      date: newDateStr(),
      priority: 'High',
      assignedHR: 'Priya Sharma',
      status: 'in-progress'
    };

    saveDb({ ...db, grievances: [...db.grievances, newG] });
    setActiveModal(null);
    showToast('Grievance ticket logged!', 'success');
  };

  const handleUpdateOfferStatus = (offerId, newStatus) => {
    const updatedOffers = db.offerLetters.map(o => {
      if (o.id === offerId) {
        return {
          ...o,
          status: newStatus,
          approvedBy: newStatus === 'approved' ? 'Priya Sharma (HR)' : o.approvedBy,
          approvedAt: newStatus === 'approved' ? newDateStr() : o.approvedAt
        };
      }
      return o;
    });
    saveDb({ ...db, offerLetters: updatedOffers });
    showToast('Offer status updated to ' + newStatus + '!', 'success');
    if (modalData && modalData.offer && modalData.offer.id === offerId) {
      setModalData({ ...modalData, offer: { ...modalData.offer, status: newStatus } });
    }
  };

  const handleUpdateLeaveStatus = (leaveId, newStatus) => {
    const updated = db.leaves.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: newStatus, approvedBy: 'Priya Sharma (HR)' };
      }
      return l;
    });
    saveDb({ ...db, leaves: updated });
    showToast('Leave request ' + newStatus + '!', 'success');
  };

  const handleClockInOut = (employeeId) => {
    const today = new Date().toISOString().slice(0, 10);
    const empAtt = db.attendance.find(a => a.employeeId === employeeId && a.date === today);
    if (!empAtt) {
      const newAtt = {
        id: db.attendance.length + 1,
        employeeId,
        date: today,
        checkIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        checkOut: '—',
        totalHours: 'In Progress',
        status: 'present',
        shift: 'Morning'
      };
      saveDb({ ...db, attendance: [...db.attendance, newAtt] });
      showToast('Clocked in successfully!', 'success');
    } else if (empAtt.checkOut === '—') {
      const updated = db.attendance.map(a => {
        if (a.id === empAtt.id) {
          return {
            ...a,
            checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            totalHours: '8.5 hrs'
          };
        }
        return a;
      });
      saveDb({ ...db, attendance: updated });
      showToast('Clocked out successfully!', 'success');
    } else {
      showToast('Already completed attendance for today!', 'info');
    }
  };

  const newDateStr = () => new Date().toISOString().slice(0, 10);

  // Filtered Lists
  const filteredEmployees = db.employees.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style dangerouslySetInnerHTML={{ __html: cssContent }} />

      {/* --- SIDEBAR --- */}
      <aside id="sidebar" className={sidebarOpen ? 'open' : ''}>
        <div className="brand">
          <i className="fas fa-cubes"></i>
          <span>HR<span style={{ color: '#6ee7b7' }}>+</span></span>
          <small>v4.0</small>
        </div>
        <nav id="sidebarNav" style={{ flex: 1, overflowY: 'auto', padding: '6px 0 16px' }}>
          {navSections.map((sec, idx) => (
            <React.Fragment key={idx}>
              <div className="nav-section">{sec.group}</div>
              {sec.items.map(item => {
                const badge = getBadgeCount(item.id);
                return (
                  <div
                    key={item.id}
                    className={'nav-item ' + (currentPage === item.id ? 'active' : '')}
                    onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
                  >
                    <i className={'fas ' + item.icon}></i>
                    <span>{item.label}</span>
                    {badge > 0 && <span className="badge">{badge}</span>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">P</div>
          <div className="info">
            <div className="name">Priya Sharma</div>
            <div className="role">HR Manager</div>
          </div>
          <button className="logout-btn" title="Session Active"><i className="fas fa-power-off"></i></button>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <div id="main">
        <header id="header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="page-title">
            <i className="fas fa-building" style={{ color: '#059669', marginRight: 6 }}></i>
            <span>{currentPage.toUpperCase()} Portal</span>
            <small style={{ marginLeft: 8, color: '#6b7280', fontSize: 13 }}>Enterprise HR ERP</small>
          </div>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search staff, profiles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="btn btn-sm btn-primary" onClick={() => setActiveModal('onboard_employee')}>
              <i className="fas fa-user-plus"></i> Onboard Staff
            </button>
            <button className="btn btn-sm btn-success" onClick={() => setActiveModal('create_offer')}>
              <i className="fas fa-file-signature"></i> Create Offer
            </button>
          </div>
        </header>

        <div id="pageContent">
          {/* TOAST */}
          {activeToast && (
            <div className={'toast ' + activeToast.type} style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}>
              <i className="fas fa-check-circle"></i>
              <span>{activeToast.message}</span>
            </div>
          )}

          {/* ========================================================== */}
          {/* 40 INDIVIDUAL FEATURE VIEWS FOR EVERY SINGLE SIDEBAR ITEM */}
          {/* ========================================================== */}

          {/* 1. DASHBOARD */}
          {currentPage === 'dashboard' && (
            <div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label"><i className="fas fa-users"></i> Total Headcount</div>
                  <div className="value">{db.employees.length}</div>
                  <span className="change up">Active Workforce</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-user-check"></i> Today's Attendance</div>
                  <div className="value">96.4%</div>
                  <span className="change up">4 Present Today</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-briefcase"></i> Open Requisitions</div>
                  <div className="value">{db.requisitions.filter(r => r.status === 'open').length}</div>
                  <span className="change neutral">Active Hiring</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-file-signature"></i> Offer Letters</div>
                  <div className="value">{db.offerLetters.length}</div>
                  <span className="change up">{db.offerLetters.filter(o => o.status === 'approved' || o.status === 'accepted').length} Approved</span>
                </div>
              </div>

              <div className="ai-insight">
                <i className="fas fa-robot"></i>
                <div className="content">
                  <div className="title">AI HR ANALYTICS & INSIGHT</div>
                  <div className="message">
                    All {db.jobProfiles.length} Backend Job Profiles are active. Salary benchmarking shows 100% policy compliance. Next payroll disburser ready for {db.employees.length} staff.
                  </div>
                </div>
                <span className="badge-ai">LIVE REALTIME</span>
              </div>

              <div className="section-header">
                <h2><i className="fas fa-users"></i> Employee Roster Overview</h2>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" onClick={() => setActiveModal('onboard_employee')}>
                    <i className="fas fa-plus"></i> Onboard New Staff
                  </button>
                  <button className="btn btn-outline" onClick={() => handleClockInOut(1)}>
                    <i className="fas fa-clock"></i> Quick Clock In/Out
                  </button>
                </div>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Monthly Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id}>
                          <td><strong>{emp.employeeCode}</strong></td>
                          <td>
                            <div className="cell-flex">
                              <div className="avatar-sm green">{emp.name[0]}</div>
                              <div>
                                <strong>{emp.name}</strong>
                                <div className="text-xs text-muted">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td><span style={{ fontWeight: 600, color: '#059669' }}>₹{emp.salary?.toLocaleString()}</span></td>
                          <td><span className="status-badge active">{emp.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => { setSelectedEmp360Id(emp.id); setCurrentPage('employee360'); }}>
                              <i className="fas fa-eye"></i> 360° View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. AI COMMAND CENTER */}
          {currentPage === 'ai' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-robot"></i> AI Command Center</h2>
                <button className="btn btn-primary" onClick={() => showToast('AI Predictive Analytics scan complete!', 'success')}>
                  <i className="fas fa-sync"></i> Run AI Attrition Scan
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label"><i className="fas fa-shield-halved"></i> Attrition Risk</div>
                  <div className="value" style={{ color: '#059669' }}>Low (2.1%)</div>
                  <span className="change up">97.9% Retention Rate</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-brain"></i> Candidate Match AI</div>
                  <div className="value">94.8%</div>
                  <span className="change up">Optimal Fit Found</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-award"></i> Performance Score AI</div>
                  <div className="value">4.6 / 5.0</div>
                  <span className="change up">High Output</span>
                </div>
              </div>

              <div className="ai-insight">
                <i className="fas fa-sparkles"></i>
                <div className="content">
                  <div className="title">AI PREDICTIVE RECOMMENDATION ENGINE</div>
                  <div className="message">
                    AI detected zero high-risk attrition candidates this month. Top recommended candidate match for Senior React Developer: Vikram Singh (Score 88%).
                  </div>
                </div>
                <span className="badge-ai">AI ACTIVE</span>
              </div>
            </div>
          )}

          {/* 3. HR CONTROL CENTER */}
          {currentPage === 'controlCenter' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-tachometer-alt"></i> HR Control Center</h2>
                <button className="btn btn-warning" onClick={() => showToast('Emergency System Broadcast Sent', 'warning')}>
                  <i className="fas fa-bullhorn"></i> System Broadcast
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label"><i className="fas fa-server"></i> System Status</div>
                  <div className="value" style={{ color: '#059669' }}>Operational</div>
                  <span className="change up">100% Uptime</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-key"></i> Active Sessions</div>
                  <div className="value">{db.users.length} Active</div>
                  <span className="change neutral">Admin & HR Logged In</span>
                </div>
                <div className="stat-card">
                  <div className="label"><i className="fas fa-database"></i> Storage Synced</div>
                  <div className="value">Local & Cloud</div>
                  <span className="change up">Encrypted</span>
                </div>
              </div>
            </div>
          )}

          {/* 4. HR AUTOMATION */}
          {currentPage === 'automation' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-cogs"></i> HR Automation & Triggers</h2>
                <button className="btn btn-primary" onClick={() => showToast('New Automation Rule Registered', 'success')}>
                  <i className="fas fa-plus"></i> Add Automation Rule
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Rule ID</th>
                        <th>Trigger Event</th>
                        <th>Automated Action</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.rules.map(r => (
                        <tr key={r.id}>
                          <td><strong>RULE-00{r.id}</strong></td>
                          <td>{r.trigger}</td>
                          <td>{r.action}</td>
                          <td><span className="status-badge active">{r.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-outline" onClick={() => showToast('Rule triggered manually', 'info')}>
                              Run Now
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. EMPLOYEE MASTER */}
          {currentPage === 'employees' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-users"></i> Employee Master Directory</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('onboard_employee')}>
                  <i className="fas fa-user-plus"></i> Onboard Employee
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Phone</th>
                        <th>Salary</th>
                        <th>Joined</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map(emp => (
                        <tr key={emp.id}>
                          <td><strong>{emp.employeeCode}</strong></td>
                          <td>
                            <div className="cell-flex">
                              <div className="avatar-sm green">{emp.name[0]}</div>
                              <div>
                                <strong>{emp.name}</strong>
                                <div className="text-xs text-muted">{emp.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td>{emp.phone}</td>
                          <td><span style={{ fontWeight: 600, color: '#059669' }}>₹{emp.salary?.toLocaleString()}</span></td>
                          <td>{emp.joined}</td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => { setSelectedEmp360Id(emp.id); setCurrentPage('employee360'); }}>
                              <i className="fas fa-id-card"></i> View Profile
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. EMPLOYEE 360 */}
          {currentPage === 'employee360' && (() => {
            const emp = db.employees.find(e => e.id === selectedEmp360Id) || db.employees[0];
            return (
              <div>
                <div className="section-header">
                  <h2><i className="fas fa-user-circle"></i> Employee 360° — {emp.name}</h2>
                  <button className="btn btn-outline" onClick={() => setCurrentPage('employees')}>
                    <i className="fas fa-arrow-left"></i> Back to Roster
                  </button>
                </div>

                <div className="offer-preview">
                  <div className="header">
                    <div className="logo"><i className="fas fa-user-shield"></i> {emp.name[0]}</div>
                    <div className="company-info">
                      <h3>{emp.name}</h3>
                      <div><strong>Emp Code:</strong> {emp.employeeCode} | <strong>Designation:</strong> {emp.position}</div>
                      <div><strong>Department:</strong> {emp.department} | <strong>Email:</strong> {emp.email}</div>
                    </div>
                  </div>

                  <div className="section">
                    <h4>Personal & Contact Information</h4>
                    <div className="row"><div className="label">Phone:</div><div className="value">{emp.phone}</div></div>
                    <div className="row"><div className="label">Address:</div><div className="value">{emp.address}, {emp.city}, {emp.state} ({emp.pin})</div></div>
                    <div className="row"><div className="label">Date of Birth:</div><div className="value">{emp.dob} ({emp.gender})</div></div>
                    <div className="row"><div className="label">Blood Group:</div><div className="value">{emp.bloodGroup}</div></div>
                  </div>

                  <div className="section">
                    <h4>Statutory & Banking Details</h4>
                    <div className="row"><div className="label">PAN Number:</div><div className="value"><strong>{emp.pan}</strong></div></div>
                    <div className="row"><div className="label">Aadhaar Card:</div><div className="value">{emp.aadhaar}</div></div>
                    <div className="row"><div className="label">Bank Account:</div><div className="value">{emp.bankName} - {emp.accountNumber} (IFSC: {emp.ifsc})</div></div>
                  </div>

                  <div className="section">
                    <h4>Salary & Monthly Compensation Structure</h4>
                    <div className="row"><div className="label">Gross CTC Salary:</div><div className="value"><strong style={{ color: '#059669', fontSize: 16 }}>₹{emp.salary?.toLocaleString()} / month</strong></div></div>
                    <div className="row"><div className="label">Basic Pay:</div><div className="value">₹{emp.basic?.toLocaleString()}</div></div>
                    <div className="row"><div className="label">HRA:</div><div className="value">₹{emp.hra?.toLocaleString()}</div></div>
                    <div className="row"><div className="label">PF Deduction:</div><div className="value">₹{emp.pf?.toLocaleString()}</div></div>
                    <div className="row"><div className="label">Net Disbursed:</div><div className="value"><strong style={{ color: '#047857' }}>₹{emp.netSalary?.toLocaleString()}</strong></div></div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* 7. DOCUMENTS */}
          {currentPage === 'documents' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-alt"></i> Documents Repository</h2>
                <button className="btn btn-primary" onClick={() => showToast('Document upload simulated!', 'success')}>
                  <i className="fas fa-upload"></i> Upload Document
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Document Title</th>
                        <th>Category</th>
                        <th>Format</th>
                        <th>Size</th>
                        <th>Last Updated</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.documents.map(d => (
                        <tr key={d.id}>
                          <td><strong>{d.title}</strong></td>
                          <td>{d.category}</td>
                          <td><span className="badge-doc blue">{d.format}</span></td>
                          <td>{d.size}</td>
                          <td>{d.updated}</td>
                          <td><span className="status-badge active">{d.status}</span></td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => showToast('Downloading document: ' + d.title, 'info')}>
                              <i className="fas fa-download"></i> Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. ASSET ASSIGNMENT */}
          {currentPage === 'assets' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-laptop"></i> Asset Assignment Ledger</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('assign_asset')}>
                  <i className="fas fa-plus"></i> Assign New Asset
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Asset Tag</th>
                        <th>Asset Name</th>
                        <th>Type</th>
                        <th>Assigned Staff</th>
                        <th>Serial Number</th>
                        <th>Condition</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.assets.map(a => {
                        const emp = db.employees.find(e => e.id === a.employeeId);
                        return (
                          <tr key={a.id}>
                            <td><strong>{a.assetTag}</strong></td>
                            <td>{a.assetName}</td>
                            <td>{a.assetType}</td>
                            <td>{emp ? emp.name : 'Unassigned'}</td>
                            <td><code>{a.serialNumber}</code></td>
                            <td><span className="badge-doc green">{a.condition}</span></td>
                            <td><span className="status-badge active">{a.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 9. EMPLOYEE EXPENSES */}
          {currentPage === 'expenses' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-receipt"></i> Employee Expense Claims</h2>
                <button className="btn btn-primary" onClick={() => showToast('Claim form opened', 'info')}>
                  <i className="fas fa-plus"></i> Submit Claim
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Claim ID</th>
                        <th>Staff Member</th>
                        <th>Category</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Purpose</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.expenses.map(ex => {
                        const emp = db.employees.find(e => e.id === ex.employeeId);
                        return (
                          <tr key={ex.id}>
                            <td><strong>CLM-00{ex.id}</strong></td>
                            <td>{emp ? emp.name : 'Staff'}</td>
                            <td>{ex.category}</td>
                            <td>{ex.expenseDate}</td>
                            <td><strong style={{ color: '#059669' }}>₹{ex.amount?.toLocaleString()}</strong></td>
                            <td>{ex.purpose}</td>
                            <td><span className={'status-badge ' + ex.status}>{ex.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 10. TIME DASHBOARD */}
          {currentPage === 'attendance' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-calendar-check"></i> Time & Attendance Dashboard</h2>
                <button className="btn btn-success" onClick={() => handleClockInOut(1)}>
                  <i className="fas fa-clock"></i> Quick Punch In / Out
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Staff Member</th>
                        <th>Shift</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Total Hours</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.attendance.map(att => {
                        const emp = db.employees.find(e => e.id === att.employeeId);
                        return (
                          <tr key={att.id}>
                            <td>{att.date}</td>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{att.shift}</td>
                            <td>{att.checkIn}</td>
                            <td>{att.checkOut}</td>
                            <td>{att.totalHours}</td>
                            <td><span className={'status-badge ' + att.status}>{att.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 11. TIME EVENT LEDGER */}
          {currentPage === 'timeEvents' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-stream"></i> Time Event Ledger</h2>
                <button className="btn btn-outline" onClick={() => showToast('Ledger re-indexed', 'info')}>
                  <i className="fas fa-sync"></i> Refresh Audit
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Event ID</th>
                        <th>Staff</th>
                        <th>Event Type</th>
                        <th>Timestamp</th>
                        <th>Geofence Location</th>
                        <th>Device</th>
                        <th>Verification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.timeEvents.map(te => {
                        const emp = db.employees.find(e => e.id === te.employeeId);
                        return (
                          <tr key={te.id}>
                            <td><strong>EVT-00{te.id}</strong></td>
                            <td>{emp ? emp.name : 'Staff'}</td>
                            <td><span className="badge-doc blue">{te.type}</span></td>
                            <td>{te.timestamp}</td>
                            <td>{te.location}</td>
                            <td>{te.device}</td>
                            <td><span className="status-badge active">{te.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 12. BREAK MANAGEMENT */}
          {currentPage === 'breaks' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-coffee"></i> Break Management</h2>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Break Type</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Allowed</th>
                        <th>Compliance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.breaks.map(b => {
                        const emp = db.employees.find(e => e.id === b.employeeId);
                        return (
                          <tr key={b.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{b.breakType}</td>
                            <td>{b.startTime}</td>
                            <td>{b.endTime}</td>
                            <td>{b.duration}</td>
                            <td>{b.allowed}</td>
                            <td><span className="status-badge active">{b.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 13. FIELD & TRAVEL */}
          {currentPage === 'fieldTime' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-map-marker-alt"></i> Field & Travel Tracking</h2>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Field Rep</th>
                        <th>Date</th>
                        <th>Start Location</th>
                        <th>End Location</th>
                        <th>Distance (KM)</th>
                        <th>Visits</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.fieldSessions.map(fs => {
                        const emp = db.employees.find(e => e.id === fs.employeeId);
                        return (
                          <tr key={fs.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{fs.date}</td>
                            <td>{fs.startLoc}</td>
                            <td>{fs.endLoc}</td>
                            <td><strong>{fs.distanceKm} KM</strong></td>
                            <td>{fs.visitCount} visits</td>
                            <td><span className="status-badge active">{fs.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 14. OVERTIME ENGINE */}
          {currentPage === 'overtime' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-hourglass-half"></i> Overtime Engine</h2>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Date</th>
                        <th>Regular Hrs</th>
                        <th>Extra OT Hrs</th>
                        <th>OT Rate (₹)</th>
                        <th>Reason</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.overtimeRequests.map(ot => {
                        const emp = db.employees.find(e => e.id === ot.employeeId);
                        return (
                          <tr key={ot.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{ot.date}</td>
                            <td>{ot.regularHrs} hrs</td>
                            <td><strong style={{ color: '#059669' }}>+{ot.extraHrs} hrs</strong></td>
                            <td>₹{ot.rate}/hr</td>
                            <td>{ot.reason}</td>
                            <td><span className="status-badge active">{ot.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 15. TIMESHEETS */}
          {currentPage === 'timesheet' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-table"></i> Project Timesheets</h2>
              </div>
              <div className="empty-state">
                <i className="fas fa-tasks" style={{ fontSize: 48, color: '#059669' }}></i>
                <h4>Timesheet Engine Synchronized</h4>
                <p className="text-muted">All staff billable hours logged and approved for current sprint.</p>
              </div>
            </div>
          )}

          {/* 16. TIME EXCEPTIONS */}
          {currentPage === 'timeExceptions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-exclamation-circle"></i> Time Exceptions Queue</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Exception ID</th>
                        <th>Type</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.exceptions.map(ex => (
                        <tr key={ex.id}>
                          <td><strong>EXC-00{ex.id}</strong></td>
                          <td>{ex.type}</td>
                          <td>{ex.description}</td>
                          <td><span className="badge-doc red">{ex.priority}</span></td>
                          <td><span className="status-badge warning">{ex.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 17. GEOFENCES */}
          {currentPage === 'geofences' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-draw-polygon"></i> Geofence Management</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Location Name</th>
                        <th>Type</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Radius (Meters)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.geofences.map(g => (
                        <tr key={g.id}>
                          <td><strong>{g.name}</strong></td>
                          <td>{g.locationType}</td>
                          <td>{g.lat}</td>
                          <td>{g.lng}</td>
                          <td><strong>{g.radius}m</strong></td>
                          <td><span className="status-badge active">{g.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 18. TIME POLICIES */}
          {currentPage === 'timeSettings' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-sliders-h"></i> Time & Attendance Policies</h2>
                <button className="btn btn-primary" onClick={() => showToast('Time policies updated!', 'success')}>
                  <i className="fas fa-save"></i> Save Policy Settings
                </button>
              </div>
              <div className="offer-preview">
                <div className="section">
                  <h4>Standard Attendance Controls</h4>
                  <div className="row"><div className="label">Grace Period:</div><div className="value">15 Minutes</div></div>
                  <div className="row"><div className="label">Late Threshold:</div><div className="value">15 Minutes</div></div>
                  <div className="row"><div className="label">Half Day Threshold:</div><div className="value">4 Hours</div></div>
                  <div className="row"><div className="label">Max Overtime Daily:</div><div className="value">4 Hours</div></div>
                  <div className="row"><div className="label">GPS Tracking:</div><div className="value">Enforced for Field Reps</div></div>
                </div>
              </div>
            </div>
          )}

          {/* 19. SHIFT MANAGEMENT */}
          {currentPage === 'shifts' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-clock"></i> Shift Management</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Shift Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Grace Period</th>
                        <th>Weekly Off</th>
                        <th>Allowance (₹)</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.shifts.map(s => (
                        <tr key={s.id}>
                          <td><strong>{s.name}</strong></td>
                          <td>{s.startTime}</td>
                          <td>{s.endTime}</td>
                          <td>{s.gracePeriod}</td>
                          <td>{s.weeklyOff}</td>
                          <td>₹{s.allowance}</td>
                          <td><span className="status-badge active">{s.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 20. LEAVE MANAGEMENT */}
          {currentPage === 'leaves' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-umbrella-beach"></i> Leave Management</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('apply_leave')}>
                  <i className="fas fa-plus"></i> Apply Leave
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Total Days</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.leaves.map(l => {
                        const emp = db.employees.find(e => e.id === l.employeeId);
                        return (
                          <tr key={l.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{l.type}</td>
                            <td>{l.startDate}</td>
                            <td>{l.endDate}</td>
                            <td><strong>{l.totalDays} Days</strong></td>
                            <td>{l.reason}</td>
                            <td><span className={'status-badge ' + l.status}>{l.status}</span></td>
                            <td>
                              {l.status === 'pending' ? (
                                <div style={{ display: 'flex', gap: 6 }}>
                                  <button className="btn btn-xs btn-success" onClick={() => handleUpdateLeaveStatus(l.id, 'approved')}>
                                    Approve
                                  </button>
                                  <button className="btn btn-xs btn-danger" onClick={() => handleUpdateLeaveStatus(l.id, 'rejected')}>
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-muted">Reviewed by {l.approvedBy}</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 21. JOB REQUISITIONS */}
          {currentPage === 'requisitions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-briefcase"></i> Job Requisitions</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_requisition')}>
                  <i className="fas fa-plus"></i> Create Requisition
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Req ID</th>
                        <th>Position Title</th>
                        <th>Department</th>
                        <th>Vacancies</th>
                        <th>Salary Range</th>
                        <th>Hiring Manager</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.requisitions.map(r => (
                        <tr key={r.id}>
                          <td><strong>REQ-00{r.id}</strong></td>
                          <td>{r.position}</td>
                          <td>{r.department}</td>
                          <td><strong>{r.vacancies} Openings</strong></td>
                          <td>{r.salaryRange}</td>
                          <td>{r.hiringManager}</td>
                          <td><span className="status-badge active">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 22. CANDIDATE MASTER */}
          {currentPage === 'candidates' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-user-plus"></i> Candidate Master</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_candidate')}>
                  <i className="fas fa-plus"></i> Add Candidate
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Experience</th>
                        <th>Expected Salary</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.candidates.map(c => (
                        <tr key={c.id}>
                          <td>
                            <strong>{c.name}</strong>
                            <div className="text-xs text-muted">{c.email}</div>
                          </td>
                          <td>{c.mobile}</td>
                          <td>{c.experience}</td>
                          <td><strong style={{ color: '#059669' }}>₹{c.expectedSalary?.toLocaleString()}</strong></td>
                          <td><span className="badge-doc green">{c.score}% Match</span></td>
                          <td><span className="status-badge active">{c.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 23. INTERVIEW MANAGEMENT */}
          {currentPage === 'interviews' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-comments"></i> Interview Management</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>Round</th>
                        <th>Interviewer</th>
                        <th>Score</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviews.map(i => (
                        <tr key={i.id}>
                          <td><strong>{i.candidateName}</strong></td>
                          <td>{i.position}</td>
                          <td>{i.round}</td>
                          <td>{i.interviewer}</td>
                          <td><span className="badge-doc green">{i.overallScore} / 10</span></td>
                          <td><span className="status-badge active">{i.recommendation}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 24. ONBOARDING */}
          {currentPage === 'onboarding' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-rocket"></i> Onboarding Tracker</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>Joining Date</th>
                        <th>Location</th>
                        <th>Manager</th>
                        <th>Checklist Completion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.onboarding.map(o => (
                        <tr key={o.id}>
                          <td><strong>{o.candidateName}</strong></td>
                          <td>{o.position}</td>
                          <td>{o.joiningDate}</td>
                          <td>{o.joiningLocation}</td>
                          <td>{o.reportingManager}</td>
                          <td>
                            <strong>{o.completion}%</strong>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 25. KPI / PERFORMANCE */}
          {currentPage === 'kpi' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-chart-line"></i> KPI / Performance Metrics</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Role</th>
                        <th>Metric Target</th>
                        <th>Target Threshold</th>
                        <th>Weightage</th>
                        <th>Achievement Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.kpiTemplates.map(k => (
                        <tr key={k.id}>
                          <td><strong className="uppercase">{k.role}</strong></td>
                          <td>{k.metric}</td>
                          <td>{k.target}</td>
                          <td>{k.weightage}</td>
                          <td><span className="badge-doc green">{k.score}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 26. APPRAISAL */}
          {currentPage === 'appraisal' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-arrow-trend-up"></i> Appraisal Reviews</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Cycle</th>
                        <th>Rating Score</th>
                        <th>Grade</th>
                        <th>Recommendation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.appraisals.map(a => {
                        const emp = db.employees.find(e => e.id === a.employeeId);
                        return (
                          <tr key={a.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{a.cycle}</td>
                            <td><strong style={{ color: '#059669' }}>{a.rating} / 5.0</strong></td>
                            <td><span className="badge-doc green">{a.grade}</span></td>
                            <td>{a.recommendation}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 27. INCENTIVE MANAGEMENT */}
          {currentPage === 'incentives' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-coins"></i> Incentive Management</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Incentive Plan</th>
                        <th>Achievement %</th>
                        <th>Payout Amount</th>
                        <th>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.incentives.map(inc => {
                        const emp = db.employees.find(e => e.id === inc.employeeId);
                        return (
                          <tr key={inc.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{inc.plan}</td>
                            <td>{inc.pct}</td>
                            <td><strong style={{ color: '#059669' }}>₹{inc.amount?.toLocaleString()}</strong></td>
                            <td><span className="status-badge active">{inc.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 28. PROMOTIONS */}
          {currentPage === 'promotions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-arrow-up"></i> Promotion & Career Growth</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Current Designation</th>
                        <th>Proposed Designation</th>
                        <th>Readiness</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.promotions.map(p => {
                        const emp = db.employees.find(e => e.id === p.employeeId);
                        return (
                          <tr key={p.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{p.currentDesignation}</td>
                            <td><strong style={{ color: '#059669' }}>{p.proposedDesignation}</strong></td>
                            <td><span className="badge-doc green">{p.readiness}</span></td>
                            <td><span className="status-badge active">{p.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 29. PIP */}
          {currentPage === 'pip' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-triangle-exclamation"></i> Performance Improvement Plan (PIP)</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Manager</th>
                        <th>Performance Issue</th>
                        <th>Improvement Target</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.pips.map(pip => {
                        const emp = db.employees.find(e => e.id === pip.employeeId);
                        return (
                          <tr key={pip.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{pip.manager}</td>
                            <td>{pip.issue}</td>
                            <td>{pip.target}</td>
                            <td><strong>{pip.progress}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 30. GRIEVANCES */}
          {currentPage === 'grievances' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-scale-balanced"></i> Employee Grievances</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('log_grievance')}>
                  <i className="fas fa-plus"></i> Log Grievance Ticket
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Staff Member</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Assigned HR</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.grievances.map(g => {
                        const emp = db.employees.find(e => e.id === g.employeeId);
                        return (
                          <tr key={g.id}>
                            <td><strong>GRV-00{g.id}</strong></td>
                            <td>{emp ? emp.name : 'Staff'}</td>
                            <td>{g.category}</td>
                            <td><span className="badge-doc red">{g.priority}</span></td>
                            <td>{g.assignedHR}</td>
                            <td><span className="status-badge warning">{g.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 31. EXIT MANAGEMENT */}
          {currentPage === 'exit' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-sign-out-alt"></i> Exit Management</h2>
              </div>
              <div className="empty-state">
                <i className="fas fa-check-circle" style={{ fontSize: 48, color: '#059669' }}></i>
                <h4>Zero Active Resignations</h4>
                <p className="text-muted">100% staff retention for current quarter.</p>
              </div>
            </div>
          )}

          {/* 32. HELPDESK */}
          {currentPage === 'helpdesk' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-headset"></i> HR Help Desk</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Ticket</th>
                        <th>Staff</th>
                        <th>Category</th>
                        <th>Subject</th>
                        <th>Assigned HR</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.helpdeskTickets.map(t => {
                        const emp = db.employees.find(e => e.id === t.employeeId);
                        return (
                          <tr key={t.id}>
                            <td><strong>HD-00{t.id}</strong></td>
                            <td>{emp ? emp.name : 'Staff'}</td>
                            <td>{t.category}</td>
                            <td>{t.subject}</td>
                            <td>{t.assignedTo}</td>
                            <td><span className="status-badge warning">{t.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 33. ANNOUNCEMENTS */}
          {currentPage === 'announcements' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-bullhorn"></i> Company Announcements</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Publish Date</th>
                        <th>Priority</th>
                        <th>Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.announcements.map(a => (
                        <tr key={a.id}>
                          <td><strong>{a.title}</strong></td>
                          <td>{a.category}</td>
                          <td>{a.publishDate}</td>
                          <td><span className="badge-doc green">{a.priority}</span></td>
                          <td>{a.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 34. JOB PROFILES */}
          {currentPage === 'jobProfiles' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-briefcase"></i> Job Profile Master</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_job_profile')}>
                  <i className="fas fa-plus"></i> Add Job Profile
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Profile Name</th>
                        <th>Department</th>
                        <th>Designation</th>
                        <th>Full-Time Salary</th>
                        <th>Intern Salary</th>
                        <th>Notice Period</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.jobProfiles.map(p => (
                        <tr key={p.id}>
                          <td><strong>{p.name}</strong></td>
                          <td>{p.department}</td>
                          <td>{p.designation}</td>
                          <td><span style={{ fontWeight: 600, color: '#059669' }}>₹{p.defaultFullTimeSalary?.toLocaleString()}</span></td>
                          <td><span style={{ fontWeight: 600, color: '#10b981' }}>₹{p.defaultInternSalary?.toLocaleString()}</span></td>
                          <td>{p.noticePeriod}</td>
                          <td><span className="status-badge active">{p.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 35. OFFER LETTERS */}
          {currentPage === 'offerLetters' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-signature"></i> Offer Letters Engine</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('create_offer')}>
                  <i className="fas fa-plus"></i> Create Offer Letter
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Offer ID</th>
                        <th>Candidate Name</th>
                        <th>Profile</th>
                        <th>Employment</th>
                        <th>Salary</th>
                        <th>Incentive</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.offerLetters.map(o => {
                        const prof = db.jobProfiles.find(p => p.id === o.profileId);
                        return (
                          <tr key={o.id}>
                            <td><strong>{o.offerId}</strong></td>
                            <td>{o.employeeName}</td>
                            <td>{prof ? prof.name : '—'}</td>
                            <td>{o.employmentType}</td>
                            <td><span style={{ fontWeight: 600, color: '#059669' }}>₹{o.salary?.toLocaleString()}</span></td>
                            <td>{o.incentive}</td>
                            <td><span className={'status-badge ' + o.status}>{o.status}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn btn-xs btn-primary" onClick={() => openPreviewOfferModal(o, prof)}>
                                  <i className="fas fa-eye"></i> Preview
                                </button>
                                {o.status === 'draft' && (
                                  <button className="btn btn-xs btn-warning" onClick={() => handleUpdateOfferStatus(o.id, 'approved')}>
                                    <i className="fas fa-check"></i> Approve
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 36. RULE BUILDER */}
          {currentPage === 'ruleBuilder' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-project-diagram"></i> Business Rule Builder</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Rule Name</th>
                        <th>Trigger Event</th>
                        <th>Automated Action</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.rules.map(r => (
                        <tr key={r.id}>
                          <td><strong>{r.ruleName}</strong></td>
                          <td>{r.trigger}</td>
                          <td>{r.action}</td>
                          <td><span className="status-badge active">{r.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 37. EXCEPTION QUEUE */}
          {currentPage === 'exceptions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-exclamation-triangle"></i> Exception Queue</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Exception ID</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Priority</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.exceptions.map(ex => (
                        <tr key={ex.id}>
                          <td><strong>EXC-00{ex.id}</strong></td>
                          <td>{ex.type}</td>
                          <td>{ex.description}</td>
                          <td><span className="badge-doc red">{ex.priority}</span></td>
                          <td><span className="status-badge warning">{ex.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 38. HR AUDIT */}
          {currentPage === 'audit' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-history"></i> HR Audit Trail</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Action</th>
                        <th>Module</th>
                        <th>Reference</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.auditLogs.map(a => (
                        <tr key={a.id}>
                          <td>{a.timestamp}</td>
                          <td><strong>{a.user}</strong></td>
                          <td><span className="badge-doc blue">{a.action}</span></td>
                          <td>{a.module}</td>
                          <td><code>{a.reference}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 39. LEARNING & DEVELOPMENT */}
          {currentPage === 'trainings' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-graduation-cap"></i> Training & Development</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Course Title</th>
                        <th>Provider</th>
                        <th>Duration</th>
                        <th>Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.trainings.map(t => {
                        const emp = db.employees.find(e => e.id === t.employeeId);
                        return (
                          <tr key={t.id}>
                            <td><strong>{emp ? emp.name : 'Staff'}</strong></td>
                            <td>{t.course}</td>
                            <td>{t.provider}</td>
                            <td>{t.duration}</td>
                            <td><span className="badge-doc green">{t.score}</span></td>
                            <td><span className="status-badge active">{t.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 40. REPORTS ENGINE */}
          {currentPage === 'reports' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-pdf"></i> HR Report Engine</h2>
              </div>
              <div className="doc-grid">
                <div className="doc-card" onClick={() => showToast('Generating Headcount CSV Report...', 'info')}>
                  <i className="fas fa-users"></i>
                  <h4>Headcount Roster</h4>
                  <p>Complete staff list & CTC disburser</p>
                  <span className="badge-doc green">Export CSV</span>
                </div>
                <div className="doc-card" onClick={() => showToast('Generating Attendance Audit Report...', 'info')}>
                  <i className="fas fa-calendar-check"></i>
                  <h4>Attendance Audit</h4>
                  <p>Monthly punches & OT ledger</p>
                  <span className="badge-doc blue">Export PDF</span>
                </div>
                <div className="doc-card" onClick={() => showToast('Generating Offer Letter Summary Report...', 'info')}>
                  <i className="fas fa-file-signature"></i>
                  <h4>Offer Letter Summary</h4>
                  <p>Candidate conversion & joining status</p>
                  <span className="badge-doc purple">Export Excel</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* --- MODALS --- */}
      {activeModal === 'onboard_employee' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-plus"></i> Onboard New Employee</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleOnboardEmployee}>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input type="text" name="name" required placeholder="John Doe" /></div>
                <div className="form-group"><label>Work Email *</label><input type="email" name="email" required placeholder="john@epay.com" /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select name="department">
                    <option value="Technology">Technology</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div className="form-group"><label>Position / Designation *</label><input type="text" name="position" required placeholder="Full Stack Developer" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Monthly Salary (₹) *</label><input type="number" name="salary" defaultValue={45000} required /></div>
                <div className="form-group"><label>Mobile Phone *</label><input type="text" name="phone" defaultValue="+91 98765 00000" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>PAN Card Number</label><input type="text" name="pan" defaultValue="ABCDE1234F" /></div>
                <div className="form-group"><label>Aadhaar Number</label><input type="text" name="aadhaar" defaultValue="1234 5678 9012" /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Complete Onboarding</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'create_offer' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-signature"></i> Create Offer Letter</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div style={{ background: '#ecfdf5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13, color: '#064e3b' }}>
              <i className="fas fa-info-circle" style={{ color: '#059669', marginRight: 6 }}></i> HR enters 6 fields. System auto-calculates salary from selected profile.
            </div>
            <form onSubmit={handleCreateOffer}>
              <div className="form-group"><label>Candidate Name *</label><input type="text" name="employeeName" required placeholder="Rahul Sharma" /></div>
              <div className="form-row">
                <div className="form-group"><label>Interview Date *</label><input type="date" name="interviewedDate" defaultValue={newDateStr()} required /></div>
                <div className="form-group"><label>Joining Date *</label><input type="date" name="joiningDate" defaultValue={newDateStr()} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Profile *</label>
                  <select name="profileId" required>
                    {db.jobProfiles.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.designation})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Employment Type *</label>
                  <select name="employmentType">
                    <option value="Full-Time">Full-Time</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Incentive Type</label>
                  <select name="incentiveType">
                    <option value="No Incentive">No Incentive</option>
                    <option value="Fixed">Fixed Amount (₹)</option>
                    <option value="Percentage">Percentage (%)</option>
                  </select>
                </div>
                <div className="form-group"><label>Incentive Value</label><input type="text" name="incentiveVal" placeholder="5000 or 10%" /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Offer Preview</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'add_candidate' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-user-plus"></i> Add Candidate to Pipeline</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddCandidate}>
              <div className="form-row">
                <div className="form-group"><label>Candidate Name *</label><input type="text" name="name" required placeholder="Vikram Singh" /></div>
                <div className="form-group"><label>Email *</label><input type="email" name="email" required placeholder="vikram@gmail.com" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Mobile Phone *</label><input type="text" name="mobile" defaultValue="+91 98765 88888" required /></div>
                <div className="form-group"><label>Experience *</label><input type="text" name="experience" defaultValue="4 years" required /></div>
              </div>
              <div className="form-group"><label>Required Skills</label><input type="text" name="skills" defaultValue="React, Next.js, Node.js" /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'add_requisition' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-briefcase"></i> Create Job Requisition</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddRequisition}>
              <div className="form-row">
                <div className="form-group"><label>Position Title *</label><input type="text" name="position" required placeholder="Senior Developer" /></div>
                <div className="form-group"><label>Department *</label><input type="text" name="department" required placeholder="Technology" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Vacancies *</label><input type="number" name="vacancies" defaultValue={2} required /></div>
                <div className="form-group"><label>Salary Range</label><input type="text" name="salaryRange" defaultValue="₹60,000 - ₹90,000" /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Publish Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'assign_asset' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-laptop"></i> Assign Asset to Staff</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAssignAsset}>
              <div className="form-group">
                <label>Select Staff Member *</label>
                <select name="employeeId" required>
                  {db.employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Asset Type *</label><input type="text" name="assetType" defaultValue="Laptop" required /></div>
                <div className="form-group"><label>Asset Name *</label><input type="text" name="assetName" defaultValue="MacBook Pro M2" required /></div>
              </div>
              <div className="form-group"><label>Asset Tag Code</label><input type="text" name="assetTag" defaultValue="AST-003" /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'log_grievance' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-scale-balanced"></i> Log Workplace Grievance</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleLogGrievance}>
              <div className="form-group">
                <label>Staff Member *</label>
                <select name="employeeId" required>
                  {db.employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="form-group"><label>Category *</label><input type="text" name="category" defaultValue="Workplace Equipment" required /></div>
              <div className="form-group"><label>Description *</label><textarea name="description" required placeholder="Detail the grievance..." /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Ticket</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'apply_leave' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-umbrella-beach"></i> Apply Leave Request</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleApplyLeave}>
              <div className="form-group">
                <label>Select Staff Member *</label>
                <select name="employeeId" required>
                  {db.employees.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.department})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Leave Type *</label>
                  <select name="type">
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Earned Leave">Earned Leave</option>
                  </select>
                </div>
                <div className="form-group"><label>Start Date *</label><input type="date" name="startDate" defaultValue={newDateStr()} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>End Date *</label><input type="date" name="endDate" defaultValue={newDateStr()} required /></div>
              </div>
              <div className="form-group"><label>Reason *</label><textarea name="reason" required placeholder="Reason for leave application..." /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Leave</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'preview_offer' && modalData && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-signature"></i> Offer Letter Preview — {modalData.offer.offerId}</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="offer-preview">
              <div className="header">
                <div className="logo"><i className="fas fa-cubes"></i> ePay</div>
                <div className="company-info">
                  <strong>{db.companySettings.companyName}</strong><br />
                  {db.companySettings.companyAddress}<br />
                  Email: {db.companySettings.companyEmail} | Phone: {db.companySettings.companyPhone}
                </div>
              </div>

              <div className="title">OFFER OF EMPLOYMENT</div>
              <div className="offer-id">Offer Reference: <strong>{modalData.offer.offerId}</strong> | Date: {modalData.offer.offerDate}</div>

              <p>Dear <strong>{modalData.offer.employeeName}</strong>,</p>
              <p>We are pleased to offer you the position of <strong>{modalData.prof.designation}</strong> in the <strong>{modalData.prof.department}</strong> department at {db.companySettings.companyName}.</p>

              <div className="section">
                <h4>Position & Compensation Terms</h4>
                <div className="row"><div className="label">Designation:</div><div className="value"><strong>{modalData.prof.designation}</strong></div></div>
                <div className="row"><div className="label">Employment Type:</div><div className="value">{modalData.offer.employmentType}</div></div>
                <div className="row"><div className="label">Monthly Salary:</div><div className="value"><strong style={{ color: '#059669', fontSize: 16 }}>₹{modalData.offer.salary?.toLocaleString()} / month</strong></div></div>
                <div className="row"><div className="label">Incentive:</div><div className="value">{modalData.offer.incentive}</div></div>
                <div className="row"><div className="label">Joining Date:</div><div className="value"><strong>{modalData.offer.joiningDate}</strong></div></div>
              </div>

              <div className="section">
                <h4>Key Responsibilities</h4>
                <ul>
                  {modalData.prof.responsibilities?.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="clause">
                <strong>Probation & Notice:</strong> {modalData.prof.probationPeriod} probation. {modalData.prof.noticePeriod} notice period.
              </div>
              <div className="clause">
                <strong>Confidentiality:</strong> {modalData.prof.confidentialityClause}
              </div>

              <div className="footer">
                <div className="signature">
                  <div className="seal">SEAL</div>
                  <div className="line"></div>
                  <div>Authorized Signatory</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Priya Sharma (HR Head)</div>
                </div>
                <div className="qr">
                  <div className="box"><i className="fas fa-qrcode"></i></div>
                  <div>Scan to Verify QR</div>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print / PDF
              </button>
              {modalData.offer.status === 'draft' && (
                <button className="btn btn-success" onClick={() => handleUpdateOfferStatus(modalData.offer.id, 'approved')}>
                  <i className="fas fa-check"></i> Approve Offer
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

fs.writeFileSync('app/hr/page.jsx', code);
console.log('Successfully generated complete HR page with 40 distinct features! File length:', code.length);
