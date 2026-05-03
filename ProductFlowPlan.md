# Pluto Product Flow Plan

This document captures the extra product surfaces needed so the hackathon demo feels complete beyond the first send flow.

## Added Surfaces

- Contact detail: opens from recent contacts or the full contacts list. Shows trusted status, wallet ending, aliases, notes, last activity, send/request/copy actions, edit, and remove.
- Add/edit contact: opens from the voice composer plus button, the Contacts screen add button, or a voice/text command such as `Add contact Nia with wallet 7x...`. The form supports name, wallet address, aliases, notes, and trusted status.
- Remove contact confirmation: removal is a deliberate second step and does not delete old receipts.
- Activity receipt: opens when tapping recent activity. Shows status, counterparty, memo, network, fee, transaction hash, explorer link, and repeat action.
- Add SOL: opens from the balance card. Shows the wallet QR/address, copy address, a Devnet faucet link, and a route to the receive screen.

## Voice/Text Behaviors

- `Add contact <name> with wallet <address>` opens a prefilled contact editor.
- `Send SOL to <contact>` starts the normal send flow and asks for missing amount.
- `Request SOL from <contact>` starts the request flow and asks for missing amount.
- Ambiguous contacts still use the contact choice cards before confirmation.

## UI Decisions

- Voice remains the default front layer.
- Home stays behind Voice and is revealed by dragging or tapping the handle/menu.
- The revealed snap point leaves only the composer-height portion of Voice visible so Home is readable.
- Contact and activity details are full-screen mobile pages, not stacked popups, to keep the wallet hierarchy calm and clear.
- Destructive contact removal uses an inline confirmation card instead of an alert-style modal.

## Future Production Notes

- Validate Solana addresses before saving contacts.
- Add contact import from device contacts after explicit user permission.
- Add a full activity history page with filters.
- Add a funded Devnet setup helper that verifies balance before demo sends.
- Add Firebase persistence for contact edits and receipt reads.
