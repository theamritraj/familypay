import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Calendar,
  User,
  Tag,
  Search,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  BookOpen,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Star,
} from "lucide-react";

const BlogPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchTerm, selectedCategory, setSearchParams]);

  // Mock blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "5 Smart Ways to Teach Kids About Money Management",
      excerpt: "Discover practical strategies to help your children develop healthy financial habits from an early age.",
      content: "Teaching children about money is one of the most valuable life skills parents can impart...",
      author: "Sarah Johnson",
      authorRole: "Family Finance Expert",
      date: "2024-01-15",
      readTime: "5 min read",
      category: "Family Finance",
      tags: ["Kids", "Education", "Money Management"],
      image: "🏦",
      featured: true,
      likes: 234,
      comments: 45,
      shares: 89,
    },
    {
      id: 2,
      title: "How Family Budgeting Apps Are Changing Household Finance",
      excerpt: "Explore the revolutionary impact of digital budgeting tools on modern family financial management.",
      content: "The landscape of family finance has undergone a dramatic transformation in recent years...",
      author: "Michael Chen",
      authorRole: "Tech Finance Analyst",
      date: "2024-01-12",
      readTime: "7 min read",
      category: "Technology",
      tags: ["Apps", "Budgeting", "Digital Finance"],
      image: "📱",
      featured: true,
      likes: 189,
      comments: 32,
      shares: 67,
    },
    {
      id: 3,
      title: "Setting Financial Goals as a Family: A Complete Guide",
      excerpt: "Learn how to set and achieve financial goals together as a family unit for maximum success.",
      content: "Financial goal setting becomes exponentially more powerful when done as a family...",
      author: "Emma Davis",
      authorRole: "Financial Planner",
      date: "2024-01-10",
      readTime: "8 min read",
      category: "Planning",
      tags: ["Goals", "Family", "Planning"],
      image: "🎯",
      featured: false,
      likes: 156,
      comments: 28,
      shares: 54,
    },
    {
      id: 4,
      title: "The Psychology of Family Spending: Understanding Your Habits",
      excerpt: "Deep dive into the psychological factors that influence family spending patterns and how to optimize them.",
      content: "Understanding the psychology behind spending decisions can transform your family's financial health...",
      author: "Dr. Alex Kumar",
      authorRole: "Behavioral Economist",
      date: "2024-01-08",
      readTime: "10 min read",
      category: "Psychology",
      tags: ["Psychology", "Spending", "Habits"],
      image: "🧠",
      featured: false,
      likes: 203,
      comments: 41,
      shares: 78,
    },
    {
      id: 5,
      title: "Emergency Fund Essentials: Every Family's Safety Net",
      excerpt: "Why emergency funds are crucial for family financial security and how to build one effectively.",
      content: "An emergency fund is the foundation of any solid financial plan, especially for families...",
      author: "Lisa Wang",
      authorRole: "Certified Financial Advisor",
      date: "2024-01-05",
      readTime: "6 min read",
      category: "Savings",
      tags: ["Emergency Fund", "Savings", "Security"],
      image: "🛡️",
      featured: false,
      likes: 178,
      comments: 35,
      shares: 92,
    },
    {
      id: 6,
      title: "Teaching Teens About Credit: A Parent's Guide",
      excerpt: "Help your teenagers understand credit cards, credit scores, and responsible credit usage.",
      content: "As teenagers approach adulthood, understanding credit becomes increasingly important...",
      author: "Robert Martinez",
      authorRole: "Credit Education Specialist",
      date: "2024-01-03",
      readTime: "7 min read",
      category: "Education",
      tags: ["Teens", "Credit", "Education"],
      image: "💳",
      featured: false,
      likes: 145,
      comments: 29,
      shares: 61,
    },
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'family-finance', name: 'Family Finance', count: 1 },
    { id: 'technology', name: 'Technology', count: 1 },
    { id: 'planning', name: 'Planning', count: 1 },
    { id: 'psychology', name: 'Psychology', count: 1 },
    { id: 'savings', name: 'Savings', count: 1 },
    { id: 'education', name: 'Education', count: 1 },
  ];

  // Filter posts
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const handlePostClick = (postId) => {
    navigate(`/blog/${postId}`);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

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
                  onClick={() => navigate("/about")}
                  className="text-text-muted hover:text-text transition-colors"
                >
                  About
                </button>
                <button className="text-primary font-medium">
                  Blog
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
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text mb-6">
              FamilyPay <span className="text-primary">Blog</span>
            </h1>
            <p className="text-xl text-text-muted max-w-3xl mx-auto leading-relaxed">
              Insights, tips, and stories to help your family achieve financial wellness together.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-bg-elevated border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-text placeholder-text-muted"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary px-6 py-2"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Filters and Categories */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-bg-elevated text-text-muted hover:text-text border border-border hover:border-primary/50'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">({category.count})</span>
                </button>
              ))}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 btn btn-secondary"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-text-muted">
              Showing {currentPosts.length} of {filteredPosts.length} articles
            </p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-text-muted hover:text-text">
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button className="flex items-center gap-2 text-text-muted hover:text-text">
                <Clock className="w-4 h-4" />
                Recent
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {currentPosts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text mb-2">No articles found</h3>
              <p className="text-text-muted mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setCurrentPage(1);
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentPosts.map((post) => (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post.id)}
                  className="card p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="inline-flex items-center gap-1 bg-warning/10 text-warning px-3 py-1 rounded-full text-xs font-medium mb-4">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Post Image */}
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {post.image}
                  </div>

                  {/* Category */}
                  <div className="mb-3">
                    <span className="text-xs font-medium text-primary uppercase tracking-wide">
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-text-muted mb-4 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-bg-elevated text-text-muted px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>

                  {/* Author */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm">
                        👤
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{post.author}</p>
                        <p className="text-xs text-text-muted">{post.authorRole}</p>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {post.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.comments}
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-4 h-4" />
                      {post.shares}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-bg-card">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-primary text-white'
                        : 'bg-bg-elevated text-text-muted hover:text-text hover:border-primary/50 border border-border'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get the latest family finance tips and insights delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="btn bg-white text-primary hover:bg-gray-100 px-6 py-3">
                Subscribe
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
                  <button className="text-primary font-medium">
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
                <BookOpen className="w-5 h-5 text-text-muted" />
                <MessageCircle className="w-5 h-5 text-text-muted" />
                <Share2 className="w-5 h-5 text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
