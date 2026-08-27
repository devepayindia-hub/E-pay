/**
 * Smart Storage Manager
 * Auto-detects and uses Firestore or LocalStorage
 * Production-ready for both development and deployment
 */

class SmartStorageManager {
    constructor() {
        this.isFirestoreReady = false;
        this.db = null;
        this.collections = ['session_timers', 'email_logs', 'call_logs'];
        this.initStorage();
    }

    async initStorage() {
        try {
            // Check if Firebase is available
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                this.db = firebase.firestore();
                
                // Test Firestore connection
                const testRef = this.db.collection('session_timers').limit(1);
                await testRef.get();
                
                this.isFirestoreReady = true;
                console.info('[SmartStorage] ✅ Using Firestore (Production Ready)');
            } else {
                console.info('[SmartStorage] ℹ️ Firebase not available, using LocalStorage');
                this.initLocalStorage();
            }
        } catch (error) {
            console.warn('[SmartStorage] Firestore unavailable, falling back to LocalStorage:', error.message);
            this.initLocalStorage();
        }
    }

    initLocalStorage() {
        for (const col of this.collections) {
            const key = 'epay_' + col;
            if (!localStorage.getItem(key)) {
                localStorage.setItem(key, JSON.stringify([]));
            }
        }
        console.info('[SmartStorage] ✅ Using LocalStorage (Development)');
    }

    async add(collection, data) {
        const doc = {
            id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            ...data,
            createdAt: new Date().toISOString()
        };

        if (this.isFirestoreReady) {
            // Firestore: auto-create collection if needed
            try {
                await this.db.collection(collection).doc(doc.id).set(doc);
                console.info(`[SmartStorage] ✅ Firestore: Added to ${collection}`);
            } catch (error) {
                console.warn(`[SmartStorage] Firestore error, falling back:`, error.message);
                this.addLocal(collection, doc);
            }
        } else {
            this.addLocal(collection, doc);
        }
        
        return doc;
    }

    addLocal(collection, doc) {
        const key = 'epay_' + collection;
        const items = JSON.parse(localStorage.getItem(key) || '[]');
        items.push(doc);
        localStorage.setItem(key, JSON.stringify(items));
        console.info(`[SmartStorage] ✅ LocalStorage: Added to ${collection}`);
    }

    async getAll(collection) {
        if (this.isFirestoreReady) {
            try {
                const snapshot = await this.db.collection(collection).get();
                const docs = [];
                snapshot.forEach(doc => {
                    docs.push({ ...doc.data(), id: doc.id });
                });
                return docs;
            } catch (error) {
                console.warn('[SmartStorage] Firestore query error:', error.message);
                return this.getAllLocal(collection);
            }
        } else {
            return this.getAllLocal(collection);
        }
    }

    getAllLocal(collection) {
        const key = 'epay_' + collection;
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    async query(collection, filterFn) {
        const all = await this.getAll(collection);
        return all.filter(filterFn);
    }

    export() {
        const data = {};
        for (const col of this.collections) {
            data[col] = this.getAllLocal(col);
        }
        return data;
    }
}

if (typeof window !== 'undefined') {
    window.smartStorageManager = new SmartStorageManager();
}
