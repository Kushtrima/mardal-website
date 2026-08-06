/* Referenced per type rather than through compilerOptions.types, which applied
   the Workers types to the whole tree. They declare a global Element carrying
   HTMLRewriter's own append(), which shadowed the DOM's ParentNode.append in
   every client component: appending a div to a div was being type-checked
   against a Workers API. */
declare namespace Cloudflare {
  interface Env {
    DB: import("@cloudflare/workers-types").D1Database;
  }
}

/* The runtime module db/index.ts reads the bindings from. Its declaration came
   from the same package, so it goes when the global types do. */
declare module "cloudflare:workers" {
  export const env: Cloudflare.Env;
}
