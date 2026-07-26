import { Container } from "../layout/Container";
import { RevealGroup } from "../motion/RevealGroup";
import { IsometricArt } from "../ui/IsometricArt";
import { products } from "../../content/home";

export function ProductsSection() {
  return (
    <section
      className="products-section"
      id={products.id}
      aria-labelledby="products-title"
      data-route-section
    >
      <Container wide>
        <RevealGroup className="products-intro" stagger={0.12}>
          <p className="section-label" data-reveal-item>
            {products.eyebrow}
          </p>
          <h2
            className="section-title products-title"
            id="products-title"
            data-reveal-item
          >
            {products.title}
          </h2>
          <p className="section-lede products-lede" data-reveal-item>
            {products.summary}
          </p>
        </RevealGroup>

        <RevealGroup className="products-grid" preset="card" stagger={0.1}>
          {products.items.map((product) => (
            <article
              className="product-card"
              id={product.id}
              key={product.id}
              data-reveal-item
            >
              <div className="product-card__header">
                <p className="product-card__status">{product.status}</p>
                <span className="card-plus" aria-hidden="true" />
              </div>

              <div className="product-card__art">
                <IsometricArt scene={product.id} />
              </div>

              <h3 className="product-card__name">{product.title}</h3>
              <p className="product-card__copy">{product.description}</p>
            </article>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
