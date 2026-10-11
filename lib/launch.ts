/**
 * **Whether the site is live on its own address** — the one switch the
 * launch turns (SEO-PLAN.md, step 1.1).
 *
 * While it is false the site is a preview: robots.txt asks every crawler to
 * stay away (the preview's deploy also sends `X-Robots-Tag: noindex`), and
 * the Vercel address serves the pages itself. Set to true in the commit that
 * launches mardal.co — after the owner points the domain at Vercel and the
 * sample projects come out — and robots.txt opens to every crawler (the AI
 * search ones included) while mardal.vercel.app redirects to mardal.co.
 */
export const siteIsLive = false;
