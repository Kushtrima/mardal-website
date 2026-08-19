import { Container } from "../layout/Container";
import { SiteFooter } from "../layout/SiteFooter";
import { SiteHeader } from "../layout/SiteHeader";
import { SectionEnter } from "../motion/SectionEnter";
import { PixelArrow } from "../ui/PixelArrow";
import { ApplyForm } from "./ApplyForm";
import { RolePin } from "./RolePin";
import { careers } from "../../content/careers";

type Role = (typeof careers.roles)[number];

/**
 * One role, opened.
 *
 * The only page on this site that does not begin with `service-hero`, and the
 * reason is the shape the owner asked for: the position and its facts hold
 * still on the left while the writing moves past them. A hero would state the
 * role's name across the top and the rail would then state it again a screen
 * lower — the rail IS the opening here, set at the big header size and standing
 * in the column it stays in.
 *
 * Which is also why the rail is not `position: sticky`. See RolePin: the page
 * runs ScrollSmoother, nothing actually scrolls, and sticky has no scrolling
 * ancestor to measure against. It is pinned by ScrollTrigger, and only while
 * there are two columns for it to be pinned beside.
 */
export function RolePage({ role }: { role: Role }) {
  return (
    <>
      <SectionEnter />
      <RolePin />

      <main
        className="service-page service-page--role"
        id="main-content"
        data-service-page
      >
        <SiteHeader />

        <section className="role-page" aria-labelledby="role-title">
          <Container>
            <div className="role-page__layout">
              {/* Held in place while the writing beside it is read. Everything
                  a reader has to keep while going down the page: what the role
                  is called, the two facts known about it, and the way in.

                  There was an "Open roles" link above this — owner deleted it.
                  It is the reason this layout briefly had three grid areas: the
                  link sat inside the rail and pushed the role's name a line
                  below the sentence beside it, so it was given a row of its
                  own to get the two columns starting together. With it gone
                  they start together anyway, and the rows went with it. Back to
                  /careers is the header's Careers entry and the browser. */}
              <div className="role-page__rail">
                <h1 className="role-page__title" id="role-title">
                  {role.title}
                </h1>

                <dl className="role__facts role-page__facts">
                  <div className="role__fact">
                    <dt>{careers.factLabels.location}</dt>
                    <dd>{role.location}</dd>
                  </div>
                  <div className="role__fact">
                    <dt>{careers.factLabels.commitment}</dt>
                    <dd>{role.commitment}</dd>
                  </div>
                </dl>

                {/* Down to the form rather than out to an email. It travels with
                    the rail, so the way to apply is on screen from the first
                    line of the role to the last. */}
                <a className="role-page__apply" href={`#${careers.apply.id}`}>
                  {careers.apply.title}
                  <PixelArrow
                    className="role-page__apply-arrow"
                    direction="up-right"
                    size="small"
                  />
                </a>
              </div>

              <div className="role-page__body">
                <p className="role-page__lede">{role.lede}</p>

                {role.body.map((section) => (
                  <section
                    className="role-section"
                    key={section.id}
                    aria-labelledby={`role-${section.id}`}
                  >
                    <h2 className="role-section__title" id={`role-${section.id}`}>
                      {section.title}
                    </h2>
                    {section.copy.map((paragraph) => (
                      <p className="role-section__copy" key={paragraph}>
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}

                {/* About the company rather than the role, so it is written
                    once and all three pages read it. */}
                <section
                  className="role-section"
                  aria-labelledby={`role-${careers.howWeWork.id}`}
                >
                  <h2
                    className="role-section__title"
                    id={`role-${careers.howWeWork.id}`}
                  >
                    {careers.howWeWork.title}
                  </h2>
                  {careers.howWeWork.copy.map((paragraph) => (
                    <p className="role-section__copy" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                </section>

                <section
                  className="role-section role-section--apply"
                  id={careers.apply.id}
                  aria-labelledby={`role-${careers.apply.id}`}
                >
                  <h2
                    className="role-section__title"
                    id={`role-${careers.apply.id}`}
                  >
                    {careers.apply.title}
                  </h2>
                  <p className="role-section__copy">{careers.apply.lede}</p>

                  <ApplyForm role={role.id} roleTitle={role.title} />
                </section>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
