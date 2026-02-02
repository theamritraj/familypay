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
  Menu,
  X,
  Clock,
  Users2,
  ShieldCheck,
  Sparkles,
  ArrowDown,
} from "lucide-react";

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // Handle scroll effect for navigation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav
        className={`fixed top-0 w-full transition-all duration-300 z-50 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-sm border-b border-border"
            : "bg-bg/80 backdrop-blur-sm"
        }`}
      >
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

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  How it Works
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Reviews
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => navigate("/blog")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Blog
                </button>
                <button
                  onClick={() => navigate("/careers")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Careers
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center gap-4">
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-bg-elevated transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-text" />
                ) : (
                  <Menu className="w-6 h-6 text-text" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border bg-bg/95 backdrop-blur-sm">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => scrollToSection("features")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  How it Works
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Reviews
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  About
                </button>
                <button
                  onClick={() => navigate("/blog")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Blog
                </button>
                <button
                  onClick={() => navigate("/careers")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Careers
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className="block w-full text-left text-text-muted hover:text-text transition-colors py-2"
                >
                  Contact
                </button>
                <div className="border-t border-border pt-4 space-y-3">
                  {isAuthenticated ? (
                    <button
                      onClick={() => navigate("/dashboard")}
                      className="w-full btn btn-primary"
                    >
                      Dashboard
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => navigate("/login")}
                        className="w-full btn btn-secondary"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="w-full btn btn-primary"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4" />
              Trusted by 2.5M+ families worldwide
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text mb-6 leading-tight">
              Manage Your Family's
              <span className="text-primary"> Finances</span> Together
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-text-muted max-w-4xl mx-auto mb-12 leading-relaxed">
              The modern way to handle family expenses, split bills, and track
              spending. Join millions of families who trust FamilyPay for their
              financial needs.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                className="btn btn-primary btn-lg flex items-center gap-2 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn btn-secondary btn-lg flex items-center gap-2 px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Features */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-info" />
                Set up in 2 minutes
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-warning" />
                14-day free trial
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center p-6 bg-bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">2.5M+</div>
              <div className="text-sm text-text-muted">users</div>
            </div>
            <div className="text-center p-6 bg-bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-text-muted">transactions</div>
            </div>
            <div className="text-center p-6 bg-bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-text-muted">countries</div>
            </div>
            <div className="text-center p-6 bg-bg-card rounded-xl border border-border hover:border-primary/50 transition-all duration-300">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-text-muted">satisfaction</div>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="relative">
            <div className="bg-bg-card rounded-2xl border border-border p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">
                    ₹12,500
                  </div>
                  <div className="text-sm text-text-muted">
                    Total sent this month
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users2 className="w-8 h-8 text-success" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">
                    8 Members
                  </div>
                  <div className="text-sm text-text-muted">
                    Active participants
                  </div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PiggyBank className="w-8 h-8 text-warning" />
                  </div>
                  <div className="text-2xl font-bold text-text mb-1">
                    ₹45,000
                  </div>
                  <div className="text-sm text-text-muted">Total saved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
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
                  className="card p-8 hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              How FamilyPay Works
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Get started in minutes and start managing your family finances
              better than ever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary via-secondary to-primary transform -translate-y-1/2"></div>

            {/* Step 1 */}
            <div className="text-center relative group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  1
                </div>
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Create Account
              </h3>
              <p className="text-text-muted leading-relaxed">
                Sign up in seconds with your email or phone number. No credit
                card required.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary-dark rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <Users2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  2
                </div>
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Invite Family
              </h3>
              <p className="text-text-muted leading-relaxed">
                Add family members to your circle and set permissions for
                everyone.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative group">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-success to-success-dark rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-success rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">
                Start Managing
              </h3>
              <p className="text-text-muted leading-relaxed">
                Send money, track expenses, and reach your financial goals
                together.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Ready to get started?
            </div>
            <button
              onClick={handleGetStarted}
              className="btn btn-primary btn-lg flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Choose the plan that works best for your family. Start free,
              upgrade anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-bg-elevated rounded-lg p-1 inline-flex shadow-lg">
              <button
                onClick={() => setActiveTab("personal")}
                className={`px-8 py-3 rounded-md transition-all duration-300 ${
                  activeTab === "personal"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Personal
              </button>
              <button
                onClick={() => setActiveTab("business")}
                className={`px-8 py-3 rounded-md transition-all duration-300 ${
                  activeTab === "business"
                    ? "bg-primary text-white shadow-md"
                    : "text-text-muted hover:text-text"
                }`}
              >
                Business
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`card p-8 relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.recommended
                    ? "border-2 border-primary ring-4 ring-primary/20 shadow-2xl"
                    : "border border-border hover:border-primary/50"
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">
                      {plan.price}
                    </span>
                    {plan.price !== "Free" && (
                      <span className="text-text-muted">/month</span>
                    )}
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-text">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={handleGetStarted}
                  className={`w-full btn ${
                    plan.recommended
                      ? "btn-primary shadow-lg hover:shadow-xl"
                      : "btn-secondary"
                  } transition-all duration-300 transform hover:-translate-y-1`}
                >
                  {plan.price === "Free" ? "Get Started" : "Start Free Trial"}
                </button>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-success/10 text-success px-6 py-3 rounded-full text-sm font-medium">
              <ShieldCheck className="w-4 h-4" />
              14-day free trial • No credit card required • Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-bl from-primary/5 to-secondary/5"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
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
              <div
                key={index}
                className="card p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-warning fill-warning"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-text-muted mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-text">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-text-muted">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>

        <div className="max-w-4xl mx-auto relative">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Family's Finances?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join millions of families who trust FamilyPay for their financial
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="btn bg-white text-primary hover:bg-gray-100 btn-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="btn bg-white/20 text-white border border-white/30 hover:bg-white/30 btn-lg backdrop-blur-sm transition-all duration-300">
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
                  <button
                    onClick={() => scrollToSection("features")}
                    className="text-text-muted hover:text-text"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("pricing")}
                    className="text-text-muted hover:text-text"
                  >
                    Pricing
                  </button>
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
