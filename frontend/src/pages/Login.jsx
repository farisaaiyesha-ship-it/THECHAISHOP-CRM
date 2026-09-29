import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Login() {
  const [email, setEmail] = useState("admin@thechaishop.co");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("crm_token", data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="brand center"><div className="brand-mark">T</div><div><strong>THECHAISHOP&CO</strong><span>CRM</span></div></div>
        <h1>Welcome back</h1>
        <p>Sign in to manage customers, leads, orders and follow-ups.</p>
        <form onSubmit={submit}>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required /></label>
          <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" required /></label>
          {error && <div className="error">{error}</div>}
          <button className="primary full">Sign in</button>
        </form>
        <small>Demo: admin@thechaishop.co / admin123</small>
      </div>
    </div>
  );
}