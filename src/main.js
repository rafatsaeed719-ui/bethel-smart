// Native + Firebase bridge. Bundled with esbuild into www/bundle.js and exposed as window.FB
// so the UI script (www/ui.js) can stay a plain script with inline handlers.
import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, inMemoryPersistence, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager, doc, collection, query, where, onSnapshot,
  setDoc, deleteDoc, updateDoc, getDoc, getDocs, orderBy, limitToLast, writeBatch } from 'firebase/firestore';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
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
  const ext = (filename.split('.').pop() || '').toLowerCase();
  const mime = { pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }[ext] || 'application/octet-stream';
  const blob = new Blob([data], { type: mime });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  return 'saved';
}

// Renders an element to an A4 PDF. Arabic text is drawn by the browser, so letters connect correctly.
async function makePdf(el) {
  const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false });
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
  const sliceH = Math.floor(canvas.width * ph / pw);
  for (let y = 0, page = 0; y < canvas.height; y += sliceH, page++) {
    const h = Math.min(sliceH, canvas.height - y);
    const part = document.createElement('canvas'); part.width = canvas.width; part.height = h;
    const ctx = part.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, part.width, h);
    ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
    if (page) pdf.addPage();
    pdf.addImage(part.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, pw, h * pw / canvas.width);
  }
  return pdf.output('arraybuffer');
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
  async changePassword(current, next) {
    const u = auth.currentUser; if (!u) throw { code: 'auth/no-user' };
    await reauthenticateWithCredential(u, EmailAuthProvider.credential(u.email, current));
    await updatePassword(u, next);
  },
  async adminSetPassword(email, current, next) {
    const c = await signInWithEmailAndPassword(helperAuth, email, current);
    try { await updatePassword(c.user, next); } finally { await signOut(helperAuth); }
  },
  batch: () => writeBatch(db),
  doc: (...p) => doc(db, ...p), col: (...p) => collection(db, ...p), query, where, orderBy, limitToLast, onSnapshot, setDoc, deleteDoc, updateDoc, getDoc, getDocs,
  getPosition, saveFile, makePdf
};
window.dispatchEvent(new Event('fb-ready'));
