import { useState } from "react";
import {
  X,
  Smartphone,
  CreditCard,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const UPIPaymentModal = ({
  isOpen,
  onClose,
  paymentData,
  onPaymentComplete,
}) => {
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(false);

  // UPI payment apps configuration
  const upiApps = [
    {
      id: "phonepe",
      name: "PhonePe",
      icon: "📱",
      color: "bg-purple-500",
      upiUrl: "phonepe",
      packageName: "com.phonepe.app",
    },
    {
      id: "googlepay",
      name: "Google Pay",
      icon: "💳",
      color: "bg-blue-500",
      upiUrl: "gpay",
      packageName: "com.google.android.apps.nbu.paisa.user",
    },
    {
      id: "paytm",
      name: "Paytm",
      icon: "💰",
      color: "bg-cyan-500",
      upiUrl: "paytmmp",
      packageName: "net.one97.paytm",
    },
    {
      id: "bhim",
      name: "BHIM",
      icon: "🏛️",
      color: "bg-orange-500",
      upiUrl: "bhim",
      packageName: "in.org.npci.upiapp",
    },
    {
      id: "amazonpay",
      name: "Amazon Pay",
      icon: "🛒",
      color: "bg-yellow-500",
      upiUrl: "amazonpay",
      packageName: "in.amazon.mShop.android.shopping",
    },
    {
      id: "mobikwik",
      name: "MobiKwik",
      icon: "💵",
      color: "bg-green-500",
      upiUrl: "mobikwik",
      packageName: "com.mobikwik.android",
    },
  ];

  const generateUPIUrl = () => {
    const { upiId, amount, description } = paymentData;
    const encodedUPIId = encodeURIComponent(upiId);
    const encodedName = encodeURIComponent(paymentData.name || "");
    const encodedDescription = encodeURIComponent(
      description || "Payment via FamilyPay",
    );

    // UPI URL format
    const upiUrl = `upi://pay?pa=${encodedUPIId}&pn=${encodedName}&am=${amount}&cu=INR&tn=${encodedDescription}`;

    return upiUrl;
  };

  const handleAppSelection = (app) => {
    setSelectedApp(app);
    initiatePayment(app);
  };

  const initiatePayment = async (selectedApp) => {
    setLoading(true);

    try {
      const upiUrl = generateUPIUrl();

      // For mobile devices, try to open the UPI app
      if (isMobileDevice()) {
        // Try to open the specific UPI app
        const appUrl = `${selectedApp.upiUrl}://upi/pay?pa=${encodeURIComponent(paymentData.upiId)}&pn=${encodeURIComponent(paymentData.name || "")}&am=${paymentData.amount}&cu=INR`;

        // Try opening the app using window.open (safer than direct href)
        const newWindow = window.open(appUrl, "_blank");

        // Fallback to generic UPI URL if app doesn't open
        setTimeout(() => {
          if (newWindow) {
            newWindow.location.href = upiUrl;
          } else {
            window.open(upiUrl, "_blank");
          }
        }, 2000);
      } else {
        // For desktop, show UPI QR code or instructions
        showDesktopUPIOptions(upiUrl);
      }

      // Simulate payment completion after delay
      setTimeout(() => {
        setLoading(false);
        onPaymentComplete({
          success: true,
          app: selectedApp.name,
          transactionId: `TXN${Date.now()}`,
          amount: paymentData.amount,
          upiId: paymentData.upiId,
        });
      }, 5000);
    } catch (error) {
      console.error("Payment initiation failed:", error);
      setLoading(false);
    }
  };

  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );
  };

  const showDesktopUPIOptions = (upiUrl) => {
    // For desktop, we could show a QR code or copy UPI ID
    alert(
      `UPI Payment URL: ${upiUrl}\n\nPlease use your UPI app to complete the payment.`,
    );
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(paymentData.upiId);
    // Show success message
    const button = document.getElementById("copy-upi-btn");
    if (button) {
      button.textContent = "Copied!";
      setTimeout(() => {
        button.textContent = "Copy UPI ID";
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text">
            Choose Payment App
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Payment Details */}
        <div className="p-4 border-b border-border">
          <div className="bg-bg-elevated rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">Paying to:</span>
              <span className="font-medium text-text">
                {paymentData.name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-muted">UPI ID:</span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-text">
                  {paymentData.upiId}
                </span>
                <button
                  id="copy-upi-btn"
                  onClick={handleCopyUPI}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">Amount:</span>
              <span className="text-lg font-semibold text-primary">
                ₹{paymentData.amount}
              </span>
            </div>
          </div>
        </div>

        {/* UPI Apps Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            <p className="text-sm text-text-muted text-center">
              Select your preferred UPI payment app
            </p>

            <div className="grid grid-cols-2 gap-3">
              {upiApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleAppSelection(app)}
                  disabled={loading}
                  className={`p-4 rounded-lg border-2 border-border hover:border-primary transition-all ${
                    selectedApp?.id === app.id
                      ? "border-primary bg-primary/10"
                      : ""
                  } ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-bg-elevated"}`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <div
                      className={`w-12 h-12 ${app.color} rounded-full flex items-center justify-center text-2xl`}
                    >
                      {app.icon}
                    </div>
                    <span className="text-sm font-medium text-text">
                      {app.name}
                    </span>
                    {selectedApp?.id === app.id && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {loading && (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-primary">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">
                    Opening {selectedApp?.name}...
                  </span>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-bg-elevated rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <div className="text-xs text-text-muted">
                  <p className="font-medium mb-1">Payment Instructions:</p>
                  <ul className="space-y-1">
                    <li>• Select your preferred UPI app</li>
                    <li>• The app will open automatically</li>
                    <li>• Confirm the payment in the app</li>
                    <li>• You'll be redirected back here</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onClose}
            disabled={loading}
            className="w-full btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UPIPaymentModal;
