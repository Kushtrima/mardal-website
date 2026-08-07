import assert from "node:assert/strict";
import test from "node:test";
import { createWheelGate } from "../lib/wheel-gate.ts";

/* The two constants the industries run uses. */
const GAP = 120;
const LOCK = 1000;

/** Feeds a series of events and counts how many were taken as fresh pushes. */
function steps(events) {
  const accepts = createWheelGate(GAP, LOCK);
  return events.filter((at) => accepts(at)).length;
}

/** One event per frame from `from` for `ms`, as a trackpad produces. */
function stream(from, ms, every = 16) {
  const out = [];
  for (let t = from; t < from + ms; t += every) out.push(t);
  return out;
}

/** Discrete notches `gap` apart, as a mouse wheel produces. */
function notches(from, count, gap) {
  return Array.from({ length: count }, (_, i) => from + i * gap);
}

test("a mouse roll is one step however many notches it takes", () => {
  // The failure that was reported twice: notches far enough apart to read as
  // separate pushes, close enough together to be one roll of a finger.
  assert.equal(steps(notches(0, 3, 150)), 1);
  assert.equal(steps(notches(0, 2, 200)), 1);
  assert.equal(steps(notches(0, 5, 120)), 1);
  assert.equal(steps(notches(0, 4, 240)), 1);
});

test("a trackpad flick is one step however long its tail runs", () => {
  assert.equal(steps(stream(0, 800)), 1);
  assert.equal(steps(stream(0, 1600)), 1);
  // Longer than the lock, so only the gap rule is holding it back here.
  assert.equal(steps(stream(0, 2500)), 1);
});

test("a second push after a pause is a second step", () => {
  assert.equal(steps([...notches(0, 3, 150), ...notches(1400, 3, 150)]), 2);
  assert.equal(steps([...stream(0, 600), ...stream(1800, 600)]), 2);
});

test("pushing again before the door opens does not step twice", () => {
  // A second roll begun 400ms in: quiet in front of it, but too soon.
  assert.equal(steps([...notches(0, 2, 150), ...notches(400, 2, 150)]), 1);
});

test("a slow deliberate scroll keeps walking rather than sticking", () => {
  // Notches a second and a half apart: each is its own push, and should be.
  assert.equal(steps(notches(0, 4, 1500)), 4);
});

test("the first event of all is a push", () => {
  assert.equal(steps([0]), 1);
  assert.equal(steps([5_000]), 1);
});
