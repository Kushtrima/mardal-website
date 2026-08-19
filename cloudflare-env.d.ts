/* Referenced per type rather than through compilerOptions.types, which applied
   the Workers types to the whole tree. They declare a global Element carrying
   HTMLRewriter's own append(), which shadowed the DOM's ParentNode.append in
   every client component: appending a div to a div was being type-checked
   against a Workers API. */
declare namespace Cloudflare {
  interface Env {
    DB: import("@cloudflare/workers-types").D1Database;
    /* Where a job application's CV is put. Optional, and that is the whole
       point: `.openai/hosting.json` has `"r2": null`, so vite.config.ts creates
       no bucket and this is undefined at runtime. The apply endpoint checks for
       it and tells the applicant to email instead rather than accepting a file
       it has nowhere to keep. Set `"r2": "CV"` to switch it on. */
    CV?: import("@cloudflare/workers-types").R2Bucket;
  }
}

/* The runtime module db/index.ts reads the bindings from. Its declaration came
   from the same package, so it goes when the global types do. */
declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
