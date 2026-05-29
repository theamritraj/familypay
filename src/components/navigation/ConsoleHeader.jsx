import React, { useState } from 'react';
import { Menu, Search, Sun, Moon, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ConsoleHeader = ({ sidebarOpen, setSidebarOpen, darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Generic notifications for the layout
  const activeNotifications = [
    {
      id: "system-activity",
      title: "System Active",
      message: "FamilyPay Circle monitoring is live.",
      time: "Just now",
      read: true
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-bg-card border-b border-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Hamburger Menu */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-bg-elevated transition-colors"
            >
              <Menu className="w-5 h-5 text-text" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-bg-elevated transition-colors"
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
                {activeNotifications.some(n => !n.read) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger border-2 border-bg-card rounded-full"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-bg-card border border-border rounded-lg shadow-lg">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <h3 className="font-semibold text-text">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {activeNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 hover:bg-bg-elevated cursor-pointer border-b border-border last:border-b-0 ${!notification.read ? "bg-primary/5" : ""}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${notification.isWarning ? "bg-warning" : "bg-primary"}`} />
                          <div className="flex-1">
                            <div className="font-semibold text-text text-sm">
                              {notification.title}
                            </div>
                            <div className="text-xs text-text-muted mt-0.5">
                              {notification.message}
                            </div>
                            <div className="text-[10px] text-text-muted mt-1.5 font-medium">
                              {notification.time}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-border text-center">
                    <button className="text-xs font-semibold text-primary hover:text-primary/80" onClick={() => navigate('/dashboard/notifications')}>
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
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-text-muted">
                    {user?.email || "user@familypay.com"}
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
                          {user?.name || "User"}
                        </div>
                        <div className="text-sm text-text-muted">
                          {user?.email || "user@familypay.com"}
                        </div>
                        <div className="text-xs text-success">
                          {user?.role === "PRIMARY" || user?.role === "ADMIN" ? "Circle Owner" : "Circle Member"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button onClick={() => navigate('/dashboard/profile')} className="w-full text-left px-4 py-2 text-sm text-text hover:bg-bg-elevated transition-colors">
                      Profile Settings
                    </button>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleLogout}
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
              <button onClick={() => {navigate('/dashboard'); setMobileMenuOpen(false);}} className="w-full text-left px-4 py-2 text-text hover:bg-bg-elevated rounded-lg">
                Dashboard
              </button>
              <button onClick={() => {navigate('/dashboard/members'); setMobileMenuOpen(false);}} className="w-full text-left px-4 py-2 text-text hover:bg-bg-elevated rounded-lg">
                Family Members
              </button>
              <button onClick={() => {navigate('/dashboard/transactions'); setMobileMenuOpen(false);}} className="w-full text-left px-4 py-2 text-text hover:bg-bg-elevated rounded-lg">
                Transactions
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default ConsoleHeader;
