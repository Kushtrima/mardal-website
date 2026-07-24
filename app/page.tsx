import { Container } from "../components/layout/Container";

export default function Home() {
  return (
    <main className="system-page" id="main-content">
      <Container className="system-shell">
        <p className="eyebrow">Mardal — Portfolio</p>
        <h1 className="display-heading">The foundation is ready.</h1>
        <p className="body-large system-intro">
          A lightweight design system is in place. The first page can now be
          designed without rebuilding the project underneath it.
        </p>

        <dl className="system-list" aria-label="Project foundation">
          <div>
            <dt>Framework</dt>
            <dd>Next.js</dd>
          </div>
          <div>
            <dt>Styling</dt>
            <dd>Tailwind CSS</dd>
          </div>
          <div>
            <dt>Motion</dt>
            <dd>GSAP</dd>
          </div>
        </dl>
      </Container>
    </main>
  );
}
