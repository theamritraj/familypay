import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Building,
  Heart,
  Shield,
  Zap,
  Award,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
  Send,
} from "lucide-react";

const CareersPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jobListings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "We're looking for a skilled Frontend Developer to join our engineering team.",
      posted: "2 days ago",
      featured: true,
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100k - $150k",
      description: "Join our product team to help shape the future of family financial management.",
      posted: "1 week ago",
      featured: true,
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      salary: "$90k - $130k",
      description: "Create beautiful and intuitive designs that help families manage their finances better.",
      posted: "3 days ago",
      featured: false,
    },
  ];

  const filteredJobs = jobListings.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department.toLowerCase() === selectedDepartment;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

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
                <button className="text-primary font-medium">Careers</button>
                <button onClick={() => navigate("/contact")} className="text-text-muted hover:text-text">Contact</button>
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
            Join Our <span className="text-primary">Team</span>
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Help us build the future of family finance. We're looking for talented individuals 
            who are passionate about making a difference.
          </p>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Why Join FamilyPay?</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">
              We offer more than just a job – we offer a chance to make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Meaningful Work</h3>
              <p className="text-text-muted">Help millions of families achieve financial wellness.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-success/20 to-success/40 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Amazing Team</h3>
              <p className="text-text-muted">Work with talented, passionate people.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-warning/20 to-warning/40 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-10 h-10 text-warning" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Growth Opportunities</h3>
              <p className="text-text-muted">Learn, grow, and advance your career.</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-info/20 to-info/40 rounded-xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-info" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-3">Great Benefits</h3>
              <p className="text-text-muted">Comprehensive benefits package.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-text mb-4">Open Positions</h2>
            <p className="text-xl text-text-muted max-w-3xl mx-auto">Find your next opportunity with us.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search positions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
                />
              </div>
            </div>

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 bg-bg-elevated border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-text"
            >
              <option value="all">All Departments</option>
              <option value="engineering">Engineering</option>
              <option value="product">Product</option>
              <option value="design">Design</option>
            </select>
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="card p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-6 h-6 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-text">{job.title}</h3>
                          {job.featured && (
                            <span className="px-2 py-1 bg-warning/10 text-warning text-xs font-medium rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <p className="text-text-muted mb-3">{job.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted">
                          <div className="flex items-center gap-1">
                            <Building className="w-4 h-4" />
                            {job.department}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {job.posted}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      className="btn btn-secondary"
                    >
                      {expandedJob === job.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      Details
                    </button>
                    <button className="btn btn-primary">Apply Now</button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedJob === job.id && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-text-muted">
                      Join our team and help us revolutionize family finance. We offer competitive compensation, 
                      comprehensive benefits, and a supportive work environment where you can grow your career.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Don't See the Right Fit?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              We're always looking for talented people. Send us your resume and we'll keep you in mind for future opportunities.
            </p>
            <button className="btn bg-white text-primary hover:bg-gray-100 btn-lg">
              Send Resume
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
                <li><button onClick={() => navigate("/careers")} className="text-primary font-medium">Careers</button></li>
                <li><button onClick={() => navigate("/blog")} className="text-text-muted hover:text-text">Blog</button></li>
                <li><button onClick={() => navigate("/contact")} className="text-text-muted hover:text-text">Contact</button></li>
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
                <Heart className="w-5 h-5 text-text-muted" />
                <Users className="w-5 h-5 text-text-muted" />
                <Briefcase className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CareersPage;
