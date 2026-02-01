import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  Shield,
  Smartphone,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Play,
  ChevronRight,
  Zap,
  Lock,
  Globe,
  Headphones,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
  QrCode,
  Send,
  BarChart3,
  PiggyBank,
  Target,
  Award,
} from "lucide-react";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Mock statistics
  const stats = {
    users: "2.5M+",
    transactions: "10M+",
    countries: "50+",
    satisfaction: "98%",
  };

  // Features data
  const features = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description:
        "Your money is protected with 256-bit encryption and multi-factor authentication.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Send money instantly from your phone with our intuitive mobile app.",
    },
    {
      icon: Users,
      title: "Family Circles",
      description:
        "Create family groups and manage expenses together with loved ones.",
    },
    {
      icon: TrendingUp,
      title: "Smart Analytics",
      description:
        "Track spending patterns and get insights to save more money.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant transfers with real-time processing and confirmation.",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description:
        "Your data is never shared with third parties without your consent.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Family Manager",
      content:
        "FamilyPay has transformed how we manage our household expenses. So simple and secure!",
      rating: 5,
      avatar: "👩",
    },
    {
      name: "Michael Chen",
      role: "Small Business Owner",
      content:
        "The best payment solution I've used. Fast, reliable, and excellent customer support.",
      rating: 5,
      avatar: "👨",
    },
    {
      name: "Emma Davis",
      role: "Student",
      content:
        "Perfect for splitting bills with roommates. The family circles feature is amazing!",
      rating: 5,
      avatar: "👧",
    },
  ];

  // Pricing plans
  const pricingPlans = [
    {
      name: "Personal",
      price: "Free",
      features: [
        "Up to 10 transactions/month",
        "Basic family circle (5 members)",
        "Email support",
        "Mobile app access",
      ],
      recommended: false,
    },
    {
      name: "Family",
      price: "$9.99/mo",
      features: [
        "Unlimited transactions",
        "Family circle (20 members)",
        "Priority support",
        "Advanced analytics",
        "Budget planning tools",
      ],
      recommended: true,
    },
    {
      name: "Business",
      price: "$29.99/mo",
      features: [
        "Unlimited everything",
        "Unlimited members",
        "24/7 phone support",
        "API access",
        "Custom branding",
        "Advanced reporting",
      ],
      recommended: false,
    },
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-bg/95 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.jpeg"
                  alt="FamilyPay"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-text">FamilyPay</span>
              </div>

              <div className="hidden md:flex items-center gap-6">
                <a
                  href="#features"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#pricing"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Reviews
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn btn-primary"
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-secondary"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="btn btn-primary"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted by 2.5M+ families worldwide
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
              Manage Your Family's
              <span className="text-primary"> Finances</span> Together
            </h1>

            <p className="text-xl text-text-muted max-w-3xl mx-auto mb-8">
              The modern way to handle family expenses, split bills, and track
              spending. Join millions of families who trust FamilyPay for their
              financial needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg flex items-center gap-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5" />
              </button>

              <button className="btn btn-secondary btn-lg flex items-center gap-2">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                Set up in 2 minutes
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                14-day free trial
              </div>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 border border-border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Send className="w-5 h-5 text-primary" />
                    <span className="font-medium text-text">Send Money</span>
                  </div>
                  <p className="text-2xl font-bold text-text mb-1">₹12,500</p>
                  <p className="text-sm text-text-muted">
                    Total sent this month
                  </p>
                </div>

                <div className="bg-bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-5 h-5 text-success" />
                    <span className="font-medium text-text">Family Circle</span>
                  </div>
                  <p className="text-2xl font-bold text-text mb-1">8 Members</p>
                  <p className="text-sm text-text-muted">Active participants</p>
                </div>

                <div className="bg-bg-card rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-4">
                    <PiggyBank className="w-5 h-5 text-warning" />
                    <span className="font-medium text-text">Savings</span>
                  </div>
                  <p className="text-2xl font-bold text-text mb-1">₹45,000</p>
                  <p className="text-sm text-text-muted">Total saved</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="text-center">
                <p className="text-3xl font-bold text-primary mb-2">{value}</p>
                <p className="text-sm text-text-muted capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Everything You Need for Family Finance
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Powerful features designed to make managing money together simple
              and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card p-6 hover:border-primary transition-colors"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-text mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              How FamilyPay Works
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Get started in minutes and start managing your family finances
              better than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Create Account
              </h3>
              <p className="text-text-muted">
                Sign up in seconds with your email or phone number
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Invite Family
              </h3>
              <p className="text-text-muted">
                Add family members to your circle and set permissions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">
                Start Managing
              </h3>
              <p className="text-text-muted">
                Send money, track expenses, and reach your goals together
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Choose the plan that works best for your family. Start free,
              upgrade anytime.
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="bg-bg-card rounded-lg p-1 inline-flex">
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === "personal"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-6 py-2 rounded-md transition-colors ${
                  activeTab === "business"
                    ? "bg-primary text-white"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Business
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card p-8 relative ${
                  plan.recommended
                    ? "border-2 border-primary ring-2 ring-primary/20"
                    : ""
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-text mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-4xl font-bold text-text mb-2">
                    {plan.price}
                    {plan.price !== "Free" && (
                      <span className="text-lg text-text-muted font-normal">
                        /month
                      </span>
                    )}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                      <span className="text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full btn ${
                    plan.recommended ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Loved by Families Worldwide
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              See what our users have to say about their experience with
              FamilyPay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                <p className="text-text-muted mb-4">"{testimonial.content}"</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-elevated rounded-full flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-text">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Family's Finances?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Join millions of families who trust FamilyPay for their financial
              needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="btn bg-white text-primary hover:bg-gray-50 btn-lg"
              >
                Get Started Free
              </button>
              <button className="btn border-2 border-white text-white hover:bg-white/10 btn-lg">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/logo.jpeg"
                  alt="FamilyPay"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-bold text-text">FamilyPay</span>
              </div>
              <p className="text-text-muted">
                The modern way to manage family finances together.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-text-muted hover:text-text"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-text-muted hover:text-text"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-text-muted text-sm">
                © 2024 FamilyPay. All rights reserved.
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Globe className="w-5 h-5 text-text-muted" />
                <Headphones className="w-5 h-5 text-text-muted" />
                <Shield className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
