'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function GlobalTaskReporter() {
  const { user, role } = useAuth();
  const [open, setOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Development');
  const [hours, setHours] = useState('1');
  const [progress, setProgress] = useState('50');
  const [status, setStatus] = useState('In Progress');
  const [desc, setDesc] = useState('');
  const [toast, setToast] = useState(null);

  // Load / Seed tasks
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem('epay_global_tasks_reports');
    if (stored) {
      setTasks(JSON.parse(stored));
    } else {
      // Seed default tasks
      const defaultTasks = [
        { id: 1, role: 'superadmin', title: 'Platform Security Audit', category: 'Security', hours: 4, progress: 100, status: 'Completed', desc: 'Conducted role permission checks.', date: '2026-08-25' },
        { id: 2, role: 'hr', title: 'Verify Noida Attendance', category: 'Operations', hours: 2, progress: 100, status: 'Completed', desc: 'Validated Delhi/Noida office geofence triggers.', date: '2026-08-26' },
        { id: 3, role: 'bde', title: 'Follow up with ABC Corp', category: 'Sales', hours: 3, progress: 50, status: 'In Progress', desc: 'Drafting pricing proposal.', date: '2026-08-26' },
        { id: 4, role: 'telecalling', title: 'Dial 30 qualified leads', category: 'Calling', hours: 6, progress: 80, status: 'In Progress', desc: 'Dialing target leads list.', date: '2026-08-26' }
      ];
      localStorage.setItem('epay_global_tasks_reports', JSON.stringify(defaultTasks));
      setTasks(defaultTasks);
    }
  }, []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    if (typeof window !== 'undefined') {
      localStorage.setItem('epay_global_tasks_reports', JSON.stringify(newTasks));
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a task title');
      return;
    }

    const newTask = {
      id: Date.now(),
      role: role || 'Staff',
      title,
      category,
      hours: parseFloat(hours) || 1,
      progress: parseInt(progress) || 0,
      status,
      desc,
      date: new Date().toISOString().slice(0, 10)
    };

    saveTasks([newTask, ...tasks]);
    setTitle('');
    setDesc('');
    showToast('Task reported successfully!');
  };

  const handleDeleteTask = (id) => {
    const filtered = tasks.filter(t => t.id !== id);
    saveTasks(filtered);
    showToast('Task report removed.');
  };

  const handleExportJSON = () => {
    const roleTasks = (tasks || []).filter(t => t && (t.role || '').toLowerCase() === (role || 'staff').toLowerCase());
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(roleTasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `task_report_${role || 'staff'}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Task report exported as JSON!');
  };

  // Only display if user is logged in
  if (!user) return null;

  const currentRoleLabel = role ? role.toUpperCase() : 'STAFF';
  const roleTasks = (tasks || []).filter(t => t && (t.role || '').toLowerCase() === (role || 'staff').toLowerCase());

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '50px',
          padding: '12px 20px',
          fontSize: '13px',
          fontWeight: 700,
          boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'transform 0.2s ease',
          outline: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <i className="fa-solid fa-list-check" style={{ fontSize: '15px' }}></i>
        <span>Task Reporter ({roleTasks.length})</span>
      </button>

      {/* Slide-out Panel Modal */}
      {open && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(2, 6, 23, 0.65)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'stretch'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: '#0f172a',
            borderLeft: '1px solid #1e293b',
            color: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px',
            boxShadow: '-10px 0 30px -10px rgba(0, 0, 0, 0.5)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                  <i className="fa-solid fa-clipboard-list" style={{ color: '#10b981', marginRight: '8px' }}></i>
                  Task Reporting Center
                </h3>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, letterSpacing: '0.05em' }}>
                  ROLE: {currentRoleLabel}
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '20px', cursor: 'pointer' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Scrollable Container */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              {/* Submission Form */}
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '16px', border: '1px solid #334155', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 14px 0', color: '#10b981' }}>
                  <i className="fa-solid fa-plus-circle"></i> Log New Task Progress
                </h4>
                <form onSubmit={handleAddTask} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Task Title</label>
                    <input
                      type="text"
                      placeholder="What are you working on?"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Category</label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                      >
                        <option value="Calling">Calling / Client Dial</option>
                        <option value="Sales">Sales & Proposals</option>
                        <option value="Security">Security & Access</option>
                        <option value="Operations">Operations Management</option>
                        <option value="Development">Code / Configuration</option>
                        <option value="Other">Other Duty</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Hours Spent</label>
                      <input
                        type="number"
                        min="0.5"
                        max="24"
                        step="0.5"
                        value={hours}
                        onChange={e => setHours(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Progress (%)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={progress}
                        onChange={e => setProgress(e.target.value)}
                        style={{ accentColor: '#10b981', height: '6px', marginTop: '10px' }}
                      />
                      <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600, textAlign: 'right' }}>{progress}%</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Status</label>
                      <select
                        value={status}
                        onChange={e => setStatus(e.target.value)}
                        style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 10px', color: '#fff', fontSize: '12.5px', outline: 'none' }}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>Task Description / Remarks</label>
                    <textarea
                      placeholder="Add brief details about task outputs..."
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      rows={2}
                      style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '8px 12px', color: '#fff', fontSize: '12.5px', outline: 'none', resize: 'none' }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '10px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      margin: '8px 0 0 0'
                    }}
                  >
                    <i className="fa-solid fa-floppy-disk"></i> Save Task Entry
                  </button>
                </form>
              </div>

              {/* Task History list */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>
                    <i className="fa-solid fa-clock-rotate-left" style={{ marginRight: '6px', color: '#10b981' }}></i>
                    Active Duty Task Logs
                  </h4>
                  {roleTasks.length > 0 && (
                    <button
                      onClick={handleExportJSON}
                      style={{ background: 'transparent', border: 'none', color: '#10b981', fontSize: '11.5px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <i className="fa-solid fa-download"></i> Export Report
                    </button>
                  )}
                </div>

                {roleTasks.length === 0 ? (
                  <div style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', padding: '24px', background: '#1e293b', borderRadius: '8px', border: '1px dashed #334155' }}>
                    No tasks logged for {currentRoleLabel} today. Use the form above to add one.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {roleTasks.map(t => (
                      <div
                        key={t.id}
                        style={{
                          background: '#1e293b',
                          borderRadius: '8px',
                          padding: '12px',
                          border: '1px solid #334155',
                          position: 'relative'
                        }}
                      >
                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '10px', background: '#0f172a', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#10b981' }}>
                            {t.category}
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{t.date}</span>
                        </div>

                        <strong style={{ fontSize: '13px', display: 'block', paddingRight: '24px', color: '#f8fafc' }}>
                          {t.title}
                        </strong>

                        {t.desc && (
                          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '6px 0 8px 0', lineHeight: '1.4' }}>
                            {t.desc}
                          </p>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', borderTop: '1px solid #334155', paddingTop: '8px', fontSize: '11.5px' }}>
                          <div>
                            Time Logged: <strong style={{ color: '#f8fafc' }}>{t.hours} hrs</strong>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              fontSize: '9.5px',
                              background: t.status === 'Completed' ? '#065f46' : t.status === 'In Progress' ? '#854d0e' : '#1e293b',
                              color: t.status === 'Completed' ? '#34d399' : t.status === 'In Progress' ? '#fbbf24' : '#94a3b8'
                            }}>
                              {t.status}
                            </span>
                            <strong>{t.progress}%</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Toast Notification */}
            {toast && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                right: '20px',
                background: '#065f46',
                color: '#34d399',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '12.5px',
                fontWeight: 600,
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                animation: 'fadeIn 0.2s ease'
              }}>
                {toast}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
