import { NextResponse } from "next/server";

const firebaseConfigured = [
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  process.env.NEXT_PUBLIC_FIREBASE_APP_ID
].every(Boolean);

export async function GET() {
  return NextResponse.json({
    status: "ok",
    firebase: firebaseConfigured,
    elevenlabs: Boolean(process.env.ELEVENLABS_API_KEY),
    solana: Boolean(process.env.SOLANA_RPC_URL || process.env.DEMO_WALLET_SECRET_KEY)
  });
}
