import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { firebaseDB } from "../firebase";
import paymentService from "../services/paymentService";
import PaymentRequestModal from "../components/PaymentRequestModal";
import {
  QrCode,
  CreditCard,
  Smartphone,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

const SecondaryDashboard = () => {
  const { user, logout } = useAuth();

  const [circle, setCircle] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

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

      setLoading(false);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Set up real-time listener for transactions
  useEffect(() => {
    if (user) {
      const unsubscribe = paymentService.listenToUserTransactions(
        user.id,
        (updatedTransactions) => {
          setTransactions(updatedTransactions);
        },
      );

      return () => {
        if (unsubscribe) unsubscribe();
      };
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
    <div className="min-h-screen bg-bg animate-fade-in">
      <header className="bg-bg-card border-b border-border p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-text mb-1">
              👤 Member Dashboard
            </h1>
            <p className="text-text-muted text-sm">
              Welcome, {user?.name || "User"}!
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Quick Payment Section */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-text">
              💸 Quick Payment
            </h3>
            <div className="text-sm text-text-muted">
              <span className="text-success">Auto-approved</span> for payments
              &lt; ₹1000 |<span className="text-warning"> Admin approval</span>{" "}
              for payments ≥ ₹1000
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter amount"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="What's this payment for?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  UPI ID (Optional)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={`${user?.name?.toLowerCase().replace(" ", "") || "user"}@familypay`}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="space-y-4">
              <h4 className="font-medium text-text">Choose Payment Method</h4>

              {/* QR Scanner */}
              <button
                onClick={() => setShowScannerModal(true)}
                className="w-full p-4 bg-bg-elevated border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <QrCode className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text">Scan QR Code</div>
                    <div className="text-sm text-text-muted">
                      Scan merchant QR code
                    </div>
                  </div>
                </div>
              </button>

              {/* UPI Payment */}
              <button
                onClick={() => setShowUpiModal(true)}
                className="w-full p-4 bg-bg-elevated border border-border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <Smartphone className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text">UPI Payment</div>
                    <div className="text-sm text-text-muted">
                      Pay via UPI apps
                    </div>
                  </div>
                </div>
              </button>

              {/* Card Payment */}
              <button
                onClick={() => handleQuickPayment("card")}
                disabled={processingPayment || !amount}
                className="w-full p-4 bg-bg-elevated border border-border rounded-lg hover:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-success/10 rounded-lg">
                    <CreditCard className="w-6 h-6 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text">Card Payment</div>
                    <div className="text-sm text-text-muted">
                      Pay with debit/credit card
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Threshold Info */}
        <div className="card mb-6">
          <p className="text-sm text-text-muted mb-2">
            💡 Smart Payment System
          </p>
          <p className="text-text">
            Payments below ₹1000 are automatically approved for your
            convenience. Payments of ₹1000 or above require admin approval to
            ensure security and proper budget management.
          </p>
        </div>

        {/* Spending Limits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Daily Limit</h3>
              <span className="text-2xl font-bold text-primary">
                ₹{dailyRemaining.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Spent</span>
                <span className="text-text">
                  ₹{circle?.currentDailySpent?.toLocaleString() || 0} / ₹
                  {circle?.dailyLimit?.toLocaleString() || 0}
                </span>
              </div>
              <div className="w-full bg-bg-elevated rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-text-muted">
                {dailyPercentage.toFixed(1)}% used
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Monthly Limit</h3>
              <span className="text-2xl font-bold text-primary">
                ₹{monthlyRemaining.toLocaleString()}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Spent</span>
                <span className="text-text">
                  ₹{circle?.currentMonthlySpent?.toLocaleString() || 0} / ₹
                  {circle?.monthlyLimit?.toLocaleString() || 0}
                </span>
              </div>
              <div className="w-full bg-bg-elevated rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-secondary to-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-text-muted">
                {monthlyPercentage.toFixed(1)}% used
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-text">
              Recent Transactions
            </h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowPaymentModal(true)}
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg border border-border"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.status === "completed"
                        ? "bg-success/10"
                        : transaction.status === "pending"
                          ? "bg-warning/10"
                          : "bg-danger/10"
                    }`}
                  >
                    {transaction.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : transaction.status === "pending" ? (
                      <Clock className="w-5 h-5 text-warning" />
                    ) : (
                      <X className="w-5 h-5 text-danger" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-text">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-text-muted">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-text">
                    ₹{transaction.amount}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === "completed"
                        ? "bg-success/10 text-success"
                        : transaction.status === "pending"
                          ? "bg-warning/10 text-warning"
                          : "bg-danger/10 text-danger"
                    }`}
                  >
                    {transaction.status === "completed"
                      ? "Completed"
                      : transaction.status === "pending"
                        ? "Pending Approval"
                        : "Failed"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">Scan QR Code</h3>
              <button onClick={() => setShowScannerModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="w-48 h-48 mx-auto bg-bg-elevated rounded-lg flex items-center justify-center mb-4">
                <QrCode className="w-24 h-24 text-text-muted" />
              </div>
              <p className="text-sm text-text-muted">
                Scan merchant QR code to auto-fill payment details
              </p>
            </div>
            <button
              onClick={() => handleQuickPayment("qr")}
              disabled={processingPayment || !amount}
              className="w-full btn btn-primary"
            >
              {processingPayment ? "Processing..." : `Pay ₹${amount || "0"}`}
            </button>
          </div>
        </div>
      )}

      {/* UPI Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-bg-card rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-text">UPI Payment</h3>
              <button onClick={() => setShowUpiModal(false)}>
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-16 h-16 text-white" />
                </div>
                <p className="text-sm text-text-muted">Pay using any UPI app</p>
              </div>
              <div className="p-3 bg-bg-elevated rounded-lg">
                <p className="text-xs text-text-muted mb-1">UPI ID</p>
                <p className="font-mono text-text">
                  {upiId ||
                    `${user?.name?.toLowerCase().replace(" ", "") || "user"}@familypay`}
                </p>
              </div>
              <button
                onClick={() => handleQuickPayment("upi")}
                disabled={processingPayment || !amount}
                className="w-full btn btn-primary"
              >
                {processingPayment ? "Processing..." : `Pay ₹${amount || "0"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Request Modal */}
      {showPaymentModal && (
        <PaymentRequestModal
          onClose={() => setShowPaymentModal(false)}
          onAdd={handlePaymentRequest}
        />
      )}
    </div>
  );
};

export default SecondaryDashboard;
