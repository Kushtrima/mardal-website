# Mardal portfolio

A lightweight UX portfolio foundation built with Next.js, Tailwind CSS, and
GSAP.

## Start

```bash
npm install
npm run dev
```

## Structure

- `app/globals.css` — colors, typography, spacing, radii, motion, and shared
  component styles
- `components/layout` — reusable layout primitives
- `components/ui` — shared interface components such as buttons
- `components/motion` — optional client-side GSAP components
- `lib/motion.ts` — centralized animation presets
- `app/page.tsx` — current page composition

Page components should use the shared tokens and primitives. Avoid inline
styles and one-off color or typography values.
