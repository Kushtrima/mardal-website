/**
 * Decides when a wheel event is a fresh push rather than the tail of the last
 * one.
 *
 * This lives on its own because it is the part that keeps being wrong. A wheel
 * does not report gestures, only events, and the two devices that produce them
 * behave nothing alike:
 *
 *   A trackpad flick fires an unbroken stream about a frame apart, and keeps
 *   firing for a second or more after the fingers have gone.
 *
 *   A mouse wheel fires one event per notch, and a single roll of a finger is
 *   two or three notches with real pauses between them — pauses long enough to
 *   look exactly like separate pushes.
 *
 * Neither rule alone covers both. Timing the tail out lets a mouse roll through
 * (a 700ms limit took three industries per roll). Requiring quiet in front of
 * an event stops the trackpad but not the mouse, whose notches have quiet
 * between them by nature. So both apply: an event must have quiet in front of
 * it AND come after the door the last step closed.
 */
export type WheelGate = (now: number) => boolean;

export function createWheelGate(gapMs: number, lockMs: number): WheelGate {
  /* Far enough back that the first event of a session always reads as a fresh
     push rather than as the continuation of nothing. */
  let lastEventAt = Number.NEGATIVE_INFINITY;
  let openAt = 0;

  return function accepts(now: number): boolean {
    const gap = now - lastEventAt;
    /* Every event moves this, stepping or not: that is what makes a stream of
       momentum keep failing the gap test all the way to its end. */
    lastEventAt = now;

    if (gap < gapMs) return false;
    if (now < openAt) return false;

    openAt = now + lockMs;
    return true;
  };
}
