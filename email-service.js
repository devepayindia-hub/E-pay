/**
 * EmailService - Email Notification Management
 * 
 * Handles sending transactional emails for CRM events:
 * - Login notifications
 * - Logout notifications with session duration
 * - Role change notifications
 * - Password reset emails
 * 
 * Integrates with SendGrid for email delivery
 * Logs all email activity to Firestore (email_logs collection)
 * 
 * Firestore Collection: email_logs/{docId}
 * Fields: recipientEmail, subject, eventType, sentAt, status, userId, templateUsed, content, error
 * 
 * Requires SendGrid API key configured in environment or constructor
 */

class EmailService {
    constructor(sendGridApiKey) {
        // SendGrid configuration
        this.sendGridApiKey = sendGridApiKey || null;
        this.sendGridBaseUrl = 'https://api.sendgrid.com/v3/mail/send';
        
        // Firestore setup
        this.db = null;
        this.emailLogsRef = null;
        this.collectionName = 'email_logs';
        
        // Email configuration
        this.fromEmail = 'noreply@epaycrm.com';
        this.fromName = 'ePay CRM';
        
        // Email templates
        this.templates = {
            LOGIN: 'login',
            LOGOUT: 'logout',
            ROLE_CHANGE: 'role_change',
            PASSWORD_RESET: 'password_reset'
        };
        
        // Initialization state
        this.isInitialized = false;
        
        console.info('[EmailService] Created');
    }
    
    /**
     * Initialize EmailService
     * - Wait for Firebase to be ready
     * - Get Firestore instance
     * - Validate SendGrid API key
     * 
     * @param {Object} [config] - Optional configuration object
     * @returns {Promise<void>}
     */
    async init(config = {}) {
        try {
            if (this.isInitialized) {
                console.warn('[EmailService] Already initialized');
                return;
            }
            
            // Update configuration if provided
            if (config.sendGridApiKey) {
                this.sendGridApiKey = config.sendGridApiKey;
            }
            if (config.fromEmail) {
                this.fromEmail = config.fromEmail;
            }
            if (config.fromName) {
                this.fromName = config.fromName;
            }
            
            // Wait for Firebase to be available
            if (typeof firebase === 'undefined') {
                await this._waitForFirebase();
            }
            
            // Get Firestore instance
            this.db = firebase.firestore();
            this.emailLogsRef = this.db.collection(this.collectionName);
            
            // Validate SendGrid API key
            if (!this.sendGridApiKey) {
                console.warn('[EmailService] SendGrid API key not configured. Email sending will fail.');
            }
            
            this.isInitialized = true;
            console.info('[EmailService] Initialized successfully');
        } catch (error) {
            console.error('[EmailService] Initialization error:', error);
            throw error;
        }
    }
    
