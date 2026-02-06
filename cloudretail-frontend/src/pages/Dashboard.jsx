import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { clearToken } from "../utils/auth";
import ProductCard from "./ProductCard";

export default function Dashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="topbar">
        <h2 className="logo">CloudRetail</h2>

        <nav className="nav-actions">
          <button onClick={() => navigate("/cart")}>Cart</button>
          <button onClick={() => navigate("/orders")}>Orders</button>
          <button onClick={() => navigate("/add-product")}>+ Product</button>
          <button className="danger" onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="content">
        <h1 className="page-title">Products</h1>

        {loading && <p className="muted">Loading products...</p>}
        {error && <p className="error">{error}</p>}

        <div className="products-grid">
          {!loading && products.length === 0 && (
            <p className="muted">No products available</p>
          )}

          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
}
