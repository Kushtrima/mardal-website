/**
 * **Whether the site is live on its own address** — the one switch the
 * launch turns (SEO-PLAN.md, step 1.1).
 *
 * Off, the site was a preview: robots.txt asked every crawler to stay away,
 * and canonicals were written against whatever address served the page. On
 * since 2026-10-19, when the owner chose to publish mardal.co from GitHub
 * Pages (next.config.ts) and the sample projects came out: robots.txt lets
 * every crawler in (the AI search ones included), and every canonical and
 * preview address is written against mardal.co.
 */
export const siteIsLive = true;
