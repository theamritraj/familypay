import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  TrendingUp,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Star,
  ArrowRight,
  CheckCircle,
  Zap,
  Clock,
  Users2,
  Building,
  Briefcase,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

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
    }
  };

  // Timeline data
  const milestones = [
    {
      year: "2020",
      title: "FamilyPay Founded",
      description: "Started with a simple mission: to help families manage their finances together.",
      icon: Calendar,
    },
    {
      year: "2021",
      title: "100K Users Milestone",
      description: "Reached our first major milestone with 100,000 families trusting FamilyPay.",
      icon: Users,
    },
    {
      year: "2022",
      title: "Series A Funding",
      description: "Secured $10M in Series A funding to expand our team and features.",
      icon: TrendingUp,
    },
    {
      year: "2023",
      title: "International Expansion",
      description: "Launched in 15+ countries, serving families worldwide.",
      icon: Globe,
    },
    {
      year: "2024",
      title: "2.5M+ Users",
      description: "Now serving over 2.5 million families with 10M+ transactions processed.",
      icon: Award,
    },
  ];

  // Team data
  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "👩‍💼",
      bio: "Former fintech executive with 15+ years experience in digital payments.",
    },
    {
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      image: "👨‍💻",
      bio: "Ex-Google engineer specializing in scalable financial systems.",
    },
    {
      name: "Emma Davis",
      role: "Head of Product",
      image: "👩‍🎨",
      bio: "Product design expert with passion for user-centric financial solutions.",
    },
    {
      name: "Alex Kumar",
      role: "Head of Engineering",
      image: "👨‍🔬",
      bio: "Security-focused engineer with expertise in fintech infrastructure.",
    },
  ];

  // Values data
  const values = [
    {
      icon: Heart,
      title: "Family First",
      description: "Everything we build is designed to bring families closer together through better financial management.",
    },
    {
      icon: Shield,
      title: "Security & Trust",
      description: "Bank-level security and transparency in everything we do. Your family's financial data is sacred.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly pushing boundaries to create innovative solutions for modern family finance challenges.",
    },
    {
      icon: Users2,
      title: "Community",
      description: "Building a global community of families who support and learn from each other.",
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full transition-all duration-300 z-50 ${
        scrolled ? 'bg-bg/95 backdrop-blur-sm border-b border-border' : 'bg-bg/80 backdrop-blur-sm'
      }`}>
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
                <button
                  onClick={() => navigate("/")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => scrollToSection("mission")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Mission
                </button>
                <button
                  onClick={() => scrollToSection("team")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Team
                </button>
                <button
                  onClick={() => scrollToSection("milestones")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Milestones
                </button>
                <button
                  onClick={() => scrollToSection("values")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  Values
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
              About <span className="text-primary">FamilyPay</span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              We're on a mission to help families worldwide manage their finances together, 
              build stronger relationships, and achieve their financial goals.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">2.5M+</div>
              <div className="text-sm text-text-muted">Families</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-text-muted">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">10M+</div>
              <div className="text-sm text-text-muted">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-text-muted">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-text-muted mb-6 leading-relaxed">
                At FamilyPay, we believe that managing money shouldn't be a source of stress 
                for families. Our mission is to create simple, secure, and collaborative financial 
                tools that bring families closer together.
              </p>
              <p className="text-lg text-text-muted mb-8 leading-relaxed">
                We're building a world where every family can achieve financial wellness together, 
                regardless of their background or financial situation.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text mb-1">Simplicity First</h3>
                    <p className="text-text-muted">Complex financial tools made simple for everyone.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text mb-1">Security Always</h3>
                    <p className="text-text-muted">Bank-level security to protect your family's data.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-text mb-1">Together Forever</h3>
                    <p className="text-text-muted">Building tools that strengthen family bonds.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 border border-border">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Vision</div>
                    <div className="text-sm text-text-muted">Financial wellness for every family</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-secondary" />
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Values</div>
                    <div className="text-sm text-text-muted">Trust, security, collaboration</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Community</div>
                    <div className="text-sm text-text-muted">2.5M+ families worldwide</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Zap className="w-8 h-8 text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-text mb-1">Impact</div>
                    <div className="text-sm text-text-muted">10M+ transactions processed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Passionate individuals dedicated to helping families achieve financial wellness together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  {member.image}
                </div>
                <h3 className="text-xl font-semibold text-text mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-text-muted text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section id="milestones" className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              From a simple idea to serving millions of families worldwide.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary via-secondary to-primary"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const Icon = milestone.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`relative flex items-center ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                      <div className="bg-bg-elevated rounded-xl p-6 border border-border hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-3 md:justify-end">
                          <Icon className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium text-primary">{milestone.year}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-text mb-2">{milestone.title}</h3>
                        <p className="text-text-muted">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary rounded-full flex items-center justify-center border-4 border-bg-card shadow-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="w-full md:w-1/2"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">
              Our Values
            </h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              The principles that guide everything we do at FamilyPay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-3">{value.title}</h3>
                  <p className="text-text-muted leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Join Our Mission
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Be part of the family that's revolutionizing how families manage their finances together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="btn bg-white text-primary hover:bg-gray-100 btn-lg flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/careers")}
                className="btn bg-white/20 text-white border border-white/30 hover:bg-white/30 btn-lg backdrop-blur-sm"
              >
                Join Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-elevated border-t border-border py-12 px-4 sm:px-6 lg:px-8">
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
              <h4 className="font-semibold text-text mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/about")} className="text-text-muted hover:text-text">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/careers")} className="text-text-muted hover:text-text">
                    Careers
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/blog")} className="text-text-muted hover:text-text">
                    Blog
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/contact")} className="text-text-muted hover:text-text">
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate("/#features")} className="text-text-muted hover:text-text">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/#pricing")} className="text-text-muted hover:text-text">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/api")} className="text-text-muted hover:text-text">
                    API
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate("/help")} className="text-text-muted hover:text-text">
                    Help Center
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Legal</h4>
              <ul className="space-y-2">
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
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="text-text-muted hover:text-text">
                    Compliance
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
                <Mail className="w-5 h-5 text-text-muted" />
                <Phone className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
