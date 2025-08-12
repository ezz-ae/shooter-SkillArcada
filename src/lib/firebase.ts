
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  projectId: "shopnluck",
  appId: "1:841616141451:web:dc8b5c582b07f907e3b88e",
  storageBucket: "shopnluck.firebasestorage.app",
  apiKey: "AIzaSyBavgW2z5rCdZAEeBdoA5wQ53E7qvHFc7o",
  authDomain: "shopnluck.firebaseapp.com",
  messagingSenderId: "841616141451"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Analytics if supported
const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);

export { app, analytics };
