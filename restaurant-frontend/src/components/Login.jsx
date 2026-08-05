import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("admin@restaurant.com");
  const [password, setPassword] = useState("admin123");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error?.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="max-w-xl">
          <div className="mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-sm font-bold backdrop-blur">
            Restaurant Operations
          </div>
          <h1 className="m-0 text-4xl font-black leading-tight md:text-6xl">
            Run the dining room from one clean screen.
          </h1>
          <p className="mt-4 max-w-lg text-base font-medium text-white/85">
            Orders, tables, menu, inventory, and daily sales stay close at hand.
          </p>
        </div>
      </section>
      <section className="login-card-wrap">
        <form onSubmit={handleSubmit} className="login-card">
          <div className="mb-6">
            <div className="eyebrow">Welcome Back</div>
            <h2 className="mt-1 text-2xl font-extrabold text-stone-900">
              Sign in to admin
            </h2>
          </div>
          <label className="mb-4 block">
            <span className="mb-1 block text-sm font-bold text-stone-700">Email</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              required
            />
          </label>
          <label className="mb-5 block">
            <span className="mb-1 block text-sm font-bold text-stone-700">Password</span>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              required
            />
          </label>
          <button type="submit" className="btn btn-primary w-full">
            Sign In
          </button>
        </form>
      </section>
    </div>
  );
}