    /**
     * Send login notification email
     * Notifies user of successful login
     * 
     * @param {Object} user - User object with email, displayName, uid
     * @param {string} [ipAddress] - Optional IP address for login info
     * @returns {Promise<boolean>} True if email sent successfully
     */
    async sendLoginNotification(user, ipAddress = null) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized. Call init() first.');
            }
            
            if (!user || !user.email) {
                throw new Error('User object with email is required');
            }
            
            const subject = 'Login Notification - ePay CRM';
            const templateData = {
                displayName: user.displayName || 'User',
                loginTime: new Date().toLocaleString(),
                ipAddress: ipAddress || 'Not available',
                supportEmail: 'support@epaycrm.com'
            };
            
            const htmlContent = this._generateLoginEmailHTML(templateData);
            const textContent = this._generateLoginEmailText(templateData);
            
            // Send email
            const result = await this._sendEmail({
                to: user.email,
                subject,
                htmlContent,
                textContent,
                eventType: 'LOGIN',
                userId: user.uid
            });
            
            // Log to Firestore
            await this._logEmailToFirestore({
                recipientEmail: user.email,
                subject,
                eventType: 'LOGIN',
                userId: user.uid,
                templateUsed: this.templates.LOGIN,
                status: result.success ? 'sent' : 'failed',
                error: result.error || null
            });
            
            return result.success;
        } catch (error) {
            console.error('[EmailService] Error sending login notification:', error);
            return false;
        }
    }
    
    /**
     * Send logout notification email
     * Includes active session duration
     * 
     * @param {Object} user - User object with email, displayName, uid
     * @param {number} activeTimeMs - Active time in milliseconds
     * @returns {Promise<boolean>} True if email sent successfully
     */
    async sendLogoutNotification(user, activeTimeMs = 0) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized. Call init() first.');
            }
            
            if (!user || !user.email) {
                throw new Error('User object with email is required');
            }
            
            const subject = 'Logout Notification - ePay CRM';
            const formattedTime = this._formatDuration(activeTimeMs);
            
            const templateData = {
                displayName: user.displayName || 'User',
                logoutTime: new Date().toLocaleString(),
                activeTime: formattedTime,
                totalMilliseconds: activeTimeMs,
                supportEmail: 'support@epaycrm.com'
            };
            
            const htmlContent = this._generateLogoutEmailHTML(templateData);
            const textContent = this._generateLogoutEmailText(templateData);
            
            // Send email
            const result = await this._sendEmail({
                to: user.email,
                subject,
                htmlContent,
                textContent,
                eventType: 'LOGOUT',
                userId: user.uid
            });
            
            // Log to Firestore
            await this._logEmailToFirestore({
                recipientEmail: user.email,
                subject,
                eventType: 'LOGOUT',
                userId: user.uid,
                templateUsed: this.templates.LOGOUT,
                status: result.success ? 'sent' : 'failed',
                error: result.error || null,
                metadata: {
                    activeTimeMs,
                    formattedTime
                }
            });
            
            return result.success;
        } catch (error) {
            console.error('[EmailService] Error sending logout notification:', error);
            return false;
        }
    }
    
    /**
     * Send role change notification email
     * Informs user of role update
     * 
     * @param {Object} user - User object with email, displayName, uid
     * @param {string} newRole - New role name
     * @param {string} [oldRole] - Previous role name
     * @returns {Promise<boolean>} True if email sent successfully
     */
    async sendRoleChangeNotification(user, newRole, oldRole = null) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized. Call init() first.');
            }
            
            if (!user || !user.email) {
                throw new Error('User object with email is required');
            }
            
            if (!newRole) {
                throw new Error('New role is required');
            }
            
            const subject = 'Role Change Notification - ePay CRM';
            const templateData = {
                displayName: user.displayName || 'User',
                newRole,
                oldRole: oldRole || 'Not specified',
                changeTime: new Date().toLocaleString(),
                supportEmail: 'support@epaycrm.com'
            };
            
            const htmlContent = this._generateRoleChangeEmailHTML(templateData);
            const textContent = this._generateRoleChangeEmailText(templateData);
            
            // Send email
            const result = await this._sendEmail({
                to: user.email,
                subject,
                htmlContent,
                textContent,
                eventType: 'ROLE_CHANGE',
                userId: user.uid
            });
            
            // Log to Firestore
            await this._logEmailToFirestore({
                recipientEmail: user.email,
                subject,
                eventType: 'ROLE_CHANGE',
                userId: user.uid,
                templateUsed: this.templates.ROLE_CHANGE,
                status: result.success ? 'sent' : 'failed',
                error: result.error || null,
                metadata: {
                    newRole,
                    oldRole
                }
            });
            
            return result.success;
        } catch (error) {
            console.error('[EmailService] Error sending role change notification:', error);
            return false;
        }
    }
    
    /**
     * Send password reset email
     * Contains password reset link
     * 
     * @param {Object} user - User object with email, displayName, uid
     * @param {string} resetLink - Password reset link
     * @returns {Promise<boolean>} True if email sent successfully
     */
    async sendPasswordResetEmail(user, resetLink) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized. Call init() first.');
            }
            
            if (!user || !user.email) {
                throw new Error('User object with email is required');
            }
            
            if (!resetLink) {
                throw new Error('Reset link is required');
            }
            
            const subject = 'Password Reset Request - ePay CRM';
            const templateData = {
                displayName: user.displayName || 'User',
                resetLink,
                expiryTime: '24 hours',
                requestTime: new Date().toLocaleString(),
                supportEmail: 'support@epaycrm.com'
            };
            
            const htmlContent = this._generatePasswordResetEmailHTML(templateData);
            const textContent = this._generatePasswordResetEmailText(templateData);
            
            // Send email
            const result = await this._sendEmail({
                to: user.email,
                subject,
                htmlContent,
                textContent,
                eventType: 'PASSWORD_RESET',
                userId: user.uid
            });
            
            // Log to Firestore
            await this._logEmailToFirestore({
                recipientEmail: user.email,
                subject,
                eventType: 'PASSWORD_RESET',
                userId: user.uid,
                templateUsed: this.templates.PASSWORD_RESET,
                status: result.success ? 'sent' : 'failed',
                error: result.error || null
            });
            
            return result.success;
        } catch (error) {
            console.error('[EmailService] Error sending password reset email:', error);
            return false;
        }
    }
    
    /**
     * Get email logs for a user
     * 
     * @param {string} userId - User ID
     * @param {string} [eventType] - Optional event type filter
     * @param {number} [limit] - Limit number of results (default: 50)
     * @returns {Promise<Array>} Array of email log records
     */
    async getEmailLogs(userId, eventType = null, limit = 50) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized');
            }
            
            let query = this.emailLogsRef.where('userId', '==', userId);
            
            if (eventType) {
                query = query.where('eventType', '==', eventType);
            }
            
            query = query.orderBy('sentAt', 'desc').limit(limit);
            
            const snapshot = await query.get();
            
            const logs = [];
            snapshot.forEach(doc => {
                logs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return logs;
        } catch (error) {
            console.error('[EmailService] Error getting email logs:', error);
            return [];
        }
    }
    
    /**
     * Get email logs for a specific date
     * 
     * @param {Date|string} date - Date to get logs for
     * @returns {Promise<Array>} Array of email log records for the date
     */
    async getEmailLogsForDate(date) {
        try {
            if (!this.isInitialized) {
                throw new Error('EmailService not initialized');
            }
            
            const targetDate = typeof date === 'string' ? new Date(date) : date;
            const startOfDay = new Date(targetDate);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(targetDate);
            endOfDay.setHours(23, 59, 59, 999);
            
            const snapshot = await this.emailLogsRef
                .where('sentAt', '>=', startOfDay)
                .where('sentAt', '<=', endOfDay)
                .orderBy('sentAt', 'desc')
                .get();
            
            const logs = [];
            snapshot.forEach(doc => {
                logs.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return logs;
        } catch (error) {
            console.error('[EmailService] Error getting email logs for date:', error);
            return [];
        }
    }
    
    // ===== Private Methods =====
    
    /**
     * Wait for Firebase to be available
     * 
     * @private
     * @returns {Promise<void>}
     */
    async _waitForFirebase() {
        const timeout = 5000; // 5 seconds
        const startTime = Date.now();
        
        return new Promise((resolve, reject) => {
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined') {
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Firebase initialization timeout'));
                } else {
                    setTimeout(checkFirebase, 100);
                }
            };
            
            checkFirebase();
        });
    }
    
    /**
     * Send email via SendGrid API
     * 
     * @private
     * @param {Object} params - Email parameters
     * @returns {Promise<{success: boolean, error: string|null}>}
     */
    async _sendEmail(params) {
        try {
            if (!this.sendGridApiKey) {
                console.warn('[EmailService] SendGrid API key not configured. Simulating email send.');
                return {
                    success: true,
                    error: null,
                    simulated: true
                };
            }
            
            const payload = {
                personalizations: [
                    {
                        to: [{ email: params.to }],
                        subject: params.subject
                    }
                ],
                from: {
                    email: this.fromEmail,
                    name: this.fromName
                },
                content: [
                    {
                        type: 'text/plain',
                        value: params.textContent
                    },
                    {
                        type: 'text/html',
                        value: params.htmlContent
                    }
                ]
            };
            
            const response = await fetch(this.sendGridBaseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.sendGridApiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.info('[EmailService] Email sent successfully to:', params.to);
                return { success: true, error: null };
            } else {
                const error = await response.text();
                console.error('[EmailService] SendGrid API error:', error);
                return {
                    success: false,
                    error: `SendGrid error: ${response.status} ${response.statusText}`
                };
            }
        } catch (error) {
            console.error('[EmailService] Error sending email:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    /**
     * Log email activity to Firestore
     * 
     * @private
     * @param {Object} logData - Log data to save
     * @returns {Promise<void>}
     */
    async _logEmailToFirestore(logData) {
        try {
            if (!this.db) {
                return;
            }
            
            const docData = {
                ...logData,
                sentAt: new Date(),
                createdAt: new Date()
            };
            
            await this.emailLogsRef.add(docData);
            console.debug('[EmailService] Email logged to Firestore');
        } catch (error) {
            console.error('[EmailService] Error logging email:', error);
        }
    }
    
    /**
     * Generate HTML content for login email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} HTML content
     */
    _generateLoginEmailHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f172a; color: white; padding: 20px; border-radius: 4px; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Login Notification</h2>
        </div>
        <div class="content">
            <p>Hi ${data.displayName},</p>
            <p>We noticed a login to your ePay CRM account.</p>
            <p><strong>Login Details:</strong></p>
            <ul>
                <li>Time: ${data.loginTime}</li>
                <li>IP Address: ${data.ipAddress}</li>
            </ul>
            <p>If this wasn't you, please contact us immediately at ${data.supportEmail}</p>
        </div>
        <div class="footer">
            <p>ePay CRM © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    /**
     * Generate text content for login email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} Text content
     */
    _generateLoginEmailText(data) {
        return `
Login Notification

Hi ${data.displayName},

We noticed a login to your ePay CRM account.

Login Details:
- Time: ${data.loginTime}
- IP Address: ${data.ipAddress}

If this wasn't you, please contact us immediately at ${data.supportEmail}

ePay CRM © ${new Date().getFullYear()}
        `;
    }
    
    /**
     * Generate HTML content for logout email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} HTML content
     */
    _generateLogoutEmailHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f172a; color: white; padding: 20px; border-radius: 4px; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
        .stats { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Logout Notification</h2>
        </div>
        <div class="content">
            <p>Hi ${data.displayName},</p>
            <p>You have been logged out of your ePay CRM account.</p>
            <div class="stats">
                <p><strong>Session Summary:</strong></p>
                <ul>
                    <li>Logout Time: ${data.logoutTime}</li>
                    <li>Active Duration: ${data.activeTime}</li>
                </ul>
            </div>
            <p>If you have any questions, contact us at ${data.supportEmail}</p>
        </div>
        <div class="footer">
            <p>ePay CRM © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    /**
     * Generate text content for logout email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} Text content
     */
    _generateLogoutEmailText(data) {
        return `
Logout Notification

Hi ${data.displayName},

You have been logged out of your ePay CRM account.

Session Summary:
- Logout Time: ${data.logoutTime}
- Active Duration: ${data.activeTime}

If you have any questions, contact us at ${data.supportEmail}

ePay CRM © ${new Date().getFullYear()}
        `;
    }
    
    /**
     * Generate HTML content for role change email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} HTML content
     */
    _generateRoleChangeEmailHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f172a; color: white; padding: 20px; border-radius: 4px; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
        .role-box { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Role Change Notification</h2>
        </div>
        <div class="content">
            <p>Hi ${data.displayName},</p>
            <p>Your role has been updated in the ePay CRM system.</p>
            <div class="role-box">
                <p><strong>Role Changes:</strong></p>
                <ul>
                    <li>Previous Role: ${data.oldRole}</li>
                    <li>New Role: ${data.newRole}</li>
                    <li>Changed At: ${data.changeTime}</li>
                </ul>
            </div>
            <p>Please review your new permissions and features. If you have questions, contact ${data.supportEmail}</p>
        </div>
        <div class="footer">
            <p>ePay CRM © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    /**
     * Generate text content for role change email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} Text content
     */
    _generateRoleChangeEmailText(data) {
        return `
Role Change Notification

Hi ${data.displayName},

Your role has been updated in the ePay CRM system.

Role Changes:
- Previous Role: ${data.oldRole}
- New Role: ${data.newRole}
- Changed At: ${data.changeTime}

Please review your new permissions and features. If you have questions, contact ${data.supportEmail}

ePay CRM © ${new Date().getFullYear()}
        `;
    }
    
    /**
     * Generate HTML content for password reset email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} HTML content
     */
    _generatePasswordResetEmailHTML(data) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #0f172a; color: white; padding: 20px; border-radius: 4px; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 10px; font-size: 12px; color: #666; text-align: center; }
        .button { display: inline-block; background: #facc15; color: #0f172a; padding: 12px 30px; 
                  border-radius: 4px; text-decoration: none; font-weight: bold; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Password Reset Request</h2>
        </div>
        <div class="content">
            <p>Hi ${data.displayName},</p>
            <p>We received a request to reset your ePay CRM password.</p>
            <p><strong>Reset Details:</strong></p>
            <ul>
                <li>Requested At: ${data.requestTime}</li>
                <li>Link Expires In: ${data.expiryTime}</li>
            </ul>
            <p>Click the button below to reset your password:</p>
            <a href="${data.resetLink}" class="button">Reset Password</a>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>For security concerns, contact ${data.supportEmail}</p>
        </div>
        <div class="footer">
            <p>ePay CRM © ${new Date().getFullYear()}</p>
        </div>
    </div>
</body>
</html>
        `;
    }
    
    /**
     * Generate text content for password reset email
     * 
     * @private
     * @param {Object} data - Template data
     * @returns {string} Text content
     */
    _generatePasswordResetEmailText(data) {
        return `
Password Reset Request

Hi ${data.displayName},

We received a request to reset your ePay CRM password.

Reset Details:
- Requested At: ${data.requestTime}
- Link Expires In: ${data.expiryTime}

Reset your password here:
${data.resetLink}

If you didn't request this, you can safely ignore this email.

For security concerns, contact ${data.supportEmail}

ePay CRM © ${new Date().getFullYear()}
        `;
    }
    
    /**
     * Format duration in milliseconds to readable string
     * 
     * @private
     * @param {number} ms - Duration in milliseconds
     * @returns {string} Formatted duration (e.g., "2 hours 30 minutes")
     */
    _formatDuration(ms) {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / (1000 * 60)) % 60);
        const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
        
        const parts = [];
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
        if (seconds > 0 && parts.length === 0) parts.push(`${seconds} second${seconds > 1 ? 's' : ''}`);
        
        return parts.length > 0 ? parts.join(' ') : '0 seconds';
    }
}

// Export for use in different contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}

// Expose globally
if (typeof window !== 'undefined') {
    window.EmailService = EmailService;
}
