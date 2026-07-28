import { Container } from "../layout/Container";
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
        <div className="products-intro">
          <p className="section-label">
            {products.eyebrow}
          </p>
          <h2
            className="section-title products-title"
            id="products-title"
          >
            {products.title}
          </h2>
          <p className="section-lede products-lede">
            {products.summary}
          </p>
        </div>

        <div className="products-grid">
          {products.items.map((product) => (
            <article
              className="product-card"
              id={product.id}
              key={product.id}
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
        </div>
      </Container>
    </section>
  );
}
