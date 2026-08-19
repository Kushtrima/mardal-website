/**
 * The Worker's bindings, handed down from the entry point rather than imported.
 *
 * The obvious way to reach a binding is `import { env } from "cloudflare:workers"`,
 * which `db/index.ts` does — and it is unusable from anything the site actually
 * renders. That specifier survives the bundle as an external import, and every
 * test in this repository loads `dist/server/index.js` with plain Node, which
 * refuses it outright: `ERR_UNSUPPORTED_ESM_URL_SCHEME ... Received protocol
 * 'cloudflare:'`. One route handler importing it takes the whole suite down,
 * page tests included, because they all import the same bundle. `db/index.ts`
 * gets away with it only because nothing imports `db/index.ts`.
 *
 * So the entry point stores what it is already given. `worker/index.ts` receives
 * `env` as its second argument on every request and passes it on; it now leaves
 * a reference here on the way past.
 *
 * Module state is safe for this and only this: the bindings are identical for
 * every request an isolate serves, so two requests overlapping cannot see
 * different values. Nothing per-request may be kept here.
 *
 * It is also what makes the endpoint testable in both directions — a test
 * fetches the worker with a `CV` in its env and gets the stored path, or
 * without one and gets the "not configured" answer. Neither needs Wrangler.
 */

type Bindings = Partial<Cloudflare.Env>;

let bindings: Bindings | undefined;

export function setWorkerEnv(env: Bindings | undefined) {
  bindings = env;
}

export function workerEnv(): Bindings {
  return bindings ?? {};
}
