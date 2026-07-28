import { Container } from "../layout/Container";
import { products } from "../../content/home";

/**
 * The three products, set as type and nothing else.
 *
 * A drawn mark was tried twice here and was crowded both times. There is not
 * much to say about three products that are still being built, so the section
 * says it plainly: a rule, a name, a line, a way through. The rules do the
 * structural work a panel would otherwise do, which is what keeps it quiet.
 *
 * It also carries the four ids the header menu and the footer link to —
 * #products and one per product.
 */
export function ProductsSection() {
  return (
    <section
      className="products-section"
      id={products.id}
      aria-labelledby="products-title"
      data-route-section
    >
      <Container wide>
        <div className="products-intro">
          <p className="section-label">{products.eyebrow}</p>
          <h2 className="section-title products-title" id="products-title">
            {products.title}
          </h2>
          <p className="section-lede products-lede">{products.summary}</p>
        </div>

        <ul className="products-row">
          {products.items.map((product) => (
            <li className="product" id={product.id} key={product.id}>
              <p className="product__status">{product.status}</p>
              <h3 className="product__name">{product.title}</h3>
              <p className="product__copy">{product.description}</p>

              <a className="product__cta" href={products.ctaHref}>
                {products.cta}
                <svg
                  className="product__arrow"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M3.5 12h16.5M13.5 5.5 20 12l-6.5 6.5" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
