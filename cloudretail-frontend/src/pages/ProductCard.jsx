import api from "../api/api";

export default function ProductCard({ product }) {
  const addToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      alert("Added to cart");
    } catch {
      alert("Failed to add to cart");
    }
  };

  return (
    <div className="product-card">
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="price">Rs. {Number(product.price).toFixed(2)}</p>
        {product.description && (
          <p className="description">{product.description}</p>
        )}
      </div>

      <button className="primary full" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  );
}
