'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { SCOPE_LEVELS } from '@/lib/rbac';

/**
 * Maps root collections to the strict rules paths under tenants/default/
 */
function resolveCollection(db, collectionName, id = null) {
  switch (collectionName) {
    case 'approvals':
      return id 
        ? doc(db, 'tenants', 'default', 'finance_budgets', id)
        : collection(db, 'tenants', 'default', 'finance_budgets');
    case 'notes':
      return id
        ? doc(db, 'tenants', 'default', 'settings', id)
        : collection(db, 'tenants', 'default', 'settings');
    case 'tasks':
      return id
        ? doc(db, 'tenants', 'default', 'tasks', id)
        : collection(db, 'tenants', 'default', 'tasks');
    case 'developers':
    case 'employees':
      return id
        ? doc(db, 'tenants', 'default', 'employees', id)
        : collection(db, 'tenants', 'default', 'employees');
    case 'projects':
      return id
        ? doc(db, 'tenants', 'default', 'projects', id)
        : collection(db, 'tenants', 'default', 'projects');
    case 'bugs':
      return id
        ? doc(db, 'tenants', 'default', 'projects_bugs', id)
        : collection(db, 'tenants', 'default', 'projects_bugs');
    case 'pullrequests':
      return id
        ? doc(db, 'tenants', 'default', 'pullrequests', id)
        : collection(db, 'tenants', 'default', 'pullrequests');
    case 'deployments':
      return id
        ? doc(db, 'tenants', 'default', 'deployments', id)
        : collection(db, 'tenants', 'default', 'deployments');
    case 'attendance':
      return id
        ? doc(db, 'tenants', 'default', 'hr_attendance', id)
        : collection(db, 'tenants', 'default', 'hr_attendance');
    case 'leaves':
      return id
        ? doc(db, 'tenants', 'default', 'hr_leaves', id)
        : collection(db, 'tenants', 'default', 'hr_leaves');
    case 'activities':
      return id
        ? doc(db, 'tenants', 'default', 'auditLogs', id)
        : collection(db, 'tenants', 'default', 'auditLogs');
    default:

      return id
        ? doc(db, 'tenants', 'default', collectionName, id)
        : collection(db, 'tenants', 'default', collectionName);
  }
}

/**
 * Custom React Hook for live synchronization with Firestore collections,
 * with automatic geographical scope-based query filtering and offline fallback resilience.
 * 
 * @param {string} collectionName - Firestore collection name to subscribe to
 * @param {Array} fallbackData - Array of mock items to use as fallback state
 * @returns {Object} { data, loading, error, add, update, remove }
 */
export function useFirestore(collectionName, fallbackData = []) {
  const { user } = useAuth();
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    let q = resolveCollection(db, collectionName);
    
    // Apply automatic geographical and organizational scope filters based on employee details
    if (user && user.roleId !== 'superadmin' && user.scopeLevel !== 'GLOBAL') {
      const scopeLevel = user.scopeLevel || SCOPE_LEVELS.SELF;
      
      switch (scopeLevel) {
        case SCOPE_LEVELS.STATE:
          q = query(q, where('stateId', '==', user.stateId));
          break;
        case SCOPE_LEVELS.DISTRICT:
          q = query(q, where('districtId', '==', user.districtId));
          break;
        case SCOPE_LEVELS.GALLERY:
          q = query(q, where('galleryId', '==', user.galleryId));
          break;
        case SCOPE_LEVELS.SELF:
          q = query(q, where('createdBy', '==', user.userId));
          break;
      }
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ id: doc.id, ...doc.data() });
        });
        // If snapshot is empty, fallback to the local mock state for preview consistency
        setData(items.length > 0 ? items : fallbackData);
        setLoading(false);
      },
      (err) => {
        console.warn(`Firestore collection subscription failed for [${collectionName}], using fallback local data:`, err.message);
        setError(err);
        setData(fallbackData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, user, fallbackData]);

  const add = async (newData) => {
    try {
      const docRef = await addDoc(resolveCollection(db, collectionName), {
        ...newData,
        createdBy: user?.userId || 'anonymous',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (err) {
      console.error(`Error adding document to [${collectionName}]:`, err);
      // Fallback local write to update state instantly in offline/sandbox demo mode
      const mockId = 'mock_' + Math.random().toString(36).substring(2, 9);
      setData(prev => [{ id: mockId, ...newData }, ...prev]);
      return mockId;
    }
  };

  const update = async (id, updatedFields) => {
    try {
      const docRef = resolveCollection(db, collectionName, id);
      await updateDoc(docRef, {
        ...updatedFields,
        updatedAt: serverTimestamp()
      });
      return true;
    } catch (err) {
      console.error(`Error updating document [${id}] in [${collectionName}]:`, err);
      setData(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
      return false;
    }
  };

  const remove = async (id) => {
    try {
      const docRef = resolveCollection(db, collectionName, id);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error(`Error deleting document [${id}] from [${collectionName}]:`, err);
      setData(prev => prev.filter(item => item.id !== id));
      return false;
    }
  };

  return { data, loading, error, add, update, remove };
}
