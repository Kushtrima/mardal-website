#!/usr/bin/env python3
"""
Turns a hero pattern PNG into the rectangles it is made of.

The service heroes were painted as PNGs used as CSS masks: flat colour behind,
the drawing cut out of it by the image's alpha. That is fine for something that
only has to sit there, and impossible to animate — a bar in a mask is pixels,
not an element, so nothing can move one bar and leave its neighbour.

This reads the alpha channel back into the rectangles it was drawn from, so the
same artwork can be rendered as an SVG of real `<rect>` elements.

    python3 SVG/trace-pattern.py public/ux-ui-branding-pattern.png

Prints the bars as a TypeScript array, and reports how faithful the trace is at
the size the pattern is actually displayed at, which is the only size where a
difference could matter.

    ── How it traces ──

The artwork is axis-aligned bars, so no general vectoriser is needed. Threshold
the alpha, then repeatedly take the top-left pixel still unclaimed, run right
while the row stays on, then run DOWN while that whole span stays on, and emit
the rectangle. Bars that abut come out as two rectangles rather than an L, which
is correct — they were two bars.

    ── Why the threshold is 90 ──

Measured, not chosen. Of the three tried, 64/90/128, it gave the closest match
at display size — 1.70 of 255 against 1.96 and 1.97 — and the fewest rectangles.

    ── Why the one-pixel slivers are KEPT ──

They were dropped at first. The PNG is anti-aliased, 2.9% of its pixels are
partial alpha, and those fringes trace as rectangles one pixel tall or one wide;
discarding the 184 of them cost 2% of the painted area, all of it a rim a third
of a pixel wide once scaled, and it took the element count from 319 to 116.

That was wrong, and the owner found it before the reasoning did: white
separations between the blocks. Not every sliver is a rim. Where one sat BETWEEN
two solid bars it was the only thing joining them, and dropping it opened a real
gap in the artwork — a third of a pixel of white with full colour either side,
which is exactly what a hairline looks like.

Keeping them costs nothing now. The bars are drawn as subpaths of one path per
band rather than as elements, so 319 subpaths and 116 are the same object count
either way.
"""

import sys
from PIL import Image, ImageDraw

THRESHOLD = 90
DISPLAY_WIDTH = 480  # `width: min(100%, 30rem)` on a wide window


def trace(path, threshold=THRESHOLD):
    image = Image.open(path).convert("RGBA")
    width, height = image.size
    alpha = image.getchannel("A").tobytes()
    on = bytearray(1 if alpha[i] >= threshold else 0 for i in range(width * height))

    bars = []
    for y in range(height):
        x = 0
        row = y * width
        while x < width:
            if not on[row + x]:
                x += 1
                continue
            right = x
            while right < width and on[row + right]:
                right += 1
            bottom = y + 1
            while bottom < height:
                below = bottom * width
                if all(on[below + i] for i in range(x, right)):
                    bottom += 1
                else:
                    break
            for r in range(y, bottom):
                claimed = r * width
                for i in range(x, right):
                    on[claimed + i] = 0
            bars.append((x, y, right - x, bottom - y))
            x = right

    return image, bars


def fidelity(image, bars):
    """Mean absolute alpha error at the size the pattern is drawn at."""
    width, height = image.size
    display = (DISPLAY_WIDTH, round(DISPLAY_WIDTH * height / width))

    drawn = Image.new("L", (width, height), 0)
    pen = ImageDraw.Draw(drawn)
    for (x, y, w, h) in bars:
        pen.rectangle([x, y, x + w - 1, y + h - 1], fill=255)

    want = list(image.getchannel("A").resize(display, Image.LANCZOS).getdata())
    got = list(drawn.resize(display, Image.LANCZOS).getdata())
    return sum(abs(a - b) for a, b in zip(want, got)) / len(want)


def main():
    path = sys.argv[1]
    image, bars = trace(path)
    width, height = image.size

    print(f"/* {len(bars)} bars traced from {path}, {width}x{height}. */")
    print("const BARS: ReadonlyArray<readonly [number, number, number, number]> = [")
    for bar in bars:
        print("  [%d, %d, %d, %d]," % bar)
    print("];")
    print()
    print("// mean alpha error at %dpx wide: %.2f/255" % (DISPLAY_WIDTH, fidelity(image, bars)),
          file=sys.stderr)


if __name__ == "__main__":
    main()
