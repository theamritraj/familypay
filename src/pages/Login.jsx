import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

// Custom Google SVG Icon
const GoogleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, register, loading, error } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    dateOfBirth: "",
    address: "",
  });
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError("Email and password are required");
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setFormError("Name is required");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setFormError("Passwords do not match");
        return false;
      }

      if (formData.password.length < 6) {
        setFormError("Password must be at least 6 characters");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validateForm()) {
      return;
    }

    try {
      let result;

      if (isLogin) {
        result = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        result = await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
          role: "SECONDARY", // Default role for new registrations
        });
      }

      if (result.success) {
        setSuccessMessage(
          isLogin ? "Login successful!" : "Registration successful!",
        );
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError("An unexpected error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setFormError("");
      setSuccessMessage("");

      const result = await loginWithGoogle();

      if (result.success) {
        setSuccessMessage("Google sign-in successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        setFormError(result.error);
      }
    } catch (error) {
      setFormError("Google sign-in failed");
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormError("");
    setSuccessMessage("");
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phone: "",
      dateOfBirth: "",
      address: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <img
              src="/logo.jpeg"
              alt="FamilyPay"
              className="w-12 h-12 rounded-lg mr-3"
            />
            <h1 className="text-2xl font-bold text-text">FamilyPay</h1>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success text-sm">{successMessage}</span>
            </div>
          )}

          {/* Error Message */}
          {(formError || error) && (
            <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-danger" />
              <span className="text-danger text-sm">{formError || error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full mb-6 p-3 bg-bg-elevated border border-border rounded-lg hover:border-primary transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <GoogleIcon className="w-5 h-5" />
            <span className="text-text font-medium">
              {loading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-border"></div>
            <span className="px-4 text-text-muted text-sm">OR</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Registration Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Phone Field (Registration Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-text mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Registration Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {/* Date of Birth Field (Registration Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Date of Birth (Optional)
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}

            {/* Address Field (Registration Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Address (Optional)
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Enter your address"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-text-muted">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={toggleForm}
                className="ml-2 text-primary hover:text-primary/80 font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Forgot Password (Login Only) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Link
                to="/forgot-password"
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Forgot your password?
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
