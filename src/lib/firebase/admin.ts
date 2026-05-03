// Server-side Firebase Admin belongs here once service account credentials are
// configured in Vercel. The MVP avoids bundling a service account locally and
// uses client SDK + Firestore security rules for the hackathon path.
export const firebaseAdminConfigured = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
);
