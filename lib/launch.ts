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

/**
 * **Pages hidden for now** — owner, 2026-10-21: "hide also Product page
 * completley". A path here is off the menu (the bar, the burger and the
 * footer, which all read `menu` in content/home.ts) and out of the sitemap,
 * and its page sits in a private folder (`app/_products`), so its address
 * answers nothing. To show it again: take it off this list and move the
 * folder back to `app/products`.
 */
export const hiddenPages: readonly string[] = ["/products"];
