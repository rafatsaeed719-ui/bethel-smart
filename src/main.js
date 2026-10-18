// Native + Firebase bridge. Bundled with esbuild into www/bundle.js and exposed as window.FB
// so the UI script (www/ui.js) can stay a plain script with inline handlers.
import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, inMemoryPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, doc, collection, query, where, onSnapshot,
  setDoc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import * as XLSX from 'xlsx';
import { firebaseConfig, OWNER_EMAIL } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, { persistence: indexedDBLocalPersistence });
let db;
try {
  db = initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentSingleTabManager() }) });
} catch (e) {
  db = initializeFirestore(app, {});
}

// A second app instance creates accounts for reps/managers without signing the current user out.
const helperApp = initializeApp(firebaseConfig, 'helper');
const helperAuth = initializeAuth(helperApp, { persistence: inMemoryPersistence });

const native = Capacitor.isNativePlatform();

async function getPosition() {
  if (native) {
    let perm = await Geolocation.checkPermissions();
    if (perm.location !== 'granted') perm = await Geolocation.requestPermissions({ permissions: ['location'] });
    if (perm.location !== 'granted') throw new Error('لازم تسمح للبرنامج يوصل لموقعك من الإعدادات');
    const p = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 });
    return { lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy };
  }
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error('الموبايل مش بيدعم تحديد الموقع'));
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }),
      e => rej(new Error(e.code === 1 ? 'لازم تسمح للبرنامج يوصل لموقعك' : 'مقدرناش نحدد موقعك، اتأكد إن الـ GPS شغال')),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 5000 });
  });
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function saveFile(filename, data) {
  if (native) {
    const safe = filename.replace(/[\\/:*?"<>|]/g, '-');
    const r = await Filesystem.writeFile({ path: safe, data: toBase64(data), directory: Directory.Cache });
    await Share.share({ title: safe, files: [r.uri], dialogTitle: 'حفظ أو إرسال الملف' });
    return 'shared';
  }
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'saved';
}

window.XLSX = XLSX;
window.FB = {
  OWNER_EMAIL, native, auth, db,
  onAuth: cb => onAuthStateChanged(auth, cb),
  signIn: (e, p) => signInWithEmailAndPassword(auth, e, p),
  signUp: (e, p) => createUserWithEmailAndPassword(auth, e, p),
  signOut: () => signOut(auth),
  resetPassword: e => sendPasswordResetEmail(auth, e),
  async createUser(email, pass) {
    const c = await createUserWithEmailAndPassword(helperAuth, email, pass);
    const uid = c.user.uid; await signOut(helperAuth); return uid;
  },
  doc: (...p) => doc(db, ...p), col: (...p) => collection(db, ...p), query, where, onSnapshot, setDoc, deleteDoc, updateDoc, getDoc,
  getPosition, saveFile
};
window.dispatchEvent(new Event('fb-ready'));
