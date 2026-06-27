import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Wallet,
  Bell,
  User,
} from "lucide-react";

const MobileTabBar = ({ userRole = "SECONDARY" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Navigation items based on user role
  const navItems =
    userRole === "ADMIN" || userRole === "PRIMARY"
      ? [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            path: "/dashboard",
          },
          {
            id: "transactions",
            label: "Transactions",
            icon: CreditCard,
            path: "/dashboard/transactions",
          },

          {
            id: "analytics",
            label: "Analytics",
            icon: BarChart3,
            path: "/dashboard/analytics",
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            path: "/dashboard/settings",
          },
        ]
      : [
          { id: "dashboard", label: "Home", icon: Home, path: "/dashboard" },
          {
            id: "payments",
            label: "Pay",
            icon: Wallet,
            path: "/dashboard/payments",
          },
          {
            id: "transactions",
            label: "History",
            icon: CreditCard,
            path: "/dashboard/transactions",
          },
          {
            id: "notifications",
            label: "Alerts",
            icon: Bell,
            path: "/dashboard/notifications",
          },
          {
            id: "profile",
            label: "Profile",
            icon: User,
            path: "/dashboard/profile",
          },
        ];

  const handleNavClick = (item) => {
    navigate(item.path);

    // Add haptic feedback on mobile (if supported)
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const activeTab =
    navItems.find(
      (item) =>
        location.pathname === item.path ||
        location.pathname.startsWith(item.path + "/"),
    )?.id || "dashboard";

  // Only show on mobile screens
  if (!isMobile) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-bg-card/95 backdrop-blur-lg border-t border-border z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-300 min-w-0 flex-1 relative group ${
                isActive
                  ? "text-primary scale-105"
                  : "text-text-muted hover:text-text"
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}

              <div className="relative mb-1">
                <Icon
                  className={`w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-primary scale-110"
                      : "text-text-muted group-hover:scale-105"
                  }`}
                />

                {/* Notification badge for alerts */}
                {item.id === "notifications" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-danger rounded-full animate-pulse"></span>
                )}
              </div>

              <span
                className={`text-xs transition-all duration-300 truncate w-full text-center ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-text-muted group-hover:text-text"
                }`}
              >
                {item.label}
              </span>

              {/* Ripple effect on touch */}
              <div className="absolute inset-0 rounded-xl bg-primary/10 scale-0 group-active:scale-100 transition-transform duration-200"></div>
            </button>
          );
        })}
      </div>

      {/* Safe area padding for iPhone notch */}
      <div className="h-2 bg-bg-card/95 backdrop-blur-lg"></div>
    </div>
  );
};

export default MobileTabBar;
