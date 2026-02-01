import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { mockAPI, mockCircle } from "../services/mockData";
import AddMemberModal from "../components/AddMemberModal";
import SetLimitModal from "../components/SetLimitModal";
import AdminSidebar from "../components/AdminSidebar";
import BottomNav from "../components/BottomNav";
import { Menu, Sun, Moon, Bell, Search, User, ChevronDown } from "lucide-react";

const PrimaryDashboard = () => {
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [circle, setCircle] = useState(mockCircle);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const loadDashboardData = async () => {
    try {
      const [circleRes, pendingRes] = await Promise.all([
        mockAPI.getCircle(),
        mockAPI.getPendingPayments(),
      ]);

      setCircle(circleRes.data.data);
      setPendingPayments(pendingRes.data.data);
      setLoading(false);
    } catch {
      console.error("Error loading dashboard");
      setLoading(false);
    }
  };

  const handleApprovePayment = async (transactionId, approved) => {
    try {
      await mockAPI.approvePayment(transactionId, approved);
      loadDashboardData();
    } catch {
      alert("Failed to process payment");
    }
  };

  const handleUpdateLimit = async (memberId, limits) => {
    try {
      // Update mock data
      const member = circle.members.find((m) => m.id === memberId);
      if (member) {
        member.dailyLimit = limits.dailyLimit;
        member.monthlyLimit = limits.monthlyLimit;
        setCircle({ ...circle });
      }
      setSelectedMember(null);
    } catch {
      throw new Error("Failed to update limits");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [circleRes, pendingRes] = await Promise.all([
          mockAPI.getCircle(),
          mockAPI.getPendingPayments(),
        ]);

        if (isMounted) {
          setCircle(circleRes.data.data);
          setPendingPayments(pendingRes.data.data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          console.error("Error loading dashboard");
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0 lg:ml-20"}`}
      >
        {/* Top Navigation Bar */}
        <header className="bg-bg-card border-b border-border sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                {/* Hamburger Menu */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-bg-elevated lg:hidden transition-colors"
                >
                  <Menu className="w-5 h-5 text-text" />
                </button>

                {/* Search Bar */}
                <div className="hidden md:flex items-center bg-bg-elevated rounded-lg px-3 py-2 w-64 lg:w-96">
                  <Search className="w-4 h-4 text-text-muted mr-2" />
                  <input
                    type="text"
                    placeholder="Search transactions, members..."
                    className="bg-transparent border-0 outline-none text-text placeholder-text-muted flex-1 text-sm"
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                  title="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun className="w-5 h-5 text-warning" />
                  ) : (
                    <Moon className="w-5 h-5 text-text-muted" />
                  )}
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-lg hover:bg-bg-elevated transition-colors relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5 text-text" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-bg-card border border-border rounded-lg shadow-lg">
                      <div className="p-4 border-b border-border">
                        <h3 className="font-semibold text-text">
                          Notifications
                        </h3>
                        <span className="text-xs text-text-muted">3 new</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {[
                          {
                            id: 1,
                            title: "Payment Pending",
                            message: "Rajnish requested ₹2,850 for groceries",
                            time: "2 minutes ago",
                            read: false,
                          },
                          {
                            id: 2,
                            title: "Limit Reached",
                            message: "Sangam reached 80% of daily limit",
                            time: "1 hour ago",
                            read: false,
                          },
                          {
                            id: 3,
                            title: "Payment Completed",
                            message: "Raveena paid electricity bill",
                            time: "3 hours ago",
                            read: true,
                          },
                        ].map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 hover:bg-bg-elevated cursor-pointer border-b border-border last:border-b-0 ${!notification.read ? "bg-primary/5" : ""}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                              <div className="flex-1">
                                <div className="font-medium text-text text-sm">
                                  {notification.title}
                                </div>
                                <div className="text-xs text-text-muted">
                                  {notification.message}
                                </div>
                                <div className="text-xs text-text-muted mt-1">
                                  {notification.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-border">
                        <button className="text-sm text-primary hover:text-primary/80">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-bg-elevated transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-text">
                        {user?.name || "Admin"}
                      </div>
                      <div className="text-xs text-text-muted">
                        {user?.email || "admin@familypay.com"}
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-text-muted" />
                  </button>

                  {/* Profile Dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-bg-card border border-border rounded-lg shadow-lg">
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <div>
                            <div className="font-medium text-text">
                              {user?.name || "Admin"}
                            </div>
                            <div className="text-sm text-text-muted">
                              {user?.email || "admin@familypay.com"}
                            </div>
                            <div className="text-xs text-success">
                              Administrator
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <button className="w-full text-left px-4 py-2 text-sm text-text hover:bg-bg-elevated transition-colors">
                          Profile Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-text hover:bg-bg-elevated transition-colors">
                          Account Settings
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-text hover:bg-bg-elevated transition-colors">
                          Help & Support
                        </button>
                        <div className="border-t border-border my-2"></div>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="fixed top-16 left-0 right-0 bg-bg-card border-b border-border z-40 lg:hidden">
              <div className="p-4">
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 text-text hover:bg-bg-elevated rounded-lg">
                    Dashboard
                  </button>
                  <button className="w-full text-left px-4 py-2 text-text hover:bg-bg-elevated rounded-lg">
                    Family Members
                  </button>
                  <button className="w-full text-left px-4 py-2 text-text hover:bg-elevated rounded-lg">
                    Transactions
                  </button>
                  <button className="w-full text-left px-4 py-2 text-text hover:bg-elevated rounded-lg">
                    Analytics
                  </button>
                  <button className="w-full text-left px-4 py-2 text-text hover:bg-elevated rounded-lg">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <div className="p-6 pb-20 lg:pb-6">
          {/* Family Pay Statistics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Spending Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-primary text-sm font-medium">+12.5%</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">₹45,678</div>
                <div className="text-sm text-text-muted">Total Spending</div>
              </div>
            </div>

            {/* Family Members Card */}
            <div className="card bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 00-5.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-blue-500 text-sm font-medium">
                  4 members
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">4</div>
                <div className="text-sm text-text-muted">Family Members</div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="card bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7-8h18m-4 0v8m0 0v8m0-8h8m-9-4h1m-9-4v8m0 0v8"
                    />
                  </svg>
                </div>
                <span className="text-green-500 text-sm font-medium">
                  234 total
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">234</div>
                <div className="text-sm text-text-muted">Transactions</div>
              </div>
            </div>

            {/* Pending Approvals Card */}
            <div className="card bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-orange-500 text-sm font-medium">
                  3 pending
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">3</div>
                <div className="text-sm text-text-muted">Pending Approvals</div>
              </div>
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {/* New Customers */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">New Customers</div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">234</div>
              <div className="text-xs text-success">+12% from last month</div>
            </div>

            {/* Pending Orders */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">Pending Orders</div>
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-warning"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">45</div>
              <div className="text-xs text-warning">Requires attention</div>
            </div>

            {/* Completed Orders */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">Completed Orders</div>
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-success"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">522</div>
              <div className="text-xs text-success">+18% from last month</div>
            </div>

            {/* Revenue Today */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">Revenue Today</div>
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-info"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">₹8,450</div>
              <div className="text-xs text-success">+5.2% from yesterday</div>
            </div>

            {/* Avg Order Value */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">Avg Order Value</div>
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">₹1,234</div>
              <div className="text-xs text-success">+2.8% from last month</div>
            </div>

            {/* Customer Satisfaction */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-text-muted">Satisfaction</div>
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div className="text-xl font-bold text-text">4.8</div>
              <div className="text-xs text-success">+0.2 from last month</div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Monthly Goal Progress */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  🎯 Monthly Goal Progress
                </h3>
                <span className="text-sm text-text-muted">68% Complete</span>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: "Revenue Target",
                    current: 45000,
                    target: 66000,
                    percentage: 68,
                    color: "bg-green-500",
                  },
                  {
                    label: "New Customers",
                    current: 180,
                    target: 250,
                    percentage: 72,
                    color: "bg-blue-500",
                  },
                  {
                    label: "Orders Processed",
                    current: 420,
                    target: 500,
                    percentage: 84,
                    color: "bg-purple-500",
                  },
                  {
                    label: "Customer Retention",
                    current: 85,
                    target: 90,
                    percentage: 94,
                    color: "bg-orange-500",
                  },
                ].map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-text">{goal.label}</span>
                      <span className="text-text-muted">
                        {goal.current.toLocaleString()} /{" "}
                        {goal.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-bg-elevated rounded-full h-2">
                      <div
                        className={`${goal.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${goal.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📊 Performance Metrics
                </h3>
                <span className="text-sm text-success">Overall: +15.3%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    label: "Response Time",
                    value: "2.3s",
                    change: "-12%",
                    trend: "down",
                    color: "text-danger",
                  },
                  {
                    label: "Resolution Rate",
                    value: "94.2%",
                    change: "+5.8%",
                    trend: "up",
                    color: "text-success",
                  },
                  {
                    label: "Customer Score",
                    value: "8.7/10",
                    change: "+0.3",
                    trend: "up",
                    color: "text-success",
                  },
                  {
                    label: "System Uptime",
                    value: "99.8%",
                    change: "+0.1%",
                    trend: "up",
                    color: "text-success",
                  },
                ].map((metric, index) => (
                  <div
                    key={index}
                    className="p-3 bg-bg-elevated rounded-lg border border-border"
                  >
                    <div className="text-sm text-text-muted mb-1">
                      {metric.label}
                    </div>
                    <div className="text-lg font-bold text-text mb-1">
                      {metric.value}
                    </div>
                    <div className={`text-xs font-medium ${metric.color}`}>
                      {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Spending Overview Chart */}
            <div className="lg:col-span-2 card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  💰 Spending Overview
                </h3>
                <select className="btn btn-secondary btn-sm">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-64">
                <div className="flex items-end justify-between h-full px-2">
                  {[
                    { day: "Mon", amount: 2800, percentage: 70 },
                    { day: "Tue", amount: 3200, percentage: 80 },
                    { day: "Wed", amount: 2100, percentage: 52 },
                    { day: "Thu", amount: 3800, percentage: 95 },
                    { day: "Fri", amount: 2900, percentage: 72 },
                    { day: "Sat", amount: 3500, percentage: 87 },
                    { day: "Sun", amount: 1800, percentage: 45 },
                  ].map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="text-xs text-text-muted mb-1">
                        ₹{data.amount}
                      </div>
                      <div className="w-full bg-bg-elevated rounded-t-lg relative h-32 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-300"
                          style={{ height: `${data.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-muted mt-2">
                        {data.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📊 Category Distribution
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    category: "Food & Groceries",
                    amount: 12500,
                    percentage: 35,
                    color: "bg-green-500",
                  },
                  {
                    category: "Shopping",
                    amount: 8900,
                    percentage: 25,
                    color: "bg-blue-500",
                  },
                  {
                    category: "Bills & Utilities",
                    amount: 7200,
                    percentage: 20,
                    color: "bg-yellow-500",
                  },
                  {
                    category: "Transport",
                    amount: 5400,
                    percentage: 15,
                    color: "bg-purple-500",
                  },
                  {
                    category: "Entertainment",
                    amount: 1800,
                    percentage: 5,
                    color: "bg-pink-500",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src="/logo.jpeg"
                        alt="FamilyPay"
                        className="w-10 h-10 rounded-lg"
                      />
                      <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-text">
                          FamilyPay Admin
                        </h1>
                        <p className="text-sm text-text-muted">
                          Manage your family circle efficiently
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-text">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Member Spending Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Member Comparison */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  👥 Member Spending Comparison
                </h3>
              </div>
              <div className="space-y-4">
                {[
                  {
                    name: "Rajnish",
                    spent: 8500,
                    limit: 10000,
                    percentage: 85,
                  },
                  { name: "Sangam", spent: 6200, limit: 8000, percentage: 77 },
                  { name: "Raveena", spent: 4800, limit: 6000, percentage: 80 },
                  { name: "Shubh", spent: 3200, limit: 5000, percentage: 64 },
                ].map((member, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-text">
                        {member.name}
                      </span>
                      <span className="text-xs text-text-muted">
                        ₹{member.spent} / ₹{member.limit}
                      </span>
                    </div>
                    <div className="w-full bg-bg-elevated rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          member.percentage > 80
                            ? "bg-danger"
                            : member.percentage > 60
                              ? "bg-warning"
                              : "bg-success"
                        }`}
                        style={{ width: `${member.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Trends */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📈 Transaction Trends
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">+23%</div>
                  <div className="text-sm text-text-muted">vs Last Month</div>
                  <div className="text-xs text-text-muted mt-1">
                    Total Transactions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-danger">+15%</div>
                  <div className="text-sm text-text-muted">vs Last Month</div>
                  <div className="text-xs text-text-muted mt-1">
                    Avg. Transaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">₹2,450</div>
                  <div className="text-sm text-text-muted">Average</div>
                  <div className="text-xs text-text-muted mt-1">
                    Per Transaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">89%</div>
                  <div className="text-sm text-text-muted">Success Rate</div>
                  <div className="text-xs text-text-muted mt-1">
                    Transactions
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Overview */}
          <div className="card">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text">
                📅 Monthly Overview
              </h3>
              <button className="btn btn-secondary btn-sm">
                Export Report
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: "January", amount: 45678, change: 12.5, trend: "up" },
                {
                  label: "February",
                  amount: 38900,
                  change: -8.2,
                  trend: "down",
                },
                { label: "March", amount: 52340, change: 34.6, trend: "up" },
                {
                  label: "April (Current)",
                  amount: 35800,
                  change: 0,
                  trend: "neutral",
                },
              ].map((month, index) => (
                <div
                  key={index}
                  className="p-4 bg-bg-elevated rounded-lg border border-border"
                >
                  <div className="text-sm text-text-muted mb-1">
                    {month.label}
                  </div>
                  <div className="text-xl font-bold text-text mb-2">
                    ₹{month.amount.toLocaleString()}
                  </div>
                  {month.trend !== "neutral" && (
                    <div
                      className={`flex items-center text-xs ${
                        month.trend === "up" ? "text-success" : "text-danger"
                      }`}
                    >
                      {month.trend === "up" ? "↑" : "↓"}{" "}
                      {Math.abs(month.change)}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending Approvals */}
          {pendingPayments.length > 0 && (
            <div className="card mb-6">
              <div className="border-b border-border pb-4 mb-4">
                <h3 className="text-lg font-semibold text-text">
                  ⏳ Pending Approvals
                </h3>
              </div>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-bg-elevated rounded-default border border-border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-text mb-1">
                        {payment.fromUser.name}
                      </div>
                      <div className="text-text-muted text-sm mb-2">
                        {payment.description}
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-info/10 text-info">
                          ₹{payment.amount}
                        </span>
                        <span className="text-text-muted text-sm">
                          To: {payment.toUpiId}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-success text-sm px-3 py-1"
                          onClick={() => handleApprovePayment(payment.id, true)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger text-sm px-3 py-1"
                          onClick={() =>
                            handleApprovePayment(payment.id, false)
                          }
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  💸 Recent Transactions
                </h3>
                <button className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      {
                        id: 1,
                        member: "Rajnish Kumar",
                        phone: "+91 9876543210",
                        avatar: "R",
                        description: "Grocery shopping at Big Bazaar",
                        amount: 2850,
                        status: "completed",
                        date: "2024-01-15",
                        category: "Food & Groceries",
                      },
                      {
                        id: 2,
                        member: "Sangam Singh",
                        phone: "+91 9876543211",
                        avatar: "S",
                        description: "Mobile phone bill payment",
                        amount: 1299,
                        status: "pending",
                        date: "2024-01-15",
                        category: "Bills & Utilities",
                      },
                      {
                        id: 3,
                        member: "Raveena Kumari",
                        phone: "+91 9876543212",
                        avatar: "R",
                        description: "Online shopping - Amazon",
                        amount: 3599,
                        status: "completed",
                        date: "2024-01-14",
                        category: "Shopping",
                      },
                      {
                        id: 4,
                        member: "Shubh Kumar",
                        phone: "+91 9876543213",
                        avatar: "S",
                        description: "Electricity bill payment",
                        amount: 2200,
                        status: "pending",
                        date: "2024-01-13",
                        category: "Bills & Utilities",
                      },
                    ].map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-bg-elevated">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {transaction.avatar}
                            </div>
                            <div>
                              <div className="font-medium text-text">
                                {transaction.member}
                              </div>
                              <div className="text-xs text-text-muted">
                                {transaction.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div className="font-medium text-text">
                              {transaction.description}
                            </div>
                            <div className="text-xs text-text-muted">
                              {transaction.category}
                            </div>
                          </div>
                        </td>
                        <td className="font-semibold text-text">
                          ₹{transaction.amount}
                        </td>
                        <td>
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              transaction.status === "completed"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="text-text-muted text-sm">
                          {transaction.date}
                        </td>
                        <td>
                          <button className="p-1 hover:bg-bg-elevated rounded">
                            <svg
                              className="w-4 h-4 text-text-muted"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v14m0 0l-7 7m7 7V7a2 2 0 002-2h2a2 2 0 002-2m0 10a2 2 0 002 2 2 2 0 002-2m-6 8a2 2 0 002-2-2 2 0 00-2z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📊 Activity Feed
                </h3>
                <button className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    id: 1,
                    icon: "🔄",
                    title: "System Update",
                    description: "Database backup completed successfully",
                    time: "1 hour ago",
                    color: "text-blue-500",
                  },
                  {
                    id: 2,
                    icon: "⚠️",
                    title: "Pending Payment Alert",
                    description: "2 payments waiting for admin approval",
                    time: "2 hours ago",
                    color: "text-yellow-500",
                  },
                  {
                    id: 3,
                    icon: "💸",
                    title: "New Transaction Received",
                    description: "Grocery payment from Rajnish - ₹2,850",
                    time: "3 hours ago",
                    color: "text-green-500",
                  },
                  {
                    id: 4,
                    icon: "💸",
                    title: "New Transaction Received",
                    description: "Mobile payment from Sangam - ₹1,299",
                    time: "4 hours ago",
                    color: "text-green-500",
                  },
                  {
                    id: 5,
                    icon: "✅",
                    title: "Payment Completed",
                    description: "Electricity bill paid for Shubh",
                    time: "5 hours ago",
                    color: "text-green-500",
                  },
                ].map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 hover:bg-bg-elevated rounded-lg"
                  >
                    <div className="text-2xl">{activity.icon}</div>
                    <div className="flex-1">
                      <div className="font-medium text-text mb-1">
                        {activity.title}
                      </div>
                      <div className="text-sm text-text-muted">
                        {activity.description}
                      </div>
                      <div className="text-xs text-text-muted mt-1">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Circle Members */}
          <div className="card">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text">
                👥 Family Members ({circle.members.length})
              </h3>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddMember(true)}
              >
                + Add Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circle.members.map((member) => (
                <div key={member.id} className="card">
                  <div className="mb-4">
                    <h4 className="font-medium text-text mb-1">
                      {member.secondaryUser.name}
                    </h4>
                    <p className="text-text-muted text-sm">
                      {member.secondaryUser.upiId}
                    </p>
                    {member.secondaryUser.isMinor && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning mt-2">
                        Minor
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-text-muted">Daily Limit</span>
                        <span className="font-medium text-text">
                          ₹{member.currentDailySpent} / ₹{member.dailyLimit}
                        </span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((member.currentDailySpent / member.dailyLimit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-text-muted">Monthly Limit</span>
                        <span className="font-medium text-text">
                          ₹{member.currentMonthlySpent} / ₹{member.monthlyLimit}
                        </span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min((member.currentMonthlySpent / member.monthlyLimit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button
                      className="btn btn-secondary w-full text-sm"
                      onClick={() => setSelectedMember(member)}
                    >
                      Set Limits
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modals */}
          {showAddMember && (
            <AddMemberModal
              onClose={() => setShowAddMember(false)}
              onAdd={async () => {
                alert("Demo Mode: Member addition simulated");
                setShowAddMember(false);
              }}
            />
          )}

          {selectedMember && (
            <SetLimitModal
              member={selectedMember}
              onClose={() => setSelectedMember(null)}
              onUpdate={handleUpdateLimit}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />
    </div>
  );
};

export default PrimaryDashboard;
