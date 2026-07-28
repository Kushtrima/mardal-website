import { Container } from "../layout/Container";
import { ProductsPin } from "./ProductsPin";
import { products } from "../../content/home";

/**
 * The three products: the words on the left, the products down the right.
 *
 * The heading column is held in place while the products are scrolled past it,
 * so it is still there when you reach the last one. Each product leads with a
 * photograph — none of the three has an interface worth showing yet, so the
 * image stands for what it is about rather than claiming to be it.
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
      <ProductsPin />

      <Container wide>
        <div className="products-layout">
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
                <img
                  className="product__image"
                  src={product.image}
                  alt={product.imageAlt}
                  width="1600"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                />

                <p className="product__status">{product.status}</p>
                <h3 className="product__name">{product.title}</h3>
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
        </div>
      </Container>
    </section>
  );
}
