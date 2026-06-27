import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, ShieldCheck, Mail, Phone, Calendar, AlertCircle, Trash2 } from "lucide-react";
import { firebaseDB } from "../firebase";
import { useAuth } from "../context/AuthContext";
import MobileTabBar from "../components/navigation/MobileTabBar";

const MemberDetailsPage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [member, setMember] = useState(null);
  const [formData, setFormData] = useState({
    dailyLimit: 1000,
    monthlyLimit: 10000,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTx, setLoadingTx] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadMemberDetails = async () => {
      if (!memberId || !user) return;
      try {
        setLoading(true);
        // Get user details
        const userRes = await firebaseDB.getUser(memberId);
        if (userRes.success && userRes.data) {
          let memberData = { ...userRes.data };

          // Get limits from circle
          if (user.familyCircle) {
            const circleRes = await firebaseDB.getCircle(user.familyCircle);
            if (circleRes.success && circleRes.data.members) {
              const circleMember = circleRes.data.members.find(m => (m.id || m) === memberId);
              if (circleMember) {
                memberData.dailyLimit = circleMember.dailyLimit !== undefined ? circleMember.dailyLimit : 1000;
                memberData.monthlyLimit = circleMember.monthlyLimit !== undefined ? circleMember.monthlyLimit : 10000;
                memberData.relationship = circleMember.relationship || userRes.data.relationship || "Family member";
                memberData.joinedAt = circleMember.joinedAt || userRes.data.joinedAt || "";
              }
            }
          }

          setMember(memberData);
          setFormData({
            dailyLimit: memberData.dailyLimit || 1000,
            monthlyLimit: memberData.monthlyLimit || 10000,
          });
        } else {
          setError("Member not found");
        }
      } catch (err) {
        setError(err.message || "Failed to load member details");
      } finally {
        setLoading(false);
      }
    };

    loadMemberDetails();
  }, [memberId, user]);

  useEffect(() => {
    if (memberId && user?.familyCircle) {
      const fetchTx = async () => {
        setLoadingTx(true);
        const res = await firebaseDB.getUserTransactions(memberId, user.familyCircle, 20);
        if (res.success) {
          setTransactions(res.data);
        }
        setLoadingTx(false);
      };
      fetchTx();
    }
  }, [memberId, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleUpdateLimits = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoadingSave(true);
    try {
      if (user && user.familyCircle) {
        const circleRes = await firebaseDB.getCircle(user.familyCircle);
        if (circleRes.success && circleRes.data.members) {
          const updatedMembers = circleRes.data.members.map((m) => {
            const mId = m.id || m;
            if (mId === memberId) {
              return {
                ...m,
                dailyLimit: formData.dailyLimit,
                monthlyLimit: formData.monthlyLimit,
              };
            }
            return m;
          });
          
          await firebaseDB.updateCircle(user.familyCircle, {
            members: updatedMembers,
          });

          setSuccess("Spending limits updated successfully!");
          setMember(prev => ({
            ...prev,
            dailyLimit: formData.dailyLimit,
            monthlyLimit: formData.monthlyLimit
          }));
          setTimeout(() => setSuccess(""), 3000);
        }
      }
    } catch (err) {
      setError("Failed to update spending limits in database.");
    } finally {
      setLoadingSave(false);
    }
  };

  const handleDeleteMember = async () => {
    if (!window.confirm(`Are you sure you want to remove ${member?.name || "this member"} from your FamilyPay circle? This will revoke all spending access and limits immediately.`)) {
      return;
    }
    
    setLoadingDelete(true);
    setError("");
    setSuccess("");
    
    try {
      if (user && user.familyCircle) {
        const res = await firebaseDB.removeMemberFromCircle(user.familyCircle, memberId);
        if (res.success) {
          setSuccess("Member successfully removed from circle!");
          setTimeout(() => {
            navigate("/dashboard/members", { replace: true });
          }, 1500);
        } else {
          setError(res.error || "Failed to remove member");
          setLoadingDelete(false);
        }
      }
    } catch (err) {
      setError(err.message || "An error occurred while removing the member");
      setLoadingDelete(false);
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
    <div className="min-h-screen bg-bg p-4 sm:p-6 pb-24">
      {/* Back Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/dashboard/members")}
          className="p-2 bg-bg-elevated hover:bg-bg-elevated/80 border border-border rounded-xl text-text-muted hover:text-text transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2">
            {member?.name || "Member Details"}
          </h1>
          <p className="text-text-muted text-sm mt-0.5">Manage spending limits and view transaction logs</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm flex items-center gap-2 mb-6 max-w-4xl">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-success/10 border border-success/20 rounded-xl text-success text-sm flex items-center gap-2 mb-6 max-w-4xl">
          <ShieldCheck className="w-4 h-4" /> {success}
        </div>
      )}

      {member && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Spending Controls */}
            <div className="card p-5 border border-border bg-bg-card">
              <h4 className="font-bold text-text text-base mb-4 flex items-center gap-2">
                🛡️ Spending Controls
              </h4>
              <form onSubmit={handleUpdateLimits} className="space-y-4">
                <div>
                  <label className="form-label text-sm text-text-muted mb-1 block">Daily Limit (₹)</label>
                  <input
                    type="number"
                    name="dailyLimit"
                    className="form-input text-base py-2.5"
                    min="0"
                    step="100"
                    value={formData.dailyLimit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="form-label text-sm text-text-muted mb-1 block">Monthly Limit (₹)</label>
                  <input
                    type="number"
                    name="monthlyLimit"
                    className="form-input text-base py-2.5"
                    min="0"
                    step="500"
                    value={formData.monthlyLimit}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loadingSave}
                  className="btn btn-primary w-full py-2.5 font-semibold text-sm flex items-center justify-center mt-2"
                >
                  {loadingSave ? <div className="loading-spinner w-5 h-5 border-2"></div> : "Save Limits"}
                </button>
              </form>
            </div>

            {/* Profile Info Summary */}
            <div className="card p-5 border border-border bg-bg-card">
              <h4 className="font-bold text-text text-base mb-4 flex items-center gap-2">
                👤 Contact Information
              </h4>
              <div className="space-y-4">
                {member.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Email Address</div>
                      <div className="text-sm text-text font-medium truncate max-w-[200px]" title={member.email}>{member.email}</div>
                    </div>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Phone Number</div>
                      <div className="text-sm text-text font-medium">{member.phone}</div>
                    </div>
                  </div>
                )}
                {member.relationship && (
                  <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Circle Role</div>
                      <span className="inline-flex text-xs font-semibold bg-primary/10 border border-primary/20 text-primary px-2.5 py-0.5 rounded-full mt-1">
                        {member.relationship}
                      </span>
                    </div>
                  </div>
                )}
                {member.joinedAt && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-text-muted" />
                    <div>
                      <div className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Joined Circle</div>
                      <div className="text-xs text-text-muted mt-1">
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="card p-5 border border-danger/25 bg-danger/5">
              <h4 className="font-bold text-danger text-base mb-3 flex items-center gap-2">
                ⚠️ Danger Zone
              </h4>
              <p className="text-xs text-text-muted mb-4">
                Remove this member from your circle. They will instantly lose spending privileges, limit tracking, and circle membership.
              </p>
              <button
                onClick={handleDeleteMember}
                disabled={loadingDelete}
                className="btn btn-danger w-full py-2.5 font-bold text-sm flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors border-none"
              >
                {loadingDelete ? (
                  <div className="loading-spinner w-5 h-5 border-2 border-white"></div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Member</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Transactions Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-5 border border-border bg-bg-card">
              <h4 className="font-bold text-text text-base mb-4 flex items-center gap-2">
                📋 Transaction History logs (Golu Raja)
              </h4>
              {loadingTx ? (
                <div className="flex justify-center items-center py-12">
                  <div className="loading-spinner"></div>
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex justify-between items-center p-4 bg-bg-elevated/40 border border-border/80 rounded-xl hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${
                          (tx.status || "").toLowerCase() === "completed" 
                            ? "bg-success/15 text-success" 
                            : (tx.status || "").toLowerCase() === "rejected"
                            ? "bg-danger/15 text-danger"
                            : "bg-warning/15 text-warning"
                        }`}>
                          {tx.amount >= 1000 ? "⚠️" : "💸"}
                        </div>
                        <div>
                          <div className="font-semibold text-text text-sm sm:text-base">{tx.description || "UPI Payment"}</div>
                          <div className="text-xs text-text-muted mt-0.5">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "Recent"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-text text-sm sm:text-base">₹{tx.amount}</div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full inline-block mt-1.5 uppercase ${
                          (tx.status || "").toLowerCase() === "completed" 
                            ? "bg-success/10 text-success" 
                            : (tx.status || "").toLowerCase() === "rejected"
                            ? "bg-danger/10 text-danger"
                            : "bg-warning/10 text-warning"
                        }`}>
                          {tx.status || "pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-sm text-text-muted border border-dashed border-border rounded-xl">
                  No recent transactions found for Golu Raja.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <MobileTabBar userRole={user?.role} />
    </div>
  );
};

export default MemberDetailsPage;
