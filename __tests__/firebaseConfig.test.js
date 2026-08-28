import { firebaseConfig } from '@/lib/firebase';

describe('Firebase Config Unit Tests', () => {
  test('firebaseConfig should have valid required project properties', () => {
    expect(firebaseConfig).toBeDefined();
    expect(firebaseConfig.apiKey).toBeTruthy();
    expect(firebaseConfig.projectId).toBe('epaycrm-63608');
    expect(firebaseConfig.authDomain).toContain('firebaseapp.com');
  });
});
