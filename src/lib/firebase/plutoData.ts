"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  writeBatch
} from "firebase/firestore";
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, updateProfile, type User } from "firebase/auth";
import { demoActivities } from "@/data/mock/activities";
import { demoContacts } from "@/data/mock/contacts";
import { demoSettings } from "@/data/mock/settings";
import { demoWallet } from "@/data/mock/wallet";
import { auth, db } from "@/lib/firebase/client";
import type { Activity, Contact, PaymentRequest, PlutoSettings, UserProfile, WalletSummary } from "@/types";

export interface PlutoFirebaseState {
  profile: UserProfile;
  wallet: WalletSummary;
  contacts: Contact[];
  activities: Activity[];
  settings: PlutoSettings;
}

const MAIN_WALLET_ID = "main";

export const firebaseDataAvailable = Boolean(auth && db);

function assertFirebase() {
  if (!auth || !db) {
    throw new Error("Firebase is not configured. Add Firebase environment variables first.");
  }
  return { auth, db };
}

function cleanForFirestore<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cleanForFirestore(item)).filter((item) => item !== undefined) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, entryValue]) => entryValue !== undefined)
        .map(([key, entryValue]) => [key, cleanForFirestore(entryValue)])
    ) as T;
  }

  return value;
}

function profileFromUser(user: User, demoMode: boolean, settings = demoSettings): UserProfile {
  const displayName = user.displayName || user.email?.split("@")[0] || "Samuel";

  return {
    uid: user.uid,
    displayName,
    email: user.email,
    defaultWalletId: MAIN_WALLET_ID,
    demoMode,
    settings
  };
}

function walletForUser(user: User, demoMode: boolean, settings = demoSettings): WalletSummary {
  return {
    ...demoWallet,
    ownerName: user.displayName || user.email?.split("@")[0] || demoWallet.ownerName,
    demoMode,
    network: settings.network
  };
}

async function collectionHasDocuments(path: string, uid: string) {
  const { db } = assertFirebase();
  const snapshot = await getDocs(query(collection(db, "users", uid, path), limit(1)));
  return !snapshot.empty;
}

export async function createOrSignInWithEmail(email: string, password: string) {
  const { auth } = assertFirebase();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    const displayName = normalizedEmail.split("@")[0];
    await updateProfile(credential.user, { displayName }).catch(() => undefined);
    return credential.user;
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
    if (code === "auth/email-already-in-use") {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return credential.user;
    }
    throw error;
  }
}

export async function signInDemoUser() {
  const { auth } = assertFirebase();
  const credential = await signInAnonymously(auth);
  await updateProfile(credential.user, { displayName: "Samuel" }).catch(() => undefined);
  return credential.user;
}

