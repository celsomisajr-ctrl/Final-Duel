# Final Duel

One-on-one online duels in the browser, built on the [Final Gate](https://github.com/celsomisajr-ctrl/Final-Gate) engine.

Pick one of five heroes (Swordsman, Shaman, Archer, Gunner, Brawler), spend 10 stat points, choose two of four skills, and fight another player. The first hero to fall loses.

## Play

- **Online duel:** one player presses **Host a room** and shares the 5-character code; the other enters it and presses **Join**. Both pick a build and press Ready, then the host starts the duel.
- **Practice:** press **Fight a practice bot** on the build screen to duel a computer-controlled hero with a random class and skills. **Rematch** keeps the same bot.

Controls: WASD or arrows (touch: drag on the arena) to move, 1 and 2 (or Q and E) for skills, R for the ultimate, Esc to pause. Basic attacks fire on their own when your opponent is in range.

## How duels work

- Every skill and ultimate from Final Gate works on the other hero: damage, stuns, slows, knockback, the Brawler's boxing ring and Blade Punishment's hold.
- Damage is scaled for hero-sized health pools, with per-hero health and damage multipliers (`DUEL_HP`, `DUEL_DPS` in `index.html`) tuned with thousands of simulated bot duels so every hero wins about half the time. An average duel lasts about 45 to 50 seconds.
- Stuns are capped at 1.2 s (3.5 s inside an ultimate) and are followed by 1.5 s of stun immunity.
- After 2 minutes, **sudden death** raises all damage by 50%.
- The host's game is the authority; the guest sends inputs and receives snapshots 20 times a second. Each player sees their own hero at the bottom of the screen, ringed in blue; the opponent is ringed in red.

## Hosting on Cloudflare

The repo deploys as a Cloudflare Worker with static assets ([`wrangler.jsonc`](wrangler.jsonc)):

1. In the Cloudflare dashboard open **Workers & Pages → Create application → Import a repository**, connect GitHub and pick **Final-Duel**.
2. Keep the root directory as `/` and the deploy command `npx wrangler deploy`, then deploy.
3. Play at `https://final-duel.<your-subdomain>.workers.dev`. Every push to `main` redeploys.

Online matches use the same Cloudflare TURN relay as Final Gate, so players on different networks can connect. On Cloudflare the game asks `/turn` on its own site, and [`cloudflare/worker.js`](cloudflare/worker.js) gets the credentials from the `final-gate-turn` Worker through a service binding, so that Worker needs no changes. If the relay is unavailable, the game falls back to public STUN servers and PeerJS's relay.

## Files

`index.html` is the whole game: engine, art, sound and network code. `assets/` holds the icons.
