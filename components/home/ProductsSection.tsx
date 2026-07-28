import { Container } from "../layout/Container";
import { ProductMark } from "./ProductMark";
import type { ProductMarkName } from "./ProductMark";
import { products } from "../../content/home";

/**
 * The three products, each under its own name, drawn in bars.
 *
 * The section also carries the four ids the header menu and the footer link
 * to — #products and one per product — so those entries lead somewhere again.
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
              <h3 className="product__name">{product.title}</h3>

              <ProductMark mark={product.mark as ProductMarkName} />

              <p className="product__status">{product.status}</p>
              <p className="product__copy">{product.description}</p>

              <a
                className="button button--secondary product__cta"
                href={products.ctaHref}
              >
                {products.cta}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
