import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
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
      const res = await API.post("/auth/register", formData);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      console.log("Signup success ✅", res.data);
      navigate("/createprofile");
    } catch (err) {
      setError(err.response?.data?.msg || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Google OAuth
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential; // Google ID Token
      const userInfo = jwtDecode(token);

      // send token to backend
      const res = await API.post("/auth/google", { token });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);

      console.log("Google signup/login success ✅", res.data);
      navigate("/createprofile");
    } catch (err) {
      console.error(err);
      setError("Google sign up failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-olive-50 via-white to-olive-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] rounded-full bg-olive-200 blur-[140px] opacity-30" />
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] rounded-full bg-olive-300 blur-[160px] opacity-30" />

      {/* Card */}
      <div className="relative bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md border border-olive-200">
        <h2 className="text-3xl font-bold text-center text-olive-800 mb-6">
          Create an Account
        </h2>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-olive-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500"
              required
            />
          </div>

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
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <div className="flex-grow border-t border-olive-200"></div>
          <span className="px-3 text-olive-500 text-sm">OR</span>
          <div className="flex-grow border-t border-olive-200"></div>
        </div>

        {/* Google Signup Button */}
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError("Google sign up failed")}
            shape="pill"
            size="large"
            theme="outline"
          />
        </div>

        {/* Already have account */}
        <div className="text-center mt-6">
          <a
            href="/login"
            className="text-sm text-olive-600 hover:text-olive-800 hover:underline"
          >
            Already have an account? Login
          </a>
        </div>
      </div>
    </div>
  );
}
