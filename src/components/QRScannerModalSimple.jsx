import { useState, useEffect } from "react";
import {
  X,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess }) => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock QR codes for demo purposes
  const mockQRCodes = [
    {
      upiId: "mom@familypay",
      name: "Mom",
      phone: "+91 98765 43210",
      amount: null,
    },
    {
      upiId: "dad@familypay",
      name: "Dad",
      phone: "+91 98765 43211",
      amount: null,
    },
    {
      upiId: "sister@familypay",
      name: "Sister",
      phone: "+91 98765 43212",
      amount: null,
    },
    {
      upiId: "john@paytm",
      name: "John Doe",
      phone: "+91 98765 43214",
      amount: 500,
    },
    {
      upiId: "merchant@paytm",
      name: "Grocery Store",
      phone: "+91 98765 43220",
      amount: 250,
    },
  ];

  const simulateScan = (qrIndex = null) => {
    setLoading(true);
    
    setTimeout(() => {
      const randomQR = qrIndex !== null 
        ? mockQRCodes[qrIndex]
        : mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
      
      setScanResult(randomQR);
      setLoading(false);

      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    }, 1500);
  };

  const handleProceedToPayment = () => {
    if (scanResult) {
      onScanSuccess(scanResult);
      onClose();
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    simulateScan();
  };

  const handleClose = () => {
    setScanResult(null);
    setLoading(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen && !scanResult && !loading) {
      // Auto-start scanning when modal opens
      simulateScan();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        {/* Scanner Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!scanResult ? (
            <div className="space-y-6">
              {/* QR Scanner Simulation */}
              <div
                className="relative bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden"
                style={{ aspectRatio: "1" }}
              >
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative">
                      <QrCode className="w-24 h-24 text-primary animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      </div>
                    </div>
                    <p className="text-sm text-text-muted mt-4">Scanning QR Code...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <QrCode className="w-24 h-24 text-primary mb-4" />
                    <p className="text-sm text-text-muted">QR Scanner Ready</p>
                  </div>
                )}

                {/* Scanning Frame */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-primary/50 rounded-lg relative">
                    {/* Corner Markers */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>

                    {/* Scanning Line */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-primary animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center space-y-4">
                <p className="text-sm text-text-muted">
                  Demo QR Scanner - Auto-scanning in progress
                </p>
                
                {/* Quick Select Options */}
                <div className="space-y-2">
                  <p className="text-xs text-text-muted">Or select a contact directly:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {mockQRCodes.slice(0, 4).map((qr, index) => (
                      <button
                        key={qr.upiId}
                        onClick={() => simulateScan(index)}
                        disabled={loading}
                        className="p-2 bg-bg-elevated hover:bg-bg-elevated/80 rounded-lg text-xs text-text transition-colors disabled:opacity-50"
                      >
                        {qr.avatar || "👤"} {qr.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Scan Result */
            <div className="space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-text mb-2">
                  QR Code Scanned!
                </h3>
                <p className="text-sm text-text-muted">
                  Payment details retrieved successfully
                </p>
              </div>

              {/* Scanned Result Card */}
              <div className="card border-2 border-success/20 bg-success/5">
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-2xl">
                      {scanResult.name === "Mom"
                        ? "👩"
                        : scanResult.name === "Dad"
                          ? "👨"
                          : scanResult.name === "Sister"
                            ? "👧"
                            : scanResult.name === "John Doe"
                              ? "👤"
                              : "🏪"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-text">{scanResult.name}</p>
                      <p className="text-sm text-text-muted">{scanResult.upiId}</p>
                      <p className="text-xs text-text-muted">{scanResult.phone}</p>
                    </div>
                  </div>
                  
                  {scanResult.amount && (
                    <div className="bg-bg-elevated rounded-lg p-3">
                      <p className="text-sm text-text-muted">Amount</p>
                      <p className="text-lg font-semibold text-primary">₹{scanResult.amount}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleRetry}
                  className="flex-1 btn btn-secondary"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scan Again
                </button>
                <button
                  onClick={handleProceedToPayment}
                  className="flex-1 btn btn-primary"
                >
                  Proceed to Pay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScannerModal;
