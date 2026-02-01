import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  CreditCard,
  Shield,
  Smartphone,
  Calendar,
  Filter,
  Search,
  ArrowLeft,
  Trash2,
  Check,
  Info,
  AlertTriangle,
  Gift,
  TrendingUp,
  UserPlus,
  Settings,
  RefreshCw,
} from "lucide-react";

const NotificationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState(new Set());

  const filterOptions = [
    { id: "all", label: "All", icon: Bell },
    { id: "unread", label: "Unread", icon: CheckCircle },
    { id: "payment", label: "Payments", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "System", icon: Info },
  ];

  useEffect(() => {
    // Generate mock notifications with current timestamps
    const now = Date.now();
    const mockNotifications = [
      {
        id: 1,
        type: "payment",
        title: "Payment Received",
        message: "You received ₹500 from Mom",
        timestamp: new Date(now - 1000 * 60 * 5), // 5 minutes ago
        read: false,
        icon: CreditCard,
        color: "success",
        action: "View Transaction",
        actionUrl: "/dashboard/transactions",
      },
      {
        id: 2,
        type: "security",
        title: "New Login Detected",
        message: "New login from Chrome on Windows",
        timestamp: new Date(now - 1000 * 60 * 60), // 1 hour ago
        read: false,
        icon: Shield,
        color: "warning",
        action: "Review Activity",
        actionUrl: "/dashboard/profile",
      },
      {
        id: 3,
        type: "payment",
        title: "Payment Approved",
        message: "Your payment of ₹1200 has been approved",
        timestamp: new Date(now - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true,
        icon: CheckCircle,
        color: "success",
        action: "View Details",
        actionUrl: "/dashboard/transactions",
      },
      {
        id: 4,
        type: "system",
        title: "Monthly Report Available",
        message: "Your spending report for November is ready",
        timestamp: new Date(now - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
        icon: TrendingUp,
        color: "info",
        action: "View Report",
        actionUrl: "/dashboard/analytics",
      },
      {
        id: 5,
        type: "alert",
        title: "Low Balance Alert",
        message: "Your balance is below ₹1000",
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        read: true,
        icon: AlertTriangle,
        color: "danger",
        action: "Add Money",
        actionUrl: "/dashboard/payments",
      },
      {
        id: 6,
        type: "social",
        title: "New Family Member",
        message: "John Doe joined your family circle",
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        read: true,
        icon: UserPlus,
        color: "primary",
        action: "View Profile",
        actionUrl: "/dashboard/members",
      },
      {
        id: 7,
        type: "promotion",
        title: "Special Offer!",
        message: "Get 10% cashback on your next payment",
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 7), // 1 week ago
        read: true,
        icon: Gift,
        color: "warning",
        action: "Learn More",
        actionUrl: "/dashboard",
      },
      {
        id: 8,
        type: "system",
        title: "App Update Available",
        message: "New features and improvements are available",
        timestamp: new Date(now - 1000 * 60 * 60 * 24 * 14), // 2 weeks ago
        read: true,
        icon: Smartphone,
        color: "info",
        action: "Update Now",
        actionUrl: "/dashboard",
      },
    ];

    // Simulate loading notifications
    setTimeout(() => {
      setNotifications(mockNotifications);
      setFilteredNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = notifications;

    // Apply filter
    if (selectedFilter === "unread") {
      filtered = filtered.filter((n) => !n.read);
    } else if (selectedFilter !== "all") {
      filtered = filtered.filter((n) => n.type === selectedFilter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.message.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredNotifications(filtered);
  }, [selectedFilter, searchQuery, notifications]);

  const handleMarkAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    setSelectedNotifications(new Set());
  };

  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleDeleteSelected = () => {
    setNotifications(
      notifications.filter((n) => !selectedNotifications.has(n.id)),
    );
    setSelectedNotifications(new Set());
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleNotificationAction = (notification) => {
    handleMarkAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const getNotificationIcon = (notification) => {
    const Icon = notification.icon;
    const colorClasses = {
      success: "text-success bg-success/10",
      warning: "text-warning bg-warning/10",
      danger: "text-danger bg-danger/10",
      info: "text-info bg-info/10",
      primary: "text-primary bg-primary/10",
    };

    return (
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClasses[notification.color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg animate-fade-in pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-bg-card border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="FamilyPay"
              className="w-10 h-10 rounded-lg"
            />
            <h1 className="text-lg sm:text-xl font-bold text-text">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-danger text-white text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted hidden sm:inline">
              {new Date().toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-secondary btn-sm text-xs px-3 py-1.5"
              disabled={unreadCount === 0}
            >
              Mark All Read
            </button>
            <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
              <RefreshCw className="w-4 h-4 text-text" />
            </button>
          </div>
        </div>
      </header>

      <div className="px-4 py-3 sm:px-6 sm:py-4">
        {/* Search and Filters */}
        <div className="space-y-3 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
              className="w-full pl-10 pr-4 py-2.5 bg-bg-elevated border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors text-xs font-medium ${
                    selectedFilter === filter.id
                      ? "bg-primary text-white"
                      : "bg-bg-elevated text-text hover:border-primary border border-transparent"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selection Actions */}
        {selectedNotifications.size > 0 && (
          <div className="card mb-3 flex items-center justify-between py-2 px-3">
            <span className="text-xs text-text">
              {selectedNotifications.size} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDeleteSelected}
                className="btn btn-danger btn-xs flex items-center gap-1 py-1 px-2"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="loading-spinner"></div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card p-3 transition-all cursor-pointer hover:border-primary ${
                  !notification.read
                    ? "border-l-4 border-l-primary bg-primary/5"
                    : ""
                } ${selectedNotifications.has(notification.id) ? "ring-2 ring-primary/20" : ""}`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox for selection */}
                  <button
                    onClick={() => handleSelectNotification(notification.id)}
                    className="mt-0.5"
                  >
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        selectedNotifications.has(notification.id)
                          ? "border-primary bg-primary"
                          : "border-border"
                      }`}
                    >
                      {selectedNotifications.has(notification.id) && (
                        <Check className="w-2.5 h-2.5 text-white" />
                      )}
                    </div>
                  </button>

                  {/* Notification Icon */}
                  {getNotificationIcon(notification)}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`font-semibold text-sm text-text truncate ${
                          !notification.read ? "font-bold" : ""
                        }`}
                      >
                        {notification.title}
                      </h3>
                      <span className="text-xs text-text-muted whitespace-nowrap ml-2">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-2 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleNotificationAction(notification)}
                        className="text-primary text-xs font-medium hover:text-primary/80 transition-colors"
                      >
                        {notification.action}
                      </button>
                      <div className="flex items-center gap-3">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-xs text-text-muted hover:text-text transition-colors"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() =>
                            handleDeleteNotification(notification.id)
                          }
                          className="text-xs text-text-muted hover:text-danger transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-text mb-2">
              No notifications
            </h3>
            <p className="text-text-muted">
              {searchQuery || selectedFilter !== "all"
                ? "No notifications match your criteria"
                : "You're all caught up!"}
            </p>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />
    </div>
  );
};

export default NotificationsPage;
