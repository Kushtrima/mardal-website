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
} as const;

export type RevealPreset = keyof typeof revealPresets;
