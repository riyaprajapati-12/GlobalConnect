import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      // Send token to backend for verification or create/login user
      const res = await API.post("/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Google login failed");
    }
  };

  const handleGoogleFailure = () => {
    setError("Google login failed. Try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-50 via-white to-olive-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-olive-200 blur-[140px] opacity-30" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-olive-300 blur-[160px] opacity-30" />

      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-olive-200">
        <h2 className="text-3xl font-bold text-center text-olive-800 mb-6">
          Login to Global Connect
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-olive-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-olive-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-olive-600 text-white py-2 rounded-lg font-semibold hover:bg-olive-700 transition shadow-md"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-olive-200"></div>
          <span className="px-3 text-olive-500 text-sm">OR</span>
          <div className="flex-grow border-t border-olive-200"></div>
        </div>

        {/* Google Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            theme="outline"
            shape="pill"
          />
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-olive-600 hover:text-olive-800 hover:underline"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