export async function initializePlutoUser(user: User, options: { demoMode: boolean }) {
  const { db } = assertFirebase();
  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);
  const existingSettings = userSnapshot.exists()
    ? ((userSnapshot.data().settings as PlutoSettings | undefined) ?? demoSettings)
    : demoSettings;
  const settings: PlutoSettings = {
    ...demoSettings,
    ...existingSettings,
    network: existingSettings.network || "devnet"
  };
  const profile = profileFromUser(user, options.demoMode, settings);
  const wallet = walletForUser(user, options.demoMode, settings);

  await setDoc(
    userRef,
    cleanForFirestore({
      ...profile,
      updatedAt: serverTimestamp(),
      createdAt: userSnapshot.exists() ? userSnapshot.data().createdAt : serverTimestamp()
    }),
    { merge: true }
  );

  await setDoc(
    doc(db, "users", user.uid, "wallets", MAIN_WALLET_ID),
    cleanForFirestore({
      ...wallet,
      name: wallet.walletName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }),
    { merge: true }
  );

  if (!(await collectionHasDocuments("contacts", user.uid))) {
    const batch = writeBatch(db);
    demoContacts.forEach((contact, index) => {
      batch.set(
        doc(db, "users", user.uid, "contacts", contact.id),
        cleanForFirestore({
          ...contact,
          sortIndex: index,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
    });
    await batch.commit();
  }

  if (!(await collectionHasDocuments("transactions", user.uid))) {
    const batch = writeBatch(db);
    demoActivities.forEach((activity, index) => {
      batch.set(
        doc(db, "users", user.uid, "transactions", activity.id),
        cleanForFirestore({
          ...activity,
          sortIndex: index,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      );
    });
    await batch.commit();
  }

  return loadPlutoData(user.uid);
}

export async function loadPlutoData(uid: string): Promise<PlutoFirebaseState> {
  const { db } = assertFirebase();
  const userSnapshot = await getDoc(doc(db, "users", uid));
  const profileData = userSnapshot.exists() ? userSnapshot.data() : {};
  const settings: PlutoSettings = {
    ...demoSettings,
    ...((profileData.settings as Partial<PlutoSettings> | undefined) ?? {})
  };

  const walletSnapshot = await getDoc(doc(db, "users", uid, "wallets", MAIN_WALLET_ID));
  const wallet: WalletSummary = {
    ...demoWallet,
    ...(walletSnapshot.exists() ? walletSnapshot.data() : {}),
    ownerName: (profileData.displayName as string | undefined) || demoWallet.ownerName,
    walletName: (walletSnapshot.data()?.walletName as string | undefined) || (walletSnapshot.data()?.name as string | undefined) || demoWallet.walletName,
    network: settings.network
  };

  const contactsSnapshot = await getDocs(collection(db, "users", uid, "contacts"));
  const contacts = contactsSnapshot.docs
    .map((contactDoc) => ({
      ...contactDoc.data(),
      id: contactDoc.id
    }))
    .sort((a, b) => Number((a as { sortIndex?: number }).sortIndex ?? 9999) - Number((b as { sortIndex?: number }).sortIndex ?? 9999)) as Contact[];

  const activitiesSnapshot = await getDocs(collection(db, "users", uid, "transactions"));
  const activities = activitiesSnapshot.docs
    .map((activityDoc) => ({
      ...activityDoc.data(),
      id: activityDoc.id
    }))
    .sort((a, b) => Number((a as { sortIndex?: number }).sortIndex ?? 9999) - Number((b as { sortIndex?: number }).sortIndex ?? 9999)) as Activity[];

  const profile: UserProfile = {
    uid,
    displayName: (profileData.displayName as string | undefined) || wallet.ownerName,
    email: (profileData.email as string | null | undefined) ?? null,
    defaultWalletId: (profileData.defaultWalletId as string | undefined) || MAIN_WALLET_ID,
    demoMode: Boolean(profileData.demoMode ?? wallet.demoMode),
    settings
  };

  return {
    profile,
    wallet,
    contacts: contacts.length ? contacts : demoContacts,
    activities: activities.length ? activities : demoActivities,
    settings
  };
}

export async function saveContact(uid: string, contact: Contact) {
  const { db } = assertFirebase();
  await setDoc(
    doc(db, "users", uid, "contacts", contact.id),
    cleanForFirestore({
      ...contact,
      sortIndex: Date.now(),
      updatedAt: serverTimestamp()
    }),
    { merge: true }
  );
}

export async function removeContact(uid: string, contactId: string) {
  const { db } = assertFirebase();
  await deleteDoc(doc(db, "users", uid, "contacts", contactId));
}

export async function saveActivity(uid: string, activity: Activity, sortIndex = -Date.now()) {
  const { db } = assertFirebase();
  await setDoc(
    doc(db, "users", uid, "transactions", activity.id),
    cleanForFirestore({
      ...activity,
      sortIndex,
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }),
    { merge: true }
  );
}

export async function savePaymentRequest(uid: string, request: PaymentRequest) {
  const { db } = assertFirebase();
  await setDoc(
    doc(db, "users", uid, "requests", request.id),
    cleanForFirestore({
      ...request,
      status: "created",
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }),
    { merge: true }
  );
}

export async function saveSettings(uid: string, settings: PlutoSettings) {
  const { db } = assertFirebase();
  await setDoc(
    doc(db, "users", uid),
    cleanForFirestore({
      settings,
      voiceEnabled: settings.voiceEnabled,
      network: settings.network,
      updatedAt: serverTimestamp()
    }),
    { merge: true }
  );
}

export async function saveWallet(uid: string, wallet: WalletSummary) {
  const { db } = assertFirebase();
  await setDoc(
    doc(db, "users", uid, "wallets", MAIN_WALLET_ID),
    cleanForFirestore({
      ...wallet,
      name: wallet.walletName,
      updatedAt: serverTimestamp()
    }),
    { merge: true }
  );
}
