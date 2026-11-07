// Final Duel on Cloudflare. Static files are served from the repo root; this Worker only
// answers /turn, asking the final-gate-turn Worker (service binding TURN) for short-lived
// TURN relay credentials. Same-origin, so no CORS setup is needed for this site.
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (url.pathname === '/turn') {
      if (!env.TURN) return new Response('{"iceServers":[]}', { status: 503, headers: { 'content-type': 'application/json' } });
      try {
        const r = await env.TURN.fetch('https://final-gate-turn/', { headers: { Origin: 'https://celsomisajr-ctrl.github.io' } });
        return new Response(r.body, { status: r.status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
      } catch (e) {
        return new Response('{"iceServers":[]}', { status: 502, headers: { 'content-type': 'application/json' } });
      }
    }
    return env.ASSETS.fetch(req);
  },
};
