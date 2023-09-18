import "dotenv/config";

import { initializeApp } from "firebase/app";
import { initializeApp as initializeAppAdmin, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";
import { getAuth } from 'firebase/auth'
import admin from 'firebase-admin'

const serviceAccount = require("../infra/creds2.json");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);

const BUCKET = process.env.FIREBASE_STORAGE_BUCKET
const DATABASE_URL = process.env.FIREBASE_DATABASE_URL

initializeAppAdmin({
  credential: cert(serviceAccount),
  databaseURL: DATABASE_URL,
  storageBucket: BUCKET
});

const firestore_db = getFirestore();
const realtime_db = getDatabase();
const storage = admin.storage();
const auth = getAuth()

export { firestore_db, realtime_db, storage, auth };
