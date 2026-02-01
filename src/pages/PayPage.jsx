import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import paymentService from "../services/paymentService";
import QRScannerModal from "../components/QRScannerModalLive";
import UPIPaymentModal from "../components/UPIPaymentModal";
import {
  QrCode,
  CreditCard,
  Smartphone,
  Banknote,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Camera,
  Search,
  User,
  Calendar,
  ArrowLeft,
  Send,
  Users,
  Phone,
  Mail,
} from "lucide-react";

const PayPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("PayPage rendering, user:", user); // Debug log

  const [activeTab, setActiveTab] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [selectedContact, setSelectedContact] = useState(
    location.state?.selectedContact || null,
  );
  const [recipient, setRecipient] = useState(selectedContact?.name || "");
  const [recipientPhone, setRecipientPhone] = useState(
    selectedContact?.phone || "",
  );
  const [amount, setAmount] = useState(
    selectedContact?.preselectedAmount?.toString() || "",
  );
  const [description, setDescription] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [recentPayments, setRecentPayments] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showUPIPaymentModal, setShowUPIPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    upiId: "",
    description: "",
    recipientName: "",
    paymentMethod: "upi",
  });

  const [quickAmounts] = [100, 200, 500, 1000, 2000, 5000];

  const frequentContacts = [
    { name: "Mom", upiId: "mom@familypay", avatar: "M" },
    { name: "Dad", upiId: "dad@familypay", avatar: "D" },
    { name: "Brother", upiId: "brother@familypay", avatar: "B" },
    { name: "Sister", upiId: "sister@familypay", avatar: "S" },
    { name: "Friend", upiId: "friend@familypay", avatar: "F" },
    { name: "Grocery Store", upiId: "grocery@paytm", avatar: "G" },
  ];

  const merchants = [
    { name: "Amazon", upiId: "amazon@paytm", category: "Shopping", icon: "🛒" },
    {
      name: "Flipkart",
      upiId: "flipkart@paytm",
      category: "Shopping",
      icon: "🛍️",
    },
    { name: "Swiggy", upiId: "swiggy@paytm", category: "Food", icon: "🍔" },
    { name: "Zomato", upiId: "zomato@paytm", category: "Food", icon: "🍕" },
    { name: "Uber", upiId: "uber@paytm", category: "Travel", icon: "🚗" },
    { name: "Ola", upiId: "ola@paytm", category: "Travel", icon: "🚕" },
    {
      name: "BigBasket",
      upiId: "bigbasket@paytm",
      category: "Grocery",
      icon: "🥬",
    },
    {
      name: "PhonePe",
      upiId: "phonepe@paytm",
      category: "Recharge",
      icon: "📱",
    },
  ];

  useEffect(() => {
    loadRecentPayments();
  }, []);

  const loadRecentPayments = async () => {
    try {
      const result = await paymentService.getUserTransactions(user.id, 10);
      if (result.success) {
        setRecentPayments(result.data);
      }
    } catch (error) {
      console.error("Error loading recent payments:", error);
    }
  };

  const handleQuickAmount = (amount) => {
    setPaymentData({
      ...paymentData,
      amount: amount.toString(),
    });
  };

  const handleContactSelect = (contact) => {
    setPaymentData({
      ...paymentData,
      upiId: contact.upiId,
      recipientName: contact.name,
    });
  };

  const handleMerchantSelect = (merchant) => {
    setPaymentData({
      ...paymentData,
      upiId: merchant.upiId,
      recipientName: merchant.name,
    });
  };

  const handleUPIPayment = () => {
    if (!paymentData.amount || !paymentData.upiId) {
      alert("Please fill in all required fields");
      return;
    }
    setShowUPIPaymentModal(true);
  };

  const handlePaymentComplete = (result) => {
    setShowUPIPaymentModal(false);
    if (result.success) {
      alert(
        `Payment successful via ${result.app}! Transaction ID: ${result.transactionId}`,
      );
      setPaymentData({
        amount: "",
        upiId: "",
        description: "",
        recipientName: "",
        paymentMethod: "upi",
      });
      loadRecentPayments();
    }
  };

  const handlePayment = async (method) => {
    if (!paymentData.amount || parseFloat(paymentData.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!paymentData.upiId) {
      alert("Please enter UPI ID or select a recipient");
      return;
    }

    setLoading(true);
    try {
      const result = await paymentService.createPayment({
        amount: parseFloat(paymentData.amount),
        description:
          paymentData.description ||
          `Payment to ${paymentData.recipientName || paymentData.upiId}`,
        method: method,
        upiId: paymentData.upiId,
        fromUserId: user.id,
        fromUserName: user.name,
      });

      if (result.success) {
        setShowSuccess(true);
        setPaymentData({
          amount: "",
          upiId: "",
          description: "",
          recipientName: "",
          paymentMethod: "upi",
        });
        loadRecentPayments();

        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        alert("Payment failed: " + result.error);
      }
    } catch (error) {
      alert("Payment error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleQRScan = () => {
    setShowScanner(true);
    // In a real app, you'd integrate with camera API
    setTimeout(() => {
      const mockQRData = {
        upiId: "scanned@merchant",
        name: "Scanned Merchant",
        amount: "500",
      };
      setPaymentData({
        ...paymentData,
        upiId: mockQRData.upiId,
        recipientName: mockQRData.name,
        amount: mockQRData.amount,
      });
      setShowScanner(false);
      setActiveTab("upi");
    }, 2000);
  };

  const tabs = [
    { id: "quick", label: "Quick Pay", icon: ArrowRight },
    { id: "upi", label: "UPI", icon: Smartphone },
    { id: "qr", label: "QR Scan", icon: QrCode },
    { id: "recent", label: "Recent", icon: Clock },
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
            <h1 className="text-xl sm:text-2xl font-bold text-text">Pay</h1>
          </div>
          <div className="text-sm font-medium text-text">
            Balance: ₹{(user.balance || 10000).toLocaleString()}
          </div>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {/* Selected Contact Display */}
        {selectedContact && (
          <div className="card mb-6 border-2 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3 p-4">
              <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-2xl border-2 border-border">
                {selectedContact.avatar || "👤"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-text">
                    {selectedContact.name}
                  </p>
                  {selectedContact.isFamily && (
                    <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                      Family
                    </span>
                  )}
                  {selectedContact.upiId && (
                    <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full">
                      QR Scanned
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Phone className="w-3 h-3" />
                  <span>{selectedContact.phone}</span>
                </div>
                {selectedContact.upiId && (
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Mail className="w-3 h-3" />
                    <span>{selectedContact.upiId}</span>
                  </div>
                )}
                {selectedContact.preselectedAmount && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <span>
                      Pre-filled amount: ₹{selectedContact.preselectedAmount}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setSelectedContact(null);
                  setRecipient("");
                  setRecipientPhone("");
                  setAmount("");
                }}
                className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "bg-bg-elevated text-text hover:border-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Pay Tab */}
        {activeTab === "quick" && (
          <div className="space-y-6">
            {/* Amount Input */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">
                Enter Amount
              </h3>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-text mb-2">₹</div>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) =>
                    setPaymentData({ ...paymentData, amount: e.target.value })
                  }
                  className="w-full text-3xl font-bold text-center bg-transparent border-0 outline-none text-text placeholder-text-muted"
                  placeholder="0"
                  min="1"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className={`p-3 rounded-lg border transition-colors ${
                      paymentData.amount === amount.toString()
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequent Contacts */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">
                Frequent Contacts
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {frequentContacts.map((contact, index) => (
                  <button
                    key={index}
                    onClick={() => handleContactSelect(contact)}
                    className="p-3 bg-bg-elevated rounded-lg hover:border-primary transition-colors text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                      {contact.avatar}
                    </div>
                    <div className="text-sm font-medium text-text">
                      {contact.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Merchants */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">
                Popular Merchants
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {merchants.map((merchant, index) => (
                  <button
                    key={index}
                    onClick={() => handleMerchantSelect(merchant)}
                    className="p-3 bg-bg-elevated rounded-lg hover:border-primary transition-colors text-center"
                  >
                    <div className="text-2xl mb-2">{merchant.icon}</div>
                    <div className="text-sm font-medium text-text">
                      {merchant.name}
                    </div>
                    <div className="text-xs text-text-muted">
                      {merchant.category}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Button */}
            {paymentData.amount && (
              <div className="card">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">
                      Description (Optional)
                    </label>
                    <input
                      type="text"
                      value={paymentData.description}
                      onChange={(e) =>
                        setPaymentData({
                          ...paymentData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="What's this payment for?"
                    />
                  </div>

                  <button
                    onClick={handleUPIPayment}
                    disabled={loading || !paymentData.upiId}
                    className="w-full btn btn-primary text-lg py-4"
                  >
                    {loading ? (
                      <div className="loading-spinner mx-auto"></div>
                    ) : (
                      `Continue to Pay ₹${paymentData.amount}`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* UPI Tab */}
        {activeTab === "upi" && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-6">
                UPI Payment
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    value={paymentData.upiId}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, upiId: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter UPI ID (e.g., name@upi)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentData.amount}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, amount: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    value={paymentData.description}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="What's this payment for?"
                  />
                </div>

                <button
                  onClick={handleUPIPayment}
                  disabled={
                    loading || !paymentData.amount || !paymentData.upiId
                  }
                  className="w-full btn btn-primary"
                >
                  {loading ? (
                    <div className="loading-spinner mx-auto"></div>
                  ) : (
                    `Continue to Pay ₹${paymentData.amount || "0"}`
                  )}
                </button>
              </div>
            </div>

            {/* UPI Apps */}
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-4">
                Pay with UPI Apps
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {["Google Pay", "PhonePe", "Paytm", "Amazon Pay"].map((app) => (
                  <button
                    key={app}
                    className="p-4 bg-bg-elevated rounded-lg hover:border-primary transition-colors text-center"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-2">
                      {app.charAt(0)}
                    </div>
                    <div className="text-sm font-medium text-text">{app}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* QR Scan Tab */}
        {activeTab === "qr" && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-6">
                Scan QR Code
              </h3>

              {showScanner ? (
                <div className="text-center">
                  <div className="w-64 h-64 mx-auto bg-bg-elevated rounded-lg flex items-center justify-center mb-4 border-2 border-dashed border-border">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-text-muted mx-auto mb-2" />
                      <p className="text-text-muted">Scanning...</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowScanner(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-64 h-64 mx-auto bg-bg-elevated rounded-lg flex items-center justify-center mb-6 border-2 border-dashed border-border">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-text-muted mx-auto mb-2" />
                      <p className="text-text-muted">QR Scanner Ready</p>
                    </div>
                  </div>
                  <button onClick={handleQRScan} className="btn btn-primary">
                    <Camera className="w-5 h-5 inline mr-2" />
                    Start Scanning
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Tab */}
        {activeTab === "recent" && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg font-semibold text-text mb-6">
                Recent Payments
              </h3>

              {recentPayments.length > 0 ? (
                <div className="space-y-3">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 bg-bg-elevated rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            payment.status === "completed"
                              ? "bg-success/10"
                              : payment.status === "pending"
                                ? "bg-warning/10"
                                : "bg-danger/10"
                          }`}
                        >
                          {payment.status === "completed" ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : payment.status === "pending" ? (
                            <Clock className="w-5 h-5 text-warning" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-danger" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-text">
                            {payment.description}
                          </div>
                          <div className="text-sm text-text-muted">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-text">
                          ₹{payment.amount}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === "completed"
                              ? "bg-success/10 text-success"
                              : payment.status === "pending"
                                ? "bg-warning/10 text-warning"
                                : "bg-danger/10 text-danger"
                          }`}
                        >
                          {payment.status === "completed"
                            ? "Completed"
                            : payment.status === "pending"
                              ? "Pending"
                              : "Failed"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <p className="text-text-muted">No recent payments</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-lg p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-text mb-2">
              Payment Successful!
            </h3>
            <p className="text-text-muted mb-4">
              ₹{paymentData.amount} paid successfully
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="btn btn-primary w-full"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />

      {/* UPI Payment Modal */}
      <UPIPaymentModal
        isOpen={showUPIPaymentModal}
        onClose={() => setShowUPIPaymentModal(false)}
        paymentData={{
          ...paymentData,
          name: paymentData.recipientName,
        }}
        onPaymentComplete={handlePaymentComplete}
      />
    </div>
  );
};

export default PayPage;
