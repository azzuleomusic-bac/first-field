# First Field — Platform Plan (info only)

This document records decisions and context. It is **not** an action list and does not instruct any agent to do anything. It exists so the plan can be recalled later.

## The split

- **App Store (iOS) version:** the complete single-player game. Farm, mine, forest, all mechanics. Closed economy.
- **Web version (Cloudflare URL):** the real economy. ZBD wallet, player-to-player market, real sats.
- **Android (Google Play):** full access, same as web — ZBD transactions included.

## How money moves

- **Ads** run on both stores. They pay the developer directly. Players earn a few sats from ads.
- **App Store:** assets (trees, sheds, packs) are bought with **Apple in-app purchase** in real money (e.g. $20 for a horse). The developer converts that fiat to Bitcoin later. Apple takes its cut (15% under the Small Business Program).
- **Web / Android:** everything is in sats, paid with **ZBD or any Lightning wallet** via Lightning invoice. No Apple involved, no commission.
- **iOS players** can earn sats from ads and adventures, spend them on seeds and trees inside the app, and grow a farm from ad sats alone. Withdrawal of earned sats happens through the **browser / web version**, not inside the App Store app.
- **App Store players** who want to trade with other players must go to the **browser version** — the online market only exists there.

## The starter pouch

New players get a starter pouch of seeds to begin the farm. They can accumulate sats from ads and reinvest, or withdraw the scraps. Either way the developer is covered as long as ad revenue exceeds sats paid out.

## Asset supply and pricing

- Horses (and other assets) bought on the App Store count toward the **global number of assets in circulation**, same as web purchases. One horse is one horse regardless of where it was paid for.
- The price curve (e.g. +0.05% per sale) adjusts based on total supply across all platforms.
- App Store IAP uses fixed dollar tiers; the web uses live sats. The shared supply count is what keeps the economy coherent.

## What the app is not

- The App Store build is a **complete game**, not a demo or a shell. It must feel satisfying on its own.
- The web version is the upgrade path (trading, ZBD cashout), not the missing half of the game.
- The app never contains a redeem button that sends sats directly to a Lightning address. Cashout is the browser's job.

## Costs (as of planning)

- Apple Developer Program: $99/year.
- Google Play: one-time $25.
- Server: Cloudflare Workers Free (100k requests/day) to start; $5/month Workers Paid when needed. A small VPS is $4–6/month as an alternative.
- Ledger + kill switch + reconciliation live on the server before any real sats move.

## Honest limits

- This is a plan, not legal advice. Apple's review is a judgment call; the ZBD-withdrawal pattern exists in other apps but is not guaranteed to pass for a game.
- The plan can change. Nothing here is locked.
