(function (global) {
    'use strict';

    var ROLE_CONFIG = {
'super-admin': {
            label: 'Super Admin',
            portal: 'superadmin.html',
            galleryLogin: true,
            staff: true
        },
        'gallery-owner': {
            label: 'Gallery Owner',
            portal: 'franchiseowner.html',
            galleryLogin: true,
            staff: false
        },
        'franchise-owner': {
            label: 'Gallery Owner',
            portal: 'franchiseowner.html',
            galleryLogin: true,
            staff: false
        },
        'gallery-manager': {
            label: 'Gallery Manager',
            portal: 'gallerymanager.html',
            galleryLogin: true,
            staff: false
        },
'admin': {
            label: 'Admin',
            portal: 'admin.html',
            galleryLogin: false,
            staff: true
        },
        'hr': {
            label: 'HR',
            portal: 'index.html',
            galleryLogin: false,
            staff: true
        },
        'telecaller': {
            label: 'Telecaller',
            portal: 'telecalling.html',
            galleryLogin: false,
            staff: true
        },
        'marketing': {
            label: 'Marketing',
            portal: 'digital marketing.html',
            galleryLogin: false,
            staff: true
        },
        'finance': {
            label: 'Finance',
            portal: 'finance.html',
            galleryLogin: false,
            staff: true
        },
        'support': {
            label: 'Support',
            portal: 'technical support.html',
            galleryLogin: false,
            staff: true
        },
        'developer': {
            label: 'Developer',
            portal: 'developerhub.html',
            galleryLogin: false,
            staff: true
        },
        'social': {
            label: 'Social',
            portal: 'socialmediamanager.html',
            galleryLogin: false,
            staff: true
        }
    };

    function normalizeRole(role) {
        if (!role) return '';
        var value = String(role).trim().toLowerCase();
        if (value === 'franchise-owner') return 'gallery-owner';
        if (value === 'galleryowner') return 'gallery-owner';
        if (value === 'gallery-manager' || value === 'gallerymanager') return 'gallery-manager';
        if (value === 'superadmin' || value === 'super-admin' || value === 'super admin') return 'super-admin';
        return value;
    }

    function isGalleryLoginRole(role) {
        var normalized = normalizeRole(role);
        return normalized === 'gallery-owner' || normalized === 'gallery-manager' || normalized === 'super-admin';
    }

    function isStaffRole(role) {
        var normalized = normalizeRole(role);
        return Boolean(ROLE_CONFIG[normalized] && ROLE_CONFIG[normalized].staff);
    }

    function getRoleLabel(role) {
        var normalized = normalizeRole(role);
        return (ROLE_CONFIG[normalized] && ROLE_CONFIG[normalized].label) || 'Unknown Role';
    }

    function getGalleryLoginRedirect(role) {
        var normalized = normalizeRole(role);
if (normalized === 'gallery-manager') return 'gallerymanager.html';
        if (normalized === 'super-admin') return 'superadmin.html';
        return 'franchiseowner.html';
    }

    var api = {
        ROLE_CONFIG: ROLE_CONFIG,
        normalizeRole: normalizeRole,
        isGalleryLoginRole: isGalleryLoginRole,
        isStaffRole: isStaffRole,
        getRoleLabel: getRoleLabel,
        getGalleryLoginRedirect: getGalleryLoginRedirect
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    global.AuthRules = api;
})(typeof window !== 'undefined' ? window : globalThis);
