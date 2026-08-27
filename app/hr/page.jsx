'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { useAuth } from '@/lib/auth-context';



const cssContent = "\r\n        /* --- GREEN & WHITE THEME --- */\r\n        :root {\r\n            --green-50: #ecfdf5;\r\n            --green-100: #d1fae5;\r\n            --green-200: #a7f3d0;\r\n            --green-300: #6ee7b7;\r\n            --green-400: #34d399;\r\n            --green-500: #10b981;\r\n            --green-600: #059669;\r\n            --green-700: #047857;\r\n            --green-800: #065f46;\r\n            --green-900: #064e3b;\r\n            --white: #ffffff;\r\n            --off-white: #f9fafb;\r\n            --surface: #f0fdf4;\r\n            --text: #111827;\r\n            --text-secondary: #4b5563;\r\n            --text-muted: #6b7280;\r\n            --border: #d1fae5;\r\n            --border-light: #ecfdf5;\r\n            --radius-sm: 10px;\r\n            --radius: 14px;\r\n            --radius-lg: 20px;\r\n            --radius-xl: 28px;\r\n            --shadow-sm: 0 1px 3px rgba(5, 150, 105, 0.08), 0 1px 2px rgba(5, 150, 105, 0.04);\r\n            --shadow: 0 4px 20px rgba(5, 150, 105, 0.07), 0 1px 4px rgba(5, 150, 105, 0.05);\r\n            --shadow-md: 0 8px 30px rgba(5, 150, 105, 0.08), 0 2px 8px rgba(5, 150, 105, 0.05);\r\n            --shadow-lg: 0 20px 50px rgba(5, 150, 105, 0.10), 0 6px 16px rgba(5, 150, 105, 0.06);\r\n            --shadow-green: 0 8px 30px rgba(5, 150, 105, 0.18), 0 2px 8px rgba(5, 150, 105, 0.08);\r\n            --shadow-green-lg: 0 20px 50px rgba(5, 150, 105, 0.2), 0 6px 16px rgba(5, 150, 105, 0.1);\r\n            --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);\r\n            --transition-smooth: 0.5s cubic-bezier(0.22, 1, 0.36, 1);\r\n            --transition-bounce: 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);\r\n            --primary: #059669;\r\n            --primary-light: #34d399;\r\n            --primary-dark: #047857;\r\n            --primary-glow: rgba(5, 150, 105, 0.2);\r\n            --secondary: #10b981;\r\n            --success: #059669;\r\n            --warning: #d97706;\r\n            --danger: #dc2626;\r\n            --gray-50: #f0fdf4;\r\n            --gray-100: #ecfdf5;\r\n            --gray-200: #d1fae5;\r\n            --gray-300: #a7f3d0;\r\n            --gray-400: #6ee7b7;\r\n            --gray-500: #6b7280;\r\n            --gray-600: #4b5563;\r\n            --gray-700: #374151;\r\n            --gray-800: #1f2937;\r\n            --gray-900: #064e3b;\r\n            --sidebar-width: 260px;\r\n            --header-height: 64px;\r\n            --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\r\n        }\r\n\r\n        * {\r\n            margin: 0;\r\n            padding: 0;\r\n            box-sizing: border-box;\r\n        }\r\n\r\n        body {\r\n            font-family: var(--font);\r\n            background: #f0fdf4;\r\n            color: var(--gray-800);\r\n            display: flex;\r\n            min-height: 100vh;\r\n            overflow: hidden;\r\n            -webkit-font-smoothing: antialiased;\r\n        }\r\n\r\n        ::-webkit-scrollbar {\r\n            width: 5px;\r\n            height: 5px;\r\n        }\r\n        ::-webkit-scrollbar-track {\r\n            background: transparent;\r\n        }\r\n        ::-webkit-scrollbar-thumb {\r\n            background: var(--gray-300);\r\n            border-radius: 10px;\r\n        }\r\n        ::-webkit-scrollbar-thumb:hover {\r\n            background: var(--gray-400);\r\n        }\r\n\r\n        /* --- SIDEBAR (Dark Green) --- */\r\n        #sidebar {\r\n            width: var(--sidebar-width);\r\n            height: 100vh;\r\n            background: #064e3b;\r\n            color: #d1fae5;\r\n            display: flex;\r\n            flex-direction: column;\r\n            position: fixed;\r\n            top: 0;\r\n            left: 0;\r\n            z-index: 100;\r\n            transition: transform var(--transition);\r\n            overflow-y: auto;\r\n            padding: 0 0 16px 0;\r\n            border-right: 1px solid rgba(255, 255, 255, 0.04);\r\n        }\r\n        #sidebar .brand {\r\n            padding: 20px 24px 16px;\r\n            font-size: 22px;\r\n            font-weight: 700;\r\n            letter-spacing: -0.5px;\r\n            border-bottom: 1px solid rgba(255, 255, 255, 0.06);\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 10px;\r\n            flex-shrink: 0;\r\n        }\r\n        #sidebar .brand i {\r\n            color: #6ee7b7;\r\n            font-size: 28px;\r\n        }\r\n        #sidebar .brand span {\r\n            color: #fff;\r\n        }\r\n        #sidebar .brand small {\r\n            font-size: 11px;\r\n            font-weight: 400;\r\n            opacity: 0.4;\r\n            margin-left: auto;\r\n            background: rgba(255, 255, 255, 0.06);\r\n            padding: 2px 10px;\r\n            border-radius: 20px;\r\n        }\r\n\r\n        .nav-section {\r\n            padding: 18px 24px 6px 24px;\r\n            font-size: 10px;\r\n            text-transform: uppercase;\r\n            letter-spacing: 0.8px;\r\n            opacity: 0.5;\r\n            font-weight: 600;\r\n            color: #6ee7b7;\r\n        }\r\n        .nav-item {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 14px;\r\n            padding: 9px 20px;\r\n            margin: 1px 12px;\r\n            border-radius: var(--radius-sm);\r\n            cursor: pointer;\r\n            transition: all var(--transition);\r\n            color: #a7f3d0;\r\n            text-decoration: none;\r\n            font-size: 13.5px;\r\n            font-weight: 500;\r\n            position: relative;\r\n            user-select: none;\r\n        }\r\n        .nav-item:hover {\r\n            background: rgba(255, 255, 255, 0.07);\r\n            color: #fff;\r\n        }\r\n        .nav-item.active {\r\n            background: rgba(16, 185, 129, 0.2);\r\n            color: #fff;\r\n            box-shadow: inset 0 0 0 1px rgba(16, 185, 129, 0.15);\r\n        }\r\n        .nav-item.active::before {\r\n            content: '';\r\n            position: absolute;\r\n            left: 0;\r\n            top: 12%;\r\n            height: 76%;\r\n            width: 3px;\r\n            background: #6ee7b7;\r\n            border-radius: 0 4px 4px 0;\r\n            box-shadow: 0 0 12px rgba(16, 185, 129, 0.3);\r\n        }\r\n        .nav-item i {\r\n            width: 20px;\r\n            text-align: center;\r\n            font-size: 15px;\r\n            flex-shrink: 0;\r\n        }\r\n        .nav-item .badge {\r\n            margin-left: auto;\r\n            background: #dc2626;\r\n            color: #fff;\r\n            font-size: 9px;\r\n            padding: 1px 9px;\r\n            border-radius: 20px;\r\n            font-weight: 600;\r\n            letter-spacing: 0.3px;\r\n        }\r\n        .nav-item .badge.green {\r\n            background: #059669;\r\n        }\r\n        .nav-item .badge.warning {\r\n            background: #d97706;\r\n        }\r\n\r\n        .sidebar-footer {\r\n            margin-top: auto;\r\n            padding: 14px 20px;\r\n            border-top: 1px solid rgba(255, 255, 255, 0.05);\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 12px;\r\n            font-size: 13px;\r\n            color: #a7f3d0;\r\n            flex-shrink: 0;\r\n        }\r\n        .sidebar-footer .avatar {\r\n            width: 38px;\r\n            height: 38px;\r\n            border-radius: 50%;\r\n            background: linear-gradient(135deg, #059669, #047857);\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            color: #fff;\r\n            font-weight: 600;\r\n            font-size: 15px;\r\n            flex-shrink: 0;\r\n            box-shadow: 0 2px 8px rgba(5, 150, 105, 0.3);\r\n        }\r\n        .sidebar-footer .info {\r\n            flex: 1;\r\n            min-width: 0;\r\n        }\r\n        .sidebar-footer .info .name {\r\n            color: #fff;\r\n            font-weight: 500;\r\n            font-size: 13px;\r\n            white-space: nowrap;\r\n            overflow: hidden;\r\n            text-overflow: ellipsis;\r\n        }\r\n        .sidebar-footer .info .role {\r\n            font-size: 11px;\r\n            opacity: 0.45;\r\n            white-space: nowrap;\r\n            overflow: hidden;\r\n            text-overflow: ellipsis;\r\n        }\r\n        .sidebar-footer .logout-btn {\r\n            background: none;\r\n            border: none;\r\n            color: #a7f3d0;\r\n            cursor: pointer;\r\n            font-size: 17px;\r\n            transition: var(--transition);\r\n            padding: 6px;\r\n            border-radius: 50%;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n        }\r\n        .sidebar-footer .logout-btn:hover {\r\n            color: #dc2626;\r\n            background: rgba(239, 68, 68, 0.12);\r\n        }\r\n\r\n        /* --- MAIN --- */\r\n        #main {\r\n            margin-left: var(--sidebar-width);\r\n            flex: 1;\r\n            display: flex;\r\n            flex-direction: column;\r\n            height: 100vh;\r\n            overflow: hidden;\r\n            background: #f0fdf4;\r\n        }\r\n\r\n        /* --- HEADER --- */\r\n        #header {\r\n            height: var(--header-height);\r\n            background: rgba(255, 255, 255, 0.85);\r\n            backdrop-filter: blur(12px);\r\n            -webkit-backdrop-filter: blur(12px);\r\n            border-bottom: 1px solid #d1fae5;\r\n            display: flex;\r\n            align-items: center;\r\n            padding: 0 28px;\r\n            gap: 16px;\r\n            flex-shrink: 0;\r\n            position: sticky;\r\n            top: 0;\r\n            z-index: 50;\r\n        }\r\n        #header .hamburger {\r\n            display: none;\r\n            background: none;\r\n            border: none;\r\n            font-size: 22px;\r\n            color: var(--gray-700);\r\n            cursor: pointer;\r\n            padding: 4px 8px;\r\n            border-radius: var(--radius-sm);\r\n            transition: var(--transition);\r\n        }\r\n        #header .hamburger:hover {\r\n            background: var(--gray-100);\r\n        }\r\n        #header .page-title {\r\n            font-size: 19px;\r\n            font-weight: 600;\r\n            flex: 1;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 8px;\r\n            color: #064e3b;\r\n        }\r\n        #header .page-title small {\r\n            font-weight: 400;\r\n            color: var(--gray-500);\r\n            font-size: 13px;\r\n            margin-left: 4px;\r\n        }\r\n        .header-actions {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 12px;\r\n        }\r\n        .header-actions .search-box {\r\n            display: flex;\r\n            align-items: center;\r\n            background: #ecfdf5;\r\n            border-radius: 30px;\r\n            padding: 6px 16px 6px 14px;\r\n            gap: 8px;\r\n            border: 1px solid transparent;\r\n            transition: all var(--transition);\r\n        }\r\n        .header-actions .search-box:focus-within {\r\n            border-color: #059669;\r\n            background: #fff;\r\n            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.15);\r\n        }\r\n        .header-actions .search-box input {\r\n            border: none;\r\n            background: transparent;\r\n            outline: none;\r\n            font-size: 13px;\r\n            padding: 6px 0;\r\n            width: 160px;\r\n            color: var(--gray-700);\r\n            font-family: var(--font);\r\n        }\r\n        .header-actions .search-box input::placeholder {\r\n            color: var(--gray-400);\r\n        }\r\n        .header-actions .search-box i {\r\n            color: var(--gray-400);\r\n            font-size: 14px;\r\n        }\r\n        .header-actions .notif {\r\n            position: relative;\r\n            background: none;\r\n            border: none;\r\n            font-size: 20px;\r\n            color: var(--gray-600);\r\n            cursor: pointer;\r\n            padding: 8px;\r\n            border-radius: 50%;\r\n            transition: var(--transition);\r\n        }\r\n        .header-actions .notif:hover {\r\n            background: #ecfdf5;\r\n        }\r\n        .header-actions .notif .dot {\r\n            position: absolute;\r\n            top: 4px;\r\n            right: 4px;\r\n            width: 9px;\r\n            height: 9px;\r\n            background: #dc2626;\r\n            border-radius: 50%;\r\n            border: 2px solid #fff;\r\n            animation: pulse-dot 2s infinite;\r\n        }\r\n        @keyframes pulse-dot {\r\n            0%,\r\n            100% {\r\n                transform: scale(1);\r\n                opacity: 1;\r\n            }\r\n            50% {\r\n                transform: scale(1.3);\r\n                opacity: 0.7;\r\n            }\r\n        }\r\n\r\n        /* --- PAGE CONTENT --- */\r\n        #pageContent {\r\n            flex: 1;\r\n            overflow-y: auto;\r\n            padding: 24px 32px 40px;\r\n        }\r\n\r\n        /* --- STATS GRID --- */\r\n        .stats-grid {\r\n            display: grid;\r\n            grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));\r\n            gap: 16px;\r\n            margin-bottom: 28px;\r\n        }\r\n        .stat-card {\r\n            background: #fff;\r\n            border-radius: var(--radius);\r\n            padding: 18px 22px;\r\n            box-shadow: var(--shadow);\r\n            border: 1px solid #d1fae5;\r\n            transition: all var(--transition);\r\n            position: relative;\r\n            overflow: hidden;\r\n        }\r\n        .stat-card::after {\r\n            content: '';\r\n            position: absolute;\r\n            top: 0;\r\n            left: 0;\r\n            right: 0;\r\n            height: 3px;\r\n            background: linear-gradient(90deg, #059669, #34d399);\r\n            opacity: 0;\r\n            transition: var(--transition);\r\n        }\r\n        .stat-card:hover::after {\r\n            opacity: 1;\r\n        }\r\n        .stat-card:hover {\r\n            transform: translateY(-3px);\r\n            box-shadow: var(--shadow-lg);\r\n            border-color: #059669;\r\n        }\r\n        .stat-card .label {\r\n            font-size: 12.5px;\r\n            color: var(--gray-500);\r\n            font-weight: 500;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 8px;\r\n        }\r\n        .stat-card .label i {\r\n            font-size: 14px;\r\n            opacity: 0.7;\r\n            color: #059669;\r\n        }\r\n        .stat-card .value {\r\n            font-size: 30px;\r\n            font-weight: 700;\r\n            margin-top: 2px;\r\n            color: #064e3b;\r\n            letter-spacing: -0.5px;\r\n        }\r\n        .stat-card .change {\r\n            font-size: 11.5px;\r\n            font-weight: 500;\r\n            margin-top: 6px;\r\n            display: inline-block;\r\n            padding: 2px 12px;\r\n            border-radius: 20px;\r\n            background: #ecfdf5;\r\n        }\r\n        .stat-card .change.up {\r\n            color: #059669;\r\n            background: #dcfce7;\r\n        }\r\n        .stat-card .change.down {\r\n            color: #dc2626;\r\n            background: #fee2e2;\r\n        }\r\n        .stat-card .change.neutral {\r\n            color: var(--gray-500);\r\n            background: #ecfdf5;\r\n        }\r\n\r\n        /* --- SECTION HEADER --- */\r\n        .section-header {\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: center;\r\n            margin: 28px 0 16px;\r\n            flex-wrap: wrap;\r\n            gap: 12px;\r\n        }\r\n        .section-header h2 {\r\n            font-size: 20px;\r\n            font-weight: 600;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 10px;\r\n            color: #064e3b;\r\n        }\r\n        .section-header h2 i {\r\n            color: #059669;\r\n        }\r\n        .section-header h2 .sub {\r\n            font-size: 13px;\r\n            font-weight: 400;\r\n            color: var(--gray-500);\r\n            margin-left: 4px;\r\n        }\r\n\r\n        /* --- BUTTONS --- */\r\n        .btn {\r\n            padding: 8px 22px;\r\n            border: none;\r\n            border-radius: var(--radius-sm);\r\n            font-weight: 600;\r\n            font-size: 13px;\r\n            cursor: pointer;\r\n            display: inline-flex;\r\n            align-items: center;\r\n            gap: 8px;\r\n            transition: all var(--transition);\r\n            background: #d1fae5;\r\n            color: #064e3b;\r\n            font-family: var(--font);\r\n            text-decoration: none;\r\n            white-space: nowrap;\r\n        }\r\n        .btn:hover {\r\n            transform: translateY(-2px);\r\n            box-shadow: 0 4px 14px rgba(5, 150, 105, 0.12);\r\n        }\r\n        .btn:active {\r\n            transform: scale(0.97);\r\n        }\r\n        .btn-primary {\r\n            background: #059669;\r\n            color: #fff;\r\n        }\r\n        .btn-primary:hover {\r\n            background: #047857;\r\n            box-shadow: 0 4px 16px rgba(5, 150, 105, 0.25);\r\n        }\r\n        .btn-success {\r\n            background: #059669;\r\n            color: #fff;\r\n        }\r\n        .btn-success:hover {\r\n            background: #047857;\r\n        }\r\n        .btn-danger {\r\n            background: #dc2626;\r\n            color: #fff;\r\n        }\r\n        .btn-danger:hover {\r\n            background: #b91c1c;\r\n        }\r\n        .btn-warning {\r\n            background: #d97706;\r\n            color: #fff;\r\n        }\r\n        .btn-warning:hover {\r\n            background: #b45309;\r\n        }\r\n        .btn-sm {\r\n            padding: 4px 14px;\r\n            font-size: 11.5px;\r\n            border-radius: 6px;\r\n        }\r\n        .btn-xs {\r\n            padding: 2px 10px;\r\n            font-size: 10px;\r\n            border-radius: 4px;\r\n        }\r\n        .btn-outline {\r\n            background: transparent;\r\n            border: 1px solid #d1fae5;\r\n            color: #064e3b;\r\n        }\r\n        .btn-outline:hover {\r\n            background: #ecfdf5;\r\n            border-color: #a7f3d0;\r\n        }\r\n        .btn-ghost {\r\n            background: transparent;\r\n            color: #064e3b;\r\n        }\r\n        .btn-ghost:hover {\r\n            background: #ecfdf5;\r\n        }\r\n\r\n        /* --- TABLE --- */\r\n        .table-wrap {\r\n            background: #fff;\r\n            border-radius: var(--radius);\r\n            border: 1px solid #d1fae5;\r\n            overflow: hidden;\r\n            box-shadow: var(--shadow);\r\n        }\r\n        .table-scroll {\r\n            overflow-x: auto;\r\n        }\r\n        table {\r\n            width: 100%;\r\n            border-collapse: collapse;\r\n            font-size: 13.5px;\r\n        }\r\n        table th {\r\n            background: #ecfdf5;\r\n            text-align: left;\r\n            padding: 12px 16px;\r\n            font-weight: 600;\r\n            color: #064e3b;\r\n            border-bottom: 1px solid #d1fae5;\r\n            white-space: nowrap;\r\n            font-size: 12px;\r\n            text-transform: uppercase;\r\n            letter-spacing: 0.4px;\r\n        }\r\n        table td {\r\n            padding: 11px 16px;\r\n            border-bottom: 1px solid #ecfdf5;\r\n            vertical-align: middle;\r\n            color: var(--gray-700);\r\n        }\r\n        table tr:last-child td {\r\n            border-bottom: none;\r\n        }\r\n        table tr:hover td {\r\n            background: #ecfdf5;\r\n        }\r\n        table .clickable-row {\r\n            cursor: pointer;\r\n        }\r\n        table .clickable-row:hover td {\r\n            background: #ecfdf5;\r\n        }\r\n\r\n        /* --- STATUS BADGES (Green scale) --- */\r\n        .status-badge {\r\n            display: inline-block;\r\n            padding: 2px 14px;\r\n            border-radius: 20px;\r\n            font-size: 11.5px;\r\n            font-weight: 600;\r\n            text-transform: capitalize;\r\n            letter-spacing: 0.2px;\r\n        }\r\n        .status-badge.active,\r\n        .status-badge.approved,\r\n        .status-badge.positive,\r\n        .status-badge.completed,\r\n        .status-badge.resolved,\r\n        .status-badge.verified,\r\n        .status-badge.accepted,\r\n        .status-badge.sent,\r\n        .status-badge.generated {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.pending,\r\n        .status-badge.review,\r\n        .status-badge.in-progress,\r\n        .status-badge.open,\r\n        .status-badge.scheduled,\r\n        .status-badge.pending-approval,\r\n        .status-badge.due-today {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.inactive,\r\n        .status-badge.expired,\r\n        .status-badge.cancelled,\r\n        .status-badge.withdrawn,\r\n        .status-badge.rejected,\r\n        .status-badge.missing,\r\n        .status-badge.error,\r\n        .status-badge.overdue,\r\n        .status-badge.draft {\r\n            background: #fee2e2;\r\n            color: #b91c1c;\r\n        }\r\n        .status-badge.high,\r\n        .status-badge.critical {\r\n            background: #fee2e2;\r\n            color: #b91c1c;\r\n        }\r\n        .status-badge.medium,\r\n        .status-badge.warning {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.low {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.interested,\r\n        .status-badge.follow-up {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.converted,\r\n        .status-badge.shortlisted,\r\n        .status-badge.interviewed,\r\n        .status-badge.offered {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.paid {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.submitted {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.present,\r\n        .status-badge.late {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .status-badge.absent {\r\n            background: #fee2e2;\r\n            color: #b91c1c;\r\n        }\r\n        .status-badge.leave {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.half-day {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.previewed {\r\n            background: #dbeafe;\r\n            color: #1d4ed8;\r\n        }\r\n        .status-badge.viewed {\r\n            background: #dbeafe;\r\n            color: #1d4ed8;\r\n        }\r\n        .status-badge['pending-approval'] {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .status-badge.on-hold {\r\n            background: #f3e8ff;\r\n            color: #7c3aed;\r\n        }\r\n        .status-badge.new {\r\n            background: #f3e8ff;\r\n            color: #7c3aed;\r\n        }\r\n\r\n        /* --- AVATARS --- */\r\n        .avatar-sm {\r\n            width: 32px;\r\n            height: 32px;\r\n            border-radius: 50%;\r\n            background: #059669;\r\n            color: #fff;\r\n            display: inline-flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            font-weight: 600;\r\n            font-size: 12px;\r\n            margin-right: 8px;\r\n            flex-shrink: 0;\r\n            text-transform: uppercase;\r\n        }\r\n        .avatar-sm.green {\r\n            background: #059669;\r\n        }\r\n        .avatar-sm.orange {\r\n            background: #d97706;\r\n        }\r\n        .avatar-sm.purple {\r\n            background: #7c3aed;\r\n        }\r\n        .avatar-sm.red {\r\n            background: #dc2626;\r\n        }\r\n        .avatar-sm.blue {\r\n            background: #059669;\r\n        }\r\n        .avatar-sm.gray {\r\n            background: #6b7280;\r\n        }\r\n        .avatar-sm.sm {\r\n            width: 28px;\r\n            height: 28px;\r\n            font-size: 10px;\r\n        }\r\n\r\n        .cell-flex {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 6px;\r\n        }\r\n        .text-muted {\r\n            color: var(--gray-500);\r\n            font-size: 13px;\r\n        }\r\n        .text-sm {\r\n            font-size: 12.5px;\r\n        }\r\n        .text-xs {\r\n            font-size: 11px;\r\n        }\r\n        .fw-600 {\r\n            font-weight: 600;\r\n        }\r\n        .gap-8 {\r\n            gap: 8px;\r\n        }\r\n        .gap-12 {\r\n            gap: 12px;\r\n        }\r\n        .mt-8 {\r\n            margin-top: 8px;\r\n        }\r\n        .mb-8 {\r\n            margin-bottom: 8px;\r\n        }\r\n        .w-full {\r\n            width: 100%;\r\n        }\r\n        .text-center {\r\n            text-align: center;\r\n        }\r\n        .text-right {\r\n            text-align: right;\r\n        }\r\n\r\n        /* --- TABS --- */\r\n        .tabs {\r\n            display: flex;\r\n            gap: 4px;\r\n            background: #ecfdf5;\r\n            padding: 4px;\r\n            border-radius: 10px;\r\n            margin-bottom: 20px;\r\n            flex-wrap: wrap;\r\n        }\r\n        .tab {\r\n            padding: 7px 18px;\r\n            border: none;\r\n            background: transparent;\r\n            border-radius: var(--radius-sm);\r\n            font-weight: 500;\r\n            font-size: 12.5px;\r\n            cursor: pointer;\r\n            color: #064e3b;\r\n            transition: all var(--transition);\r\n            font-family: var(--font);\r\n        }\r\n        .tab:hover {\r\n            color: #047857;\r\n        }\r\n        .tab.active {\r\n            background: #fff;\r\n            color: #064e3b;\r\n            box-shadow: 0 2px 8px rgba(5, 150, 105, 0.08);\r\n        }\r\n\r\n        /* --- MODAL --- */\r\n        .modal-overlay {\r\n            position: fixed;\r\n            inset: 0;\r\n            z-index: 999;\r\n            background: rgba(5, 150, 105, 0.25);\r\n            backdrop-filter: blur(6px);\r\n            -webkit-backdrop-filter: blur(6px);\r\n            display: none;\r\n            align-items: center;\r\n            justify-content: center;\r\n            padding: 20px;\r\n            animation: fadeIn 0.2s ease;\r\n        }\r\n        .modal-overlay.open {\r\n            display: flex;\r\n        }\r\n        @keyframes fadeIn {\r\n            from {\r\n                opacity: 0;\r\n            }\r\n            to {\r\n                opacity: 1;\r\n            }\r\n        }\r\n        .modal {\r\n            background: #fff;\r\n            border-radius: 18px;\r\n            max-width: 820px;\r\n            width: 100%;\r\n            max-height: 90vh;\r\n            overflow-y: auto;\r\n            padding: 32px 36px;\r\n            box-shadow: 0 32px 80px rgba(5, 150, 105, 0.15);\r\n            animation: modalSlide 0.3s ease;\r\n        }\r\n        @keyframes modalSlide {\r\n            from {\r\n                transform: scale(0.95) translateY(20px);\r\n                opacity: 0;\r\n            }\r\n            to {\r\n                transform: scale(1) translateY(0);\r\n                opacity: 1;\r\n            }\r\n        }\r\n        .modal .modal-header {\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: center;\r\n            margin-bottom: 22px;\r\n            padding-bottom: 14px;\r\n            border-bottom: 1px solid #d1fae5;\r\n        }\r\n        .modal .modal-header h3 {\r\n            font-size: 20px;\r\n            font-weight: 600;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 10px;\r\n            color: #064e3b;\r\n        }\r\n        .modal .modal-header h3 i {\r\n            color: #059669;\r\n        }\r\n        .modal .modal-header .close {\r\n            background: none;\r\n            border: none;\r\n            font-size: 26px;\r\n            color: var(--gray-400);\r\n            cursor: pointer;\r\n            padding: 4px 8px;\r\n            border-radius: 50%;\r\n            transition: var(--transition);\r\n            line-height: 1;\r\n        }\r\n        .modal .modal-header .close:hover {\r\n            color: var(--gray-700);\r\n            background: #ecfdf5;\r\n        }\r\n        .modal .form-group {\r\n            margin-bottom: 16px;\r\n        }\r\n        .modal .form-group label {\r\n            display: block;\r\n            font-weight: 500;\r\n            font-size: 12.5px;\r\n            color: #064e3b;\r\n            margin-bottom: 4px;\r\n        }\r\n        .modal .form-group label .required {\r\n            color: #dc2626;\r\n            margin-left: 2px;\r\n        }\r\n        .modal .form-group input,\r\n        .modal .form-group select,\r\n        .modal .form-group textarea {\r\n            width: 100%;\r\n            padding: 9px 14px;\r\n            border: 1px solid #d1fae5;\r\n            border-radius: var(--radius-sm);\r\n            font-size: 13.5px;\r\n            outline: none;\r\n            transition: all var(--transition);\r\n            font-family: var(--font);\r\n            background: #fff;\r\n            color: var(--gray-800);\r\n        }\r\n        .modal .form-group input:focus,\r\n        .modal .form-group select:focus,\r\n        .modal .form-group textarea:focus {\r\n            border-color: #059669;\r\n            box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);\r\n        }\r\n        .modal .form-group textarea {\r\n            resize: vertical;\r\n            min-height: 70px;\r\n        }\r\n        .modal .form-row {\r\n            display: grid;\r\n            grid-template-columns: 1fr 1fr;\r\n            gap: 14px;\r\n        }\r\n        .modal .form-actions {\r\n            display: flex;\r\n            gap: 10px;\r\n            justify-content: flex-end;\r\n            margin-top: 22px;\r\n            padding-top: 16px;\r\n            border-top: 1px solid #d1fae5;\r\n        }\r\n\r\n        /* --- CHART GRID --- */\r\n        .chart-grid {\r\n            display: grid;\r\n            grid-template-columns: 1fr 1fr;\r\n            gap: 20px;\r\n            margin-bottom: 28px;\r\n        }\r\n        .chart-box {\r\n            background: #fff;\r\n            border-radius: var(--radius);\r\n            padding: 20px 22px;\r\n            border: 1px solid #d1fae5;\r\n            box-shadow: var(--shadow);\r\n        }\r\n        .chart-box h4 {\r\n            font-size: 14px;\r\n            font-weight: 600;\r\n            color: #064e3b;\r\n            margin-bottom: 14px;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 8px;\r\n        }\r\n        .chart-box h4 i {\r\n            color: #059669;\r\n        }\r\n        .chart-box canvas {\r\n            max-height: 210px;\r\n            max-width: 100%;\r\n        }\r\n\r\n        /* --- AI INSIGHT --- */\r\n        .ai-insight {\r\n            background: linear-gradient(135deg, #064e3b 0%, #047857 100%);\r\n            color: #fff;\r\n            border-radius: var(--radius);\r\n            padding: 18px 26px;\r\n            margin-bottom: 20px;\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 18px;\r\n            flex-wrap: wrap;\r\n            border: 1px solid rgba(255, 255, 255, 0.06);\r\n        }\r\n        .ai-insight i {\r\n            font-size: 30px;\r\n            color: #6ee7b7;\r\n            flex-shrink: 0;\r\n        }\r\n        .ai-insight .content {\r\n            flex: 1;\r\n            min-width: 160px;\r\n        }\r\n        .ai-insight .content .title {\r\n            font-size: 11px;\r\n            font-weight: 600;\r\n            text-transform: uppercase;\r\n            letter-spacing: 0.6px;\r\n            opacity: 0.5;\r\n        }\r\n        .ai-insight .content .message {\r\n            font-size: 14.5px;\r\n            font-weight: 450;\r\n            line-height: 1.5;\r\n        }\r\n        .ai-insight .badge-ai {\r\n            background: rgba(16, 185, 129, 0.2);\r\n            padding: 4px 14px;\r\n            border-radius: 20px;\r\n            font-size: 10px;\r\n            font-weight: 600;\r\n            color: #6ee7b7;\r\n            border: 1px solid rgba(16, 185, 129, 0.2);\r\n            letter-spacing: 0.5px;\r\n            animation: pulse-badge 2s infinite;\r\n        }\r\n        @keyframes pulse-badge {\r\n            0%,\r\n            100% {\r\n                opacity: 1;\r\n            }\r\n            50% {\r\n                opacity: 0.6;\r\n            }\r\n        }\r\n\r\n        /* --- FILTER BAR --- */\r\n        .filter-bar {\r\n            background: #fff;\r\n            border-radius: var(--radius);\r\n            padding: 16px 20px;\r\n            border: 1px solid #d1fae5;\r\n            margin-bottom: 20px;\r\n            display: flex;\r\n            flex-wrap: wrap;\r\n            gap: 14px;\r\n            align-items: flex-end;\r\n            box-shadow: var(--shadow);\r\n        }\r\n        .filter-bar .filter-group {\r\n            display: flex;\r\n            flex-direction: column;\r\n            gap: 4px;\r\n            flex: 1 1 140px;\r\n            min-width: 120px;\r\n        }\r\n        .filter-bar .filter-group label {\r\n            font-size: 10.5px;\r\n            font-weight: 600;\r\n            color: var(--gray-500);\r\n            text-transform: uppercase;\r\n            letter-spacing: 0.5px;\r\n        }\r\n        .filter-bar .filter-group input,\r\n        .filter-bar .filter-group select {\r\n            padding: 7px 12px;\r\n            border: 1px solid #d1fae5;\r\n            border-radius: 6px;\r\n            font-size: 13px;\r\n            outline: none;\r\n            background: #fff;\r\n            font-family: var(--font);\r\n            color: var(--gray-800);\r\n            transition: var(--transition);\r\n        }\r\n        .filter-bar .filter-group input:focus,\r\n        .filter-bar .filter-group select:focus {\r\n            border-color: #059669;\r\n            box-shadow: 0 0 0 2px rgba(5, 150, 105, 0.1);\r\n        }\r\n        .filter-bar .filter-actions {\r\n            display: flex;\r\n            gap: 8px;\r\n            flex-wrap: wrap;\r\n        }\r\n\r\n        /* --- DOCUMENT CARDS --- */\r\n        .doc-grid {\r\n            display: grid;\r\n            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));\r\n            gap: 16px;\r\n            margin-top: 8px;\r\n        }\r\n        .doc-card {\r\n            background: #fff;\r\n            border-radius: var(--radius);\r\n            padding: 20px 16px;\r\n            border: 1px solid #d1fae5;\r\n            box-shadow: var(--shadow);\r\n            text-align: center;\r\n            cursor: pointer;\r\n            transition: all var(--transition);\r\n        }\r\n        .doc-card:hover {\r\n            transform: translateY(-4px);\r\n            box-shadow: var(--shadow-lg);\r\n            border-color: #059669;\r\n        }\r\n        .doc-card i {\r\n            font-size: 34px;\r\n            color: #059669;\r\n            margin-bottom: 6px;\r\n        }\r\n        .doc-card h4 {\r\n            font-size: 13.5px;\r\n            font-weight: 600;\r\n            margin: 6px 0 2px;\r\n            color: #064e3b;\r\n        }\r\n        .doc-card p {\r\n            font-size: 11.5px;\r\n            color: var(--gray-500);\r\n            margin: 0;\r\n        }\r\n        .doc-card .badge-doc {\r\n            display: inline-block;\r\n            margin-top: 8px;\r\n            padding: 2px 14px;\r\n            border-radius: 20px;\r\n            font-size: 10px;\r\n            font-weight: 600;\r\n            background: #ecfdf5;\r\n            color: #064e3b;\r\n        }\r\n        .doc-card .badge-doc.blue {\r\n            background: #dbeafe;\r\n            color: #1d4ed8;\r\n        }\r\n        .doc-card .badge-doc.green {\r\n            background: #dcfce7;\r\n            color: #065f46;\r\n        }\r\n        .doc-card .badge-doc.orange {\r\n            background: #fef3c7;\r\n            color: #b45309;\r\n        }\r\n        .doc-card .badge-doc.red {\r\n            background: #fee2e2;\r\n            color: #b91c1c;\r\n        }\r\n        .doc-card .badge-doc.purple {\r\n            background: #f3e8ff;\r\n            color: #7c3aed;\r\n        }\r\n\r\n        /* --- TOAST --- */\r\n        .toast-container {\r\n            position: fixed;\r\n            bottom: 24px;\r\n            right: 24px;\r\n            z-index: 99999;\r\n            display: flex;\r\n            flex-direction: column;\r\n            gap: 8px;\r\n            max-width: 380px;\r\n            width: 100%;\r\n        }\r\n        .toast {\r\n            background: #064e3b;\r\n            color: #fff;\r\n            padding: 14px 20px;\r\n            border-radius: 12px;\r\n            box-shadow: 0 8px 32px rgba(5, 150, 105, 0.2);\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 12px;\r\n            font-size: 13.5px;\r\n            animation: slideUp 0.35s ease;\r\n            border-left: 4px solid #059669;\r\n            backdrop-filter: blur(4px);\r\n        }\r\n        .toast.success {\r\n            border-left-color: #059669;\r\n        }\r\n        .toast.error {\r\n            border-left-color: #dc2626;\r\n        }\r\n        .toast.warning {\r\n            border-left-color: #d97706;\r\n        }\r\n        .toast.info {\r\n            border-left-color: #059669;\r\n        }\r\n        @keyframes slideUp {\r\n            from {\r\n                transform: translateY(24px) scale(0.96);\r\n                opacity: 0;\r\n            }\r\n            to {\r\n                transform: translateY(0) scale(1);\r\n                opacity: 1;\r\n            }\r\n        }\r\n        .toast i {\r\n            font-size: 18px;\r\n            flex-shrink: 0;\r\n        }\r\n        .toast .toast-close {\r\n            margin-left: auto;\r\n            background: none;\r\n            border: none;\r\n            color: rgba(255, 255, 255, 0.35);\r\n            cursor: pointer;\r\n            font-size: 16px;\r\n            padding: 0 4px;\r\n            transition: var(--transition);\r\n        }\r\n        .toast .toast-close:hover {\r\n            color: #fff;\r\n        }\r\n\r\n        /* --- EMPTY STATE --- */\r\n        .empty-state {\r\n            text-align: center;\r\n            padding: 48px 20px;\r\n            color: var(--gray-500);\r\n        }\r\n        .empty-state i {\r\n            font-size: 48px;\r\n            opacity: 0.25;\r\n            margin-bottom: 12px;\r\n        }\r\n        .empty-state h4 {\r\n            color: var(--gray-700);\r\n            margin-bottom: 4px;\r\n            font-weight: 500;\r\n        }\r\n\r\n        /* --- RESPONSIVE --- */\r\n        @media (max-width: 992px) {\r\n            .chart-grid {\r\n                grid-template-columns: 1fr;\r\n            }\r\n            .modal .form-row {\r\n                grid-template-columns: 1fr;\r\n            }\r\n            .stats-grid {\r\n                grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\r\n            }\r\n        }\r\n        @media (max-width: 768px) {\r\n            #sidebar {\r\n                transform: translateX(-100%);\r\n            }\r\n            #sidebar.open {\r\n                transform: translateX(0);\r\n                box-shadow: 0 0 40px rgba(0, 0, 0, 0.3);\r\n            }\r\n            #main {\r\n                margin-left: 0;\r\n            }\r\n            #header .hamburger {\r\n                display: block;\r\n            }\r\n            #header .page-title small {\r\n                display: none;\r\n            }\r\n            .header-actions .search-box input {\r\n                width: 100px;\r\n            }\r\n            #pageContent {\r\n                padding: 16px;\r\n            }\r\n            .stats-grid {\r\n                grid-template-columns: 1fr 1fr;\r\n            }\r\n            .modal {\r\n                padding: 24px 20px;\r\n                margin: 12px;\r\n            }\r\n            .filter-bar .filter-group {\r\n                flex: 1 1 100%;\r\n                min-width: 0;\r\n            }\r\n            .doc-grid {\r\n                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));\r\n            }\r\n        }\r\n        @media (max-width: 480px) {\r\n            .stats-grid {\r\n                grid-template-columns: 1fr;\r\n            }\r\n            .header-actions .search-box {\r\n                display: none;\r\n            }\r\n            #header {\r\n                padding: 0 16px;\r\n            }\r\n            .modal .form-row {\r\n                grid-template-columns: 1fr;\r\n            }\r\n            .ai-insight {\r\n                flex-direction: column;\r\n                align-items: flex-start;\r\n            }\r\n            .ai-insight .badge-ai {\r\n                align-self: flex-start;\r\n            }\r\n        }\r\n\r\n        /* --- UTILITY --- */\r\n        .hidden {\r\n            display: none !important;\r\n        }\r\n        .flex {\r\n            display: flex;\r\n        }\r\n        .flex-center {\r\n            align-items: center;\r\n            justify-content: center;\r\n        }\r\n        .flex-between {\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: center;\r\n        }\r\n        .flex-wrap {\r\n            flex-wrap: wrap;\r\n        }\r\n        .gap-8 {\r\n            gap: 8px;\r\n        }\r\n        .gap-12 {\r\n            gap: 12px;\r\n        }\r\n        .mt-8 {\r\n            margin-top: 8px;\r\n        }\r\n        .mb-8 {\r\n            margin-bottom: 8px;\r\n        }\r\n        .w-full {\r\n            width: 100%;\r\n        }\r\n        .text-center {\r\n            text-align: center;\r\n        }\r\n        .text-muted {\r\n            color: var(--gray-500);\r\n        }\r\n        .text-sm {\r\n            font-size: 12.5px;\r\n        }\r\n        .text-xs {\r\n            font-size: 11px;\r\n        }\r\n        .fw-600 {\r\n            font-weight: 600;\r\n        }\r\n        .truncate {\r\n            white-space: nowrap;\r\n            overflow: hidden;\r\n            text-overflow: ellipsis;\r\n            max-width: 180px;\r\n        }\r\n\r\n        .modal::-webkit-scrollbar {\r\n            width: 4px;\r\n        }\r\n        .modal::-webkit-scrollbar-thumb {\r\n            background: #d1fae5;\r\n            border-radius: 10px;\r\n        }\r\n\r\n        @keyframes highlight-fade {\r\n            0% {\r\n                background: rgba(5, 150, 105, 0.15);\r\n            }\r\n            100% {\r\n                background: transparent;\r\n            }\r\n        }\r\n        .highlight-row {\r\n            animation: highlight-fade 1.2s ease;\r\n        }\r\n\r\n        /* --- OFFER LETTER PREVIEW --- */\r\n        .offer-preview {\r\n            background: #fff;\r\n            border: 1px solid #d1fae5;\r\n            border-radius: var(--radius);\r\n            padding: 36px 40px;\r\n            box-shadow: var(--shadow-lg);\r\n            max-width: 840px;\r\n            margin: 0 auto;\r\n            font-size: 13.5px;\r\n            line-height: 1.7;\r\n            color: var(--gray-800);\r\n        }\r\n        .offer-preview .header {\r\n            display: flex;\r\n            align-items: center;\r\n            gap: 20px;\r\n            border-bottom: 2px solid #d1fae5;\r\n            padding-bottom: 20px;\r\n            margin-bottom: 20px;\r\n        }\r\n        .offer-preview .header .logo {\r\n            font-size: 32px;\r\n            font-weight: 700;\r\n            color: #059669;\r\n        }\r\n        .offer-preview .header .logo i {\r\n            color: #34d399;\r\n        }\r\n        .offer-preview .header .company-info {\r\n            font-size: 13px;\r\n            color: var(--gray-600);\r\n        }\r\n        .offer-preview .header .company-info strong {\r\n            color: var(--gray-800);\r\n        }\r\n        .offer-preview .title {\r\n            text-align: center;\r\n            font-size: 24px;\r\n            font-weight: 700;\r\n            color: var(--gray-900);\r\n            margin: 20px 0 12px;\r\n            letter-spacing: 1px;\r\n        }\r\n        .offer-preview .offer-id {\r\n            text-align: center;\r\n            font-size: 13px;\r\n            color: var(--gray-500);\r\n            margin-bottom: 24px;\r\n        }\r\n        .offer-preview .section {\r\n            margin: 18px 0;\r\n        }\r\n        .offer-preview .section h4 {\r\n            font-size: 14px;\r\n            font-weight: 600;\r\n            color: #059669;\r\n            border-bottom: 1px solid #ecfdf5;\r\n            padding-bottom: 4px;\r\n            margin-bottom: 10px;\r\n        }\r\n        .offer-preview .section .row {\r\n            display: flex;\r\n            padding: 4px 0;\r\n            border-bottom: 1px solid #f8fafc;\r\n        }\r\n        .offer-preview .section .row .label {\r\n            width: 140px;\r\n            font-weight: 500;\r\n            color: var(--gray-600);\r\n            flex-shrink: 0;\r\n        }\r\n        .offer-preview .section .row .value {\r\n            flex: 1;\r\n            color: var(--gray-800);\r\n        }\r\n        .offer-preview .section .row .value strong {\r\n            color: var(--gray-900);\r\n        }\r\n        .offer-preview .section ul {\r\n            padding-left: 22px;\r\n            margin: 6px 0;\r\n        }\r\n        .offer-preview .section ul li {\r\n            margin-bottom: 2px;\r\n            color: var(--gray-700);\r\n        }\r\n        .offer-preview .footer {\r\n            margin-top: 30px;\r\n            border-top: 1px solid #d1fae5;\r\n            padding-top: 24px;\r\n            display: flex;\r\n            justify-content: space-between;\r\n            align-items: flex-end;\r\n            flex-wrap: wrap;\r\n            gap: 16px;\r\n        }\r\n        .offer-preview .footer .signature {\r\n            text-align: center;\r\n        }\r\n        .offer-preview .footer .signature .seal {\r\n            font-size: 14px;\r\n            color: #059669;\r\n            font-weight: 600;\r\n            border: 2px solid #059669;\r\n            border-radius: 50%;\r\n            width: 70px;\r\n            height: 70px;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            margin: 0 auto 8px;\r\n            background: rgba(5, 150, 105, 0.05);\r\n        }\r\n        .offer-preview .footer .signature .line {\r\n            width: 200px;\r\n            border-top: 1px solid var(--gray-400);\r\n            margin: 4px auto;\r\n        }\r\n        .offer-preview .footer .qr {\r\n            text-align: center;\r\n            font-size: 12px;\r\n            color: var(--gray-500);\r\n        }\r\n        .offer-preview .footer .qr .box {\r\n            width: 70px;\r\n            height: 70px;\r\n            background: #ecfdf5;\r\n            border: 1px solid #d1fae5;\r\n            border-radius: 8px;\r\n            display: flex;\r\n            align-items: center;\r\n            justify-content: center;\r\n            font-size: 28px;\r\n            color: var(--gray-600);\r\n            margin: 0 auto 4px;\r\n        }\r\n\r\n        .offer-preview .clause {\r\n            background: #ecfdf5;\r\n            border-left: 3px solid #059669;\r\n            padding: 8px 14px;\r\n            margin: 6px 0;\r\n            border-radius: 0 4px 4px 0;\r\n            font-size: 13px;\r\n            color: var(--gray-700);\r\n        }\r\n\r\n        .offer-preview .clause strong {\r\n            color: var(--gray-800);\r\n        }\r\n\r\n        /* --- LOGOUT BTN (Green) --- */\r\n        .crm-logout-btn {\r\n            background: #059669;\r\n            color: white;\r\n            border: none;\r\n            padding: 10px 16px;\r\n            border-radius: 6px;\r\n            cursor: pointer;\r\n            font-size: 13px;\r\n            font-weight: 600;\r\n            box-shadow: 0 4px 15px rgba(5, 150, 105, 0.35);\r\n            transition: all 0.3s ease;\r\n            text-align: center;\r\n            min-width: 80px;\r\n        }\r\n        .crm-logout-btn:hover {\r\n            transform: translateY(-2px);\r\n            box-shadow: 0 6px 20px rgba(5, 150, 105, 0.45);\r\n            background: #047857;\r\n        }\r\n        .crm-logout-btn:active {\r\n            transform: translateY(0);\r\n        }\r\n        .crm-logout-btn:disabled {\r\n            opacity: 0.6;\r\n            cursor: not-allowed;\r\n        }\r\n\r\n        /* --- COLOR OVERRIDES FOR GREEN THEME --- */\r\n        .bg-indigo-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .bg-indigo-600 {\r\n            background: #059669 !important;\r\n        }\r\n        .text-indigo-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .text-indigo-400 {\r\n            color: #34d399 !important;\r\n        }\r\n        .text-indigo-300 {\r\n            color: #6ee7b7 !important;\r\n        }\r\n        .text-indigo-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .border-indigo-500 {\r\n            border-color: #059669 !important;\r\n        }\r\n        .ring-indigo-300 {\r\n            --tw-ring-color: #6ee7b7 !important;\r\n        }\r\n        .bg-indigo-600\\/30 {\r\n            background: rgba(5, 150, 105, 0.25) !important;\r\n        }\r\n        .text-indigo-200 {\r\n            color: #a7f3d0 !important;\r\n        }\r\n        .hover\\:bg-indigo-50:hover {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .focus\\:border-indigo-500:focus {\r\n            border-color: #059669 !important;\r\n        }\r\n        .bg-blue-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-blue-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-purple-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-purple-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-rose-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-rose-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-amber-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-amber-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-teal-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-teal-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-cyan-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-cyan-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-violet-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-violet-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-sky-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-sky-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-emerald-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-emerald-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .text-emerald-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-orange-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-orange-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-red-50 {\r\n            background: #fef2f2 !important;\r\n        }\r\n        .text-red-500 {\r\n            color: #dc2626 !important;\r\n        }\r\n        .bg-green-50 {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .text-green-600 {\r\n            color: #059669 !important;\r\n        }\r\n        .text-green-700 {\r\n            color: #047857 !important;\r\n        }\r\n        .border-green-200 {\r\n            border-color: #a7f3d0 !important;\r\n        }\r\n        .bg-green-100 {\r\n            background: #d1fae5 !important;\r\n        }\r\n        .text-green-800 {\r\n            color: #065f46 !important;\r\n        }\r\n        .text-green-500 {\r\n            color: #059669 !important;\r\n        }\r\n\r\n        .bg-\\[\\#0b0f19\\] {\r\n            background: #064e3b !important;\r\n        }\r\n        .border-slate-800\\/60 {\r\n            border-color: #047857 !important;\r\n        }\r\n        .border-slate-800\\/50 {\r\n            border-color: #047857 !important;\r\n        }\r\n        .text-slate-400 {\r\n            color: #a7f3d0 !important;\r\n        }\r\n        .text-slate-500 {\r\n            color: #6ee7b7 !important;\r\n        }\r\n        .text-slate-600 {\r\n            color: #d1fae5 !important;\r\n        }\r\n        .hover\\:bg-slate-100:hover {\r\n            background: #047857 !important;\r\n        }\r\n        .hover\\:bg-slate-50:hover {\r\n            background: #ecfdf5 !important;\r\n        }\r\n        .bg-slate-50 {\r\n            background: #f0fdf4 !important;\r\n        }\r\n        .bg-slate-50\\/80 {\r\n            background: rgba(240, 253, 244, 0.85) !important;\r\n        }\r\n        .border-slate-200 {\r\n            border-color: #d1fae5 !important;\r\n        }\r\n        .border-slate-300 {\r\n            border-color: #a7f3d0 !important;\r\n        }\r\n        .text-slate-800 {\r\n            color: #064e3b !important;\r\n        }\r\n        .text-slate-700 {\r\n            color: #065f46 !important;\r\n        }\r\n        .text-slate-900 {\r\n            color: #064e3b !important;\r\n        }\r\n        .bg-slate-100 {\r\n            background: #d1fae5 !important;\r\n        }\r\n        .hover\\:bg-slate-200:hover {\r\n            background: #a7f3d0 !important;\r\n        }\r\n        .border-slate-100 {\r\n            border-color: #ecfdf5 !important;\r\n        }\r\n        .bg-white {\r\n            background: #ffffff !important;\r\n        }\r\n        .border-b {\r\n            border-bottom: 1px solid #d1fae5 !important;\r\n        }\r\n        .ring-2 {\r\n            --tw-ring-color: #6ee7b7 !important;\r\n        }\r\n        .bg-rose-500 {\r\n            background: #dc2626 !important;\r\n        }\r\n        .text-rose-500 {\r\n            color: #dc2626 !important;\r\n        }\r\n        .text-rose-600 {\r\n            color: #dc2626 !important;\r\n        }\r\n        .bg-indigo-600 {\r\n            background: #059669 !important;\r\n        }\r\n        .bg-indigo-600:hover {\r\n            background: #047857 !important;\r\n        }\r\n        .hover\\:bg-indigo-700:hover {\r\n            background: #047857 !important;\r\n        }\r\n        .text-indigo-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .text-green-500 {\r\n            color: #059669 !important;\r\n        }\r\n        .bg-green-600 {\r\n            background: #059669 !important;\r\n        }\r\n        .hover\\:bg-green-700:hover {\r\n            background: #047857 !important;\r\n        }\r\n    ";

