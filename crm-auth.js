/* ePay CRM - Role Based Access Control (RBAC)
   Shared across all portal pages.
   - Stores the current role in localStorage.
   - Provides a role picker overlay.
   - Filters the Portals section in the sidebar by role.
   - Blocks access to pages the role is not allowed to open.
   Load this AFTER crm-engine.js on each page. */
(function () {
    'use strict';

    // ----------------------------------------------------------
    //  ROLE DEFINITIONS
    //  Each role maps to the portals it is allowed to access.
    // ----------------------------------------------------------
var ROLES = {
        'super-admin': {
            label: 'Super Admin',
            icon: 'fa-crown',
            color: '#10b981',
portals: ['superadmin', 'index', 'telecalling', 'marketing', 'support', 'devhub', 'social', 'franchise', 'gallery', 'owner', 'landing']
        },
        'gallery-owner': {
            label: 'Gallery Owner',
            icon: 'fa-user-tie',
            color: '#10b981',
portals: ['owner', 'landing']
        },
'admin': {
            label: 'Admin',
            icon: 'fa-user-shield',
            color: '#10b981',
            portals: ['admin', 'index']
        },
        'finance': {
            label: 'Finance Manager',
            icon: 'fa-coins',
            color: '#f59e0b',
            portals: ['finance', 'index']
        },
        'hr': {
            label: 'HR Manager',
            icon: 'fa-users',
            color: '#0ea5e9',
            portals: ['index']
        },
        'telecaller': {
            label: 'Telecaller',
            icon: 'fa-headset',
            color: '#22c55e',
            portals: ['telecalling']
        },
        'marketing': {
            label: 'Marketing Manager',
            icon: 'fa-bullhorn',
            color: '#eab308',
            portals: ['marketing']
        },
        'support': {
            label: 'Support Agent',
            icon: 'fa-headset',
            color: '#8b5cf6',
            portals: ['support']
        },
        'developer': {
            label: 'Developer',
            icon: 'fa-code',
            color: '#ef4444',
            portals: ['devhub']
        },
        'social': {
            label: 'Social Media Manager',
            icon: 'fa-hashtag',
            color: '#ec4899',
            portals: ['social']
        },
        'franchise-admin': {
            label: 'Franchise Admin',
            icon: 'fa-store',
            color: '#14b8a6',
            portals: ['franchise']
        },
        'gallery-manager': {
            label: 'Gallery Manager',
            icon: 'fa-images',
            color: '#f97316',
portals: ['gallery', 'landing']
        },
        'franchise-owner': {
            label: 'Franchise Owner',
            icon: 'fa-user-tie',
            color: '#10b981',
            portals: ['owner']
        }
    };

    // Map current page file -> portal id
var FILE_TO_PORTAL = {
        'index.html': 'index',
        'hr.html': 'index',
        'superadmin.html': 'superadmin',
        'admin.html': 'admin',
    'finance.html': 'finance',
    'telecalling.html': 'telecalling',
        'digital marketing.html': 'marketing',
        'technical support.html': 'support',
        'developerhub.html': 'devhub',
        'socialmediamanager.html': 'social',
        'franchise.html': 'franchise',
        'gallerymanager.html': 'gallery',
        'galleryowner.html': 'owner',
'landingpage.html': 'landing'
    };

    function currentFile() {
        return (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    }

    function currentPortal() {
        return FILE_TO_PORTAL[currentFile()] || 'landing';
    }

    function getRole() {
        try {
            var raw = localStorage.getItem('crm-role') || 'super-admin';
            return normalizeStoredRole(raw);
        } catch (e) { return 'super-admin'; }
    }

    function normalizeStoredRole(role) {
        var value = String(role || '').trim().toLowerCase();
        if (!value) return 'super-admin';
        if (value === 'franchise-owner' || value === 'galleryowner' || value === 'gallery-owner') return 'gallery-owner';
        if (value === 'gallery-manager' || value === 'gallerymanager') return 'gallery-manager';
        if (value === 'superadmin' || value === 'super-admin' || value === 'super admin') return 'super-admin';
        return value;
    }

    function setRole(role) {
        try { localStorage.setItem('crm-role', normalizeStoredRole(role)); } catch (e) {}
    }

    function roleConfig() {
        return ROLES[getRole()] || ROLES['super-admin'];
    }

    function canAccess(portalId) {
        var allowed = roleConfig().portals || [];
        return allowed.indexOf(portalId) !== -1;
    }

    // ----------------------------------------------------------
    //  ROLE PICKER OVERLAY
    // ----------------------------------------------------------
    function showRolePicker() {
        var overlay = document.createElement('div');
        overlay.id = 'crm-role-picker';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99999;background:linear-gradient(135deg,#1e1b4b,#065f46,#10b981);display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto;';
        var cards = '';
        Object.keys(ROLES).forEach(function (key) {
            var r = ROLES[key];
            var active = getRole() === key;
            cards +=
                '<button onclick="CRM.setRole(\'' + key + '\')" style="background:#fff;border:2px solid ' + (active ? r.color : '#e2e8f0') + ';border-radius:16px;padding:20px;text-align:center;cursor:pointer;transition:0.2s;min-width:150px;flex:1;max-width:200px;">' +
                '  <div style="width:48px;height:48px;border-radius:50%;background:' + r.color + ';color:#fff;display:flex;align-items:center;justify-content:center;margin:0 auto 10px;font-size:20px;"><i class="fas ' + r.icon + '"></i></div>' +
                '  <div style="font-weight:700;color:#0f172a;font-size:14px;">' + r.label + '</div>' +
                '  <div style="font-size:11px;color:#64748b;margin-top:4px;">' + (r.portals.length) + ' portal(s)</div>' +
                (active ? '<div style="margin-top:8px;font-size:11px;font-weight:700;color:' + r.color + ';">&#10003; Current</div>' : '') +
                '</button>';
        });
        overlay.innerHTML =
            '<div style="background:rgba(255,255,255,0.08);backdrop-filter:blur(20px);border-radius:24px;padding:40px;max-width:900px;width:100%;border:1px solid rgba(255,255,255,0.12);color:#fff;text-align:center;">' +
            '  <div style="font-size:32px;font-weight:800;letter-spacing:-0.5px;margin-bottom:6px;">ePay <span style="color:#34d399;">CRM</span></div>' +
            '  <div style="opacity:0.7;font-size:14px;margin-bottom:28px;">Select your role to access the appropriate portal</div>' +
            '  <div style="display:flex;flex-wrap:wrap;gap:14px;justify-content:center;">' + cards + '</div>' +
            '  <div style="margin-top:24px;font-size:12px;opacity:0.5;">Role is stored locally. You can switch roles anytime from the sidebar footer.</div>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    function hideRolePicker() {
        var o = document.getElementById('crm-role-picker');
        if (o) o.remove();
    }

    // ----------------------------------------------------------
    //  ACCESS GATE
    //  If the current role cannot access this page, show a
    //  "no access" screen with a role switcher.
    // ----------------------------------------------------------
    function enforceAccess() {
        var portal = currentPortal();
// Public pages (login screens, landing) are always accessible
        if (portal === 'landing') return true;
        if (canAccess(portal)) return true;

        // Blocked: show access denied
        var overlay = document.createElement('div');
        overlay.id = 'crm-access-denied';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:99998;background:#0f172a;display:flex;align-items:center;justify-content:center;padding:20px;';
        overlay.innerHTML =
            '<div style="background:#fff;border-radius:20px;padding:40px;max-width:420px;width:100%;text-align:center;box-shadow:0 24px 80px rgba(0,0,0,0.4);">' +
            '  <div style="width:64px;height:64px;border-radius:50%;background:#fee2e2;color:#ef4444;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;"><i class="fas fa-lock"></i></div>' +
            '  <h2 style="font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px;">Access Denied</h2>' +
            '  <p style="color:#64748b;font-size:14px;margin:0 0 20px;">Your current role (<strong>' + roleConfig().label + '</strong>) does not have permission to access this portal.</p>' +
            '  <button onclick="CRM.showRolePicker()" style="background:#10b981;color:#fff;border:none;padding:12px 24px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;width:100%;"><i class="fas fa-user-shield"></i> Switch Role</button>' +
            '</div>';
        document.body.appendChild(overlay);
        return false;
    }

    // ----------------------------------------------------------
    //  FILTER SIDEBAR PORTALS BY ROLE
    //  Called after the engine renders the sidebar.
    // ----------------------------------------------------------
    function filterPortals() {
        var allowed = roleConfig().portals || [];
        document.querySelectorAll('.crm-nav-item[data-nav="portal"]').forEach(function (a) {
            var file = (a.getAttribute('href') || '').toLowerCase();
            var pid = FILE_TO_PORTAL[file];
            if (pid && allowed.indexOf(pid) === -1) {
                a.style.display = 'none';
            }
        });
    }

    // ----------------------------------------------------------
    //  ADD ROLE SWITCHER TO SIDEBAR FOOTER
    // ----------------------------------------------------------
    function addRoleSwitcher() {
        var footer = document.querySelector('.crm-sidebar-footer');
        if (!footer) return;
        // Add a role badge/button before the logout icon
        var roleBtn = document.createElement('button');
        roleBtn.id = 'crm-role-btn';
        roleBtn.title = 'Switch role';
        roleBtn.style.cssText = 'background:none;border:none;color:#94a3b8;cursor:pointer;font-size:15px;padding:4px;transition:color 0.2s;';
        roleBtn.innerHTML = '<i class="fas fa-user-shield"></i>';
        roleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showRolePicker();
        });
        footer.insertBefore(roleBtn, footer.querySelector('.crm-logout'));
    }

    // ----------------------------------------------------------
    //  INIT
    // ----------------------------------------------------------
    function init() {
        // Normalize any legacy role values before enforcing access
        var storedRole = getRole();
        if (storedRole !== (localStorage.getItem('crm-role') || 'super-admin')) {
            setRole(storedRole);
        }

        // Enforce access first
        if (!enforceAccess()) return;

        // Filter portals in sidebar (engine renders on DOMContentLoaded)
        var run = function () {
            filterPortals();
            addRoleSwitcher();
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', run);
        } else {
            run();
        }
    }

    // Expose on CRM API
    window.CRM = window.CRM || {};
    window.CRM.setRole = function (role) {
        if (!ROLES[role]) return;
        setRole(role);
        hideRolePicker();
        var denied = document.getElementById('crm-access-denied');
        if (denied) denied.remove();
        // Re-filter sidebar and reload current page to apply access
        filterPortals();
        addRoleSwitcher();
        // If current page is now allowed, remove any denied overlay; else re-enforce
        if (!canAccess(currentPortal())) {
            enforceAccess();
        } else {
            // Refresh the page so the new role's portal set applies cleanly
            window.location.reload();
        }
    };
    window.CRM.showRolePicker = showRolePicker;
    window.CRM.getRole = getRole;
    window.CRM.roleConfig = roleConfig;
    window.CRM.canAccess = canAccess;
    window.CRM.ROLES = ROLES;

    init();
})();