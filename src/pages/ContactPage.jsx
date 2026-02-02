import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Globe,
  Building,
  Users,
  Zap,
  Shield,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

const ContactPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general',
  });
  const [formStatus, setFormStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus('');

    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general',
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email",
      contact: "support@familypay.com",
      action: "Email us",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us for immediate help",
      contact: "+1 (555) 123-4567",
      action: "Call now",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available 24/7",
      action: "Start chat",
      color: "text-info",
      bgColor: "bg-info/10",
    },
  ];

  const officeLocations = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Market Street, Suite 100",
      phone: "+1 (555) 123-4567",
      email: "sf@familypay.com",
      image: "🌉",
    },
    {
      city: "New York",
      country: "United States",
      address: "456 Broadway, Floor 12",
      phone: "+1 (555) 987-6543",
      email: "ny@familypay.com",
      image: "🗽",
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "789 Oxford Street",
      phone: "+44 20 7123 4567",
      email: "london@familypay.com",
      image: "🎡",
    },
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page and follow the instructions sent to your email.",
    },
    {
      question: "Is FamilyPay available in my country?",
      answer: "FamilyPay is available in 50+ countries worldwide. Check our app store for availability in your region.",
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach us via email at support@familypay.com, phone at +1 (555) 123-4567, or live chat 24/7.",
    },
    {
      question: "What payment methods are supported?",
      answer: "We support all major UPI apps, credit/debit cards, and bank transfers.",
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
                <img src="/logo.jpeg" alt="FamilyPay" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-text">FamilyPay</span>
              </div>
              <div className="hidden md:flex items-center gap-6">
                <button onClick={() => navigate("/")} className="text-text-muted hover:text-text">Home</button>
                <button onClick={() => navigate("/about")} className="text-text-muted hover:text-text">About</button>
                <button onClick={() => navigate("/blog")} className="text-text-muted hover:text-text">Blog</button>
                <button onClick={() => navigate("/careers")} className="text-text-muted hover:text-text">Careers</button>
                <button className="text-primary font-medium">Contact</button>
              </div>
            </div>
            <button onClick={() => navigate("/")} className="btn btn-primary">Back to Home</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="max-w-7xl mx-auto relative text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            We're here to help. Reach out to our team for any questions, support, or feedback.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">How Can We Help?</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Choose the best way to reach us based on your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="card p-8 text-center hover:shadow-lg transition-all duration-300">
                  <div className={`w-20 h-20 ${method.bgColor} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className={`w-10 h-10 ${method.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-text mb-2">{method.title}</h3>
                  <p className="text-text-muted mb-4">{method.description}</p>
                  <p className="text-primary font-medium mb-4">{method.contact}</p>
                  <button className="btn btn-primary w-full">{method.action}</button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Send Us a Message</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="bg-bg-card rounded-2xl p-8 border border-border">
            {formStatus === 'success' && (
              <div className="mb-6 p-4 bg-success/10 border border-success/20 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-success">Thank you for your message! We'll get back to you soon.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feedback">Feedback</option>
                    <option value="partnership">Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Visit Our Offices</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Find us at our global locations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <div key={index} className="card p-6 hover:shadow-lg transition-all duration-300">
                <div className="text-4xl mb-4">{office.image}</div>
                <h3 className="text-xl font-semibold text-text mb-2">{office.city}</h3>
                <p className="text-text-muted mb-4">{office.country}</p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-muted">{office.address}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-muted">{office.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-muted">{office.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              Quick answers to common questions.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-text mb-2">{faq.question}</h3>
                <p className="text-text-muted">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn btn-secondary">
              View All FAQs
              <ExternalLink className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <Headphones className="w-16 h-16 text-white mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">24/7 Support Available</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Our support team is always here to help you with any questions or issues.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <Clock className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <h3 className="text-white font-semibold">24/7 Live Chat</h3>
                <p className="text-white/70 text-sm">Instant support</p>
              </div>
              <div className="text-center">
                <Phone className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Phone Support</h3>
                <p className="text-white/70 text-sm">Mon-Fri, 9AM-6PM</p>
              </div>
              <div className="text-center">
                <Mail className="w-8 h-8 text-white/80 mx-auto mb-2" />
                <h3 className="text-white font-semibold">Email Support</h3>
                <p className="text-white/70 text-sm">Within 24 hours</p>
              </div>
            </div>
            <button className="btn bg-white text-primary hover:bg-gray-100 btn-lg">
              Start Live Chat
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg-elevated border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.jpeg" alt="FamilyPay" className="w-8 h-8 rounded-lg" />
                <span className="text-xl font-bold text-text">FamilyPay</span>
              </div>
              <p className="text-text-muted">The modern way to manage family finances together.</p>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Company</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/about")} className="text-text-muted hover:text-text">About</button></li>
                <li><button onClick={() => navigate("/careers")} className="text-text-muted hover:text-text">Careers</button></li>
                <li><button onClick={() => navigate("/blog")} className="text-text-muted hover:text-text">Blog</button></li>
                <li><button className="text-primary font-medium">Contact</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Product</h4>
              <ul className="space-y-2">
                <li><button onClick={() => navigate("/#features")} className="text-text-muted hover:text-text">Features</button></li>
                <li><button onClick={() => navigate("/#pricing")} className="text-text-muted hover:text-text">Pricing</button></li>
                <li><button onClick={() => navigate("/api")} className="text-text-muted hover:text-text">API</button></li>
                <li><button onClick={() => navigate("/help")} className="text-text-muted hover:text-text">Help Center</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-text mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-text-muted hover:text-text">Privacy Policy</a></li>
                <li><a href="#" className="text-text-muted hover:text-text">Terms of Service</a></li>
                <li><a href="#" className="text-text-muted hover:text-text">Security</a></li>
                <li><a href="#" className="text-text-muted hover:text-text">Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-text-muted text-sm">© 2024 FamilyPay. All rights reserved.</p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <Mail className="w-5 h-5 text-text-muted" />
                <Phone className="w-5 h-5 text-text-muted" />
                <Headphones className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;