// Default Database Generator
function getDefaultDB() {
  return {
    alerts: [
      { id: 1, severity: 'critical', type: 'interview', title: 'Candidate interview starting now', details: 'Vikram Singh - Senior React Developer Round 2 at 10:00 AM', action: 'Join Room', targetTab: 'todaysInterviews' },
      { id: 2, severity: 'critical', type: 'verification', title: 'Employee verification failed', details: 'Aadhaar validation failed for Raj Patel. Mismatch in DOB.', action: 'Verify Documents', targetTab: 'bgvVerification' },
      { id: 3, severity: 'critical', type: 'document', title: 'Important document expired', details: 'NDA agreement for Emily Chen expired on 2026-08-20', action: 'Upload NDA', targetTab: 'documents' },
      { id: 4, severity: 'important', type: 'feedback', title: 'Interview feedback pending', details: 'Emily Chen has not submitted feedback for Vikram Singh since 4 hours.', action: 'Request Feedback', targetTab: 'interviewFeedback' },
      { id: 5, severity: 'important', type: 'offer', title: '3 offer letters awaiting approval', details: 'Rahul Sharma (Senior React Developer) offer pending Q3 approval.', action: 'Review Offer', targetTab: 'offerLetters' },
      { id: 6, severity: 'reminder', type: 'probation', title: 'Probation review due', details: 'Raj Patel (Telecaller Agent) completing 60 days on 2026-09-01.', action: 'Conduct Review', targetTab: 'kpi' }
    ],
    warnings: [
      { id: 1, employeeId: 4, type: 'Written Warning', reason: 'Repeated late arrival exceeding grace period (6 times in August)', date: '2026-08-18', issuedBy: 'Priya Sharma', response: 'Apologies, will adhere to standard timings.', status: 'acknowledged' }
    ],
    bgv: [
      { id: 1, candidateId: 1, candidateName: 'Vikram Singh', identity: 'Verified', address: 'Verified', education: 'Verified', employment: 'In Progress', references: 'Pending', status: 'In Progress' },
      { id: 2, candidateId: 2, candidateName: 'Ananya Verma', identity: 'Verified', address: 'Verified', education: 'Verified', employment: 'Verified', references: 'Verified', status: 'Verified' }
    ],
    employeeTasks: [
      { id: 1, employeeId: 1, taskName: 'Deploy next branch to staging', deadline: '2026-08-26', status: 'In Progress', progress: 50 },
      { id: 2, employeeId: 3, taskName: 'Create Meta Ads franchise strategy', deadline: '2026-08-25', status: 'Completed', progress: 100 },
      { id: 3, employeeId: 4, taskName: 'Make 100 outbound cold calls', deadline: '2026-08-25', status: 'Pending', progress: 0 }
    ],
    rewards: [
      { id: 1, employeeId: 1, award: 'Best Performer of the Month', date: '2026-07-31', points: 500, recognizedBy: 'Priya Sharma' }
    ],
    rooms: [
      { id: 1, name: 'Interview Room A (Main)', status: 'Available' },
      { id: 2, name: 'Interview Room B (Annex)', status: 'Busy' },
      { id: 3, name: 'Video Room 1 (Virtual)', status: 'Available' }
    ],

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
    appointmentLetters: [
      { id: 1, letterId: 'APT-2026-000001', employeeName: 'Priya Menon', employeeId: 'EMP-001', designation: 'HR Executive', department: 'Human Resources', team: 'Recruitment', reportingManager: 'Priya Sharma', joiningDate: '2026-09-01', workLocation: 'Noida HQ Office', employmentType: 'Full-Time', monthlySalary: 35000, probationPeriod: '6 Months', status: 'generated', generatedDate: '2026-08-14', sentDate: '2026-08-14' },
      { id: 2, letterId: 'APT-2026-000002', employeeName: 'Rahul Sharma', employeeId: 'EMP-002', designation: 'Senior React Developer', department: 'Technology', team: 'Web Development', reportingManager: 'Emily Chen', joiningDate: '2026-08-25', workLocation: 'Noida HQ Office', employmentType: 'Full-Time', monthlySalary: 85000, probationPeriod: '6 Months', status: 'sent', generatedDate: '2026-08-12', sentDate: '2026-08-13' }
    ],
    exitLetters: [
      { id: 1, letterId: 'EXIT-2026-000001', employeeName: 'Vikram Patel', employeeId: 'EMP-045', designation: 'Telecaller Agent', team: 'Sales', joiningDate: '2024-03-15', lastWorkingDate: '2026-08-31', relievingDate: '2026-08-31', resignationDate: '2026-08-01', noticeServed: '30 Days', status: 'pending-clearance', workHandover: 'completed', assetReturn: 'completed', itClearance: 'completed', financeClearance: 'pending', hrClearance: 'pending', exitInterview: 'scheduled', generatedDate: '2026-08-20' },
      { id: 2, letterId: 'EXIT-2026-000002', employeeName: 'Ananya Kapoor', employeeId: 'EMP-032', designation: 'Marketing Executive', team: 'Digital Marketing', joiningDate: '2023-06-10', lastWorkingDate: '2026-08-25', relievingDate: '2026-08-25', resignationDate: '2026-07-28', noticeServed: '28 Days', status: 'completed', workHandover: 'completed', assetReturn: 'completed', itClearance: 'completed', financeClearance: 'completed', hrClearance: 'completed', exitInterview: 'completed', generatedDate: '2026-08-15' }
    ],
    interviewLetters: [
      { id: 1, letterId: 'INT-2026-000001', candidateName: 'Vikram Singh', designation: 'Senior React Developer', department: 'Technology', interviewDate: '2026-08-20', interviewTime: '02:00 PM', round: 'Technical Round 1', mode: 'In-Person', interviewer: 'Emily Chen', location: 'Noida HQ Office - Conference Room A', meetingLink: '', status: 'sent', sentDate: '2026-08-18' },
      { id: 2, letterId: 'INT-2026-000002', candidateName: 'Ananya Verma', designation: 'Franchise Sales Executive', department: 'Sales', interviewDate: '2026-08-27', interviewTime: '11:00 AM', round: 'HR Round', mode: 'Online', interviewer: 'Priya Sharma', location: '', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'scheduled', sentDate: '' },
      { id: 3, letterId: 'INT-2026-000003', candidateName: 'Rohit Mehta', designation: 'Telecaller Agent', department: 'Sales', interviewDate: '2026-08-28', interviewTime: '03:30 PM', round: 'Final Round', mode: 'In-Person', interviewer: 'Michael Torres', location: 'Delhi Regional Office - Room 201', meetingLink: '', status: 'scheduled', sentDate: '' }
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
    hrLoginSessions: [
      { id: 1, sessionId: 'SESS001', userId: 'raj@epay.com', employeeId: 'EMP004', loginAt: '2026-08-26 09:02 AM', logoutAt: '2026-08-26 06:15 PM', sessionStatus: 'completed', device: 'Chrome / Windows', ipAddress: '192.168.1.45', location: 'Pune HQ', loginMethod: 'Password', failedAttempts: 0 },
      { id: 2, sessionId: 'SESS002', userId: 'emily@epay.com', employeeId: 'EMP001', loginAt: '2026-08-26 08:58 AM', logoutAt: '', sessionStatus: 'active', device: 'Firefox / macOS', ipAddress: '192.168.1.12', location: 'Noida HQ', loginMethod: 'Biometric', failedAttempts: 0 }
    ],
    attendanceCorrections: [
      { id: 1, requestId: 'REQ-CORR-001', employeeId: 4, employeeName: 'Raj Patel', date: '2026-08-22', fieldName: 'checkIn', originalValue: '09:45 AM', requestedValue: '09:05 AM', reason: 'Official client call delay at entry gate', status: 'pending', requestedAt: '2026-08-23 10:15 AM' }
    ],
    timeExceptions: [
      { id: 1, employeeId: 4, employeeName: 'Raj Patel', date: '2026-08-22', type: 'Late Arrival', details: 'Clocked in at 09:45 AM (Grace period ends 09:15 AM)', location: 'Pune', status: 'pending' },
      { id: 2, employeeId: 3, employeeName: 'Sarah Kim', date: '2026-08-26', type: 'GPS Outside Office', details: 'Clocked in from Lat: 18.5300, Lng: 73.8700 (1.4 km outside Pune HQ)', location: 'Remote', status: 'pending' }
    ],
    breakLedger: [
      { id: 1, employeeId: 4, employeeName: 'Raj Patel', type: 'Lunch', start: '01:20 PM', end: '02:00 PM', duration: '40 mins', reason: 'Lunch Break', approved: 'Approved', status: 'completed' },
      { id: 2, employeeId: 1, employeeName: 'Emily Chen', type: 'Tea/Coffee', start: '11:15 AM', end: '11:30 AM', duration: '15 mins', reason: 'Beverage break', approved: 'Approved', status: 'completed' }
    ],
    geofences: [
      { id: 1, name: 'Noida HQ Office', latitude: 28.6273, longitude: 77.3725, radius: 150, status: 'active' },
      { id: 2, name: 'Pune Gallery Office', latitude: 18.5204, longitude: 73.8567, radius: 150, status: 'active' }
    ],
    auditLogs: [
      { id: 1, timestamp: '2026-08-22 09:15:12', user: 'Priya Sharma', action: 'LOGIN', module: 'Authentication', reference: 'hr@epay.com' },
      { id: 2, timestamp: '2026-08-22 10:30:45', user: 'Admin User', action: 'OFFER_APPROVED', module: 'Offer Letters', reference: 'OFF-2026-000002' }
    ],
    nextId: { employee: 6, jobProfile: 10, offerLetter: 4, appointmentLetter: 3, exitLetter: 3, interviewLetter: 4, leave: 3, candidate: 3, requisition: 3, asset: 3, expense: 2, grievance: 2, shift: 3, rule: 2, correction: 2, geofence: 3, session: 3, exception: 3, break: 3 }
  };
}

export default function HRPage() {
  const { logActivity, createUser, user, logout } = useAuth();
  const [db, setDb] = useState(getDefaultDB());
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeToast, setActiveToast] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [selectedEmp360Id, setSelectedEmp360Id] = useState(1);
  const [mounted, setMounted] = useState(false);
  const pageContentRef = useRef(null);

  const [activeBreak, setActiveBreak] = useState(null);
  const [breakSeconds, setBreakSeconds] = useState(0);

  const [geoTestTarget, setGeoTestTarget] = useState(1);
  const [geoTestLat, setGeoTestLat] = useState('28.6275');
  const [geoTestLng, setGeoTestLng] = useState('77.3720');
  const [geoTestResult, setGeoTestResult] = useState(null);
  const [selectedTimelineEmpId, setSelectedTimelineEmpId] = useState(4);

  useEffect(() => {
    let timer;
    if (activeBreak) {
      timer = setInterval(() => {
        setBreakSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setBreakSeconds(0);
    }
    return () => clearInterval(timer);
  }, [activeBreak]);

  const handleNavClick = (tabId) => {
    setCurrentPage(tabId);
    setSidebarOpen(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (pageContentRef.current) {
      pageContentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Live Firestore database subscriptions
  const { data: employeesData, add: addEmployee } = useFirestore('employees', getDefaultDB().employees);
  const { data: attendanceData, add: addAttendance, update: updateAttendance } = useFirestore('attendance', getDefaultDB().attendance);
  const { data: leavesData, add: addLeave, update: updateLeave } = useFirestore('leaves', getDefaultDB().leaves);

  // Sync Firestore live queries to state db
  useEffect(() => {
    if (employeesData) {
      setDb(prev => ({ ...prev, employees: employeesData }));
    }
  }, [employeesData]);

  useEffect(() => {
    if (attendanceData) {
      setDb(prev => ({ ...prev, attendance: attendanceData }));
    }
  }, [attendanceData]);

  useEffect(() => {
    if (leavesData) {
      setDb(prev => ({ ...prev, leaves: leavesData }));
    }
  }, [leavesData]);

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

  // ALL SIDEBAR ITEMS RESTRUCTURED ACCORDING TO DEEP TIME & AUDIT SPECIFICATION
  const navSections = [
    {
      group: 'HR COMMAND CENTER',
      items: [
        { id: 'dashboard', label: 'HR Dashboard', icon: 'fa-chart-pie' },
        { id: 'hrActionRequired', label: 'HR Action Required', icon: 'fa-triangle-exclamation' },
        { id: 'liveWorkforce', label: 'Live Workforce', icon: 'fa-people-group' }
      ]
    },
    {
      group: 'PEOPLE',
      items: [
        { id: 'employees', label: 'Employees', icon: 'fa-users' },
        { id: 'departmentsList', label: 'Departments', icon: 'fa-building' },
        { id: 'reportingStructure', label: 'Organization Structure', icon: 'fa-sitemap' },
        { id: 'documents', label: 'Employee Documents', icon: 'fa-folder-open' },
        { id: 'employeeAssets', label: 'Employee Assets', icon: 'fa-laptop' }
      ]
    },
    {
      group: 'ATTENDANCE & TIME',
      items: [
        { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
        { id: 'liveAttendance', label: 'Live Attendance', icon: 'fa-circle-dot' },
        { id: 'loginSessions', label: 'Login Sessions', icon: 'fa-network-wired' },
        { id: 'breaks', label: 'Break Management', icon: 'fa-coffee' },
        { id: 'timesheet', label: 'Timesheets', icon: 'fa-table' },
        { id: 'overtime', label: 'Overtime', icon: 'fa-hourglass-half' },
        { id: 'fieldTime', label: 'Field & Travel Time', icon: 'fa-map-location-dot' },
        { id: 'exceptions', label: 'Time Exceptions', icon: 'fa-exclamation-triangle' },
        { id: 'geofences', label: 'Geofences', icon: 'fa-draw-polygon' },
        { id: 'corrections', label: 'Attendance Corrections', icon: 'fa-square-check' }
      ]
    },
    {
      group: 'LEAVE',
      items: [
        { id: 'leaves', label: 'Leave Management', icon: 'fa-umbrella-beach' },
        { id: 'leaveCalendar', label: 'Leave Calendar', icon: 'fa-calendar-days' },
        { id: 'leavePolicies', label: 'Leave Policies', icon: 'fa-file-shield' },
        { id: 'leaveApprovals', label: 'Leave Approvals', icon: 'fa-clipboard-check' }
      ]
    },
    {
      group: 'RECRUITMENT',
      items: [
        { id: 'jobOpenings', label: 'Job Profiles', icon: 'fa-id-card' },
        { id: 'requisitions', label: 'Manpower Requisitions', icon: 'fa-file-signature' },
        { id: 'candidates', label: 'Candidates', icon: 'fa-users-line' },
        { id: 'todaysInterviews', label: 'Interviews', icon: 'fa-calendar-day' },
        { id: 'interviewLetters', label: 'Interview Letters', icon: 'fa-envelope' },
        { id: 'offerLetters', label: 'Offer Letters', icon: 'fa-envelope-open-text' },
        { id: 'appointmentLetters', label: 'Appointment Letters', icon: 'fa-file-contract' },
        { id: 'onboarding', label: 'Onboarding', icon: 'fa-rocket' }
      ]
    },
    {
      group: 'PERFORMANCE',
      items: [
        { id: 'employeeTasks', label: 'Tasks & Targets', icon: 'fa-list-check' },
        { id: 'kpi', label: 'Performance', icon: 'fa-gauge-high' },
        { id: 'appraisals', label: 'Appraisals', icon: 'fa-arrow-up-right-dots' },
        { id: 'pip', label: 'PIP', icon: 'fa-chart-line-down' },
        { id: 'promotions', label: 'Promotions', icon: 'fa-turn-up' },
        { id: 'incentives', label: 'Incentives', icon: 'fa-hand-holding-dollar' },
        { id: 'rewards', label: 'Rewards & Recognition', icon: 'fa-trophy' },
        { id: 'trainings', label: 'Training', icon: 'fa-graduation-cap' }
      ]
    },
    {
      group: 'EMPLOYEE RELATIONS',
      items: [
        { id: 'grievances', label: 'Grievances', icon: 'fa-comments' },
        { id: 'helpdesk', label: 'HR Help Desk', icon: 'fa-headset' },
        { id: 'disciplinary', label: 'Warnings & Disciplinary', icon: 'fa-gavel' },
        { id: 'announcements', label: 'Announcements', icon: 'fa-bullhorn' }
      ]
    },
    {
      group: 'EXIT',
      items: [
        { id: 'exit', label: 'Resignation & Exit', icon: 'fa-door-open' },
        { id: 'exitLetters', label: 'Exit & Relieving Letters', icon: 'fa-file-export' },
        { id: 'exitInterview', label: 'Exit Interview', icon: 'fa-clipboard-question' },
        { id: 'exitClearance', label: 'Clearance & Full/Final', icon: 'fa-file-invoice-dollar' }
      ]
    },
    {
      group: 'FINANCE & ALLOWANCES',
      items: [
        { id: 'salary', label: 'Salary', icon: 'fa-wallet' },
        { id: 'salaryComponents', label: 'Salary Components', icon: 'fa-cubes' },
        { id: 'expenses', label: 'Travel Allowance', icon: 'fa-plane' },
        { id: 'payroll', label: 'Payroll Coordination', icon: 'fa-money-check-dollar' }
      ]
    },
    {
      group: 'AUDIT & CONTROL',
      items: [
        { id: 'reports', label: 'HR Reports', icon: 'fa-file-chart-column' },
        { id: 'attendanceAudit', label: 'Attendance Audit', icon: 'fa-clipboard-user' },
        { id: 'audit', label: 'HR Audit', icon: 'fa-shield-halved' },
        { id: 'loginAudit', label: 'Login Audit', icon: 'fa-arrow-right-to-bracket' },
        { id: 'securityEvents', label: 'Security Events', icon: 'fa-user-shield' }
      ]
    },
    {
      group: 'SETTINGS',
      items: [
        { id: 'timeSettings', label: 'HR Policies', icon: 'fa-sliders' },
        { id: 'shiftSettings', label: 'Shift Settings', icon: 'fa-business-time' },
        { id: 'timePolicies', label: 'Time Policies', icon: 'fa-clock-rotate-left' }
      ]
    }
  ];

  const getBadgeCount = (id) => {
    if (id === 'hrActionRequired') return db.alerts?.filter(a => a.severity === 'critical').length || 0;
    if (id === 'hrAlerts') return db.alerts?.length || 0;
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
  const handleOnboardEmployee = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const department = fd.get('department');
    const position = fd.get('position');
    const roleId = fd.get('role') || 'sales-exec';
    const password = fd.get('password') || 'Epay@2026!';
    const salary = parseFloat(fd.get('salary')) || 35000;
    const phone = fd.get('phone') || '+91 98765 00000';
    const empCode = 'EMP' + String(db.nextId.employee++).padStart(3, '0');

    try {
      if (createUser) {
        await createUser({
          name,
          email,
          password,
          role: roleId,
          employeeId: empCode,
          department,
          designation: position,
          salary: `₹${salary.toLocaleString('en-IN')}/mo`
        });
      }

      const newEmp = {
        id: db.nextId.employee,
        name,
        email,
        department,
        position,
        status: 'pending_approval',
        joined: new Date().toISOString().slice(0, 10),
        phone,
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
        employeeCode: empCode,
        role: roleId
      };

      await addEmployee(newEmp);
      await logActivity('HR_SUBMITTED_EMPLOYEE_FOR_APPROVAL', { employeeCode: newEmp.employeeCode, name: newEmp.name, email: newEmp.email });
      saveDb({ ...db, employees: [...db.employees, newEmp] });
      setActiveModal(null);
      showToast(`Employee ${name} submitted! Awaiting Super Admin authorization before activation.`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to submit employee onboarding request.', 'error');
    }
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

  // APPOINTMENT LETTER HANDLERS
  const handleCreateAppointmentLetter = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const employeeName = fd.get('employeeName');
    const employeeId = fd.get('employeeId');
    const designation = fd.get('designation');
    const department = fd.get('department');
    const team = fd.get('team');
    const reportingManager = fd.get('reportingManager');
    const joiningDate = fd.get('joiningDate');
    const workLocation = fd.get('workLocation');
    const employmentType = fd.get('employmentType');
    const monthlySalary = parseFloat(fd.get('monthlySalary')) || 0;
    const probationPeriod = fd.get('probationPeriod') || '6 Months';

    const letterId = 'APT-2026-' + String(db.nextId.appointmentLetter).padStart(6, '0');

    const newLetter = {
      id: db.nextId.appointmentLetter++,
      letterId,
      employeeName,
      employeeId,
      designation,
      department,
      team,
      reportingManager,
      joiningDate,
      workLocation,
      employmentType,
      monthlySalary,
      probationPeriod,
      status: 'generated',
      generatedDate: new Date().toISOString().slice(0, 10),
      sentDate: ''
    };

    saveDb({ ...db, appointmentLetters: [...db.appointmentLetters, newLetter] });
    setActiveModal(null);
    showToast('Appointment letter ' + letterId + ' generated!', 'success');
    openPreviewAppointmentModal(newLetter);
  };

  const openPreviewAppointmentModal = (letter) => {
    setModalData({ letter });
    setActiveModal('preview_appointment');
  };

  const handleUpdateAppointmentStatus = (letterId, newStatus) => {
    const updatedLetters = db.appointmentLetters.map(l => {
      if (l.id === letterId) {
        const updated = { ...l, status: newStatus };
        if (newStatus === 'sent' && !l.sentDate) {
          updated.sentDate = new Date().toISOString().slice(0, 10);
        }
        return updated;
      }
      return l;
    });
    saveDb({ ...db, appointmentLetters: updatedLetters });
    showToast('Appointment letter status updated!', 'success');
    setActiveModal(null);
  };

  // EXIT LETTER HANDLERS
  const handleCreateExitLetter = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const employeeName = fd.get('employeeName');
    const employeeId = fd.get('employeeId');
    const designation = fd.get('designation');
    const team = fd.get('team');
    const joiningDate = fd.get('joiningDate');
    const lastWorkingDate = fd.get('lastWorkingDate');
    const relievingDate = fd.get('relievingDate');
    const resignationDate = fd.get('resignationDate');
    const noticeServed = fd.get('noticeServed') || '30 Days';

    const letterId = 'EXIT-2026-' + String(db.nextId.exitLetter).padStart(6, '0');

    const newLetter = {
      id: db.nextId.exitLetter++,
      letterId,
      employeeName,
      employeeId,
      designation,
      team,
      joiningDate,
      lastWorkingDate,
      relievingDate,
      resignationDate,
      noticeServed,
      status: 'pending-clearance',
      workHandover: 'pending',
      assetReturn: 'pending',
      itClearance: 'pending',
      financeClearance: 'pending',
      hrClearance: 'pending',
      exitInterview: 'pending',
      generatedDate: new Date().toISOString().slice(0, 10)
    };

    saveDb({ ...db, exitLetters: [...db.exitLetters, newLetter] });
    setActiveModal(null);
    showToast('Exit letter ' + letterId + ' generated!', 'success');
    openPreviewExitModal(newLetter);
  };

  const openPreviewExitModal = (letter) => {
    setModalData({ letter });
    setActiveModal('preview_exit');
  };

  const handleUpdateExitStatus = (letterId, newStatus) => {
    const updatedLetters = db.exitLetters.map(l => {
      if (l.id === letterId) {
        return { ...l, status: newStatus };
      }
      return l;
    });
    saveDb({ ...db, exitLetters: updatedLetters });
    showToast('Exit letter status updated!', 'success');
  };

  const handleUpdateExitClearance = (letterId, field, value) => {
    const updatedLetters = db.exitLetters.map(l => {
      if (l.id === letterId) {
        const updated = { ...l, [field]: value };
        // Check if all clearances are completed
        if (updated.workHandover === 'completed' &&
          updated.assetReturn === 'completed' &&
          updated.itClearance === 'completed' &&
          updated.financeClearance === 'completed' &&
          updated.hrClearance === 'completed' &&
          updated.exitInterview === 'completed') {
          updated.status = 'completed';
        }
        return updated;
      }
      return l;
    });
    saveDb({ ...db, exitLetters: updatedLetters });
    showToast('Clearance status updated!', 'success');
  };

  // INTERVIEW LETTER HANDLERS
  const handleCreateInterviewLetter = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const candidateName = fd.get('candidateName');
    const designation = fd.get('designation');
    const department = fd.get('department');
    const interviewDate = fd.get('interviewDate');
    const interviewTime = fd.get('interviewTime');
    const round = fd.get('round');
    const mode = fd.get('mode');
    const interviewer = fd.get('interviewer');
    const location = fd.get('location') || '';
    const meetingLink = fd.get('meetingLink') || '';

    const letterId = 'INT-2026-' + String(db.nextId.interviewLetter).padStart(6, '0');

    const newLetter = {
      id: db.nextId.interviewLetter++,
      letterId,
      candidateName,
      designation,
      department,
      interviewDate,
      interviewTime,
      round,
      mode,
      interviewer,
      location,
      meetingLink,
      status: 'scheduled',
      sentDate: ''
    };

    saveDb({ ...db, interviewLetters: [...db.interviewLetters, newLetter] });
    setActiveModal(null);
    showToast('Interview letter ' + letterId + ' created!', 'success');
    openPreviewInterviewModal(newLetter);
  };

  const openPreviewInterviewModal = (letter) => {
    setModalData({ letter });
    setActiveModal('preview_interview');
  };

  const handleUpdateInterviewStatus = (letterId, newStatus) => {
    const updatedLetters = db.interviewLetters.map(l => {
      if (l.id === letterId) {
        const updated = { ...l, status: newStatus };
        if (newStatus === 'sent' && !l.sentDate) {
          updated.sentDate = new Date().toISOString().slice(0, 10);
        }
        return updated;
      }
      return l;
    });
    saveDb({ ...db, interviewLetters: updatedLetters });
    showToast('Interview letter status updated!', 'success');
    setActiveModal(null);
  };

  const handleApplyLeave = async (e) => {
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

    await addLeave(newLeave);
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

  const handleResolveException = (id, newStatus, message) => {
    const updatedEx = db.timeExceptions.map(ex => {
      if (ex.id === id) {
        return { ...ex, status: newStatus };
      }
      return ex;
    });
    saveDb({
      ...db,
      timeExceptions: updatedEx
    });
    showToast(`Exception EXC-${id} marked as ${newStatus}: ${message}`, 'success');
  };

  const handleApproveCorrection = (id) => {
    const updated = db.attendanceCorrections.map(corr => {
      if (corr.id === id) {
        return { ...corr, status: 'approved' };
      }
      return corr;
    });
    saveDb({
      ...db,
      attendanceCorrections: updated
    });
    showToast(`Attendance correction request REQ-CORR-00${id} approved!`, 'success');
  };

  const handleRejectCorrection = (id) => {
    const updated = db.attendanceCorrections.map(corr => {
      if (corr.id === id) {
        return { ...corr, status: 'rejected' };
      }
      return corr;
    });
    saveDb({
      ...db,
      attendanceCorrections: updated
    });
    showToast(`Attendance correction request REQ-CORR-00${id} rejected!`, 'error');
  };

  const handleTestGeofence = (e) => {
    e.preventDefault();
    const fence = db.geofences.find(g => g.id === geoTestTarget);
    if (!fence) return;
    const lat = parseFloat(geoTestLat);
    const lng = parseFloat(geoTestLng);
    if (isNaN(lat) || isNaN(lng)) {
      showToast('Please enter valid coordinates', 'error');
      return;
    }

    const R = 6371e3; // metres
    const phi1 = fence.latitude * Math.PI / 180;
    const phi2 = lat * Math.PI / 180;
    const deltaPhi = (lat - fence.latitude) * Math.PI / 180;
    const deltaLambda = (lng - fence.longitude) * Math.PI / 180;

    const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
      Math.cos(phi1) * Math.cos(phi2) *
      Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = R * c;

    const inside = dist <= fence.radius;
    setGeoTestResult({
      distance: dist,
      inside,
      targetName: fence.name
    });

    if (inside) {
      showToast(`Coordinate verified inside ${fence.name}!`, 'success');
    } else {
      showToast(`Punch coordinate is outside geofence by ${Math.round(dist - fence.radius)} meters! Exception triggered.`, 'error');
      const newEx = {
        id: db.nextId.exception++,
        employeeId: 4,
        employeeName: 'Raj Patel',
        date: new Date().toISOString().slice(0, 10),
        type: 'GPS Outside Office',
        details: `Clocked in from Lat: ${lat}, Lng: ${lng} (${Math.round(dist)}m away from ${fence.name})`,
        location: 'Remote Simulator',
        status: 'pending'
      };
      saveDb({
        ...db,
        timeExceptions: [...db.timeExceptions, newEx]
      });
    }
  };

  const handleStartBreak = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const employeeId = parseInt(fd.get('employeeId'));
    const type = fd.get('type') || 'Tea/Coffee';
    const reason = fd.get('reason') || 'Break';
    const emp = db.employees.find(x => x.id === employeeId);

    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    setActiveBreak({
      employeeId,
      employeeName: emp ? emp.name : 'Unknown',
      type,
      reason,
      start: nowStr,
      seconds: 0
    });
    showToast(`${emp ? emp.name : 'Staff'} started ${type} break!`, 'info');
  };

  const handleEndBreak = () => {
    if (!activeBreak) return;
    const nowStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const mins = Math.max(1, Math.round(breakSeconds / 60));
    const newBreak = {
      id: db.nextId.break++,
      employeeId: activeBreak.employeeId,
      employeeName: activeBreak.employeeName,
      type: activeBreak.type,
      start: activeBreak.start,
      end: nowStr,
      duration: `${mins} min(s)`,
      reason: activeBreak.reason,
      approved: 'Approved',
      status: 'completed'
    };
    saveDb({
      ...db,
      breakLedger: [...db.breakLedger, newBreak]
    });
    setActiveBreak(null);
    showToast(`Break completed! Duration: ${mins} min(s).`, 'success');
  };

  const handleAddCandidate = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name');
    const email = fd.get('email');
    const mobile = fd.get('mobile');
    const experience = fd.get('experience');
    const skills = fd.get('skills');
    const location = fd.get('location') || 'Noida / Delhi';
    const qualification = fd.get('qualification') || 'Graduate';
    const currentSalary = parseFloat(fd.get('currentSalary')) || 45000;
    const expectedSalary = parseFloat(fd.get('expectedSalary')) || 60000;
    const noticePeriod = fd.get('noticePeriod') || '30 days';

    const newCand = {
      id: db.nextId.candidate++,
      name,
      email,
      mobile,
      location,
      qualification,
      experience,
      currentCompany: fd.get('currentCompany') || 'Tech Corp',
      currentSalary,
      expectedSalary,
      noticePeriod,
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

  const handleUpdateLeaveStatus = async (leaveId, newStatus) => {
    const updated = db.leaves.map(l => {
      if (l.id === leaveId) {
        return { ...l, status: newStatus, approvedBy: 'Priya Sharma (HR)' };
      }
      return l;
    });
    await updateLeave(leaveId, { status: newStatus, approvedBy: 'Priya Sharma (HR)' });
    await logActivity('HR_UPDATED_LEAVE_STATUS', { leaveId, status: newStatus });
    saveDb({ ...db, leaves: updated });
    showToast('Leave request ' + newStatus + '!', 'success');
  };


  const handleClockInOut = async (employeeId) => {
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
      await addAttendance(newAtt);
      saveDb({ ...db, attendance: [...db.attendance, newAtt] });
      showToast('Clocked in successfully!', 'success');
    } else if (empAtt.checkOut === '—') {
      const checkOutTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      await updateAttendance(empAtt.id, { checkOut: checkOutTime, totalHours: '8.5 hrs' });
      const updated = db.attendance.map(a => {
        if (a.id === empAtt.id) {
          return {
            ...a,
            checkOut: checkOutTime,
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

  // =================================================================
  // ADVANCED HR COMMAND CENTER HANDLERS
  // =================================================================
  const handleResolveAlert = (id) => {
    const updatedAlerts = db.alerts.filter(a => a.id !== id);
    saveDb({ ...db, alerts: updatedAlerts });
    showToast('Alert resolved and removed!', 'success');
  };

  const handleUpdateBgvStatus = (candidateId, field, status) => {
    const updatedBgv = db.bgv.map(b => {
      if (b.candidateId === candidateId) {
        const item = { ...b, [field]: status };
        // If all verified, set status
        if (item.identity === 'Verified' && item.address === 'Verified' && item.education === 'Verified' && item.employment === 'Verified') {
          item.status = 'Verified';
        } else if (item.identity === 'Failed' || item.address === 'Failed' || item.education === 'Failed' || item.employment === 'Failed') {
          item.status = 'Failed';
        } else {
          item.status = 'In Progress';
        }
        return item;
      }
      return b;
    });
    saveDb({ ...db, bgv: updatedBgv });
    showToast('BGV ' + field + ' status updated to ' + status, 'success');
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const candidateId = parseInt(fd.get('candidateId'));
    const candidateName = db.candidates.find(c => c.id === candidateId)?.name || 'Unknown Candidate';
    const position = fd.get('position');
    const round = fd.get('round');
    const interviewer = fd.get('interviewer');
    const date = fd.get('date');
    const time = fd.get('time');
    const room = fd.get('room');
    const mode = fd.get('mode');

    // Conflict detection check
    const conflict = db.interviews.find(i => i.interviewer === interviewer && i.date === date && i.time === time);
    if (conflict) {
      showToast('Conflict Detected! Interviewer ' + interviewer + ' is already busy at ' + time, 'error');
      return;
    }

    const newInt = {
      id: db.interviews.length + 1,
      candidateId,
      candidateName,
      position,
      round,
      interviewer,
      date,
      time,
      mode,
      room,
      status: 'scheduled',
      technicalScore: 0,
      communicationScore: 0,
      overallScore: 0,
      recommendation: 'Pending Feedback',
      feedbackLocked: false
    };

    saveDb({ ...db, interviews: [...db.interviews, newInt] });
    showToast('Interview scheduled successfully & Candidate notified!', 'success');
    setActiveModal(null);
  };

  const handleRecordFeedback = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const intId = parseInt(fd.get('interviewId'));
    const tech = parseFloat(fd.get('techScore')) || 0;
    const comm = parseFloat(fd.get('commScore')) || 0;
    const culture = parseFloat(fd.get('cultureScore')) || 0;
    const rec = fd.get('recommendation');

    const overall = parseFloat(((tech + comm + culture) / 3).toFixed(1));

    const updated = db.interviews.map(i => {
      if (i.id === intId) {
        return {
          ...i,
          technicalScore: tech,
          communicationScore: comm,
          overallScore: overall,
          recommendation: rec,
          status: 'completed',
          feedbackLocked: true
        };
      }
      return i;
    });

    saveDb({ ...db, interviews: updated });
    showToast('Feedback submitted & locked successfully!', 'success');
    setActiveModal(null);
  };

  const handleIssueWarning = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const type = fd.get('type');
    const reason = fd.get('reason');

    const newW = {
      id: db.warnings.length + 1,
      employeeId: empId,
      type,
      reason,
      date: new Date().toISOString().slice(0, 10),
      issuedBy: 'Priya Sharma',
      response: 'Pending Employee Response',
      status: 'issued'
    };

    saveDb({ ...db, warnings: [...db.warnings, newW] });
    showToast(type + ' issued to employee!', 'success');
    setActiveModal(null);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const taskName = fd.get('taskName');
    const deadline = fd.get('deadline');

    const newT = {
      id: db.employeeTasks.length + 1,
      employeeId: empId,
      taskName,
      deadline,
      status: 'Pending',
      progress: 0
    };

    saveDb({ ...db, employeeTasks: [...db.employeeTasks, newT] });
    showToast('Task assigned successfully!', 'success');
    setActiveModal(null);
  };

  const handleAddReward = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const empId = parseInt(fd.get('employeeId'));
    const award = fd.get('award');
    const points = parseInt(fd.get('points')) || 100;

    const newReward = {
      id: db.rewards.length + 1,
      employeeId: empId,
      award,
      date: new Date().toISOString().slice(0, 10),
      points,
      recognizedBy: 'Priya Sharma'
    };

    saveDb({ ...db, rewards: [...db.rewards, newReward] });
    showToast('Reward / Recognition logged!', 'success');
    setActiveModal(null);
  };
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
        <nav id="sidebarNav" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '6px 0 16px' }}>
          {navSections.map((sec, idx) => (
            <React.Fragment key={idx}>
              <div className="nav-section">{sec.group}</div>
              {sec.items.map(item => {
                const badge = getBadgeCount(item.id);
                const isActive = currentPage === item.id;
                return (
                  <div
                    key={item.id}
                    className={'nav-item ' + (isActive ? 'active' : '')}
                    onClick={() => handleNavClick(item.id)}
                    role="button"
                    tabIndex={0}
                    title={item.label}
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
          <div className="avatar">{user?.name ? user.name[0].toUpperCase() : 'P'}</div>
          <div className="info">
            <div className="name">{user?.name || 'Priya Sharma'}</div>
            <div className="role">{user?.role ? user.role.toUpperCase() : 'HR MANAGER'}</div>
          </div>
          <button className="logout-btn" title="Sign Out" onClick={logout}><i className="fas fa-power-off"></i></button>
        </div>
      </aside>

      {/* --- MOBILE BACKDROP OVERLAY --- */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 90
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- MAIN --- */}
      <div id="main">
        <header id="header">
          <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)} title="Toggle Menu">
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

        <div id="pageContent" ref={pageContentRef}>
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
              <div className="section-header">
                <h2><i className="fas fa-chart-pie"></i> HR COMMAND CENTER — Live Overview</h2>
                <div className="flex gap-8">
                  <button className="btn btn-primary" onClick={() => setActiveModal('onboard_employee')}>
                    <i className="fas fa-plus"></i> Onboard Staff
                  </button>
                  <button className="btn btn-outline" onClick={() => handleClockInOut(1)}>
                    <i className="fas fa-clock"></i> Punch In/Out
                  </button>
                </div>
              </div>

              {/* Today's HR Overview Live Workforce Grid */}
              <div className="table-wrap" style={{ padding: 24, marginBottom: 24 }}>
                <h4 style={{ color: '#064e3b', marginBottom: 16 }}><i className="fas fa-calendar-day"></i> WHO'S WORKING NOW?</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 14, textAlign: 'center' }}>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('employees')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Total Employees</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#064e3b', marginTop: 4 }}>286</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('liveWorkforce')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Logged In</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#059669', marginTop: 4 }}>241</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('attendance')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Clocked In</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#10b981', marginTop: 4 }}>228</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('breaks')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>On Break</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#d97706', marginTop: 4 }}>18</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('leaves')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>On Leave</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#7c3aed', marginTop: 4 }}>14</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('attendance')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Absent</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>29</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('fieldTime')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Field Work</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb', marginTop: 4 }}>11</div>
                  </div>
                  <div className="stat-card" style={{ cursor: 'pointer', border: '1px solid #d1fae5', padding: 14, borderRadius: 10 }} onClick={() => handleNavClick('overtime')}>
                    <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Overtime</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#047857', marginTop: 4 }}>7</div>
                  </div>
                </div>
              </div>

              {/* Critical Alert Indices & Direct Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, marginBottom: 24 }}>
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <h4>🚨 CRITICAL HR ISSUES</h4>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fee2e2', borderRadius: 8, color: '#b91c1c' }}>
                    <span>🔴 Critical Issues</span>
                    <strong style={{ fontSize: 18 }}>5</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#fef3c7', borderRadius: 8, color: '#b45309' }}>
                    <span>🟠 Important</span>
                    <strong style={{ fontSize: 18 }}>18</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', borderRadius: 8, color: '#047857' }}>
                    <span>🟡 Reminders</span>
                    <strong style={{ fontSize: 18 }}>27</strong>
                  </div>
                </div>

                <div className="table-wrap" style={{ padding: 20 }}>
                  <h4>📅 TODAY'S INTERVIEWS SCHEDULE</h4>
                  <div className="table-scroll" style={{ marginTop: 12 }}>
                    <table>
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Role</th>
                          <th>Round</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>10:00 AM</strong></td>
                          <td>Full Stack Developer</td>
                          <td><span className="badge-doc blue">Round 2</span></td>
                        </tr>
                        <tr>
                          <td><strong>11:30 AM</strong></td>
                          <td>HR Manager</td>
                          <td><span className="badge-doc green">HR Round</span></td>
                        </tr>
                        <tr>
                          <td><strong>02:00 PM</strong></td>
                          <td>Android Developer</td>
                          <td><span className="badge-doc purple">Technical</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Action Required Box */}
              <div className="table-wrap" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid #dc2626' }}>
                <h4 style={{ color: '#dc2626', marginBottom: 12 }}><i className="fas fa-triangle-exclamation"></i> ACTION REQUIRED</h4>
                <ul style={{ paddingLeft: 20, fontSize: 14, color: '#4b5563', lineHeight: 1.8 }}>
                  <li>7 interview feedback submissions pending from technical panels.</li>
                  <li>3 offer letters awaiting final executive seal approval.</li>
                  <li>5 employees' regulatory identity documents incomplete in database.</li>
                  <li>4 employee probation performance reviews due.</li>
                </ul>
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

          {/* LIVE WORKFORCE & LIVE ATTENDANCE */}
          {(currentPage === 'liveWorkforce' || currentPage === 'liveAttendance') && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-people-group"></i> Live Workforce Monitor & Timeline</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 20 }}>
                {/* Live Workforce List */}
                <div className="table-wrap">
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                    <h4 style={{ color: '#064e3b' }}><i className="fas fa-users"></i> Active Staff Sessions Today</h4>
                  </div>
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Status</th>
                          <th>Login Time</th>
                          <th>Clock-In</th>
                          <th>Break Time</th>
                          <th>Net Working</th>
                          <th>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {db.employees.map(emp => {
                          const isRaj = emp.id === 4;
                          const isEmily = emp.id === 1;
                          const isSarah = emp.id === 3;

                          const status = isRaj ? 'Break' : isSarah ? 'Field' : 'Working';
                          const login = isRaj ? '09:02 AM' : isEmily ? '08:58 AM' : '09:11 AM';
                          const clockIn = isRaj ? '09:08 AM' : isEmily ? '09:02 AM' : '09:15 AM';
                          const breaks = isRaj ? '00:22' : isEmily ? '00:15' : '00:45';
                          const working = isRaj ? '7h 32m' : isEmily ? '7h 40m' : '6h 51m';
                          const location = isRaj ? 'Pune HQ' : isEmily ? 'Noida HQ' : 'Mumbai';

                          return (
                            <tr
                              key={emp.id}
                              style={{ cursor: 'pointer', background: selectedTimelineEmpId === emp.id ? '#ecfdf5' : 'transparent' }}
                              onClick={() => setSelectedTimelineEmpId(emp.id)}
                            >
                              <td>
                                <div className="cell-flex">
                                  <div className="avatar-sm sm">{emp.name[0]}</div>
                                  <strong>{emp.name}</strong>
                                </div>
                              </td>
                              <td>
                                <span className={`status-badge ${status === 'Working' ? 'active' : status === 'Break' ? 'pending' : 'previewed'}`}>
                                  {status}
                                </span>
                              </td>
                              <td>{login}</td>
                              <td>{clockIn}</td>
                              <td><code>{breaks}</code></td>
                              <td>{working}</td>
                              <td>{location}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Selected Employee's Workday Timeline Visualizer */}
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {(() => {
                    const emp = db.employees.find(e => e.id === selectedTimelineEmpId) || db.employees[0];
                    const isRaj = emp.id === 4;
                    const isEmily = emp.id === 1;

                    const events = isRaj ? [
                      { time: '08:58 AM', event: 'CRM Portal Login Session Opened', type: 'system' },
                      { time: '09:04 AM', event: 'Attendance Clock-In Recorded', type: 'clock' },
                      { time: '11:18 AM', event: 'Break Started (Tea / Coffee)', type: 'break' },
                      { time: '11:31 AM', event: 'Break Ended (Resumed Work)', type: 'work' },
                      { time: '01:20 PM', event: 'Lunch Break Started', type: 'break' },
                      { time: '02:00 PM', event: 'Lunch Break Ended (Resumed Work)', type: 'work' },
                      { time: '04:14 PM', event: 'Break Started (Personal)', type: 'break' },
                      { time: '04:23 PM', event: 'Break Ended (Resumed Work)', type: 'work' },
                      { time: '06:12 PM', event: 'Attendance Clock-Out Punch', type: 'clock' },
                      { time: '06:15 PM', event: 'CRM Portal Session Closed (Logout)', type: 'system' }
                    ] : isEmily ? [
                      { time: '08:56 AM', event: 'CRM Portal Login Session Opened', type: 'system' },
                      { time: '09:02 AM', event: 'Attendance Clock-In Recorded', type: 'clock' },
                      { time: '01:00 PM', event: 'Lunch Break Started', type: 'break' },
                      { time: '01:45 PM', event: 'Lunch Break Ended (Resumed Work)', type: 'work' },
                      { time: '06:00 PM', event: 'Attendance Clock-Out Punch', type: 'clock' },
                      { time: '06:05 PM', event: 'CRM Portal Session Closed (Logout)', type: 'system' }
                    ] : [
                      { time: '09:11 AM', event: 'CRM Portal Login Session Opened', type: 'system' },
                      { time: '09:15 AM', event: 'Attendance Clock-In Recorded', type: 'clock' }
                    ];

                    const loginDur = isRaj ? '9h 17m' : isEmily ? '9h 09m' : '2h 15m';
                    const grossWork = isRaj ? '9h 08m' : isEmily ? '8h 58m' : '2h 11m';
                    const breakDur = isRaj ? '1h 04m' : isEmily ? '45m' : '0m';
                    const netWorking = isRaj ? '8h 04m' : isEmily ? '8h 13m' : '2h 11m';
                    const overtime = isRaj ? '4m' : isEmily ? '13m' : '0m';

                    return (
                      <>
                        <div style={{ borderBottom: '1px solid #d1fae5', paddingBottom: 10 }}>
                          <h4 style={{ color: '#064e3b' }}><i className="fas fa-route"></i> Daily Timeline Visualizer</h4>
                          <span style={{ fontSize: 13, color: '#6b7280' }}>Staff: <strong>{emp.name}</strong> ({emp.position})</span>
                        </div>

                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', maxHeight: 300, paddingRight: 4 }}>
                          {events.map((ev, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 12.5 }}>
                              <strong style={{ color: '#059669', width: 68, flexShrink: 0 }}>{ev.time}</strong>
                              <div style={{ flex: 1 }}>
                                <div style={{ color: '#111827', fontWeight: 500 }}>{ev.event}</div>
                                <span style={{ fontSize: 10.5, color: '#9ca3af', textTransform: 'uppercase' }}>{ev.type}</span>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, border: '1px solid #ecfdf5', fontSize: 12.5 }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>Login Duration: <strong>{loginDur}</strong></div>
                            <div>Gross Duration: <strong>{grossWork}</strong></div>
                            <div>Break Duration: <strong>{breakDur}</strong></div>
                            <div>Net Working Time: <strong style={{ color: '#059669' }}>{netWorking}</strong></div>
                            <div>Required: <strong>8h 00m</strong></div>
                            <div>Overtime: <strong style={{ color: '#10b981' }}>{overtime}</strong></div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* LOGIN SESSIONS */}
          {currentPage === 'loginSessions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-network-wired"></i> Login Security & Session Audit</h2>
              </div>
              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-user-shield"></i> active & past authentication logs</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Session ID</th>
                        <th>User Email</th>
                        <th>Employee ID</th>
                        <th>Logged In At</th>
                        <th>Logged Out At</th>
                        <th>Device Metadata</th>
                        <th>IP Address</th>
                        <th>Location</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.hrLoginSessions?.map(sess => (
                        <tr key={sess.id}>
                          <td><code>{sess.sessionId}</code></td>
                          <td><strong>{sess.userId}</strong></td>
                          <td>{sess.employeeId}</td>
                          <td>{sess.loginAt}</td>
                          <td>{sess.logoutAt || '—'}</td>
                          <td>{sess.device}</td>
                          <td><code>{sess.ipAddress}</code></td>
                          <td>{sess.location}</td>
                          <td>
                            <span className={`status-badge ${sess.sessionStatus === 'active' ? 'active' : 'inactive'}`}>
                              {sess.sessionStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE CORRECTIONS */}
          {currentPage === 'corrections' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-square-check"></i> Attendance Correction Requests</h2>
              </div>
              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-clipboard-question"></i> Pending Adjustment Approvals</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Request ID</th>
                        <th>Employee</th>
                        <th>Date</th>
                        <th>Field Name</th>
                        <th>Original Value</th>
                        <th>Requested Value</th>
                        <th>Reason / Evidence</th>
                        <th>Requested At</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.attendanceCorrections?.map(corr => (
                        <tr key={corr.id}>
                          <td><code>{corr.requestId}</code></td>
                          <td><strong>{corr.employeeName}</strong></td>
                          <td>{corr.date}</td>
                          <td><code>{corr.fieldName}</code></td>
                          <td><span className="status-badge inactive">{corr.originalValue}</span></td>
                          <td><span className="status-badge active">{corr.requestedValue}</span></td>
                          <td>"{corr.reason}"</td>
                          <td>{corr.requestedAt}</td>
                          <td>
                            <span className={`status-badge ${corr.status === 'approved' ? 'active' : corr.status === 'rejected' ? 'inactive' : 'pending'}`}>
                              {corr.status}
                            </span>
                          </td>
                          <td>
                            {corr.status === 'pending' ? (
                              <div className="flex gap-8">
                                <button className="btn btn-xs btn-success" onClick={() => handleApproveCorrection(corr.id)}>
                                  Approve
                                </button>
                                <button className="btn btn-xs btn-danger" onClick={() => handleRejectCorrection(corr.id)}>
                                  Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
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

          {currentPage === 'breaks' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-coffee"></i> Break Management Center</h2>
              </div>

              {/* Break Status / Simulator Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                {/* Active Break Timer Card */}
                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200 }}>
                  <div>
                    <h4><i className="fas fa-stopwatch" style={{ color: activeBreak ? '#dc2626' : '#6b7280' }}></i> Active Break Monitor</h4>
                    {activeBreak ? (
                      <div style={{ marginTop: 14 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#064e3b' }}>{activeBreak.employeeName}</div>
                        <div style={{ color: '#b45309', fontSize: 13, fontWeight: 500, marginTop: 4 }}>
                          Category: <span className="status-badge pending">{activeBreak.type}</span>
                        </div>
                        <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Started: {activeBreak.start}</div>
                        <div style={{ fontSize: 13, color: '#6b7280' }}>Reason: "{activeBreak.reason}"</div>
                      </div>
                    ) : (
                      <div style={{ marginTop: 24, color: '#6b7280', textAlign: 'center' }}>
                        <i className="fas fa-mug-hot" style={{ fontSize: 32, opacity: 0.3, marginBottom: 8 }}></i>
                        <div>No active employee breaks running.</div>
                      </div>
                    )}
                  </div>
                  {activeBreak && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #ecfdf5', paddingTop: 14, marginTop: 14 }}>
                      <div>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>Elapsed:</span>
                        <strong style={{ fontSize: 18, color: '#dc2626', marginLeft: 6 }}>
                          {String(Math.floor(breakSeconds / 60)).padStart(2, '0')}m {String(breakSeconds % 60).padStart(2, '0')}s
                        </strong>
                      </div>
                      <button className="btn btn-danger" onClick={handleEndBreak}>
                        <i className="fas fa-stop"></i> Resume Work (End Break)
                      </button>
                    </div>
                  )}
                </div>

                {/* Simulate New Break Card */}
                <div className="stat-card">
                  <h4><i className="fas fa-plus-circle"></i> Trigger Break Event</h4>
                  <form onSubmit={handleStartBreak} style={{ marginTop: 12 }}>
                    <div className="form-group">
                      <label>Select Employee</label>
                      <select name="employeeId" required style={{ padding: '6px 10px', fontSize: 13 }}>
                        {db.employees.map(e => (
                          <option key={e.id} value={e.id}>{e.name} ({e.position})</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-row" style={{ marginTop: 10 }}>
                      <div className="form-group">
                        <label>Break Category</label>
                        <select name="type" style={{ padding: '6px 10px', fontSize: 13 }}>
                          <option value="Tea/Coffee">Tea / Coffee</option>
                          <option value="Lunch">Lunch</option>
                          <option value="Personal">Personal</option>
                          <option value="Official Work">Official Work</option>
                          <option value="Prayer/Personal Time">Prayer / Personal Time</option>
                          <option value="Medical">Medical</option>
                          <option value="Emergency">Emergency</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Reason / Remarks</label>
                        <input type="text" name="reason" placeholder="Quick refresh..." defaultValue="Scheduled Break" style={{ padding: '6px 10px', fontSize: 13 }} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 14 }} disabled={!!activeBreak}>
                      <i className="fas fa-play"></i> Start Timer (Go on Break)
                    </button>
                  </form>
                </div>
              </div>

              {/* Break Ledger History Table */}
              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-history"></i> Break History Log</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Break Category</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                        <th>Reason</th>
                        <th>Approval</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.breakLedger?.map(b => (
                        <tr key={b.id}>
                          <td><strong>{b.employeeName}</strong></td>
                          <td><span className="status-badge pending">{b.type}</span></td>
                          <td>{b.start}</td>
                          <td>{b.end || '—'}</td>
                          <td>{b.duration}</td>
                          <td>{b.reason}</td>
                          <td><span className="status-badge approved">{b.approved}</span></td>
                          <td><span className="status-badge active">{b.status}</span></td>
                        </tr>
                      ))}
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

          {currentPage === 'geofences' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-draw-polygon"></i> Geofence Management & Simulator</h2>
              </div>

              {/* Geofence Simulator Widget */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 20, marginBottom: 24 }}>
                <div className="stat-card">
                  <h4><i className="fas fa-satellite-dish" style={{ color: '#059669' }}></i> Punch GPS Coordinates Simulator</h4>
                  <form onSubmit={handleTestGeofence} style={{ marginTop: 14 }}>
                    <div className="form-group">
                      <label>Target Geofence Location</label>
                      <select value={geoTestTarget} onChange={e => {
                        const targetId = parseInt(e.target.value);
                        setGeoTestTarget(targetId);
                        const fence = db.geofences.find(g => g.id === targetId);
                        if (fence) {
                          setGeoTestLat(String(fence.latitude + 0.0005));
                          setGeoTestLng(String(fence.longitude - 0.0005));
                        }
                      }} style={{ padding: '6px 10px', fontSize: 13 }}>
                        {db.geofences.map(g => (
                          <option key={g.id} value={g.id}>{g.name} (R: {g.radius}m)</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-row" style={{ marginTop: 10 }}>
                      <div className="form-group">
                        <label>Simulated Latitude</label>
                        <input type="text" value={geoTestLat} onChange={e => setGeoTestLat(e.target.value)} style={{ padding: '6px 10px', fontSize: 13 }} />
                      </div>
                      <div className="form-group">
                        <label>Simulated Longitude</label>
                        <input type="text" value={geoTestLng} onChange={e => setGeoTestLng(e.target.value)} style={{ padding: '6px 10px', fontSize: 13 }} />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-full" style={{ marginTop: 14 }}>
                      <i className="fas fa-satellite"></i> Validate GPS Punch Distance
                    </button>
                  </form>
                </div>

                <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h4><i className="fas fa-square-poll-horizontal"></i> Simulation Result Details</h4>
                  {geoTestResult ? (
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>Status:</span>
                        <span className={`status-badge ${geoTestResult.inside ? 'active' : 'inactive'}`}>
                          {geoTestResult.inside ? 'PUNCH ALLOWED (INSIDE)' : 'PUNCH BLOCKED (OUTSIDE)'}
                        </span>
                      </div>
                      <div style={{ marginTop: 8, fontSize: 13 }}>
                        Distance to <strong>{geoTestResult.targetName}</strong>: <strong style={{ color: geoTestResult.inside ? '#059669' : '#dc2626' }}>{Math.round(geoTestResult.distance)} meters</strong>
                      </div>
                      {!geoTestResult.inside && (
                        <div style={{ marginTop: 8, padding: 8, background: '#fee2e2', color: '#b91c1c', fontSize: 12, borderRadius: 6 }}>
                          <strong>Exception logged:</strong> Raj Patel flagged for outside geofence check-in attempt on {new Date().toISOString().slice(0, 10)}.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', marginTop: 12 }}>
                      Run a simulated coordinates validation check to test geofencing distance triggers.
                    </div>
                  )}
                </div>
              </div>

              {/* Geofence Registry Table */}
              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-map-location-dot"></i> Configured Geofences</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Geofence Location</th>
                        <th>Center Latitude</th>
                        <th>Center Longitude</th>
                        <th>Allowed Radius (Meters)</th>
                        <th>Target Branch/Office</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.geofences.map(g => (
                        <tr key={g.id}>
                          <td><strong>{g.name}</strong></td>
                          <td><code>{g.latitude}</code></td>
                          <td><code>{g.longitude}</code></td>
                          <td><strong>{g.radius} meters</strong></td>
                          <td>{g.id === 1 ? 'Noida HQ' : 'Pune Gallery'}</td>
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

          {/* 35a. APPOINTMENT LETTERS */}
          {currentPage === 'appointmentLetters' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-contract"></i> Appointment Letters</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('create_appointment')}>
                  <i className="fas fa-plus"></i> Generate Appointment Letter
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Letter ID</th>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Joining Date</th>
                        <th>Salary</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.appointmentLetters?.map(l => (
                        <tr key={l.id}>
                          <td><strong>{l.letterId}</strong></td>
                          <td>{l.employeeName}</td>
                          <td>{l.employeeId}</td>
                          <td>{l.designation}</td>
                          <td>{l.department}</td>
                          <td>{l.joiningDate}</td>
                          <td><span style={{ fontWeight: 600, color: '#059669' }}>₹{l.monthlySalary?.toLocaleString()}</span></td>
                          <td><span className={'status-badge ' + l.status}>{l.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-xs btn-primary" onClick={() => openPreviewAppointmentModal(l)}>
                                <i className="fas fa-eye"></i> Preview
                              </button>
                              {l.status === 'generated' && (
                                <button className="btn btn-xs btn-success" onClick={() => handleUpdateAppointmentStatus(l.id, 'sent')}>
                                  <i className="fas fa-paper-plane"></i> Send
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 35b. INTERVIEW LETTERS */}
          {currentPage === 'interviewLetters' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-envelope"></i> Interview Invitation Letters</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('create_interview_letter')}>
                  <i className="fas fa-plus"></i> Create Interview Letter
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Letter ID</th>
                        <th>Candidate Name</th>
                        <th>Position</th>
                        <th>Interview Date</th>
                        <th>Time</th>
                        <th>Round</th>
                        <th>Mode</th>
                        <th>Interviewer</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviewLetters?.map(l => (
                        <tr key={l.id}>
                          <td><strong>{l.letterId}</strong></td>
                          <td>{l.candidateName}</td>
                          <td>{l.designation}</td>
                          <td>{l.interviewDate}</td>
                          <td>{l.interviewTime}</td>
                          <td><span className="status-badge pending">{l.round}</span></td>
                          <td>{l.mode}</td>
                          <td>{l.interviewer}</td>
                          <td><span className={'status-badge ' + l.status}>{l.status}</span></td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-xs btn-primary" onClick={() => openPreviewInterviewModal(l)}>
                                <i className="fas fa-eye"></i> Preview
                              </button>
                              {l.status === 'scheduled' && (
                                <button className="btn btn-xs btn-success" onClick={() => handleUpdateInterviewStatus(l.id, 'sent')}>
                                  <i className="fas fa-paper-plane"></i> Send
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 35c. EXIT & RELIEVING LETTERS */}
          {currentPage === 'exitLetters' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-export"></i> Exit & Relieving Letters</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('create_exit_letter')}>
                  <i className="fas fa-plus"></i> Generate Exit Letter
                </button>
              </div>

              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Letter ID</th>
                        <th>Employee Name</th>
                        <th>Employee ID</th>
                        <th>Designation</th>
                        <th>Last Working Day</th>
                        <th>Clearance Status</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.exitLetters?.map(l => {
                        const totalClearances = 6;
                        const completedClearances = [
                          l.workHandover,
                          l.assetReturn,
                          l.itClearance,
                          l.financeClearance,
                          l.hrClearance,
                          l.exitInterview
                        ].filter(c => c === 'completed').length;
                        const clearancePercent = Math.round((completedClearances / totalClearances) * 100);

                        return (
                          <tr key={l.id}>
                            <td><strong>{l.letterId}</strong></td>
                            <td>{l.employeeName}</td>
                            <td>{l.employeeId}</td>
                            <td>{l.designation}</td>
                            <td>{l.lastWorkingDate}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: '#ecfdf5', borderRadius: 10, overflow: 'hidden' }}>
                                  <div style={{ width: clearancePercent + '%', height: '100%', background: clearancePercent === 100 ? '#059669' : '#d97706', transition: 'width 0.3s' }}></div>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#4b5563' }}>{clearancePercent}%</span>
                              </div>
                            </td>
                            <td><span className={'status-badge ' + l.status.replace('pending-', '')}>{l.status}</span></td>
                            <td>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button className="btn btn-xs btn-primary" onClick={() => openPreviewExitModal(l)}>
                                  <i className="fas fa-eye"></i> Preview
                                </button>
                                <button className="btn btn-xs btn-outline" onClick={() => {
                                  setModalData({ letter: l });
                                  setActiveModal('exit_clearance');
                                }}>
                                  <i className="fas fa-tasks"></i> Clearance
                                </button>
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

          {currentPage === 'exceptions' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-exclamation-triangle"></i> Time & Attendance Exceptions Queue</h2>
              </div>
              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-traffic-light"></i> Live Discrepancies Awaiting HR Verification</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Exception ID</th>
                        <th>Employee</th>
                        <th>Discrepancy Category</th>
                        <th>Exception Details</th>
                        <th>Branch</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.timeExceptions?.map(ex => (
                        <tr key={ex.id}>
                          <td><strong>EXC-00{ex.id}</strong></td>
                          <td>{ex.employeeName}</td>
                          <td><span className="badge-doc red">{ex.type}</span></td>
                          <td>{ex.details}</td>
                          <td>{ex.location}</td>
                          <td>
                            <span className={`status-badge ${ex.status === 'approved' ? 'active' : ex.status === 'rejected' ? 'inactive' : 'pending'}`}>
                              {ex.status}
                            </span>
                          </td>
                          <td>
                            {ex.status === 'pending' ? (
                              <div className="flex gap-8">
                                <button className="btn btn-xs btn-success" onClick={() => handleResolveException(ex.id, 'approved', 'Authorized check-in discrepancy approved')}>
                                  Approve
                                </button>
                                <button className="btn btn-xs btn-danger" onClick={() => handleResolveException(ex.id, 'rejected', 'Punch coordinate rejected')}>
                                  Reject
                                </button>
                                <button className="btn btn-xs btn-outline" onClick={() => handleResolveException(ex.id, 'warned', 'Warning notice sent to staff')}>
                                  Warn
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: 12, color: '#6b7280', fontStyle: 'italic' }}>Resolved</span>
                            )}
                          </td>
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

          {/* ========================================================== */}
          {/* ADVANCED HR COMMAND CENTER NEW PAGES */}
          {/* ========================================================== */}

          {/* HR ACTION REQUIRED */}
          {currentPage === 'hrActionRequired' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-triangle-exclamation" style={{ color: '#dc2626' }}></i> HR Action Required</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Severity</th>
                        <th>Issue</th>
                        <th>Details</th>
                        <th>Immediate Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.alerts?.map(alert => (
                        <tr key={alert.id}>
                          <td>
                            <span className={'status-badge ' + (alert.severity === 'critical' ? 'critical' : 'warning')}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </td>
                          <td><strong>{alert.title}</strong></td>
                          <td>{alert.details}</td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => {
                              setCurrentPage(alert.targetTab);
                              showToast('Navigated to resolve: ' + alert.title, 'info');
                            }}>
                              {alert.action}
                            </button>
                            <button className="btn btn-xs btn-outline" style={{ marginLeft: 6 }} onClick={() => handleResolveAlert(alert.id)}>
                              Dismiss
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

          {/* HR ALERTS */}
          {currentPage === 'hrAlerts' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-bell"></i> HR Alerts & Notification Center</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label">🔴 Critical Alerts</div>
                  <div className="value">{db.alerts?.filter(a => a.severity === 'critical').length}</div>
                </div>
                <div className="stat-card">
                  <div className="label">🟠 Important Alerts</div>
                  <div className="value">{db.alerts?.filter(a => a.severity === 'important').length}</div>
                </div>
                <div className="stat-card">
                  <div className="label">🟡 Reminders</div>
                  <div className="value">{db.alerts?.filter(a => a.severity === 'reminder').length}</div>
                </div>
              </div>
              <div className="table-wrap" style={{ marginTop: 20 }}>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Alert Description</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.alerts?.map(alert => (
                        <tr key={alert.id}>
                          <td>#ALT-{alert.id}</td>
                          <td><span className="badge-doc blue">{alert.type.toUpperCase()}</span></td>
                          <td>{alert.details}</td>
                          <td><span className="status-badge warning">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* HR ANALYTICS */}
          {currentPage === 'hrAnalytics' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-chart-bar"></i> HR Performance Analytics</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label">Application-to-Hire Conversion</div>
                  <div className="value" style={{ color: '#059669' }}>1.5%</div>
                  <span className="change up">Benchmark Met</span>
                </div>
                <div className="stat-card">
                  <div className="label">Average Time-to-Hire</div>
                  <div className="value">22 Days</div>
                  <span className="change down">-4 days faster</span>
                </div>
                <div className="stat-card">
                  <div className="label">Recruiter Screen Pass Rate</div>
                  <div className="value">42.8%</div>
                  <span className="change neutral">Consistent</span>
                </div>
              </div>
              <div className="chart-grid">
                <div className="chart-box">
                  <h4>Top Sourcing Channels</h4>
                  <div style={{ padding: 20, background: '#f9fafb', borderRadius: 8, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>LinkedIn Ads</span><strong>54%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Employee Referrals</span><strong>28%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Direct Sourcing / Walk-in</span><strong>18%</strong>
                    </div>
                  </div>
                </div>
                <div className="chart-box">
                  <h4>Top Exit Reasons (ePay attrition index)</h4>
                  <div style={{ padding: 20, background: '#f9fafb', borderRadius: 8, fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Career Path Growth</span><strong>45%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Compensation Benchmarks</span><strong>35%</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Commute & Remote flexibility</span><strong>20%</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEE DIRECTORY */}
          {currentPage === 'employeeDirectory' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-address-book"></i> Employee Directory</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {db.employees.map(emp => (
                  <div key={emp.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="avatar-sm green" style={{ width: 44, height: 44, fontSize: 18 }}>{emp.name[0]}</div>
                      <div>
                        <strong>{emp.name}</strong>
                        <div className="text-xs text-muted">{emp.position}</div>
                      </div>
                    </div>
                    <div className="text-sm" style={{ borderTop: '1px solid #d1fae5', paddingTop: 8, marginTop: 4 }}>
                      <div><i className="fas fa-envelope" style={{ color: '#059669', marginRight: 6 }}></i> {emp.email}</div>
                      <div><i className="fas fa-phone" style={{ color: '#059669', marginRight: 6 }}></i> {emp.phone}</div>
                      <div><i className="fas fa-building" style={{ color: '#059669', marginRight: 6 }}></i> {emp.department}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEPARTMENTS */}
          {currentPage === 'departmentsList' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-building"></i> Company Departments</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Department Name</th>
                        <th>Headcount</th>
                        <th>Hiring Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Technology</strong></td>
                        <td>3 Employees</td>
                        <td><span className="status-badge active">2 Openings</span></td>
                      </tr>
                      <tr>
                        <td><strong>Sales</strong></td>
                        <td>2 Employees</td>
                        <td><span className="status-badge active">4 Openings</span></td>
                      </tr>
                      <tr>
                        <td><strong>Marketing</strong></td>
                        <td>2 Employees</td>
                        <td><span className="status-badge inactive">No Vacancies</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DESIGNATIONS */}
          {currentPage === 'designationsList' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-id-badge"></i> Designated Positions</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Designation</th>
                        <th>Reporting Authority</th>
                        <th>Probation Span</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.jobProfiles.map(prof => (
                        <tr key={prof.id}>
                          <td><strong>{prof.designation}</strong></td>
                          <td>{prof.reportingTo}</td>
                          <td>{prof.probationPeriod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TEAMS */}
          {currentPage === 'teamsList' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-people-group"></i> Active Operational Teams</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Team Name</th>
                        <th>Focus Area</th>
                        <th>Team Lead</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>App Engineering Team</strong></td>
                        <td>Mobile AEPS integration</td>
                        <td>Emily Chen</td>
                      </tr>
                      <tr>
                        <td><strong>B2B Franchise Acquisition</strong></td>
                        <td>Franchise network growth</td>
                        <td>Michael Torres</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* REPORTING STRUCTURE */}
          {currentPage === 'reportingStructure' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-sitemap"></i> Reporting Authority Map</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Designation</th>
                        <th>Direct Manager</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.employees.map(emp => (
                        <tr key={emp.id}>
                          <td><strong>{emp.name}</strong></td>
                          <td>{emp.position}</td>
                          <td>{emp.department === 'Technology' ? 'CTO / Admin User' : 'CEO Office'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORGANIZATION CHART */}
          {currentPage === 'orgChart' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-diagram-project"></i> Hierarchical Organization Chart</h2>
              </div>
              <div className="offer-preview" style={{ background: '#f0fdf4', textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ background: '#064e3b', color: '#fff', padding: '12px 24px', borderRadius: 8, display: 'inline-block', marginBottom: 20 }}>
                  <strong>CEO Command</strong><br /><span style={{ fontSize: 11, opacity: 0.8 }}>Executive Board</span>
                </div>
                <div style={{ fontSize: 24, color: '#059669' }}>↓</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                  <div style={{ background: '#fff', border: '1px solid #d1fae5', padding: '12px 20px', borderRadius: 8 }}>
                    <strong>Michael Torres</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Sales Manager</span>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #d1fae5', padding: '12px 20px', borderRadius: 8 }}>
                    <strong>Emily Chen</strong><br /><span style={{ fontSize: 11, color: '#6b7280' }}>Tech Lead</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITMENT DASHBOARD */}
          {currentPage === 'recruitmentDashboard' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-chart-line"></i> Sourcing & ATS Funnel</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label">Total Applications</div>
                  <div className="value">842</div>
                </div>
                <div className="stat-card">
                  <div className="label">Selected Candidates</div>
                  <div className="value">{db.candidates.filter(c => c.status === 'selected' || c.status === 'interviewed').length}</div>
                </div>
                <div className="stat-card">
                  <div className="label">BGV Completed</div>
                  <div className="value">{db.bgv?.filter(b => b.status === 'Verified').length}</div>
                </div>
              </div>
              <div className="offer-preview" style={{ marginTop: 20 }}>
                <h4>Hiring Funnel Ratios</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                      <span>Sourced → Screened (40%)</span>
                    </div>
                    <div style={{ height: 8, background: '#ecfdf5', borderRadius: 10 }}>
                      <div style={{ width: '40%', height: '100%', background: '#059669', borderRadius: 10 }}></div>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 2 }}>
                      <span>Screened → Interviewed (15%)</span>
                    </div>
                    <div style={{ height: 8, background: '#ecfdf5', borderRadius: 10 }}>
                      <div style={{ width: '15%', height: '100%', background: '#059669', borderRadius: 10 }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* JOB OPENINGS */}
          {currentPage === 'jobOpenings' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-briefcase"></i> Active Job Openings</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_requisition')}>
                  <i className="fas fa-plus"></i> New Vacancy
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {db.requisitions.map(req => (
                  <div key={req.id} className="stat-card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div className="flex-between">
                      <span className="status-badge active">{req.status}</span>
                      <small style={{ color: '#6b7280' }}>REQ-00{req.id}</small>
                    </div>
                    <h4>{req.position}</h4>
                    <div className="text-sm text-muted">
                      <div><strong>Department:</strong> {req.department}</div>
                      <div><strong>Location:</strong> {req.location}</div>
                      <div><strong>Skills:</strong> {req.skills}</div>
                    </div>
                    <strong style={{ color: '#059669', fontSize: 14 }}>{req.salaryRange}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {currentPage === 'applications' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-import"></i> All Applications</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Applied Designation</th>
                        <th>Matching Skills</th>
                        <th>Match Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.candidates.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong><br /><span className="text-xs text-muted">{c.email}</span></td>
                          <td>React Developer</td>
                          <td>{c.skills}</td>
                          <td><span className="badge-doc green">{c.score}%</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SCREENING */}
          {currentPage === 'screeningList' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-filter"></i> Resume Screening</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Current Company</th>
                        <th>Notice Period</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.candidates.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td>
                          <td>{c.currentCompany}</td>
                          <td>{c.noticePeriod}</td>
                          <td><span className="status-badge pending">Screening Pending</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SHORTLISTED */}
          {currentPage === 'shortlisted' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-user-check"></i> Shortlisted Candidates</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_candidate')}>
                  <i className="fas fa-plus"></i> Add Candidate
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Experience</th>
                        <th>Expected CTC</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.candidates.filter(c => c.status === 'shortlisted').map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td>
                          <td>{c.experience}</td>
                          <td>₹{c.expectedSalary?.toLocaleString()}</td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => {
                              setActiveModal('schedule_interview');
                              setModalData(c);
                            }}>
                              Schedule Interview
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

          {/* INTERVIEW SCHEDULER */}
          {currentPage === 'interviewScheduler' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-calendar-plus"></i> Advanced Interview Scheduler</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('schedule_interview')}>
                  <i className="fas fa-plus"></i> Schedule New Round
                </button>
              </div>
              <div className="offer-preview">
                <h4>Automated Conflict Detection Matrix</h4>
                <p className="text-muted text-sm">System checks availability before scheduling interview panels.</p>
                <div style={{ marginTop: 12, padding: 12, background: '#ecfdf5', borderRadius: 8, color: '#064e3b', fontSize: 13 }}>
                  🟢 Emily Chen: Available<br />
                  🔴 CTO: Busy (10:00 AM - 11:30 AM)<br />
                  🟢 Priya Sharma: Available
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW CALENDAR */}
          {currentPage === 'interviewCalendar' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-calendar-days"></i> Interview Calendar</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Interviewer</th>
                        <th>Candidate</th>
                        <th>Date / Time</th>
                        <th>Round</th>
                        <th>Room / Link</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviews.map(int => (
                        <tr key={int.id}>
                          <td><strong>{int.interviewer}</strong></td>
                          <td>{int.candidateName}</td>
                          <td>{int.date} at {int.time}</td>
                          <td>{int.round}</td>
                          <td><code>{int.room || 'Virtual Meeting'}</code></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW PANELS */}
          {currentPage === 'interviewPanels' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-users-rectangle"></i> Interview Panel Allocation</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="stat-card">
                  <h4>Full Stack Developer Panel</h4>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                    <strong>Technical:</strong> Emily Chen (Lead Dev)<br />
                    <strong>Management:</strong> CTO (Technical Director)<br />
                    <strong>HR:</strong> Priya Sharma (HR Head)
                  </div>
                </div>
                <div className="stat-card">
                  <h4>BDE / Franchise Sales Panel</h4>
                  <div style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>
                    <strong>Sales:</strong> Michael Torres (Sales Manager)<br />
                    <strong>HR:</strong> Priya Sharma (HR Manager)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW FEEDBACK */}
          {currentPage === 'interviewFeedback' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-comment-medical"></i> Interview Feedback & Evaluation</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('record_feedback')}>
                  <i className="fas fa-plus"></i> Submit Feedback
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Round</th>
                        <th>Tech /10</th>
                        <th>Comm /10</th>
                        <th>Overall Score</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviews.map(int => (
                        <tr key={int.id}>
                          <td><strong>{int.candidateName}</strong></td>
                          <td>{int.round}</td>
                          <td>{int.technicalScore || '—'} / 10</td>
                          <td>{int.communicationScore || '—'} / 10</td>
                          <td><strong>{int.overallScore || '—'} / 10</strong></td>
                          <td>
                            <span className={'status-badge ' + (int.status === 'completed' ? 'verified' : 'pending')}>
                              {int.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SELECTION STAGE */}
          {currentPage === 'selectionStage' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-user-graduate"></i> Selection & Offer Intent</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Designation</th>
                        <th>Overall Evaluation</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.candidates.map(c => (
                        <tr key={c.id}>
                          <td><strong>{c.name}</strong></td>
                          <td>React Developer</td>
                          <td><span className="badge-doc green">Strong Hire (Score {c.score}%)</span></td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => {
                              setActiveModal('create_offer');
                            }}>
                              Release Offer Letter
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

          {/* BACKGROUND VERIFICATION */}
          {currentPage === 'bgvVerification' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-shield-halved"></i> Background Verification (BGV)</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Identity</th>
                        <th>Address</th>
                        <th>Education</th>
                        <th>Employment</th>
                        <th>References</th>
                        <th>Final Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.bgv?.map(b => (
                        <tr key={b.id}>
                          <td><strong>{b.candidateName}</strong></td>
                          <td>
                            <select value={b.identity} onChange={(e) => handleUpdateBgvStatus(b.candidateId, 'identity', e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td>
                            <select value={b.address} onChange={(e) => handleUpdateBgvStatus(b.candidateId, 'address', e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td>
                            <select value={b.education} onChange={(e) => handleUpdateBgvStatus(b.candidateId, 'education', e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td>
                            <select value={b.employment} onChange={(e) => handleUpdateBgvStatus(b.candidateId, 'employment', e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td>
                            <select value={b.references} onChange={(e) => handleUpdateBgvStatus(b.candidateId, 'references', e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                              <option value="Failed">Failed</option>
                            </select>
                          </td>
                          <td>
                            <span className={'status-badge ' + (b.status === 'Verified' ? 'verified' : (b.status === 'Failed' ? 'error' : 'pending'))}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* RECRUITMENT REPORTS */}
          {currentPage === 'recruitmentReports' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-file-excel"></i> Recruitment Reports</h2>
              </div>
              <div className="doc-grid">
                <div className="doc-card" onClick={() => showToast('Downloading Funnel Report...', 'info')}>
                  <i className="fas fa-filter"></i>
                  <h4>ATS Sourcing funnel</h4>
                  <p>Applications conversion ratios</p>
                  <span className="badge-doc green">CSV Export</span>
                </div>
                <div className="doc-card" onClick={() => showToast('Downloading Delay Audit...', 'info')}>
                  <i className="fas fa-hourglass-half"></i>
                  <h4>Time-to-Hire Audit</h4>
                  <p>SLA breaches per opening</p>
                  <span className="badge-doc red">PDF Export</span>
                </div>
              </div>
            </div>
          )}

          {/* TODAY'S INTERVIEWS */}
          {currentPage === 'todaysInterviews' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-calendar-day"></i> Today's Scheduled Interviews</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Position</th>
                        <th>Round</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviews.map(int => (
                        <tr key={int.id}>
                          <td><strong>{int.candidateName}</strong></td>
                          <td>{int.position}</td>
                          <td>{int.round}</td>
                          <td>{int.time}</td>
                          <td>
                            <button className="btn btn-xs btn-primary" onClick={() => showToast('Joining video call room...', 'success')}>
                              Join Room
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

          {/* UPCOMING INTERVIEWS */}
          {currentPage === 'upcomingInterviews' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-calendar-week"></i> Upcoming Interviews</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Round</th>
                        <th>Date</th>
                        <th>Interviewer</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.interviews.map(int => (
                        <tr key={int.id}>
                          <td><strong>{int.candidateName}</strong></td>
                          <td>{int.round}</td>
                          <td>{int.date}</td>
                          <td>{int.interviewer}</td>
                          <td><span className="status-badge pending">{int.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INTERVIEW ROOMS */}
          {currentPage === 'interviewRooms' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-door-open"></i> Interview Room Status</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {db.rooms?.map(room => (
                  <div key={room.id} className="stat-card">
                    <h4>{room.name}</h4>
                    <span className={'status-badge ' + (room.status === 'Available' ? 'verified' : 'pending')}>
                      {room.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* INTERVIEWERS */}
          {currentPage === 'interviewers' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-user-tie"></i> Interviewer Matrix & Availability</h2>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Staff Member</th>
                        <th>Role Focus</th>
                        <th>Status Today</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>Emily Chen</strong></td>
                        <td>React / Technical Developer</td>
                        <td><span className="status-badge verified">Available</span></td>
                      </tr>
                      <tr>
                        <td><strong>Priya Sharma</strong></td>
                        <td>HR Screenings</td>
                        <td><span className="status-badge verified">Available</span></td>
                      </tr>
                      <tr>
                        <td><strong>CTO</strong></td>
                        <td>Final Architect rounds</td>
                        <td><span className="status-badge pending">Busy</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* NO SHOWS */}
          {currentPage === 'noShows' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-user-slash"></i> No Shows Log</h2>
              </div>
              <div className="empty-state">
                <i className="fas fa-user-xmark" style={{ fontSize: 48, color: '#dc2626' }}></i>
                <h4>Zero No-Shows Logged</h4>
                <p className="text-muted">All scheduled candidates attended their slots.</p>
              </div>
            </div>
          )}

          {/* RESCHEDULES */}
          {currentPage === 'reschedules' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-arrows-rotate"></i> Reschedule Requests</h2>
              </div>
              <div className="empty-state">
                <i className="fas fa-calendar-check" style={{ fontSize: 48, color: '#059669' }}></i>
                <h4>No pending reschedule requests</h4>
              </div>
            </div>
          )}

          {/* INTERVIEW ANALYTICS */}
          {currentPage === 'interviewAnalytics' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-chart-pie"></i> Interview Analytics</h2>
              </div>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="label">Interviews Conducted</div>
                  <div className="value">18</div>
                </div>
                <div className="stat-card">
                  <div className="label">Average Score</div>
                  <div className="value">8.2 / 10</div>
                </div>
                <div className="stat-card">
                  <div className="label">No Show Rate</div>
                  <div className="value">0%</div>
                </div>
              </div>
            </div>
          )}

          {/* EMPLOYEE TASK MANAGEMENT */}
          {currentPage === 'employeeTasks' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-tasks"></i> Staff Task & Deliverables</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('assign_task')}>
                  <i className="fas fa-plus"></i> Assign Task
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Task Name</th>
                        <th>Assigned To</th>
                        <th>Deadline</th>
                        <th>Progress</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.employeeTasks?.map(task => {
                        const emp = db.employees.find(e => e.id === task.employeeId);
                        return (
                          <tr key={task.id}>
                            <td><strong>{task.taskName}</strong></td>
                            <td>{emp ? emp.name : 'Unknown Staff'}</td>
                            <td>{task.deadline}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ flex: 1, height: 6, background: '#ecfdf5', borderRadius: 4 }}>
                                  <div style={{ width: task.progress + '%', height: '100%', background: '#059669', borderRadius: 4 }}></div>
                                </div>
                                <span style={{ fontSize: 12 }}>{task.progress}%</span>
                              </div>
                            </td>
                            <td><span className={'status-badge ' + (task.status === 'Completed' ? 'verified' : 'pending')}>{task.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* WARNING & DISCIPLINARY */}
          {currentPage === 'disciplinary' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-gavel"></i> Warning & Disciplinary Registry</h2>
                <button className="btn btn-danger" onClick={() => setActiveModal('issue_warning')}>
                  <i className="fas fa-triangle-exclamation"></i> Issue Warning
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Warning Type</th>
                        <th>Reason / Incident</th>
                        <th>Issued Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.warnings?.map(w => {
                        const emp = db.employees.find(e => e.id === w.employeeId);
                        return (
                          <tr key={w.id}>
                            <td><strong>{emp ? emp.name : 'Unknown Staff'}</strong></td>
                            <td><span className="badge-doc orange">{w.type}</span></td>
                            <td>{w.reason}</td>
                            <td>{w.date}</td>
                            <td><span className="status-badge active">{w.status}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SALARY & PAYROLL COORDINATION */}
          {currentPage === 'payroll' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-money-check-dollar"></i> Salary & Payroll Coordination</h2>
                <button className="btn btn-primary" onClick={() => showToast('Reconciliation complete. Shared with CFO!', 'success')}>
                  Submit to CFO
                </button>
              </div>

              {/* Payroll summary stats strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <div className="stat-card">
                  <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Total Gross Payroll</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#064e3b', marginTop: 4 }}>₹3,08,000</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Late Deductions</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#dc2626', marginTop: 4 }}>-₹500</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Overtime Approved</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 4 }}>+₹1,200</div>
                </div>
                <div className="stat-card">
                  <div style={{ fontSize: 11, color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>Net Disbursable</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#059669', marginTop: 4 }}>₹2,84,867</div>
                </div>
              </div>

              <div className="table-wrap">
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #d1fae5' }}>
                  <h4 style={{ color: '#064e3b' }}><i className="fas fa-calculator"></i> Attendance-Linked Salary Adjustments</h4>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Staff Member</th>
                        <th>Base CTC</th>
                        <th>Deductions (Late/Absent)</th>
                        <th>Allowances (OT)</th>
                        <th>Provident Fund</th>
                        <th>Net Calculated</th>
                        <th>Payout Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.employees.map(emp => {
                        const isRaj = emp.id === 4;
                        const isEmily = emp.id === 1;
                        const isMichael = emp.id === 2;

                        const lateDeduct = isRaj ? 500 : 0;
                        const unpaidLeave = isMichael ? 1333 : 0;
                        const otPay = isEmily ? 1200 : 0;
                        const pfVal = Math.round(emp.salary * 0.06);

                        const netPay = Math.round(emp.salary - lateDeduct - unpaidLeave + otPay - pfVal);

                        return (
                          <tr key={emp.id}>
                            <td><code>{emp.employeeCode}</code></td>
                            <td><strong>{emp.name}</strong></td>
                            <td>₹{emp.salary?.toLocaleString('en-IN')}</td>
                            <td style={{ color: '#dc2626' }}>
                              {lateDeduct > 0 && `₹${lateDeduct} (Late)`}
                              {unpaidLeave > 0 && `₹${unpaidLeave} (Leave)`}
                              {lateDeduct === 0 && unpaidLeave === 0 && '—'}
                            </td>
                            <td style={{ color: '#059669' }}>
                              {otPay > 0 ? `+₹${otPay} (OT)` : '—'}
                            </td>
                            <td>₹{pfVal.toLocaleString('en-IN')}</td>
                            <td><strong style={{ color: '#059669' }}>₹{netPay.toLocaleString('en-IN')}</strong></td>
                            <td>
                              <span className={`status-badge ${isRaj || isMichael ? 'pending' : 'active'}`}>
                                {isRaj || isMichael ? 'Awaiting Adjustments' : 'Settlement Approved'}
                              </span>
                            </td>
                            <td>
                              <button
                                className="btn btn-xs btn-outline"
                                onClick={() => showToast(`Settlement computed & finalized for ${emp.name}`, 'success')}
                              >
                                Finalize
                              </button>
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

          {/* REWARDS & RECOGNITION */}
          {currentPage === 'rewards' && (
            <div>
              <div className="section-header">
                <h2><i className="fas fa-trophy"></i> Rewards & Recognition</h2>
                <button className="btn btn-primary" onClick={() => setActiveModal('add_reward')}>
                  Log Recognition
                </button>
              </div>
              <div className="table-wrap">
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Award Title</th>
                        <th>Date Recognized</th>
                        <th>Points Awarded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {db.rewards?.map(r => {
                        const emp = db.employees.find(e => e.id === r.employeeId);
                        return (
                          <tr key={r.id}>
                            <td><strong>{emp ? emp.name : 'Unknown Staff'}</strong></td>
                            <td>{r.award}</td>
                            <td>{r.date}</td>
                            <td><strong style={{ color: '#d97706' }}>+{r.points} pts</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
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
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 12.5, color: '#064e3b' }}>
              <div style={{ fontWeight: 700, marginBottom: 2, display: 'flex', items: 'center', gap: 6 }}>
                <span>🛡️ Governance & Approval Workflow</span>
              </div>
              <div>Employees added by HR are saved and queued for <strong>Super Admin authorization</strong> before their account is activated for portal login.</div>
            </div>
            <form onSubmit={handleOnboardEmployee}>
              <div className="form-row">
                <div className="form-group"><label>Full Name *</label><input type="text" name="name" required placeholder="John Doe" /></div>
                <div className="form-group"><label>Work Email *</label><input type="email" name="email" required placeholder="john@epay.in" /></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Portal Role *</label>
                  <select name="role" defaultValue="sales-exec">
                    <option value="sales-exec">Sales Executive (Field / Office)</option>
                    <option value="bde">Business Development Executive (BDE)</option>
                    <option value="bdo">Business Development Officer (BDO)</option>
                    <option value="telecalling">Telecaller / Inbound Support</option>
                    <option value="hr">Human Resources (HR Staff)</option>
                    <option value="accountant">Accountant / Finance Exec</option>
                    <option value="ops-exec">Operations Executive</option>
                    <option value="support">Customer Support Executive</option>
                    <option value="marketing-exec">Marketing Executive</option>
                    <option value="devhub">IT / Developer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Initial Temporary Password *</label>
                  <input type="text" name="password" defaultValue="Epay@2026!" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select name="department">
                    <option value="Sales">Sales & Growth</option>
                    <option value="Operations">Operations</option>
                    <option value="Technology">Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Human Resources">Human Resources</option>
                  </select>
                </div>
                <div className="form-group"><label>Position / Designation *</label><input type="text" name="position" required defaultValue="Sales Executive" placeholder="Senior Executive" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Monthly Salary (₹) *</label><input type="number" name="salary" defaultValue={35000} required /></div>
                <div className="form-group"><label>Mobile Phone *</label><input type="text" name="phone" defaultValue="+91 98765 00000" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>PAN Card Number</label><input type="text" name="pan" defaultValue="ABCDE1234F" /></div>
                <div className="form-group"><label>Aadhaar Number</label><input type="text" name="aadhaar" defaultValue="1234 5678 9012" /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit for Super Admin Approval</button>
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
              <div className="form-row">
                <div className="form-group"><label>Location</label><input type="text" name="location" defaultValue="Noida / Delhi" /></div>
                <div className="form-group"><label>Qualification</label><input type="text" name="qualification" defaultValue="B.Tech / MCA / Graduate" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Current CTC (₹/mo)</label><input type="number" name="currentSalary" defaultValue={45000} /></div>
                <div className="form-group"><label>Expected CTC (₹/mo)</label><input type="number" name="expectedSalary" defaultValue={60000} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Current Company</label><input type="text" name="currentCompany" defaultValue="Tech Corp" /></div>
                <div className="form-group"><label>Notice Period</label><input type="text" name="noticePeriod" defaultValue="30 days" /></div>
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

      {activeModal === 'schedule_interview' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-calendar-plus"></i> Schedule Interview</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleScheduleInterview}>
              <div className="form-group">
                <label>Select Candidate *</label>
                <select name="candidateId" required>
                  {db.candidates.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.status})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Position / Vacancy *</label><input type="text" name="position" defaultValue="Senior React Developer" required /></div>
                <div className="form-group"><label>Round *</label><input type="text" name="round" defaultValue="Technical Round 1" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Interviewer Panel Member *</label><input type="text" name="interviewer" defaultValue="Emily Chen" required /></div>
                <div className="form-group">
                  <label>Room Allocation</label>
                  <select name="room">
                    <option value="Virtual Meeting">Virtual Meeting Room</option>
                    <option value="Room A">Interview Room A</option>
                    <option value="Room B">Interview Room B</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Date *</label><input type="date" name="date" defaultValue={newDateStr()} required /></div>
                <div className="form-group"><label>Time Slot *</label><input type="text" name="time" placeholder="02:00 PM" required /></div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Round</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'record_feedback' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-comment-medical"></i> Log Interview Feedback</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleRecordFeedback}>
              <div className="form-group">
                <label>Select Scheduled Interview *</label>
                <select name="interviewId" required>
                  {db.interviews.map(i => (
                    <option key={i.id} value={i.id}>{i.candidateName} - {i.round} ({i.interviewer})</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Technical Score (/10) *</label><input type="number" name="techScore" max={10} min={0} defaultValue={8} required /></div>
                <div className="form-group"><label>Communication Score (/10) *</label><input type="number" name="commScore" max={10} min={0} defaultValue={8} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Culture Fit Score (/10) *</label><input type="number" name="cultureScore" max={10} min={0} defaultValue={8} required /></div>
                <div className="form-group">
                  <label>Overall Recommendation *</label>
                  <select name="recommendation" required>
                    <option value="Strong Hire">Strong Hire</option>
                    <option value="Hire">Hire</option>
                    <option value="Consider">Consider</option>
                    <option value="Reject">Reject</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Lock & Submit Feedback</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'issue_warning' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-triangle-exclamation"></i> Issue Disciplinary Warning</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleIssueWarning}>
              <div className="form-group">
                <label>Select Employee *</label>
                <select name="employeeId" required>
                  {db.employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeCode})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Warning Category *</label>
                <select name="type" required>
                  <option value="Verbal Warning">Verbal Warning</option>
                  <option value="Written Warning">Written Warning</option>
                  <option value="Performance Warning">Performance Warning</option>
                  <option value="Attendance Warning">Attendance Warning</option>
                  <option value="PIP Warning">Performance Improvement Warning</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reason / Incident Description *</label>
                <textarea name="reason" required placeholder="Detail the warning context..."></textarea>
              </div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-danger">Issue Warning</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'assign_task' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-tasks"></i> Assign Employee Task</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Select Employee *</label>
                <select name="employeeId" required>
                  {db.employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeCode})</option>
                  ))}
                </select>
              </div>
              <div className="form-group"><label>Task Name / Description *</label><input type="text" name="taskName" required placeholder="Create weekly marketing copy" /></div>
              <div className="form-group"><label>Deadline *</label><input type="date" name="deadline" defaultValue={newDateStr()} required /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeModal === 'add_reward' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-trophy"></i> Log Recognition & Award</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleAddReward}>
              <div className="form-group">
                <label>Select Employee *</label>
                <select name="employeeId" required>
                  {db.employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeCode})</option>
                  ))}
                </select>
              </div>
              <div className="form-group"><label>Award / Recognition Title *</label><input type="text" name="award" placeholder="Star of the Quarter" required /></div>
              <div className="form-group"><label>Reward Points</label><input type="number" name="points" defaultValue={100} required /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Award Recognition</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE APPOINTMENT LETTER MODAL */}
      {activeModal === 'create_appointment' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-contract"></i> Generate Appointment Letter</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateAppointmentLetter}>
              <div className="form-row">
                <div className="form-group"><label>Employee Name *</label><input type="text" name="employeeName" required placeholder="Priya Menon" /></div>
                <div className="form-group"><label>Employee ID *</label><input type="text" name="employeeId" required placeholder="EMP-001" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Designation *</label><input type="text" name="designation" required placeholder="HR Executive" /></div>
                <div className="form-group"><label>Department *</label><input type="text" name="department" required placeholder="Human Resources" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Team</label><input type="text" name="team" placeholder="Recruitment" /></div>
                <div className="form-group"><label>Reporting Manager *</label><input type="text" name="reportingManager" required placeholder="Priya Sharma" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Joining Date *</label><input type="date" name="joiningDate" required /></div>
                <div className="form-group"><label>Work Location *</label><input type="text" name="workLocation" required placeholder="Noida HQ Office" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Employment Type *</label>
                  <select name="employmentType" required>
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>
                <div className="form-group"><label>Monthly Salary (₹) *</label><input type="number" name="monthlySalary" required placeholder="35000" /></div>
              </div>
              <div className="form-group"><label>Probation Period</label><input type="text" name="probationPeriod" defaultValue="6 Months" /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Letter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW APPOINTMENT LETTER MODAL */}
      {activeModal === 'preview_appointment' && modalData?.letter && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-contract"></i> Appointment Letter Preview — {modalData.letter.letterId}</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="offer-preview">
              <div className="header">
                <div className="logo"><i className="fas fa-cubes"></i> EPAY DIGITAL PVT LTD</div>
                <div className="company-info">
                  <strong>EPAY DIGITAL PVT LTD</strong><br />
                  Noida, Uttar Pradesh, India
                </div>
              </div>

              <div className="title">EMPLOYEE JOINING & APPOINTMENT LETTER</div>
              <div className="offer-id">Reference: <strong>{modalData.letter.letterId}</strong> | Date: {modalData.letter.generatedDate}</div>

              <p>To,</p>
              <p><strong>{modalData.letter.employeeName}</strong></p>

              <p><strong>Subject: Employee Joining & Appointment Confirmation – {modalData.letter.designation}</strong></p>

              <p>Dear {modalData.letter.employeeName},</p>
              <p>We are pleased to offer you employment with <strong>EPAY DIGITAL PVT LTD</strong> for the position of <strong>{modalData.letter.designation}</strong> in the <strong>{modalData.letter.department}</strong>.</p>

              <div className="section">
                <h4>Your employment details are as follows:</h4>
                <div className="row"><div className="label">Employee Name:</div><div className="value">{modalData.letter.employeeName}</div></div>
                <div className="row"><div className="label">Employee ID:</div><div className="value"><strong>{modalData.letter.employeeId}</strong></div></div>
                <div className="row"><div className="label">Designation:</div><div className="value">{modalData.letter.designation}</div></div>
                <div className="row"><div className="label">Department:</div><div className="value">{modalData.letter.department}</div></div>
                <div className="row"><div className="label">Team:</div><div className="value">{modalData.letter.team}</div></div>
                <div className="row"><div className="label">Reporting Manager:</div><div className="value">{modalData.letter.reportingManager}</div></div>
                <div className="row"><div className="label">Joining Date:</div><div className="value"><strong>{modalData.letter.joiningDate}</strong></div></div>
                <div className="row"><div className="label">Work Location:</div><div className="value">{modalData.letter.workLocation}</div></div>
                <div className="row"><div className="label">Employment Type:</div><div className="value">{modalData.letter.employmentType}</div></div>
                <div className="row"><div className="label">Monthly Salary:</div><div className="value"><strong style={{ color: '#059669', fontSize: 16 }}>₹{modalData.letter.monthlySalary?.toLocaleString()}</strong></div></div>
                <div className="row"><div className="label">Probation Period:</div><div className="value">{modalData.letter.probationPeriod}</div></div>
              </div>

              <div className="section">
                <h4>Mandatory Employment Conditions</h4>
                <p>By accepting this appointment, you agree to:</p>
                <ol style={{ paddingLeft: 20, lineHeight: 1.8 }}>
                  <li>Join on the specified joining date and report to the assigned manager/HR.</li>
                  <li>Follow the Company's working hours, attendance, leave, and late-mark policies.</li>
                  <li>Maintain the Company's required professional/formal dress code.</li>
                  <li>Maintain professional, respectful, and disciplined behavior at all times.</li>
                  <li>Follow all applicable company rules, departmental procedures, and management instructions.</li>
                  <li>Maintain strict confidentiality of company, customer, employee, financial, technical, and business information.</li>
                  <li>Follow all IT, cybersecurity, password, device, and data-security requirements.</li>
                  <li>Use company equipment, systems, accounts, and resources only for authorized purposes.</li>
                  <li>Complete assigned work, targets, responsibilities, and reporting requirements within agreed timelines.</li>
                  <li>Maintain accurate attendance, task, CRM, performance, and other company records.</li>
                  <li>Not falsify, manipulate, forge, or misrepresent any document, information, attendance, work report, or company record.</li>
                  <li>Not engage in harassment, bullying, threats, abusive behavior, unnecessary disruption, or inappropriate workplace conduct.</li>
                  <li>Not sell, promote, or solicit outside products, services, or personal business through company premises or official company channels without authorization.</li>
                  <li>Protect company property and return all assigned equipment, documents, ID cards, and access items when required.</li>
                  <li>Follow the Company's 6-month probation/employment terms and applicable performance requirements.</li>
                  <li>Complete all required onboarding documents, training, and policy acknowledgements.</li>
                </ol>
              </div>

              <div className="section">
                <h4>Department-Specific Requirements</h4>
                <p>You will also be required to comply with the specific rules, systems, targets, security requirements, and responsibilities applicable to your Department, Team, and Designation.</p>
              </div>

              <div className="section">
                <h4>Acceptance</h4>
                <p>Please sign and return this letter as confirmation that you have read, understood, and accepted the above employment terms and mandatory company requirements.</p>
                <p>We welcome you to EPAY DIGITAL and look forward to your contribution.</p>
              </div>

              <div className="footer">
                <div className="signature">
                  <div className="seal">SEAL</div>
                  <div className="line"></div>
                  <div>For EPAY DIGITAL</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>HR Department</div>
                </div>
                <div className="signature">
                  <div className="line"></div>
                  <div>Employee Signature</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Date: ____________</div>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print / PDF
              </button>
              {modalData.letter.status === 'generated' && (
                <button className="btn btn-success" onClick={() => handleUpdateAppointmentStatus(modalData.letter.id, 'sent')}>
                  <i className="fas fa-paper-plane"></i> Send to Employee
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE INTERVIEW LETTER MODAL */}
      {activeModal === 'create_interview_letter' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-envelope"></i> Create Interview Invitation Letter</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateInterviewLetter}>
              <div className="form-row">
                <div className="form-group"><label>Candidate Name *</label><input type="text" name="candidateName" required placeholder="Vikram Singh" /></div>
                <div className="form-group"><label>Position *</label><input type="text" name="designation" required placeholder="Senior React Developer" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Department *</label><input type="text" name="department" required placeholder="Technology" /></div>
                <div className="form-group"><label>Interview Round *</label><input type="text" name="round" required placeholder="Technical Round 1" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Interview Date *</label><input type="date" name="interviewDate" required /></div>
                <div className="form-group"><label>Interview Time *</label><input type="time" name="interviewTime" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Interview Mode *</label>
                  <select name="mode" required>
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="form-group"><label>Interviewer *</label><input type="text" name="interviewer" required placeholder="Emily Chen" /></div>
              </div>
              <div className="form-group"><label>Location (for in-person)</label><input type="text" name="location" placeholder="Noida HQ Office - Conference Room A" /></div>
              <div className="form-group"><label>Meeting Link (for online)</label><input type="url" name="meetingLink" placeholder="https://meet.google.com/..." /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Letter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW INTERVIEW LETTER MODAL */}
      {activeModal === 'preview_interview' && modalData?.letter && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" style={{ maxWidth: 700 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-envelope"></i> Interview Letter Preview — {modalData.letter.letterId}</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="offer-preview">
              <div className="header">
                <div className="logo"><i className="fas fa-cubes"></i> EPAY DIGITAL</div>
                <div className="company-info">
                  <strong>EPAY DIGITAL</strong>
                </div>
              </div>

              <div className="title">INTERVIEW INVITATION LETTER</div>
              <div className="offer-id">Date: {new Date().toISOString().slice(0, 10)}</div>

              <p><strong>Subject: Interview Invitation – {modalData.letter.designation}</strong></p>

              <p>Dear <strong>{modalData.letter.candidateName}</strong>,</p>
              <p>We are pleased to invite you for an interview for the position of <strong>{modalData.letter.designation}</strong> in the <strong>{modalData.letter.department}</strong> at EPAY DIGITAL.</p>

              <div className="section">
                <h4>Interview Details</h4>
                <div className="row"><div className="label">Interview Date:</div><div className="value"><strong>{modalData.letter.interviewDate}</strong></div></div>
                <div className="row"><div className="label">Time:</div><div className="value"><strong>{modalData.letter.interviewTime}</strong></div></div>
                <div className="row"><div className="label">Round:</div><div className="value">{modalData.letter.round}</div></div>
                <div className="row"><div className="label">Mode:</div><div className="value">{modalData.letter.mode}</div></div>
                <div className="row"><div className="label">Interviewer:</div><div className="value">{modalData.letter.interviewer}</div></div>
                {modalData.letter.location && (
                  <div className="row"><div className="label">Location:</div><div className="value">{modalData.letter.location}</div></div>
                )}
                {modalData.letter.meetingLink && (
                  <div className="row"><div className="label">Meeting Link:</div><div className="value"><a href={modalData.letter.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: '#059669' }}>{modalData.letter.meetingLink}</a></div></div>
                )}
              </div>

              <p>Please be available at the scheduled time and keep your required documents/resume ready.</p>
              <p>We look forward to speaking with you.</p>

              <div className="footer">
                <div className="signature">
                  <div className="line"></div>
                  <div>Regards,</div>
                  <div style={{ fontSize: 13, color: '#064e3b', fontWeight: 600 }}>HR Team</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>EPAY DIGITAL</div>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print / PDF
              </button>
              {modalData.letter.status === 'scheduled' && (
                <button className="btn btn-success" onClick={() => handleUpdateInterviewStatus(modalData.letter.id, 'sent')}>
                  <i className="fas fa-paper-plane"></i> Send to Candidate
                </button>
              )}
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EXIT LETTER MODAL */}
      {activeModal === 'create_exit_letter' && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-export"></i> Generate Exit & Relieving Letter</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <form onSubmit={handleCreateExitLetter}>
              <div className="form-row">
                <div className="form-group"><label>Employee Name *</label><input type="text" name="employeeName" required placeholder="Vikram Patel" /></div>
                <div className="form-group"><label>Employee ID *</label><input type="text" name="employeeId" required placeholder="EMP-045" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Designation *</label><input type="text" name="designation" required placeholder="Telecaller Agent" /></div>
                <div className="form-group"><label>Team *</label><input type="text" name="team" required placeholder="Sales" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Joining Date *</label><input type="date" name="joiningDate" required /></div>
                <div className="form-group"><label>Resignation Date *</label><input type="date" name="resignationDate" required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Last Working Date *</label><input type="date" name="lastWorkingDate" required /></div>
                <div className="form-group"><label>Relieving Date *</label><input type="date" name="relievingDate" required /></div>
              </div>
              <div className="form-group"><label>Notice Served</label><input type="text" name="noticeServed" defaultValue="30 Days" /></div>
              <div className="form-actions">
                <button type="button" className="btn" onClick={() => setActiveModal(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Letter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PREVIEW EXIT LETTER MODAL */}
      {activeModal === 'preview_exit' && modalData?.letter && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" style={{ maxWidth: 840 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-file-export"></i> Exit Letter Preview — {modalData.letter.letterId}</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div className="offer-preview">
              <div className="header">
                <div className="logo"><i className="fas fa-cubes"></i> EPAY DIGITAL</div>
                <div className="company-info">
                  <strong>EPAY DIGITAL</strong>
                </div>
              </div>

              <div className="title">EMPLOYEE EXIT & RELIEVING LETTER</div>
              <div className="offer-id">Date: {modalData.letter.generatedDate}</div>

              <p><strong>Subject: Relieving & Employment Confirmation</strong></p>

              <p>Dear <strong>{modalData.letter.employeeName}</strong>,</p>
              <p>This is to confirm that <strong>{modalData.letter.employeeName}</strong>, Employee ID <strong>{modalData.letter.employeeId}</strong>, was employed with EPAY DIGITAL as <strong>{modalData.letter.designation}</strong> in the <strong>{modalData.letter.team}</strong> from <strong>{modalData.letter.joiningDate}</strong> to <strong>{modalData.letter.lastWorkingDate}</strong>.</p>

              <div className="section">
                <h4>The employee has completed the applicable exit formalities, including:</h4>
                <ul>
                  <li>Work and knowledge handover</li>
                  <li>Company asset return</li>
                  <li>Document clearance</li>
                  <li>IT access clearance</li>
                  <li>Department clearance</li>
                  <li>Applicable final settlement process</li>
                </ul>
              </div>

              <p>The employee is relieved from their duties effective <strong>{modalData.letter.relievingDate}</strong>, subject to completion of any remaining applicable formalities.</p>
              <p>We thank you for your contribution and wish you success in your future endeavors.</p>

              <div className="section">
                <h4>Mandatory Exit Rules</h4>
                <p><strong>A. Resignation & Notice:</strong> Resignation must be submitted through the approved company/HR process. The applicable notice period must be completed unless formally waived or modified by the authorized management.</p>
                <p><strong>B. Complete Work Handover:</strong> Before the last working day, the employee MUST complete pending assigned work, transfer ongoing tasks, provide required project documentation, and complete knowledge transfer where required.</p>
                <p><strong>C. Company Property Return:</strong> The employee must return all company property including laptop/computer, mobile phone, SIM card, ID card, access card, keys, hard drives/USB devices, company documents, equipment, and other assigned assets.</p>
                <p><strong>D. IT & Cybersecurity Clearance:</strong> Company email and system access must be cleared/disabled. Company passwords, credentials, access tokens must not be retained. Employees must not copy company data, transfer source code, customer information, databases, documents, financial information, or other confidential data to personal devices/accounts.</p>
                <p><strong>E. Confidentiality After Exit:</strong> Confidentiality obligations that legally and contractually continue after employment must be respected. Employees must not share confidential company information, customer/employee information, disclose source code or technical information, or misuse company documents.</p>
                <p><strong>F. Financial & HR Clearance:</strong> HR/Finance may verify salary/payroll status, approved reimbursements, outstanding advances, company assets, applicable deductions, and leave/attendance records.</p>
                <p><strong>G. Exit Interview:</strong> The employee may be required to complete an exit interview covering reason for leaving, job experience, management feedback, team environment, and workplace feedback.</p>
              </div>

              <div className="section">
                <h4>Exit Clearance Form</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#ecfdf5' }}>
                      <th style={{ padding: 8, textAlign: 'left', border: '1px solid #d1fae5' }}>Clearance Area</th>
                      <th style={{ padding: 8, textAlign: 'left', border: '1px solid #d1fae5' }}>Responsible Person</th>
                      <th style={{ padding: 8, textAlign: 'left', border: '1px solid #d1fae5' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Work Handover</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Reporting Manager</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.workHandover}>{modalData.letter.workHandover}</span></td>
                    </tr>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Company Assets</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Admin</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.assetReturn}>{modalData.letter.assetReturn}</span></td>
                    </tr>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>IT & Access Clearance</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>IT Team</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.itClearance}>{modalData.letter.itClearance}</span></td>
                    </tr>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Finance/Advances</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Finance</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.financeClearance}>{modalData.letter.financeClearance}</span></td>
                    </tr>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>HR Clearance</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>HR</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.hrClearance}>{modalData.letter.hrClearance}</span></td>
                    </tr>
                    <tr>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>Exit Interview</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}>HR</td>
                      <td style={{ padding: 8, border: '1px solid #d1fae5' }}><span className={'status-badge ' + modalData.letter.exitInterview}>{modalData.letter.exitInterview}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="section">
                <h4>Employee Exit Declaration</h4>
                <p>I, <strong>{modalData.letter.employeeName}</strong>, confirm that I have completed the applicable exit formalities and have returned all company property in my possession.</p>
                <p>I confirm that I have completed the required work handover and will continue to comply with any confidentiality, intellectual property, data protection, and other obligations that legally or contractually continue after my employment.</p>
              </div>

              <div className="footer">
                <div className="signature">
                  <div className="seal">SEAL</div>
                  <div className="line"></div>
                  <div>For EPAY DIGITAL</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>HR Department</div>
                </div>
                <div className="signature">
                  <div className="line"></div>
                  <div>Employee Signature</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>Date: ____________</div>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-outline" onClick={() => window.print()}>
                <i className="fas fa-print"></i> Print / PDF
              </button>
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Close Preview</button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT CLEARANCE MANAGEMENT MODAL */}
      {activeModal === 'exit_clearance' && modalData?.letter && (
        <div className="modal-overlay open" onClick={() => setActiveModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><i className="fas fa-tasks"></i> Exit Clearance Management — {modalData.letter.letterId}</h3>
              <button className="close" onClick={() => setActiveModal(null)}>&times;</button>
            </div>

            <div style={{ padding: '0 4px' }}>
              <p style={{ marginBottom: 16, color: '#6b7280' }}>Manage clearance status for <strong>{modalData.letter.employeeName}</strong></p>

              <div style={{ display: 'grid', gap: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>Work Handover</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Reporting Manager</div>
                  </div>
                  <select
                    value={modalData.letter.workHandover}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'workHandover', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>Asset Return</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Admin</div>
                  </div>
                  <select
                    value={modalData.letter.assetReturn}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'assetReturn', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>IT Clearance</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>IT Team</div>
                  </div>
                  <select
                    value={modalData.letter.itClearance}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'itClearance', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>Finance Clearance</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>Finance</div>
                  </div>
                  <select
                    value={modalData.letter.financeClearance}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'financeClearance', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>HR Clearance</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>HR</div>
                  </div>
                  <select
                    value={modalData.letter.hrClearance}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'hrClearance', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#f9fafb', borderRadius: 8 }}>
                  <div>
                    <strong>Exit Interview</strong>
                    <div style={{ fontSize: 11, color: '#6b7280' }}>HR</div>
                  </div>
                  <select
                    value={modalData.letter.exitInterview}
                    onChange={(e) => handleUpdateExitClearance(modalData.letter.id, 'exitInterview', e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #d1fae5' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-actions" style={{ marginTop: 20 }}>
              <button className="btn btn-primary" onClick={() => setActiveModal(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
