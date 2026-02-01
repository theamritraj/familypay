import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/BottomNav";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Bell,
  CreditCard,
  Smartphone,
  Camera,
  Edit2,
  Save,
  X,
  Check,
  AlertCircle,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ChevronRight,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    photoURL: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    paymentAlerts: true,
    securityAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    biometricLogin: false,
    loginAlerts: true,
    sessionTimeout: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dateOfBirth: user.dateOfBirth || "",
        address: user.address || "",
        photoURL: user.photoURL || "",
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile: " + result.error);
      }
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      // In a real app, you'd call a password change API
      alert("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      alert("Error changing password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const menuItems = [
    { id: "profile", label: "Profile Info", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
  ];

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
      <header className="bg-bg-card border-b border-border px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpeg"
              alt="FamilyPay"
              className="w-10 h-10 rounded-lg"
            />
            <h1 className="text-xl sm:text-2xl font-bold text-text">Profile</h1>
          </div>
          <button onClick={logout} className="btn btn-danger btn-sm">
            Logout
          </button>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Mobile Menu Tabs */}
          <div className="lg:hidden">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      activeSection === item.id
                        ? "bg-primary text-white"
                        : "bg-bg-elevated text-text hover:border-primary"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="card p-4">
              <h3 className="font-semibold text-text mb-4">Settings</h3>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeSection === item.id
                          ? "bg-primary text-white"
                          : "text-text hover:bg-bg-elevated"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Profile Info Section */}
            {activeSection === "profile" && (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-text">
                      Profile Information
                    </h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-secondary btn-sm flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(false)}
                          className="btn btn-secondary btn-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveProfile}
                          disabled={loading}
                          className="btn btn-primary btn-sm flex items-center gap-2"
                        >
                          {loading ? (
                            <div className="loading-spinner w-4 h-4"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {formData.photoURL ? (
                          <img
                            src={formData.photoURL}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          formData.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full text-white">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text">
                        {formData.name}
                      </h3>
                      <p className="text-text-muted">
                        {user?.role === "ADMIN"
                          ? "Administrator"
                          : user?.role === "PRIMARY"
                            ? "Primary User"
                            : "Secondary User"}
                      </p>
                      <p className="text-sm text-text-muted">
                        Member since {new Date().getFullYear()}
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-text mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Address
                      </label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows="3"
                        className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold text-text mb-6">
                    Security Settings
                  </h2>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full flex items-center justify-between p-4 bg-bg-elevated rounded-lg hover:border-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="/logo.jpeg"
                          alt="FamilyPay"
                          className="w-10 h-10 rounded-lg"
                        />
                        <div>
                          <h1 className="text-xl sm:text-2xl font-bold text-text">
                            Profile Settings
                          </h1>
                          <p className="text-sm text-text-muted">
                            Manage your account and preferences
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    </button>

                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-text-muted" />
                        <div className="text-left">
                          <div className="font-medium text-text">
                            Two-Factor Authentication
                          </div>
                          <div className="text-sm text-text-muted">
                            Add an extra layer of security
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setSecurity({
                            ...security,
                            twoFactorAuth: !security.twoFactorAuth,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.twoFactorAuth ? "bg-primary" : "bg-bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security.twoFactorAuth
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-text-muted" />
                        <div className="text-left">
                          <div className="font-medium text-text">
                            Login Alerts
                          </div>
                          <div className="text-sm text-text-muted">
                            Get notified of new login attempts
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setSecurity({
                            ...security,
                            loginAlerts: !security.loginAlerts,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security.loginAlerts ? "bg-primary" : "bg-bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security.loginAlerts
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold text-text mb-6">
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-text-muted" />
                        <div className="text-left">
                          <div className="font-medium text-text">
                            Email Notifications
                          </div>
                          <div className="text-sm text-text-muted">
                            Receive updates via email
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            emailNotifications:
                              !notifications.emailNotifications,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.emailNotifications
                            ? "bg-primary"
                            : "bg-bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.emailNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-text-muted" />
                        <div className="text-left">
                          <div className="font-medium text-text">
                            Push Notifications
                          </div>
                          <div className="text-sm text-text-muted">
                            Receive push notifications
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: !notifications.pushNotifications,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.pushNotifications
                            ? "bg-primary"
                            : "bg-bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.pushNotifications
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-text-muted" />
                        <div className="text-left">
                          <div className="font-medium text-text">
                            Payment Alerts
                          </div>
                          <div className="text-sm text-text-muted">
                            Get notified about payments
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            paymentAlerts: !notifications.paymentAlerts,
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications.paymentAlerts
                            ? "bg-primary"
                            : "bg-bg-border"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications.paymentAlerts
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods Section */}
            {activeSection === "payment" && (
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-xl font-semibold text-text mb-6">
                    Payment Methods
                  </h2>

                  <div className="space-y-4">
                    <div className="p-4 bg-bg-elevated rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-text">
                              •••• •••• •••• 4242
                            </div>
                            <div className="text-sm text-text-muted">
                              Expires 12/25
                            </div>
                          </div>
                        </div>
                        <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                          Default
                        </span>
                      </div>
                    </div>

                    <button className="w-full p-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors">
                      <div className="flex items-center justify-center gap-2 text-text-muted">
                        <CreditCard className="w-5 h-5" />
                        <span>Add Payment Method</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-text">
                Change Password
              </h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={loading}
                  className="flex-1 btn btn-primary"
                >
                  {loading ? (
                    <div className="loading-spinner mx-auto"></div>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />
    </div>
  );
};

export default ProfilePage;
