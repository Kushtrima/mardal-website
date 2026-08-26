import { Fragment } from "react";
import Link from "next/link";
import { Container } from "../layout/Container";
import { PixelArrow } from "../ui/PixelArrow";
import { audiences, solutions } from "../../content/home";

/**
 * Who Mardal builds for — as a roll call rather than a list of seven.
 *
 * Rebuilt 2026-08-26 after the owner rejected the section it replaces and then
 * rejected three redesigns of it, all of which were ways of setting the same
 * seven rows. What was wrong with it was not the layout:
 *
 *   - **Six of the seven were unreadable at any moment.** The section held one
 *     industry and dimmed the rest almost to the ground. For a list whose whole
 *     job is naming an audience, the reader could not scan it, and grey at that
 *     weight reads as disabled rather than as waiting.
 *   - **The left column was empty for four fifths of its height** — the heading
 *     used 194px of a 1,034px section and nothing stood under it.
 *   - **The section already had copy it never showed.** `solutions.eyebrow` and
 *     `solutions.title` were both written and neither was rendered. That is what
 *     the empty column is for, and it is where they are now.
 *
 * So the seven sector names stop being the content. The descriptors already name
 * twenty-five kinds of organisation, and read end to end they are the breadth
 * the section is claiming — shown rather than summarised.
 *
 * **The hover adds; it never takes away.** Passing a sector name draws a rule
 * under that sector's own words. Nothing dims, and every word on the page is at
 * full strength at all times, which is the exact inversion of what was here.
 *
 * **No JavaScript at all**, and the section is no longer a client component. The
 * highlight is `:has()` in the stylesheet, so it works before hydration and on a
 * page whose script never arrives. What went with it: a wheel-momentum
 * recogniser, a step lock, a three-second hold, a pin, and the ScrollTrigger
 * that drove them — about 200 lines whose entire visible output was a grey row
 * turning black.
 *
 * **The colour is one accent, not seven.** The design this came from had a tint
 * per sector, and the site has five brand tints, so seven would have meant
 * inventing two. Only one sector is ever lit, so one accent does the same work.
 * Two more values from the owner is all it would take.
 */
export function IndustriesSection() {
  return (
    <section
      className="industries-section"
      id={solutions.id}
      aria-labelledby="industries-title"
      data-route-section
    >
      <Container className="industries-layout" data-industries>
        <div className="industries-header">
          {/* Broken where the owner broke it. `aria-label` carries the sentence
              whole, because the two spans are rendered adjacent and a screen
              reader meeting them would otherwise read `Built acrossindustries`.
              The hero solves the same thing with a leading space; a label is
              cleaner here, since this heading has no phone layout that sets the
              spans inline. */}
          <h2
            className="industries-title"
            id="industries-title"
            aria-label={solutions.lede}
          >
            {solutions.ledeLines.map((line) => (
              <span className="industries-title__line" key={line}>
                {line}
              </span>
            ))}
          </h2>

          {/* **A legend, not a control.** These go nowhere — the owner settled
              that on 2026-08-25, and the run below is readable without ever
              touching one. So they are not buttons and take no tab stop: a
              keyboard landing on seven things that only tint some text is a
              worse outcome than not landing on them, and nothing is lost by
              passing over them, because the words they light are already
              black. */}
          <ul className="industries-keys">
            {solutions.items.map((industry) => (
              /* **The id stays on the key.** The header's Clients panel links
                 to `#finance` and the six below it, so these seven are anchor
                 targets whatever else the section becomes — and they moved with
                 the names when the run they used to sit on was replaced. */
              <li
                className="industries-key"
                key={industry.id}
                id={industry.id}
                data-key={industry.id}
              >
                {industry.title}
              </li>
            ))}
          </ul>
        </div>

        {/* One paragraph, and it is the seven descriptors run together.

            `aria-label` carries it as a sentence: the words are in separate
            spans so each can be lit, and a screen reader meeting a paragraph of
            spans reads it as fragments. The service pages and the About page
            solve it the same way. */}
        <div className="industries-roll">
          <p
            className="industries-run"
            aria-label={solutions.items
              .map((industry) => industry.descriptor)
              .join(" ")}
          >
            {audiences.map((audience, index) => (
              <Fragment key={`${audience.sector}-${audience.name}`}>
                {/* **Real whitespace around the separator, and it is
                    load-bearing.** The spans are written adjacent with nothing
                    between them, so the only places this paragraph could break
                    were the spaces inside phrases — and the moment a phrase was
                    told not to break, the whole run became one unbreakable word
                    and ran off the page.

                    A no-break space before the dot and an ordinary one after it:
                    the dot stays with the phrase it follows, and the line may
                    turn after it. */}
                {index > 0 ? (
                  <Fragment>
                    {"\u00a0"}
                    <span className="industries-run__dot" aria-hidden="true">
                      ·
                    </span>{" "}
                  </Fragment>
                ) : null}
                {/* Only the first word of the run keeps its capital, so the
                    twenty-five read as one sentence rather than as seven lists
                    pushed together. Safe on this copy because no phrase begins
                    with a proper noun — every one of them is a common noun for
                    a kind of organisation. */}
                <span className="industries-who" data-sector={audience.sector}>
                  {index === 0
                    ? audience.name
                    : audience.name.charAt(0).toLowerCase() +
                      audience.name.slice(1)}
                </span>
              </Fragment>
            ))}
          </p>

          {/* The way out, and the only thing in this section that goes
              anywhere. It stood at the end of a line counting the run — twenty
              five kinds of organisation across seven sectors — which the owner
              took out along with the two lines of copy above the keys. */}
          <Link className="industries-explore" href={solutions.ctaHref}>
            {solutions.cta}
            <PixelArrow
              className="industries-explore__arrow"
              direction="up-right"
              size="small"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
