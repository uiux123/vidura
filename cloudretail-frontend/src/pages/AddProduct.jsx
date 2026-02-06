import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/products", {
        name: form.name,
        price: Number(form.price),
        description: form.description,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-header">
        <h1>Add New Product</h1>
        <p className="muted">
          Enter product details to add it to the store
        </p>
      </div>

      <form className="form-card" onSubmit={submit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g. Wireless Mouse"
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={onChange}
            placeholder="e.g. 2500"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Short product description"
          />
        </div>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button className="primary" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
