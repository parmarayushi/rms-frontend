import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { login } from "./authSlice";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "", role: "admin" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Try backend login
      const res = await axiosClient.post("/auth/login", {
        email: form.email,
        password: form.password,
        role: form.role,
      });
      const { token, user } = res.data || {};
      if (token && user) {
        localStorage.setItem("access_token", token);
        localStorage.setItem("rms_user", JSON.stringify(user));
        dispatch(login(user));
        navigate("/");
        return;
      }
    } catch (err) {
      // ignore, fallback to mock if role selected
    }

    // If backend failed or didn't return token, perform mock login using selected role
    if (form.role) {
      const mockUser = {
        id: `local-${Date.now()}`,
        name: form.email ? form.email.split("@")[0] : "LocalUser",
        role: form.role,
      };
      localStorage.setItem("access_token", "local-mock-token");
      localStorage.setItem("rms_user", JSON.stringify(mockUser));
      dispatch(login(mockUser));
      setLoading(false);
      navigate("/");
      return;
    }

    setError("Login failed. Please try again.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 via-rose-400 to-slate-900">
      <div className="w-full max-w-md bg-white/90 backdrop-blur shadow-2xl rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-slate-800 mb-1 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mb-5 text-center">
          Login to manage your restaurant operations
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role (for demo)
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="admin">Admin</option>
              <option value="waiter">Waiter</option>
              <option value="chef">Chef</option>
              <option value="tableManager">TableManager</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">
              If your backend is unavailable, selecting a role will perform a
              local mock login.
            </p>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center rounded-lg bg-slate-900 text-white text-sm font-medium py-2.5 hover:bg-slate-800 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400 text-center">
          Roles: <span className="font-semibold text-slate-600">admin</span>,{" "}
          <span className="font-semibold text-slate-600">waiter</span>,{" "}
          <span className="font-semibold text-slate-600">chef</span>,{" "}
          <span className="font-semibold text-slate-600">tableManager</span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
