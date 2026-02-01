import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText,
  Settings,
  MapPin,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Activity,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      title: "Family Members",
      icon: Users,
      count: 4,
      path: "/dashboard/members",
      active: location.pathname === "/dashboard/members",
    },
    {
      title: "Transactions",
      icon: CreditCard,
      count: 234,
      path: "/dashboard/transactions",
      active: location.pathname === "/dashboard/transactions",
    },
    {
      title: "Pending Approvals",
      icon: Calendar,
      count: 3,
      path: "/dashboard/pending",
      active: location.pathname === "/dashboard/pending",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/dashboard/analytics",
      active: location.pathname === "/dashboard/analytics",
    },
    {
      title: "Spending Limits",
      icon: Settings,
      path: "/dashboard/limits",
      active: location.pathname === "/dashboard/limits",
    },
    {
      title: "Notifications",
      icon: MessageSquare,
      count: 12,
      path: "/dashboard/notifications",
      active: location.pathname === "/dashboard/notifications",
    },
    {
      title: "Reports",
      icon: FileText,
      path: "/dashboard/reports",
      active: location.pathname === "/dashboard/reports",
    },
    {
      title: "Activity Log",
      icon: Activity,
      path: "/dashboard/activity",
      active: location.pathname === "/dashboard/activity",
    },
  ];

  const dropdownItems = [
    {
      title: "Settings",
      icon: Settings,
      items: [
        { title: "General Settings", path: "/dashboard/settings/general" },
        {
          title: "Circle Management",
          icon: Users,
          path: "/dashboard/settings/circle",
        },
        {
          title: "Payment Methods",
          icon: CreditCard,
          path: "/dashboard/settings/payments",
        },
      ],
    },
  ];

  const toggleDropdown = (title) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
                fixed left-0 top-0 h-full bg-bg-card border-r border-border z-50 transition-all duration-300
                ${isOpen ? "w-64" : "w-0 lg:w-20"} 
                ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center gap-3 ${!isOpen && "lg:justify-center"}`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">FP</span>
                </div>
                {isOpen && (
                  <div>
                    <h2 className="text-text font-semibold">Family Pay</h2>
                    <p className="text-text-muted text-xs">Admin Panel</p>
                  </div>
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-lg hover:bg-bg-elevated lg:hidden"
              >
                <X className="w-5 h-5 text-text" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.path}
                  className={`
                                        flex items-center justify-between p-3 rounded-lg transition-all duration-200
                                        ${
                                          item.active
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "hover:bg-bg-elevated text-text-muted hover:text-text"
                                        }
                                    `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {isOpen && (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                  </div>
                  {item.count && isOpen && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                      {item.count}
                    </span>
                  )}
                </Link>
              ))}

              {/* Dropdown Items */}
              {dropdownItems.map((dropdown) => (
                <div key={dropdown.title}>
                  <button
                    onClick={() => toggleDropdown(dropdown.title)}
                    className={`
                                            w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200
                                            ${
                                              activeDropdown === dropdown.title
                                                ? "bg-primary/10 text-primary border border-primary/20"
                                                : "hover:bg-bg-elevated text-text-muted hover:text-text"
                                            }
                                        `}
                  >
                    <div className="flex items-center gap-3">
                      <dropdown.icon className="w-5 h-5" />
                      {isOpen && (
                        <span className="text-sm font-medium">
                          {dropdown.title}
                        </span>
                      )}
                    </div>
                    {isOpen && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          activeDropdown === dropdown.title ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown Content */}
                  {isOpen && activeDropdown === dropdown.title && (
                    <div className="ml-4 mt-2 space-y-1">
                      {dropdown.items.map((subItem) => (
                        <Link
                          key={subItem.title}
                          to={subItem.path}
                          className={`
                                                        flex items-center gap-3 p-2 rounded-lg text-sm transition-all duration-200
                                                        ${
                                                          location.pathname ===
                                                          subItem.path
                                                            ? "bg-primary/10 text-primary"
                                                            : "text-text-muted hover:text-text hover:bg-bg-elevated"
                                                        }
                                                    `}
                        >
                          {subItem.icon && <subItem.icon className="w-4 h-4" />}
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text truncate">
                    {user?.email || "admin@familypay.com"}
                  </p>
                  <p className="text-xs text-text-muted">Administrator</p>
                </div>
              )}
            </div>

            {isOpen && (
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-2 rounded-lg text-sm text-text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;
