export const revealPresets = {
  up: {
    from: { autoAlpha: 0, y: 32 },
    to: { autoAlpha: 1, y: 0 },
  },
  fade: {
    from: { autoAlpha: 0 },
    to: { autoAlpha: 1 },
  },
  scale: {
    from: { autoAlpha: 0, scale: 0.97 },
    to: { autoAlpha: 1, scale: 1 },
  },
  /** For short bands where a 32px rise overshoots the element's own height. */
  upSmall: {
    from: { autoAlpha: 0, y: 16 },
    to: { autoAlpha: 1, y: 0 },
  },
  /** Matches the Why Mardal cards, so every card on the page enters alike. */
  card: {
    from: { autoAlpha: 0, scale: 0.985, y: 64 },
    to: { autoAlpha: 1, scale: 1, y: 0 },
  },
} as const;

export type RevealPreset = keyof typeof revealPresets;
