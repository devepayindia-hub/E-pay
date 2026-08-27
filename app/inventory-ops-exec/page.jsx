'use client';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';




import React, { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'inventoryOpsExecData_v1';

const defaultData = () => ({
    user: { name: 'Vishal Mane', role: 'Inventory Operations Executive' },
    metrics: {
        totalStockUnits: 1420,
        totalInventoryValuation: '₹1.85 Cr',
        inwardTransfersToday: 120,
        outwardDispatchesToday: 95,
        lowStockAlerts: 2,
        galleryLocationsTracked: 18
    },
    stocks: [
        { id: 'INV-101', item: 'ePay Smart POS Terminals', category: 'Hardware', gallery: 'Pune Central', stockQty: 85, minLevel: 20, valuation: '₹42.5 L', status: 'Healthy' },
        { id: 'INV-102', item: 'Micro-ATM Biometric Scanners', category: 'Hardware', gallery: 'Mumbai Andheri', stockQty: 12, minLevel: 15, valuation: '₹18.0 L', status: 'Low Stock Alert' }
    ]
});

export default function InventoryOpsExecPage() {
    useEffect(() => {
        if (!db) return;
        const docRef = doc(db, 'tenants', 'default', 'roleData', STORAGE_KEY);
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                const remoteData = docSnap.data();
                setData(remoteData);
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData));
                } catch (e) {}
            } else {
                const def = defaultData();
                setDoc(docRef, def).catch(e => console.warn(e));
            }
        });
        return () => unsubscribe();
    }, []);

    

    const [data, setData] = useState(() => loadData());
    const [activeTab, setActiveTab] = useState('dashboard');
    const [modal, setModal] = useState(null);
    const [toast, setToast] = useState(null);

    function loadData() {
        try {
            if (typeof window !== 'undefined') {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (stored) return JSON.parse(stored);
            }
        } catch (e) {}
        const def = defaultData();
        if (typeof window !== 'undefined') { saveData(def); }
        return def;
    }

    function saveData(d) {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
            }
        } catch (e) {}
        if (db && typeof window !== 'undefined') {
            const docRef = doc(db, 'tenants', 'default', 'roleData', STORAGE_KEY);
            setDoc(docRef, d).catch(e => console.warn('Firestore sync failed:', e));
        }
    }

    const updateData = useCallback((updater) => {
        setData(prev => {
            const newData = typeof updater === 'function' ? updater(prev) : updater;
            saveData(newData);
            return newData;
        });
    }, []);

    const showToast = useCallback((msg, type = 'success') => {
        setToast({ msg, type });
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3000);
    }, []);
    const toastTimer = useRef(null);

    const openModal = useCallback((title, content) => setModal({ title, content }), []);
    const closeModal = useCallback(() => setModal(null), []);

    const handleStockTransfer = () => {
        openModal(
            '📦 Record Stock Inward / Outward Transfer',
            <div>
                <label className="block text-xs font-semibold text-slate-700 mt-2">Item Name *</label>
                <input id="invItem" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. POS Thermal Paper Rolls" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Gallery / Destination</label>
                <input id="invGallery" className="w-full border p-2 rounded text-sm mt-1" placeholder="e.g. Pune Central Gallery" />
                <label className="block text-xs font-semibold text-slate-700 mt-2">Quantity Transferred</label>
                <input id="invQty" type="number" className="w-full border p-2 rounded text-sm mt-1" placeholder="50" />
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={closeModal} className="px-4 py-2 border rounded text-xs">Cancel</button>
                    <button onClick={() => {
                        const item = document.getElementById('invItem')?.value || 'Stock Item';
                        const gallery = document.getElementById('invGallery')?.value || 'Pune Central';
                        const qty = parseInt(document.getElementById('invQty')?.value) || 50;
                        const newS = { id: `INV-10${data.stocks.length + 1}`, item, category: 'Supplies', gallery, stockQty: qty, minLevel: 10, valuation: '₹1.2 L', status: 'Healthy' };
                        updateData(prev => ({
                            ...prev,
                            stocks: [...prev.stocks, newS],
                            metrics: { ...prev.metrics, totalStockUnits: prev.metrics.totalStockUnits + qty }
                        }));
                        showToast(`📦 Stock transfer of ${qty} units to ${gallery} logged!`);
                        closeModal();
                    }} className="px-4 py-2 bg-amber-600 text-white font-semibold rounded text-xs hover:bg-amber-700">Record Transfer</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
                <div className="p-5 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-lg">📦</div>
                    <div>
                        <div className="font-bold text-white text-base">Inventory <span className="text-amber-400">Exec</span></div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wider">Stock Movement & Valuation</div>
                    </div>
                </div>
                <nav className="flex-1 p-3 space-y-1 overflow-y-auto text-xs">
                    {[
                        ['dashboard', 'Dashboard', 'fa-house'],
                        ['stock', 'Inventory Roster', 'fa-boxes-stacked'],
                        ['transfers', 'Stock Transfers', 'fa-dolly'],
                        ['alerts', 'Low Stock Alerts', 'fa-bell-exclamation'],
                    ].map(([id, label, icon]) => (
                        <div key={id} onClick={() => setActiveTab(id)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition ${activeTab === id ? 'bg-amber-600 text-white font-semibold' : 'hover:bg-slate-800 text-slate-400'}`}>
                            <i className={`fa-solid ${icon} w-4`}></i>{label}
                        </div>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
                    <div className="font-bold text-sm text-slate-800">Inventory Operations & Stock Movement Command Portal</div>
                    <button onClick={handleStockTransfer} className="px-3.5 py-1.5 bg-amber-600 text-white rounded text-xs font-semibold hover:bg-amber-700">📦 Record Transfer</button>
                </header>

                <main className="flex-1 p-5 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Total Stock Units</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.totalStockUnits}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Inventory Valuation</div>
                            <div className="text-xl font-black text-emerald-600 mt-1">{data.metrics.totalInventoryValuation}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Inward Today</div>
                            <div className="text-xl font-black text-teal-600 mt-1">{data.metrics.inwardTransfersToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Outward Today</div>
                            <div className="text-xl font-black text-slate-900 mt-1">{data.metrics.outwardDispatchesToday}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Low Stock Alerts</div>
                            <div className="text-xl font-black text-rose-600 mt-1">{data.metrics.lowStockAlerts}</div>
                        </div>
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                            <div className="text-[10px] font-bold text-slate-500 uppercase">Locations Tracked</div>
                            <div className="text-xl font-black text-purple-600 mt-1">{data.metrics.galleryLocationsTracked}</div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-bold text-sm text-slate-800">📦 Gallery-wise Inventory Roster & Stock Levels</h3>
                            <button onClick={handleStockTransfer} className="px-3 py-1 bg-amber-600 text-white rounded text-xs font-semibold">+ Stock Transfer</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-semibold border-b">
                                    <tr>
                                        <th className="p-2.5">ID</th>
                                        <th className="p-2.5">Item Name</th>
                                        <th className="p-2.5">Category</th>
                                        <th className="p-2.5">Gallery Location</th>
                                        <th className="p-2.5">Available Stock</th>
                                        <th className="p-2.5">Valuation</th>
                                        <th className="p-2.5">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y text-slate-700">
                                    {data.stocks.map(s => (
                                        <tr key={s.id} className="hover:bg-slate-50">
                                            <td className="p-2.5 font-bold text-amber-600">{s.id}</td>
                                            <td className="p-2.5 font-bold text-slate-900">{s.item}</td>
                                            <td className="p-2.5 text-slate-500">{s.category}</td>
                                            <td className="p-2.5">{s.gallery}</td>
                                            <td className="p-2.5 font-bold">{s.stockQty} units</td>
                                            <td className="p-2.5 font-bold text-emerald-600">{s.valuation}</td>
                                            <td className="p-2.5"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'Healthy' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>{s.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {toast && (
                <div className={`fixed bottom-5 right-5 px-4 py-3 rounded-lg shadow-lg text-xs font-semibold text-white z-50 ${toast.type === 'error' ? 'bg-rose-600' : 'bg-amber-600'}`}>
                    {toast.msg}
                </div>
            )}

            {modal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
                    <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                            <h3 className="font-bold text-base text-slate-800">{modal.title}</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-lg">&times;</button>
                        </div>
                        {modal.content}
                    </div>
                </div>
            )}
        </div>
    );
}
