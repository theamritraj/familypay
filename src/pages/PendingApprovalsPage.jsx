import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import paymentService from "../services/paymentService";
import { CheckCircle, XCircle, Clock, Search, Filter } from "lucide-react";

const PendingApprovalsPage = () => {
  const { user } = useAuth();
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPending = async () => {
    try {
      if (user && user.familyCircle) {
        setLoading(true);
        const result = await paymentService.getPendingTransactions(user.familyCircle);
        if (result && result.success) {
          const mapped = (result.data || []).map(t => ({
            ...t,
            date: new Date(t.createdAt || Date.now())
          }));
          mapped.sort((a, b) => b.date - a.date);
          setPendingTransactions(mapped);
        } else {
          setPendingTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, [user]);

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this payment?")) return;
    try {
      const res = await paymentService.approvePayment(id, user.id);
      if (res.success) {
        setPendingTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    try {
      const res = await paymentService.rejectPayment(id, user.id, reason);
      if (res.success) {
        setPendingTransactions(prev => prev.filter(t => t.id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Pending Approvals</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-bg-elevated rounded-lg transition-colors">
            <Filter className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {pendingTransactions.length === 0 ? (
           <div className="text-center py-12 card">
             <Clock className="w-12 h-12 text-text-muted mx-auto mb-4" />
             <h3 className="text-lg font-semibold text-text mb-2">No pending approvals</h3>
             <p className="text-text-muted">You're all caught up!</p>
           </div>
        ) : (
          pendingTransactions.map(t => (
            <div key={t.id} className="card p-4 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium text-text">{t.fromUserName} is requesting approval</p>
                    <p className="text-sm text-text-muted">{t.description || "Payment Request"}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text mb-2">₹{t.amount?.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleReject(t.id)}
                      className="px-3 py-1 bg-danger/10 text-danger rounded-md text-sm font-medium hover:bg-danger/20 transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => handleApprove(t.id)}
                      className="px-3 py-1 bg-success text-white rounded-md text-sm font-medium hover:bg-success/90 transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PendingApprovalsPage;
