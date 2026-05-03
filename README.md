# Pluto

Pluto is a voice-first Solana wallet built for the DEV3PACK Hackathon. It uses ElevenLabs for voice input/output, Solana Devnet for payments, Firebase for user data, and Vercel for deployment.

The MVP focuses on one polished loop:

Voice command -> parsed intent -> contact check -> confirmation screen -> Solana Devnet/demo transaction -> spoken success response -> receipt.

## Features

- Mobile-first Next.js PWA with TypeScript
- Voice/chat screen as the default app surface
- Swipe-down Home reveal behind the voice layer
- White-and-blue premium fintech UI
- Demo Mode for judging without setup friction
- Rule-based intent parser for send, request, receive, balance, contacts, help, and cancel
- Contact resolver with aliases, fuzzy partial matches, and ambiguous contact selection
- Contact detail, manual add/edit/remove, and voice/text contact creation
- Recent activity receipt/detail screens with repeat actions
- Add SOL funding screen with wallet QR, copy address, and Devnet faucet link
- Hold-to-confirm transaction safety screen
- Success receipt with Devnet explorer link
- Receive SOL QR screen
- Solana Pay request QR/payment link screen
- Firebase client setup and Firestore rules
- Firebase Auth + Firestore-backed profile, wallet metadata, contacts, activity, requests, and settings
- ElevenLabs STT/TTS API routes with text fallback
- Solana Devnet send route with explicit hackathon demo shortcut

## Tech Stack

- Frontend: Next.js App Router, React, TypeScript
- Styling: Tailwind CSS
- Animation: CSS transitions and native pointer gestures
- Voice: ElevenLabs Speech-to-Text and Text-to-Speech
- Blockchain: Solana Devnet via `@solana/web3.js`
- Data/Auth: Firebase Auth + Firestore
- QR/payment links: Solana Pay-style URLs with QR codes
- Hosting: Vercel
- Tests: Vitest

## Project Structure

```txt
src/
  app/
    api/
      health/
      intent/parse/
      solana/send/
      voice/speak/
      voice/transcribe/
  components/
    contacts/
    transactions/
    ui/
    voice/
    wallet/
  data/mock/
  hooks/
  lib/
    contacts/
    elevenlabs/
    firebase/
    intent/
    solana/
    utils/
  screens/
  styles/
  test/
  types/
```

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the values you need.

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=
ELEVENLABS_STT_MODEL_ID=scribe_v2
ELEVENLABS_TTS_MODEL_ID=eleven_multilingual_v2

SOLANA_RPC_URL=https://api.devnet.solana.com
DEMO_WALLET_SECRET_KEY=
DEMO_REAL_SEND=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PLUTO_PROGRAM_ID=
```

## ElevenLabs Integration

Pluto uses secure server-side ElevenLabs API routes so the API key never ships to the browser:

- `POST /api/voice/transcribe` sends recorded audio to ElevenLabs Speech to Text using `ELEVENLABS_STT_MODEL_ID` (`scribe_v2` by default).
- `POST /api/voice/speak` sends Pluto responses to ElevenLabs Text to Speech using `ELEVENLABS_TTS_MODEL_ID` and `ELEVENLABS_VOICE_ID`.
- If ElevenLabs is unavailable, the UI keeps working with text responses.

## Demo Commands

1. `Send 0.1 SOL to Muape for lunch.`
2. `Muape K.`
3. Hold to confirm.
4. `Show my balance.`
5. `Request 0.5 SOL from Alex for dinner.`
6. `Add contact Nia with wallet 7xC1demoAddress`

## Hackathon Shortcuts

- Demo Mode works even without Firebase, ElevenLabs, or a funded Solana wallet.
- `/api/solana/send` returns a simulated demo signature unless `DEMO_REAL_SEND=true` and `DEMO_WALLET_SECRET_KEY` are configured.
- Wallet custody screens are UI placeholders. Do not use the current custody approach for mainnet.
- Contact addresses in demo data are presentation-safe placeholders.

## Firebase Data Model

```txt
users/{userId}
users/{userId}/wallets/{walletId}
users/{userId}/contacts/{contactId}
users/{userId}/transactions/{transactionId}
users/{userId}/requests/{requestId}
```

Firestore rules are included in `firestore.rules` and restrict each user to their own documents. Demo mode signs in anonymously when Firebase is configured, seeds demo contacts/activity once, and then keeps contact edits, send receipts, payment requests, wallet metadata, and settings synced to Firestore. If Firebase is unavailable, the app falls back to local demo state so the hackathon flow remains usable.

## Solana Program

Pluto includes a custom Anchor program for the Solana hackathon track.

**Generated Program ID:** `8MEhzdrriUEbKK1s4MmNzK876YmyUAwtF1sWJ9qhdYH`

**Deployment status:** source and app wiring are included, but Devnet deploy from this Windows machine is blocked until the elevated Windows SDK libraries are installed or the program is built from Linux/WSL. Anchor needs `kernel32.lib` to compile Rust build scripts on Windows.

**What it does:** every real send transaction in Pluto can call the `send_with_memo` instruction, which:

1. Transfers SOL via CPI to the System Program.
2. Stores an on-chain record with sender, recipient, recipient alias, amount, memo, and timestamp.

**Solscan link after deployment:**
`https://solscan.io/account/8MEhzdrriUEbKK1s4MmNzK876YmyUAwtF1sWJ9qhdYH?cluster=devnet`

**Source code:** `pluto-program/programs/pluto-program/src/lib.rs`

The app calls this program from `src/lib/solana/plutoProgram.ts` when `NEXT_PUBLIC_PLUTO_PROGRAM_ID` is set and `DEMO_REAL_SEND=true` is enabled with a funded `DEMO_WALLET_SECRET_KEY`. Otherwise, the hackathon demo falls back to simulated sends so judging remains reliable.

### Deploy The Program

On Linux/WSL, or after installing the Windows SDK desktop libraries with elevated Build Tools:

```bash
cd pluto-program
anchor build
anchor deploy --provider.cluster devnet
```

After deployment, set `NEXT_PUBLIC_PLUTO_PROGRAM_ID=8MEhzdrriUEbKK1s4MmNzK876YmyUAwtF1sWJ9qhdYH` locally and in Vercel.

## Deployment

1. Push the repo to GitHub.
2. Import it into Vercel.
3. Add the environment variables from `.env.example`.
4. Deploy.
5. Test `/api/health`, voice fallback, the demo send flow, and mobile browser layout.

## Known Limitations

- Demo send is simulated by default for reliability.
- Real wallet key management needs secure mobile-grade custody before mainnet.
- Voice recording depends on browser microphone support and HTTPS in production.
- Mainnet is intentionally disabled for the hackathon build.

## Roadmap

- Production wallet custody and recovery flow
- Real Firebase auth/session wiring in UI
- Real Devnet contact addresses and faucet funding helper
- AI-assisted parser behind the rule-based parser
- Push notifications for received payments
- Realtime Solana request status tracking
