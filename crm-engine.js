/* ePay CRM - Dynamic Sidebar and Navigation Engine v2 */
(function () {
    'use strict';

var PORTALS = [
        { id: 'index',       label: 'HR Management',        file: 'index.html',             icon: 'fa-cubes' },
        { id: 'superadmin',  label: 'Super Admin',          file: 'superadmin.html',        icon: 'fa-crown' },
        { id: 'admin',       label: 'Admin Dashboard',      file: 'admin.html',             icon: 'fa-user-shield' },
        { id: 'finance',     label: 'Finance Portal',       file: 'finance.html',           icon: 'fa-coins' },
        { id: 'telecalling', label: 'Telecaller CRM',       file: 'telecalling.html',       icon: 'fa-headset' },
        { id: 'marketing',   label: 'Digital Marketing',    file: 'digital marketing.html', icon: 'fa-bullhorn' },
        { id: 'support',     label: 'Technical Support',    file: 'technical support.html', icon: 'fa-headset' },
        { id: 'devhub',      label: 'Developer Hub',        file: 'developerhub.html',      icon: 'fa-code' },
        { id: 'social',      label: 'Social Media Manager', file: 'socialmediamanager.html', icon: 'fa-hashtag' },
        { id: 'franchise',   label: 'Franchise Admin',      file: 'franchise.html',         icon: 'fa-store' },
        { id: 'gallery',     label: 'Gallery Manager',      file: 'gallerymanager.html',    icon: 'fa-images' },
        { id: 'owner',       label: 'Franchise Owner',      file: 'franchiseowner.html',    icon: 'fa-user-tie' },
        { id: 'landing',     label: 'Landing Page',         file: 'landingpage.html',       icon: 'fa-globe' }
    ];

    function makeEl(tag, cls) {
        var n = document.createElement(tag);
        if (cls) n.className = cls;
        return n;
    }

    function addIcon(node, cls) {
        var i = makeEl('i');
        i.className = 'fas ' + cls;
        node.appendChild(i);
        return i;
    }

    function currentFileName() {
        var p = window.location.pathname.split('/').pop() || 'index.html';
        return p.toLowerCase();
    }

    function cfg() {
        return window.CRM_PORTAL || {};
    }

    // Pages that own their own navigation (e.g. HR app) set this
    // flag to true to prevent the generic renderer from clobbering
    // their pages. The engine will still dispatch crm:navigate and
    // the page's bridge handles the rest.
    function suppressGeneric() {
        return window.CRM_SUPPRESS_GENERIC === true;
    }

    // View registry: pages register render functions keyed by view id
    var viewRegistry = {};

    function registerView(id, fn) {
        viewRegistry[id] = fn;
    }

    // ----------------------------------------------------------
    //  GENERIC VIEW RENDERER
    //  Renders a functional, data-driven page for any view id.
    //  Uses self-contained inline styles so it works on every
    //  page (custom CSS, Tailwind, or plain) and overrides any
    //  static block. Pages can override via registerView().
    // ----------------------------------------------------------
    function renderGenericView(viewId) {
        var c = cfg();
        var item = null;
        (c.menu || []).forEach(function (m) {
            if (m.id === viewId) item = m;
        });
        if (!item) return;

        var label = item.label || viewId;
        var icon = item.icon || 'fa-circle';
        var container = document.getElementById('pageContent') ||
            document.getElementById('main-content') ||
            document.querySelector('main .flex-1') ||
            document.querySelector('main');
        if (!container) return;

        // Deterministic pseudo-data from the view id
        var seed = 0;
        for (var i = 0; i < viewId.length; i++) seed += viewId.charCodeAt(i);
        var rnd = function (n) { return (seed * (n + 7) % 997) / 10; };

        var total = Math.floor(40 + rnd(1) * 12);
        var active = Math.floor(18 + rnd(2) * 9);
        var pending = Math.floor(2 + rnd(3) * 6);
        var completed = Math.max(1, total - active - pending);

        var stats = [
            { label: 'Total ' + label, value: total, icon: 'fa-database', color: '#059669' },
            { label: 'Active', value: active, icon: 'fa-circle-check', color: '#22c55e' },
            { label: 'Pending', value: pending, icon: 'fa-clock', color: '#eab308' },
            { label: 'Completed', value: completed, icon: 'fa-check-double', color: '#0ea5e9' }
        ];

        var names = ['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Kulkarni', 'Vikram Joshi', 'Anita Verma', 'Rohan Mehta', 'Neha Shah'];
        var statuses = [['Active', '#dcfce7', '#15803d'], ['Pending', '#fef3c7', '#b45309'], ['Completed', '#dbeafe', '#1d4ed8'], ['In Progress', '#e0f2fe', '#0369a1']];
        var avatars = ['#059669', '#22c55e', '#eab308', '#059669', '#ef4444', '#0ea5e9'];
        var rows = '';
        var today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        for (var r = 0; r < 6; r++) {
            var nm = names[(seed + r) % names.length];
            var st = statuses[(seed + r * 2) % statuses.length];
            var amt = (rnd(r + 5) * 2500 + 500).toFixed(0);
            var bg = avatars[(seed + r) % avatars.length];
            rows += '<tr>' +
                '<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;gap:10px;">' +
                '<span style="width:32px;height:32px;border-radius:50%;background:' + bg + ';color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;">' + nm.charAt(0) + '</span>' +
                '<strong style="color:#1e293b;">' + nm + '</strong></td>' +
                '<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#64748b;">' + label + ' #' + (1000 + r + seed) + '</td>' +
                '<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;"><span style="padding:3px 12px;border-radius:20px;font-size:12px;font-weight:600;background:' + st[1] + ';color:' + st[2] + ';">' + st[0] + '</span></td>' +
                '<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;font-weight:600;color:#1e293b;">₹ ' + amt + '</td>' +
                '<td style="padding:12px 16px;border-bottom:1px solid #f1f5f9;color:#94a3b8;">' + today + '</td></tr>';
        }

        var statsHtml = '';
        for (var s = 0; s < stats.length; s++) {
            statsHtml += '<div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:18px 20px;box-shadow:0 4px 20px rgba(0,0,0,0.05);min-width:180px;flex:1;">' +
                '<div style="font-size:13px;color:#64748b;font-weight:500;display:flex;align-items:center;gap:8px;margin-bottom:6px;"><i class="fas ' + stats[s].icon + '" style="color:' + stats[s].color + ';"></i> ' + stats[s].label + '</div>' +
                '<div style="font-size:28px;font-weight:700;color:#0f172a;">' + stats[s].value + '</div>' +
                '<div style="font-size:12px;font-weight:500;color:#15803d;background:#dcfce7;border-radius:20px;padding:2px 10px;display:inline-block;margin-top:6px;">Live</div>' +
                '</div>';
        }

        container.innerHTML = '' +
            '<div id="crm-gen-root" style="padding:8px 4px;font-family:Inter,Segoe UI,system-ui,sans-serif;">' +
            '  <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin:14px 0 18px;">' +
            '    <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin:0;"><i class="fas ' + icon + '" style="color:#059669;margin-right:10px;"></i>' + label + ' Management</h2>' +
            '    <div style="display:flex;gap:10px;">' +
            '      <button onclick="CRM.addGenericRecord(\'' + viewId + '\')" style="background:#059669;color:#fff;border:none;padding:9px 20px;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;gap:8px;"><i class="fas fa-plus"></i> Add New</button>' +
            '      <button onclick="CRM.navigateTo(\'' + viewId + '\')" style="background:#e2e8f0;color:#334155;border:none;padding:9px 20px;border-radius:10px;font-weight:600;font-size:13px;cursor:pointer;"><i class="fas fa-rotate"></i> Refresh</button>' +
            '    </div>' +
            '  </div>' +
            '  <div id="gen-stats" style="display:flex;gap:14px;flex-wrap:wrap;margin-bottom:24px;">' + statsHtml + '</div>' +
            '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px;">' +
            '    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">' +
            '      <h4 style="font-size:14px;font-weight:600;color:#475569;margin:0 0 12px;"><i class="fas fa-chart-pie"></i> ' + label + ' Distribution</h4>' +
            '      <div style="max-height:220px;"><canvas id="genChart1"></canvas></div>' +
            '    </div>' +
            '    <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px;box-shadow:0 4px 20px rgba(0,0,0,0.05);">' +
            '      <h4 style="font-size:14px;font-weight:600;color:#475569;margin:0 0 12px;"><i class="fas fa-chart-line"></i> ' + label + ' Trend</h4>' +
            '      <div style="max-height:220px;"><canvas id="genChart2"></canvas></div>' +
            '    </div>' +
            '  </div>' +
            '  <div style="background:#fff;border:1px solid #e2e8f0;border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.05);overflow:hidden;">' +
            '    <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;display:flex;justify-content:space-between;align-items:center;">' +
            '      <h3 style="font-size:16px;font-weight:600;color:#0f172a;margin:0;"><i class="fas fa-list"></i> ' + label + ' Records</h3>' +
            '      <span style="font-size:12px;color:#94a3b8;">Showing 6 of ' + total + '</span>' +
            '    </div>' +
            '    <div style="overflow-x:auto;">' +
            '      <table style="width:100%;border-collapse:collapse;font-size:14px;">' +
            '        <thead><tr style="text-align:left;">' +
            '          <th style="background:#f8fafc;padding:12px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Name</th>' +
            '          <th style="background:#f8fafc;padding:12px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Reference</th>' +
            '          <th style="background:#f8fafc;padding:12px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Status</th>' +
            '          <th style="background:#f8fafc;padding:12px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Amount</th>' +
            '          <th style="background:#f8fafc;padding:12px 16px;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0;">Date</th>' +
            '        </tr></thead>' +
            '        <tbody>' + rows + '</tbody>' +
            '      </table>' +
            '    </div>' +
            '  </div>' +
            '  <div id="gen-toast" style="position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;"></div>' +
            '</div>';

        // Render charts if Chart.js is available
        setTimeout(function () {
            if (typeof Chart === 'undefined') return;
            var c1 = document.getElementById('genChart1');
            var c2 = document.getElementById('genChart2');
            if (c1) {
                new Chart(c1, {
                    type: 'doughnut',
                    data: {
                        labels: ['Active', 'Pending', 'Completed', 'Other'],
                        datasets: [{ data: [active, pending, completed, Math.max(0, total - active - pending - completed)], backgroundColor: ['#22c55e', '#eab308', '#0ea5e9', '#94a3b8'] }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
                });
            }
            if (c2) {
                new Chart(c2, {
                    type: 'line',
                    data: {
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{ label: label, data: [12 + rnd(1), 19 + rnd(2), 15 + rnd(1), 24 + rnd(2), 18 + rnd(1), 28 + rnd(2), 22 + rnd(1)], borderColor: '#059669', backgroundColor: 'rgba(5,150,105,0.1)', fill: true, tension: 0.4 }]
                    },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
                });
            }
        }, 50);
    }

    function renderSidebar(root) {
        var c = cfg();
        var activeView = c.active || '';
        var curFile = currentFileName();

        /* Brand block */
        var brand = makeEl('div', 'crm-brand');
        var logo = makeEl('div', 'crm-brand-logo');
        // Use real logo image; fall back to icon if image fails to load
        var logoImg = makeEl('img');
        logoImg.src = 'assets/images/logo.png';
        logoImg.alt = 'ePay';
        logoImg.style.cssText = 'width:36px;height:36px;object-fit:contain;border-radius:8px;display:block;';
        logoImg.onerror = function() {
            this.style.display = 'none';
            addIcon(logo, c.brandIcon || 'fa-cubes');
        };
        logo.appendChild(logoImg);
        var text = makeEl('div', 'crm-brand-text');
        var title = makeEl('div', 'crm-brand-title');
        title.textContent = c.brandTitle || 'ePay';
        var sub = makeEl('div', 'crm-brand-sub');
        sub.textContent = c.brandSub || 'CRM';
        text.appendChild(title);
        text.appendChild(sub);
        brand.appendChild(logo);
        brand.appendChild(text);
        root.appendChild(brand);

        /* Navigation */
        var nav = makeEl('nav', 'crm-nav');
        var items = c.menu && c.menu.length ? c.menu : [];
        items.forEach(function (item) {
            if (item.type === 'section') {
                var s = makeEl('div', 'crm-nav-section');
                s.textContent = item.label;
                nav.appendChild(s);
                return;
            }

            if (item.type === 'portal') {
                var plist = item.children && item.children.length ? item.children : PORTALS;
                var ps = makeEl('div', 'crm-nav-section');
                ps.textContent = item.label || 'Portals';
                nav.appendChild(ps);
                plist.forEach(function (p) {
                    var a = makeEl('a', 'crm-nav-item' + (curFile === (p.file || '').toLowerCase() ? ' active' : ''));
                    a.href = p.file;
                    a.setAttribute('data-nav', 'portal');
                    addIcon(a, p.icon || 'fa-link');
                    var sp = makeEl('span', 'crm-nav-label');
                    sp.textContent = p.label;
                    a.appendChild(sp);
                    nav.appendChild(a);
                });
                return;
            }

            var active = false;
            if (item.id && item.id === activeView) active = true;
            if (!active && item.href) {
                active = curFile === (item.href || '').toLowerCase().split('#')[0];
            }

            var link = makeEl('a', 'crm-nav-item' + (active ? ' active' : ''));
            link.setAttribute('data-nav', item.id || item.label || '');
            if (item.href) {
                link.href = item.href;
                link.setAttribute('data-nav-type', 'link');
            } else {
                link.href = 'javascript:void(0)';
                link.setAttribute('data-nav-type', 'view');
            }
            addIcon(link, item.icon || 'fa-circle');
            var label = makeEl('span', 'crm-nav-label');
            label.textContent = item.label;
            link.appendChild(label);
            if (item.badge) {
                var b = makeEl('span', 'crm-badge' + (item.badgeClass === 'green' ? ' crm-badge-green' : ' crm-badge-red'));
                b.textContent = item.badge;
                link.appendChild(b);
            }
            if (item.chevron) {
                link.appendChild(makeEl('i', 'crm-chevron ' + item.chevron));
            }
            if (!item.href) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    navigateTo(item.id || item.label || '');
                });
            }
            nav.appendChild(link);
        });
        root.appendChild(nav);

        /* Footer */
        var footer = makeEl('div', 'crm-sidebar-footer');
        var userName = c.userName || 'Admin User';
        var userRole = c.userRole || 'Administrator';
        var av = makeEl('div', 'crm-avatar');
        av.textContent = (userName.trim().charAt(0) || 'A').toUpperCase();
        var info = makeEl('div', 'crm-user-info');
        var nm = makeEl('div', 'crm-user-name');
        nm.textContent = userName;
        var rl = makeEl('div', 'crm-user-role');
        rl.textContent = userRole;
        info.appendChild(nm);
        info.appendChild(rl);
        var logout = makeEl('a', 'crm-logout');
        logout.href = 'landingpage.html';
        logout.title = 'Back to landing page';
        addIcon(logout, 'fa-right-from-bracket');
        footer.appendChild(av);
        footer.appendChild(info);
        footer.appendChild(logout);
        root.appendChild(footer);

        window.CRM_NAV_ITEMS = nav.querySelectorAll('.crm-nav-item');
    }

    function navigateTo(viewId) {
        viewId = (viewId || '').replace(/[^a-zA-Z0-9_-]/g, '');
        // Update active state on sidebar
        document.querySelectorAll('.crm-nav-item').forEach(function (n) { n.classList.remove('active'); });
        var current = document.querySelector('.crm-nav-item[data-nav="' + viewId + '"]');
        if (current) current.classList.add('active');

        // Update page title if present
        var titleEl = document.getElementById('pageTitle');
        if (titleEl) titleEl.textContent = viewId.charAt(0).toUpperCase() + viewId.slice(1);

        // Store current view
        try { localStorage.setItem('crm-active-view', viewId); } catch (e) {}

        // Close mobile sidebar
        var sidebar = document.getElementById('crm-sidebar-root');
        if (sidebar) sidebar.classList.remove('open');

        // Dispatch event for page-specific code first
        document.dispatchEvent(new CustomEvent('crm:navigate', {
            detail: { view: viewId }
        }));

        // If a view renderer is registered, call it; otherwise use generic.
        // Pages that own navigation set CRM_SUPPRESS_GENERIC to skip this.
        if (suppressGeneric()) return;
        if (viewRegistry[viewId]) {
            viewRegistry[viewId]();
        } else {
            renderGenericView(viewId);
        }
    }

    function restoreView() {
        var c = cfg();
        var saved = null;
        try { saved = localStorage.getItem('crm-active-view'); } catch (e) {}
        var activeEl = document.querySelector('.crm-nav-item.active');
        if (!activeEl && saved) {
            var m = document.querySelector('.crm-nav-item[data-nav="' + saved + '"]');
            if (m) m.classList.add('active');
        }
        // On initial load, only restore the active highlight.
        // The generic renderer runs only on sidebar clicks (navigateTo).
        if (suppressGeneric()) return;
        var activeId = (activeEl ? activeEl.getAttribute('data-nav') : null) || saved || c.active || '';
        if (viewRegistry[activeId]) {
            viewRegistry[activeId]();
        }
    }

    function setupToggle() {
        var sidebar = document.getElementById('crm-sidebar-root');
        if (!sidebar) return;
        var btn = document.getElementById('crm-hamburger') || document.querySelector('[data-crm-toggle]');
        if (btn) {
            btn.addEventListener('click', function () { sidebar.classList.toggle('open'); });
        }
        document.addEventListener('click', function (e) {
            if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && btn && !btn.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });
    }

    function init() {
        var root = document.getElementById('crm-sidebar-root');
        if (!root) return;
        root.innerHTML = '';
        root.classList.add('crm-sidebar');
        renderSidebar(root);
        setupToggle();

        var c = cfg();
        if (c.active) {
            var initial = document.querySelector('.crm-nav-item[data-nav="' + c.active + '"]');
            if (initial) {
                document.querySelectorAll('.crm-nav-item').forEach(function (n) { n.classList.remove('active'); });
                initial.classList.add('active');
            }
            // On initial load, let the page render its own dashboard.
            // The generic renderer runs only on sidebar clicks (navigateTo).
        } else {
            restoreView();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ----------------------------------------------------------
    //  GENERIC RECORD CREATION + TOAST
    //  Makes the "Add New" button functional on every view.
    // ----------------------------------------------------------
    function showToast(msg, type) {
        var container = document.getElementById('gen-toast');
        if (!container) {
            container = document.createElement('div');
            container.id = 'gen-toast';
            container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;display:flex;flex-direction:column;gap:8px;';
            document.body.appendChild(container);
        }
        var colors = { success: '#22c55e', error: '#ef4444', info: '#059669', warning: '#eab308' };
        var el = document.createElement('div');
        el.style.cssText = 'background:#0f172a;color:#fff;padding:14px 20px;border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.2);display:flex;align-items:center;gap:12px;font-size:14px;border-left:4px solid ' + (colors[type] || colors.info) + ';animation:slideUp 0.3s ease;';
        el.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : type === 'warning' ? 'fa-triangle-exclamation' : 'fa-circle-info') + '" style="color:' + (colors[type] || colors.info) + ';"></i><span>' + msg + '</span>';
        container.appendChild(el);
        setTimeout(function () { if (el.parentNode) el.remove(); }, 3500);
    }

    function addGenericRecord(viewId) {
        var c = cfg();
        var item = null;
        (c.menu || []).forEach(function (m) { if (m.id === viewId) item = m; });
        var label = item ? item.label : viewId;

        // Build a simple modal form
        var overlay = document.createElement('div');
        overlay.id = 'gen-modal';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.innerHTML =
            '<div style="background:#fff;border-radius:16px;max-width:520px;width:100%;padding:28px;box-shadow:0 24px 80px rgba(0,0,0,0.3);">' +
            '  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;">' +
            '    <h3 style="font-size:20px;font-weight:600;color:#0f172a;margin:0;"><i class="fas fa-plus-circle" style="color:#059669;"></i> Add New ' + label + '</h3>' +
            '    <button onclick="CRM.closeGenericModal()" style="background:none;border:none;font-size:24px;color:#94a3b8;cursor:pointer;">&times;</button>' +
            '  </div>' +
            '  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">' +
            '    <div style="grid-column:1/-1;"><label style="display:block;font-weight:500;font-size:13px;color:#334155;margin-bottom:4px;">Name</label><input id="gen-name" placeholder="Enter name" style="width:100%;padding:10px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;"></div>' +
            '    <div><label style="display:block;font-weight:500;font-size:13px;color:#334155;margin-bottom:4px;">Status</label><select id="gen-status" style="width:100%;padding:10px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;outline:none;background:#fff;"><option>Active</option><option>Pending</option><option>Completed</option><option>In Progress</option></select></div>' +
            '    <div><label style="display:block;font-weight:500;font-size:13px;color:#334155;margin-bottom:4px;">Amount (₹)</label><input id="gen-amount" type="number" placeholder="0" style="width:100%;padding:10px 14px;border:1px solid #cbd5e1;border-radius:8px;font-size:14px;outline:none;box-sizing:border-box;"></div>' +
            '  </div>' +
            '  <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;">' +
            '    <button onclick="CRM.closeGenericModal()" style="background:#e2e8f0;color:#334155;border:none;padding:9px 20px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;">Cancel</button>' +
            '    <button onclick="CRM.saveGenericRecord(\'' + viewId + '\')" style="background:#059669;color:#fff;border:none;padding:9px 20px;border-radius:8px;font-weight:600;font-size:13px;cursor:pointer;"><i class="fas fa-check"></i> Save</button>' +
            '  </div>' +
            '</div>';
        overlay.addEventListener('click', function (e) { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
    }

    function closeGenericModal() {
        var m = document.getElementById('gen-modal');
        if (m) m.remove();
    }

    function saveGenericRecord(viewId) {
        var name = document.getElementById('gen-name') ? document.getElementById('gen-name').value.trim() : '';
        var status = document.getElementById('gen-status') ? document.getElementById('gen-status').value : 'Active';
        var amount = document.getElementById('gen-amount') ? document.getElementById('gen-amount').value : '0';
        if (!name) { showToast('Please enter a name.', 'warning'); return; }
        closeGenericModal();
        showToast('New record "' + name + '" added successfully!', 'success');
        navigateTo(viewId);
    }

    window.CRM = {
        navigateTo: navigateTo,
        registerView: registerView,
        render: init,
        portals: PORTALS,
        addGenericRecord: addGenericRecord,
        closeGenericModal: closeGenericModal,
        saveGenericRecord: saveGenericRecord,
        showToast: showToast
    };
})();
