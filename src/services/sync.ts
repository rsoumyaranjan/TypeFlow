import { doc, getDoc, setDoc } from 'firebase/firestore';
import { dbCloud } from './firebase';
import { db } from './db';

// Gets the active user key for syncing
export function getActiveUserKey(): string | null {
  const activeUser = localStorage.getItem('typeflow_active_user');
  if (!activeUser) return null;
  // Clean key for Firestore path
  return activeUser.replace(/[^a-zA-Z0-9@._-]/g, '_');
}

// Debounce helper to prevent multiple rapid database writes from triggering multiple network calls
let syncTimeout: any = null;
export function triggerBackgroundSync() {
  if (syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(syncLocalToCloud, 1500);
}

// Syncs all local Dexie tables to Firestore
export async function syncLocalToCloud() {
  const userKey = getActiveUserKey();
  if (!userKey) return;

  try {
    const tests = await db.tests.toArray();
    const personalBests = await db.personalBests.toArray();
    const lessons = await db.lessons.toArray();
    const userStats = await db.userStats.toArray();
    const badges = await db.badges.toArray();
    const dailyChallenges = await db.dailyChallenges.toArray();
    
    const userDocRef = doc(dbCloud, 'users', userKey);
    
    // Save tables into user's document
    await setDoc(userDocRef, {
      lastSynced: Date.now(),
      tests,
      personalBests,
      lessons: lessons.map(l => ({ ...l, completedAt: l.completedAt instanceof Date ? l.completedAt.toISOString() : l.completedAt })),
      userStats,
      badges,
      dailyChallenges
    }, { merge: true });
    
    console.log('Successfully synced local data to Cloud Firestore.');
  } catch (error) {
    console.error('Failed to sync data to Firestore:', error);
  }
}

// Pulls data from Firestore and merges it locally
export async function pullCloudToLocal() {
  const userKey = getActiveUserKey();
  if (!userKey) return;

  try {
    const userDocRef = doc(dbCloud, 'users', userKey);
    const docSnap = await getDoc(userDocRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      
      // Update Dexie tables
      if (data.tests && data.tests.length > 0) {
        await db.tests.bulkPut(data.tests);
      }
      if (data.personalBests && data.personalBests.length > 0) {
        await db.personalBests.bulkPut(data.personalBests);
      }
      if (data.lessons && data.lessons.length > 0) {
        const parsedLessons = data.lessons.map((l: any) => ({
          ...l,
          completedAt: new Date(l.completedAt)
        }));
        await db.lessons.bulkPut(parsedLessons);
      }
      if (data.userStats && data.userStats.length > 0) {
        await db.userStats.bulkPut(data.userStats);
      }
      if (data.badges && data.badges.length > 0) {
        await db.badges.bulkPut(data.badges);
      }
      if (data.dailyChallenges && data.dailyChallenges.length > 0) {
        await db.dailyChallenges.bulkPut(data.dailyChallenges);
      }
      
      console.log('Successfully pulled data from Cloud Firestore.');
    }
  } catch (error) {
    console.error('Failed to pull data from Firestore:', error);
  }
}

// Register Dexie Hooks for automatic sync
db.tests.hook('creating', triggerBackgroundSync);
db.tests.hook('updating', triggerBackgroundSync);
db.lessons.hook('creating', triggerBackgroundSync);
db.userStats.hook('updating', triggerBackgroundSync);
db.badges.hook('creating', triggerBackgroundSync);
db.dailyChallenges.hook('creating', triggerBackgroundSync);

