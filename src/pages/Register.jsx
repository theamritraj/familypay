import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Users, UserPlus } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [isJoining, setIsJoining] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isMinor: false,
    upiId: "",
    familyCircle: "", // Used for invite code
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return;
    }

    if (!formData.upiId.includes("@")) {
      setError("Invalid UPI ID format (example: user@bank)");
      return;
    }

    if (isJoining && !formData.familyCircle.trim()) {
      setError("Please enter a valid Family Invite Code to join.");
      return;
    }

    setLoading(true);

    const { confirmPassword, ...registerData } = formData;
    
    // Assign role automatically based on the tab selected
    registerData.role = isJoining ? "SECONDARY" : "PRIMARY";
    if (!isJoining) {
        // Clear out familyCircle if creating a new family so the backend can generate one
        registerData.familyCircle = "";
    }

    const result = await register(registerData);

    if (result.success) {
      // Navigate based on role
      if (result.data.role === "PRIMARY") {
        navigate("/dashboard/primary");
      } else {
        navigate("/dashboard/secondary");
      }
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-gradient-to-br sm:from-bg sm:to-bg-elevated sm:p-4 bg-bg">
      <div className="w-full h-screen sm:h-auto sm:max-w-md bg-bg-card sm:border sm:border-border sm:rounded-[8px] p-6 sm:p-8 sm:shadow-xl animate-fade-in flex flex-col justify-center">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/logo.jpeg"
            alt="FamilyPay"
            className="w-12 h-12 rounded-[8px] mr-3"
          />
          <h1 className="text-2xl font-bold text-text">FamilyPay</h1>
        </div>

        {/* Tabs for Create vs Join */}
        <div className="flex bg-bg-elevated p-1 rounded-[8px] mb-6">
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-[8px] flex items-center justify-center gap-2 transition-colors ${
              !isJoining ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
            }`}
            onClick={() => { setIsJoining(false); setError(""); }}
          >
            <Users className="w-4 h-4" />
            Create Family
          </button>
          <button
            className={`flex-1 py-2 text-sm font-medium rounded-[8px] flex items-center justify-center gap-2 transition-colors ${
              isJoining ? "bg-primary text-white shadow-sm" : "text-text-muted hover:text-text"
            }`}
            onClick={() => { setIsJoining(true); setError(""); }}
          >
            <UserPlus className="w-4 h-4" />
            Join Family
          </button>
        </div>

        {error && <div className="alert alert-error rounded-[8px]">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isJoining && (
            <div>
              <label className="form-label">Family Invite Code</label>
              <input
                type="text"
                name="familyCircle"
                className="form-input rounded-[8px]"
                placeholder="Enter 20-character invite code"
                value={formData.familyCircle}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-text-muted mt-1">Ask your Family Head for this code.</p>
            </div>
          )}

          <div>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input rounded-[8px]"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input rounded-[8px]"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              className="form-input rounded-[8px]"
              placeholder="10 digit phone number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
          </div>

          <div>
            <label className="form-label">UPI ID</label>
            <input
              type="text"
              name="upiId"
              className="form-input rounded-[8px]"
              placeholder="yourname@bank"
              value={formData.upiId}
              onChange={handleChange}
              required
            />
          </div>

          {isJoining && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isMinor"
                  className="form-checkbox rounded"
                  checked={formData.isMinor}
                  onChange={handleChange}
                />
                <span className="form-label mb-0">
                  I am a minor (requires approval for all payments)
                </span>
              </label>
            </div>
          )}

          <div>
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input rounded-[8px]"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="form-input rounded-[8px]"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full rounded-[8px]"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner mx-auto"></div>
            ) : (
              isJoining ? "Join Family" : "Create Family"
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-border">
          <p className="text-text-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link text-primary hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
