import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  User,
  Clock,
  ArrowLeft,
  ArrowRight,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Tag,
  Facebook,
  Twitter,
  Linkedin,
  Link,
  CheckCircle,
  Send,
} from "lucide-react";

const BlogPostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [scrolled, setScrolled] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock blog post data (in real app, this would come from API)
  const blogPost = {
    id: postId,
    title: "5 Smart Ways to Teach Kids About Money Management",
    excerpt: "Discover practical strategies to help your children develop healthy financial habits from an early age.",
    content: `
# 5 Smart Ways to Teach Kids About Money Management

Teaching children about money is one of the most valuable life skills parents can impart. In today's complex financial world, starting early with the right approach can set your children up for a lifetime of financial success.

## Why Financial Education Matters

Financial literacy isn't just about knowing how to save – it's about understanding the value of money, making informed decisions, and developing habits that will serve children well into adulthood. Studies show that children who learn about money management early are more likely to become financially responsible adults.

## 1. Start with Allowances and Budgeting

**Age Group:** 5-8 years

Begin with a simple allowance system that teaches basic budgeting concepts. Divide their allowance into three clear categories:

- **Saving (40%)**: For long-term goals
- **Spending (40%)**: For immediate wants
- **Giving (20%)**: For charitable causes

Use clear jars or digital apps to help them visualize where their money goes. This tangible approach makes abstract concepts concrete.

## 2. Introduce Smart Shopping Habits

**Age Group:** 8-12 years

Take your children shopping and involve them in decision-making processes:

- Compare prices between brands
- Use coupons and explain discounts
- Discuss needs versus wants
- Set shopping budgets and stick to them

These real-world experiences teach valuable lessons about value, comparison shopping, and delayed gratification.

## 3. Open a Bank Account Together

**Age Group:** 10-14 years

Opening their first bank account is a significant milestone. Use this opportunity to teach:

- How banks work
- The concept of interest
- Digital banking safety
- The importance of saving

Many banks offer special accounts for minors with no minimum balance requirements and educational resources.

## 4. Introduce Investment Concepts

**Age Group:** 13-16 years

As teenagers become more sophisticated, introduce basic investment concepts:

- Explain stocks, bonds, and mutual funds
- Discuss risk and return
- Use investment apps designed for teens
- Set up a custodial investment account

Consider using a small amount of money to practice investing with real (but supervised) market experience.

## 5. Teach Credit and Debt Management

**Age Group:** 16-18 years

Before they leave home, ensure they understand:

- How credit cards work
- The importance of credit scores
- The dangers of debt
- Responsible borrowing

Consider adding them as authorized users on your credit card with strict limits to help them build credit history under supervision.

## Making It Fun and Engaging

### Gamification
Turn financial learning into games:
- Board games like Monopoly or The Game of Life
- Apps that teach financial concepts
- Family financial challenges with rewards

### Real-World Applications
Connect lessons to their interests:
- If they love gaming, discuss in-game purchases and value
- For sports fans, explore athlete finances and contracts
- Music lovers can learn about the business side of the industry

## Common Mistakes to Avoid

1. **Being too abstract** - Use concrete examples and real money
2. **Overcomplicating concepts** - Start simple and build complexity gradually
3. **Not practicing what you preach** - Model good financial behavior
4. **Making it stressful** - Keep lessons positive and encouraging
5. **Waiting too long** - Start as early as possible with age-appropriate concepts

## Tools and Resources

### Apps for Kids
- **Greenlight**: Debit card and app for kids with parental controls
- **GoHenry**: Similar to Greenlight, with educational content
- **FamZoo**: Virtual family bank for teaching money management

### Books and Resources
- "The Opposite of Spoiled" by Ron Lieber
- "Smart Money Smart Kids" by Dave Ramsey
- Junior Achievement programs
- Local bank educational programs

## Conclusion

Teaching kids about money management is a marathon, not a sprint. Start early, be consistent, and adapt your approach as they grow. The financial habits you help them build today will serve them for the rest of their lives.

Remember, every family is different, so find what works for yours. The most important thing is to start the conversation and keep it going as your children grow and develop.

**What age did you start teaching your kids about money? Share your experiences in the comments below!**
    `,
    author: "Sarah Johnson",
    authorRole: "Family Finance Expert",
    authorBio: "Sarah is a certified financial planner with over 15 years of experience helping families build wealth and teach financial literacy to children.",
    date: "2024-01-15",
    readTime: "8 min read",
    category: "Family Finance",
    tags: ["Kids", "Education", "Money Management", "Parenting", "Financial Literacy"],
    image: "🏦",
    featured: true,
    likes: 234,
    comments: 45,
    shares: 89,
    views: 1523,
  };

  // Related posts
  const relatedPosts = [
    {
      id: 2,
      title: "Setting Financial Goals as a Family: A Complete Guide",
      excerpt: "Learn how to set and achieve financial goals together as a family unit.",
      author: "Emma Davis",
      date: "2024-01-10",
      readTime: "8 min read",
      image: "🎯",
    },
    {
      id: 3,
      title: "Emergency Fund Essentials: Every Family's Safety Net",
      excerpt: "Why emergency funds are crucial for family financial security.",
      author: "Lisa Wang",
      date: "2024-01-05",
      readTime: "6 min read",
      image: "🛡️",
    },
    {
      id: 4,
      title: "Teaching Teens About Credit: A Parent's Guide",
      excerpt: "Help your teenagers understand credit cards and responsible usage.",
      author: "Robert Martinez",
      date: "2024-01-03",
      readTime: "7 min read",
      image: "💳",
    },
  ];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = blogPost.title;
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const handleRelatedPostClick = (postId) => {
    navigate(`/blog/${postId}`);
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
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/blog")}
                className="btn btn-secondary"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Article Header */}
      <article className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Category */}
          <div className="mb-4">
            <span className="text-sm font-medium text-primary uppercase tracking-wide">
              {blogPost.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-text mb-6 leading-tight">
            {blogPost.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-text-muted mb-8 leading-relaxed">
            {blogPost.excerpt}
          </p>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-text-muted mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(blogPost.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {blogPost.readTime}
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {blogPost.views} views
            </div>
          </div>

          {/* Author Info */}
          <div className="flex items-start gap-4 mb-8 pb-8 border-b border-border">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl">
              👤
            </div>
            <div className="flex-1">
              <div>
                <h3 className="font-semibold text-text">{blogPost.author}</h3>
                <p className="text-sm text-text-muted">{blogPost.authorRole}</p>
              </div>
              <p className="text-text-muted mt-2 text-sm">{blogPost.authorBio}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogPost.tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 text-sm bg-bg-elevated text-text-muted px-3 py-1 rounded-full"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Article Content */}
      <section className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg prose-invert max-w-none">
            {/* Featured Image */}
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center text-6xl mx-auto mb-8">
              {blogPost.image}
            </div>

            {/* Article Content */}
            <div 
              className="text-text leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: blogPost.content.replace(/\n/g, '<br>').replace(/#{1,6}\s/g, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>') }}
            />
          </div>
        </div>
      </section>

      {/* Engagement Bar */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Like, Comment, Share */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  liked 
                    ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                    : 'bg-bg-elevated text-text-muted hover:text-text border border-border'
                }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                {blogPost.likes + (liked ? 1 : 0)}
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-bg-elevated text-text-muted hover:text-text rounded-lg border border-border transition-all duration-300">
                <MessageCircle className="w-4 h-4" />
                {blogPost.comments}
              </button>
              
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  bookmarked 
                    ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20' 
                    : 'bg-bg-elevated text-text-muted hover:text-text border border-border'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                Save
              </button>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleShare('facebook')}
                className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleShare('linkedin')}
                className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button
                onClick={handleCopyLink}
                className="w-10 h-10 bg-bg-elevated text-text-muted hover:text-text rounded-lg flex items-center justify-center border border-border transition-all duration-300"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-success" /> : <Link className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text mb-4">Related Articles</h2>
            <p className="text-xl text-text-muted">
              Continue reading about family finance and money management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => handleRelatedPostClick(post.id)}
                className="card p-6 cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {post.image}
                </div>

                <h3 className="text-xl font-semibold text-text mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-text-muted mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-text-muted">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-bg-card">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Enjoyed this article?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Get more family finance tips and insights delivered straight to your inbox.
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
                  <button onClick={() => navigate("/blog")} className="text-primary font-medium">
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
                <Heart className="w-5 h-5 text-text-muted" />
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

export default BlogPostPage;
