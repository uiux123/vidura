import { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await api.get("/cart");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      await api.post("/orders");
      alert("Order placed successfully");
      navigate("/orders");
    } catch {
      alert("Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="container">
      <h1>Your Cart</h1>

      {loading && <p className="muted">Loading cart...</p>}

      {items.map((item) => (
        <div key={item.productId} className="cart-item">
          <strong>{item.name}</strong>
          <span>
            Rs. {item.price} × {item.quantity}
          </span>
        </div>
      ))}

      {items.length > 0 && (
        <div className="checkout">
          <h3>Total: Rs. {total}</h3>
          <button className="primary" onClick={placeOrder} disabled={placing}>
            {placing ? "Placing..." : "Place Order"}
          </button>
        </div>
      )}
    </div>
  );
}
