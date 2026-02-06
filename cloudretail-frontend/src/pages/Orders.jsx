import { useEffect, useState } from "react";
import api from "../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch {
      alert("❌ Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Page header */}
      <div style={{ marginBottom: "20px" }}>
        <h1 style={{ marginBottom: "4px" }}>My Orders</h1>
        <p className="muted">
          View your past orders and totals
        </p>
      </div>

      {loading && <p className="muted">Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <p className="muted">You haven’t placed any orders yet.</p>
      )}

      {/* Orders list */}
      <div style={{ display: "grid", gap: "14px" }}>
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "6px",
              }}
            >
              <span style={{ fontWeight: 700 }}>
                Order #{order.id}
              </span>

              <span
                style={{
                  fontWeight: 700,
                  color: "var(--primary)",
                }}
              >
                Rs. {order.total}
              </span>
            </div>

            <div className="muted" style={{ fontSize: "14px" }}>
              {new Date(order.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
