import { useState, useEffect, useRef } from "react";
import {
  X,
  Camera,
  QrCode,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

const QRScannerModal = ({ isOpen, onClose, onScanSuccess, user }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

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

  const requestCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: "camera" });
      setPermission(result.state);

      if (result.state === "granted") {
        startCamera();
      } else if (result.state === "prompt") {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        setPermission("granted");
        startCamera();
      }
    } catch (err) {
      console.error("Camera permission error:", err);
      setPermission("denied");
      setError("Camera access denied. Please enable camera permissions.");
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsScanning(true);
        setError(null);

        // Start scanning simulation
        simulateScanning();
      }
    } catch (err) {
      console.error("Camera start error:", err);
      setError("Unable to access camera. Please check your camera settings.");
      setPermission("denied");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const simulateScanning = () => {
    // Simulate QR code detection after 3 seconds
    setTimeout(() => {
      if (isScanning) {
        const randomQR =
          mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
        handleScanSuccess(randomQR);
      }
    }, 3000);
  };

  const handleScanSuccess = (qrData) => {
    setScanResult(qrData);
    setIsScanning(false);
    stopCamera();

    // Vibrate if available
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const handleProceedToPayment = () => {
    if (scanResult) {
      onScanSuccess(scanResult);
      onClose();
    }
  };

  const handleRetry = () => {
    setScanResult(null);
    setError(null);
    startCamera();
  };

  const handleClose = () => {
    stopCamera();
    setScanResult(null);
    setError(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      requestCameraPermission();
    }

    return () => {
      stopCamera();
    };
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
            <div className="space-y-4">
              {/* Camera View */}
              <div
                className="relative bg-black rounded-lg overflow-hidden"
                style={{ aspectRatio: "1" }}
              >
                {isScanning ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Scanning Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-primary rounded-lg relative">
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

                    {/* Scanning Instructions */}
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full inline-block">
                        Align QR code within frame
                      </p>
                    </div>
                  </>
                ) : permission === "denied" || error ? (
                  <div className="flex flex-col items-center justify-center h-full text-white p-4">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <p className="text-center text-sm">
                      {error || "Camera permission denied"}
                    </p>
                    <button
                      onClick={handleRetry}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white">
                    <Loader2 className="w-16 h-16 animate-spin mb-4" />
                    <p className="text-sm">Requesting camera access...</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              <div className="text-center space-y-2">
                <p className="text-sm text-text-muted">
                  Position the QR code within the frame to scan
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>Auto-detect</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Camera className="w-3 h-3 text-primary" />
                    <span>Rear camera</span>
                  </div>
                </div>
              </div>

              {/* Manual Entry Option */}
              <div className="text-center">
                <button
                  onClick={() => {
                    // Simulate manual QR code entry
                    const randomQR =
                      mockQRCodes[
                        Math.floor(Math.random() * mockQRCodes.length)
                      ];
                    handleScanSuccess(randomQR);
                  }}
                  className="text-primary text-sm hover:text-primary/80 transition-colors"
                >
                  Can't scan? Enter UPI ID manually
                </button>
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
                      <p className="font-medium text-text">{scanResult.name}</p>
                      <p className="text-sm text-text-muted">
                        {scanResult.upiId}
                      </p>
                    </div>
                  </div>

                  {scanResult.phone && (
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <span>Phone:</span>
                      <span>{scanResult.phone}</span>
                    </div>
                  )}

                  {scanResult.amount && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>Amount:</span>
                      <span className="font-semibold text-primary">
                        ₹{scanResult.amount}
                      </span>
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
