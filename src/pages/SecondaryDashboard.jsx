import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { firebaseDB } from "../firebase";
import paymentService from "../services/paymentService";
import PaymentRequestModal from "../components/PaymentRequestModal";
import ContactListModal from "../components/ContactListModal";
import QRScannerModal from "../components/QRScannerModalLive";
import BottomNav from "../components/BottomNav";
import {
  QrCode,
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Send,
  MoreHorizontal,
  Bell,
  UserPlus,
  Gift,
  Target,
  Shield,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
} from "lucide-react";

const SecondaryDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showQRScannerModal, setShowQRScannerModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Additional state for new UI features
  const [balance, setBalance] = useState(12500.5);
  const [monthlySpending, setMonthlySpending] = useState(3250.0);
  const [savingsGoal, setSavingsGoal] = useState(50000);
  const [recentActivity, setRecentActivity] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);

  const loadDashboardData = async () => {
    try {
      const [transactionsRes] = await Promise.all([
        paymentService.getUserTransactions(user.id),
      ]);

      // Get user transactions
      if (transactionsRes.success) {
        setTransactions(transactionsRes.data);
      }

      // Get user circle data
      if (user.familyCircle) {
        const circleRes = await firebaseDB.getCircle(user.familyCircle);
        if (circleRes.success) {
          setCircle(circleRes.data);
        }
      }

      // Mock data for new UI features
      setRecentActivity([
        {
          id: 1,
          type: "payment",
          title: "Payment to Mom",
          amount: -500,
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 min ago
          status: "completed",
        },
        {
          id: 2,
          type: "receive",
          title: "From Dad",
          amount: 1000,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          status: "completed",
        },
        {
          id: 3,
          type: "payment",
          title: "Grocery Store",
          amount: -250,
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
          status: "completed",
        },
      ]);

      setFamilyMembers([
        { id: 1, name: "Mom", role: "admin", avatar: "👩", status: "online" },
        { id: 2, name: "Dad", role: "admin", avatar: "👨", status: "online" },
        {
          id: 3,
          name: "Sister",
          role: "member",
          avatar: "👧",
          status: "offline",
        },
        {
          id: 4,
          name: "Brother",
          role: "member",
          avatar: "👦",
          status: "online",
        },
      ]);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const handlePaymentRequest = async (paymentData) => {
    try {
      const result = await paymentService.createPayment({
        ...paymentData,
        fromUserId: user.id,
        fromUserName: user.name,
        upiId: upiId || `${user.name.toLowerCase().replace(" ", "")}@familypay`,
      });

      if (result.success) {
        loadDashboardData();
        setShowPaymentModal(false);
        return result;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      throw new Error("Failed to submit payment request: " + error.message);
    }
  };

  const handleQuickPayment = async (method) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setPaymentMethod(method);
    setProcessingPayment(true);

    try {
      const paymentData = {
        amount: parseFloat(amount),
        description: description || `Payment via ${method}`,
        method: method,
        upiId: upiId || `${user.name.toLowerCase().replace(" ", "")}@familypay`,
      };

      const result = await paymentService.createPayment({
        ...paymentData,
        fromUserId: user.id,
        fromUserName: user.name,
      });

      if (result.success) {
        if (parseFloat(amount) < 1000) {
          alert(`Payment of ₹${amount} processed successfully!`);
        } else {
          alert(`Payment request of ₹${amount} submitted for admin approval!`);
        }

        setAmount("");
        setDescription("");
        setUpiId("");
        setShowScannerModal(false);
        setShowUpiModal(false);
        loadDashboardData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      alert("Payment failed: " + error.message);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleContactSelect = (contact) => {
    setSelectedContact(contact);
    // Navigate to payment page with selected contact
    navigate("/dashboard/payments", { state: { selectedContact } });
  };

  const handleSendClick = () => {
    setShowContactModal(true);
  };

  const handleScanClick = () => {
    setShowQRScannerModal(true);
  };

  const handleQRScanSuccess = (qrData) => {
    // Convert QR data to contact format and navigate to payment
    const contactData = {
      id: Date.now(),
      name: qrData.name,
      phone: qrData.phone,
      email: qrData.upiId,
      avatar:
        qrData.name === "Mom"
          ? "👩"
          : qrData.name === "Dad"
            ? "👨"
            : qrData.name === "Sister"
              ? "👧"
              : qrData.name === "John Doe"
                ? "👤"
                : "🏪",
      status: "offline",
      isFamily:
        qrData.name === "Mom" ||
        qrData.name === "Dad" ||
        qrData.name === "Sister",
      lastTransaction: null,
      upiId: qrData.upiId,
      preselectedAmount: qrData.amount,
    };

    navigate("/dashboard/payments", {
      state: { selectedContact: contactData },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const dailyPercentage = circle
    ? (circle.currentDailySpent / circle.dailyLimit) * 100
    : 0;
  const monthlyPercentage = circle
    ? (circle.currentMonthlySpent / circle.monthlyLimit) * 100
    : 0;
  const dailyRemaining = circle
    ? circle.dailyLimit - circle.currentDailySpent
    : 0;
  const monthlyRemaining = circle
    ? circle.monthlyLimit - circle.currentMonthlySpent
    : 0;

  return (
    <div className="min-h-screen bg-bg animate-fade-in pb-20 lg:pb-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-6 sm:px-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">Good morning</h1>
            <p className="text-white/80">
              Welcome back, {user?.name || "User"}!
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-white/80 text-sm mb-1">Total balance</p>
              <h2 className="text-3xl font-bold">
                ₹
                {balance.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </h2>
            </div>
            <div className="bg-white/20 px-2 py-1 rounded-full">
              <span className="text-xs font-medium">+12.5%</span>
            </div>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <ArrowUpRight className="w-4 h-4 text-green-300" />
              <span>Income: ₹8,500</span>
            </div>
            <div className="flex items-center gap-1">
              <ArrowDownRight className="w-4 h-4 text-red-300" />
              <span>Expense: ₹3,250</span>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <button
            onClick={handleSendClick}
            className="flex flex-col items-center p-3 bg-bg-card rounded-xl hover:bg-bg-elevated transition-colors border border-border"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <Send className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-text">Send</span>
          </button>
          <button
            onClick={handleScanClick}
            className="flex flex-col items-center p-3 bg-bg-card rounded-xl hover:bg-bg-elevated transition-colors border border-border"
          >
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center mb-2">
              <QrCode className="w-5 h-5 text-success" />
            </div>
            <span className="text-xs text-text">Scan</span>
          </button>
          <button className="flex flex-col items-center p-3 bg-bg-card rounded-xl hover:bg-bg-elevated transition-colors border border-border">
            <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center mb-2">
              <CreditCard className="w-5 h-5 text-warning" />
            </div>
            <span className="text-xs text-text">Cards</span>
          </button>
          <button className="flex flex-col items-center p-3 bg-bg-card rounded-xl hover:bg-bg-elevated transition-colors border border-border">
            <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center mb-2">
              <MoreHorizontal className="w-5 h-5 text-info" />
            </div>
            <span className="text-xs text-text">More</span>
          </button>
        </div>

        {/* Family Members */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-text">Family Members</h3>
            <button className="text-primary text-sm font-medium">
              See all
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center min-w-fit"
              >
                <div className="relative">
                  <div className="w-14 h-14 bg-bg-elevated rounded-full flex items-center justify-center text-2xl mb-1 border-2 border-border">
                    {member.avatar}
                  </div>
                  <div
                    className={`absolute bottom-1 right-0 w-3 h-3 rounded-full border-2 border-bg-card ${
                      member.status === "online"
                        ? "bg-success"
                        : "bg-text-muted"
                    }`}
                  ></div>
                </div>
                <span className="text-xs text-text">{member.name}</span>
              </div>
            ))}
            <button className="flex flex-col items-center min-w-fit">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-1 border-2 border-dashed border-primary">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-primary">Add</span>
            </button>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-text">
              Recent Transactions
            </h3>
            <button className="text-primary text-sm font-medium">
              See all
            </button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="card p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === "receive"
                          ? "bg-success/10"
                          : "bg-danger/10"
                      }`}
                    >
                      {activity.type === "receive" ? (
                        <ArrowDownRight className="w-5 h-5 text-success" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-danger" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text">{activity.title}</p>
                      <p className="text-xs text-text-muted">
                        {activity.timestamp.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        activity.amount > 0 ? "text-success" : "text-danger"
                      }`}
                    >
                      {activity.amount > 0 ? "+" : ""}₹
                      {Math.abs(activity.amount).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Savings Goal */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-text">Savings Goal</h3>
            <button className="text-primary text-sm font-medium">Edit</button>
          </div>
          <div className="card p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-text-muted mb-1">
                  Target: ₹{savingsGoal.toLocaleString("en-IN")}
                </p>
                <p className="text-lg font-semibold text-text">
                  ₹
                  {(balance * 0.6).toLocaleString("en-IN", {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(((balance * 0.6) / savingsGoal) * 100)}%
                </p>
                <p className="text-xs text-text-muted">completed</p>
              </div>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(((balance * 0.6) / savingsGoal) * 100, 100)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Monthly Spending</p>
                <p className="text-lg font-semibold text-text">
                  ₹{monthlySpending.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-info" />
              </div>
              <div>
                <p className="text-xs text-text-muted">Goals Left</p>
                <p className="text-lg font-semibold text-text">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help & Support */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="FamilyPay"
                className="w-10 h-10 rounded-lg"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-text">
                  👤 Member Dashboard
                </h1>
                <p className="text-sm text-text-muted">
                  Welcome, {user?.name || "User"}!
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-text-muted" />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />

      {/* Contact List Modal */}
      <ContactListModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        onSelectContact={handleContactSelect}
        user={user}
      />

      {/* QR Scanner Modal */}
      <QRScannerModal
        isOpen={showQRScannerModal}
        onClose={() => setShowQRScannerModal(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </div>
  );
};

export default SecondaryDashboard;
