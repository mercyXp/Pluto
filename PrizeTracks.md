# Pluto Prize Track Readiness

## 1. Solana - $10,000 Best App Overall

**Does Pluto qualify now?** Almost, but not fully yet.

Pluto is a Solana-first wallet UX, has a custom Anchor/Rust program in `pluto-program`, uses Solana Devnet APIs in the app, and includes a generated program ID. The missing eligibility item is a successful Devnet deployment plus a Solscan-visible test transaction through that deployed program. The demo video is also still intentionally left for later.

**Missing**

- Deploy `pluto_program` to Solana Devnet.
- Add the confirmed deployed Program ID and Solscan link to the README.
- Run one real `send_with_memo` transaction through the program.
- Record a demo video under 3 minutes.
- Keep the GitHub repo public/open source.

**Minimum work to unlock**

Install the Windows SDK desktop libraries with elevation or build from Linux/WSL, then run `anchor build` and `anchor deploy --provider.cluster devnet`. After that, set `NEXT_PUBLIC_PLUTO_PROGRAM_ID`, run a real Devnet send with `DEMO_REAL_SEND=true`, and update the README with the deployed Program ID and transaction link. Complexity: medium, mostly environment/tooling.

## 2. LI.FI - $1,000 Best Cross-Chain Solana UX

**Does Pluto qualify now?** No.

Pluto currently focuses on Solana-only send, receive, request, and voice confirmation. It does not yet integrate LI.FI.

**Missing**

- A real LI.FI Widget, SDK, REST API, or MCP integration.
- A real quote, route, swap, bridge, or agent-assisted transaction.
- A Solana-centered cross-chain UX problem, such as onboarding funds into SOL from another chain.

**Minimum work to unlock**

Add an "Add funds from another chain" flow using the LI.FI Widget or SDK. The simplest route is an Add Funds screen action that opens a LI.FI quote/bridge widget preconfigured to receive SOL or USDC on Solana. Complexity: low to medium for widget, medium to high for a custom voice-driven route flow.

## 3. Virtuals - $500 Best AI Agent Into Physical World

**Does Pluto qualify now?** No.

Pluto is an AI/voice wallet, but it does not extend into robotics, physical environments, or human-robot collaboration.

**Missing**

- A physical-world agent component.
- Robot or hardware interaction.
- Demo video showing the robot/physical environment.

**Minimum work to unlock**

This is not a natural fit for Pluto. A minimal attempt would be a voice agent that instructs a small physical display or robot to confirm payment status, but that is separate hardware work. Complexity: high relative to Pluto's current MVP.

## 4. Solana Mobile - Seeker Phones Prize

**Does Pluto qualify now?** No.

Pluto is currently a Next.js mobile-first PWA, not a native Android APK.

**Missing**

- Native Android build.
- Solana Mobile Stack integration.
- Mobile Wallet Adapter support.
- Functional APK.
- Meaningful Solana network interaction from the native app.
- Submission to the Solana dApp Store.

**Minimum work to unlock**

Port the app shell to Expo/React Native Android, integrate Mobile Wallet Adapter, build an APK, and submit to the Solana dApp Store. The existing UI and intent logic can be reused, but wallet connection and platform packaging are real work. Complexity: high.

## 5. ElevenLabs - 3 Months Scale Tier

**Does Pluto qualify now?** Yes, once environment variables are configured in production.

Pluto integrates ElevenLabs through server-side API routes for Speech to Text and Text to Speech. Voice input can transcribe user commands, and Pluto responses can be spoken back to the user.

**Missing**

- Add production `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, `ELEVENLABS_STT_MODEL_ID`, and `ELEVENLABS_TTS_MODEL_ID` in Vercel.
- In the demo, show voice input or voice response working.

**Minimum work to unlock**

Keep the current routes, add the Vercel env vars, and mention the exact STT/TTS path in the README. Complexity: low.
