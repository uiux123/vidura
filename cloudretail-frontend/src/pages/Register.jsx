import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setMsg("Account created! Please login.");
      setTimeout(() => navigate("/login"), 800);
    } catch (error) {
      setErr(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="muted center">Join Cloud Retail</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              placeholder="Create strong password"
              required
            />
          </div>

          <button className="primary full" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>

          {msg && <p className="success">{msg}</p>}
          {err && <p className="error">{err}</p>}
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
