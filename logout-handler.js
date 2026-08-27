/**
 * ePay CRM Logout Handler & Session Timer
 * Handles user logout, session tracking, and notifications
 */

class CRMLogoutHandler {
    constructor() {
        this.sessionStartTime = Date.now();
        this.lastActivityTime = Date.now();
        this.isActive = true;
        this.timerInterval = null;
        this.timerDisplay = null;
        this.logoutBtn = null;
        this.inactivityThreshold = 15 * 60 * 1000; // 15 minutes
        this.init();
    }

    init() {
        console.info('[LogoutHandler] Initializing...');
        
        // Find logout button and timer display
        this.logoutBtn = document.getElementById('logout-btn');
        this.timerDisplay = document.getElementById('session-timer-display');
        
        if (!this.logoutBtn) {
            console.warn('[LogoutHandler] Logout button not found');
            return;
        }

        // Add event listeners
        document.addEventListener('mousemove', () => this.trackActivity());
        document.addEventListener('keypress', () => this.trackActivity());
        document.addEventListener('click', () => this.trackActivity());
        
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
        
        // Start timer updates
        this.startTimer();
        
        console.info('[LogoutHandler] ✅ Ready');
    }

    trackActivity() {
        this.lastActivityTime = Date.now();
        if (!this.isActive) {
            this.isActive = true;
            console.info('[LogoutHandler] User active again');
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay() {
        if (!this.timerDisplay) return;

        const elapsed = Date.now() - this.sessionStartTime;
        const hours = Math.floor(elapsed / (1000 * 60 * 60));
        const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

        const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        this.timerDisplay.textContent = formatted;
    }

    async handleLogout() {
        console.info('[LogoutHandler] Logout initiated');
        
        if (this.logoutBtn) {
            this.logoutBtn.disabled = true;
            this.logoutBtn.textContent = 'Logging out...';
        }

        const activeTime = Date.now() - this.sessionStartTime;
        const user = {
            email: localStorage.getItem('user_email') || 'unknown@epay.com',
            name: localStorage.getItem('user_name') || 'User',
            uid: localStorage.getItem('user_id') || 'guest'
        };

        // Log session data
        const sessionData = {
            userId: user.uid,
            userEmail: user.email,
            userName: user.name,
            loginTime: new Date(this.sessionStartTime).toISOString(),
            logoutTime: new Date().toISOString(),
            activeTimeMs: activeTime,
            activeTimeFormatted: this.formatDuration(activeTime),
            duration: activeTime
        };

        // Save to storage
        if (typeof window.smartStorageManager !== 'undefined') {
            await window.smartStorageManager.add('session_timers', sessionData);
            console.info('[LogoutHandler] ✅ Session logged');
        }

        // Clear user data
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_id');

        // Redirect or show logout complete
        setTimeout(() => {
            alert('✅ Logged out successfully!');
            window.location.href = '/login.html';
        }, 500);
    }

    formatDuration(ms) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);

        const parts = [];
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    destroy() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }
}

// Initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.crmLogoutHandler = new CRMLogoutHandler();
    });
} else {
    window.crmLogoutHandler = new CRMLogoutHandler();
}
