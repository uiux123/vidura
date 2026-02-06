import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { saveToken } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const token = res?.data?.token || res?.data?.accessToken;
      if (!token) throw new Error("Token not found");

      saveToken(token);
      setMsg("Login successful!");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (error) {
      setErr(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error.message ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="muted center">Login to your account</p>

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button className="primary full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {msg && <p className="success">{msg}</p>}
          {err && <p className="error">{err}</p>}
        </form>

        <p className="auth-footer">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}
