import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import InviteCircleMemberModal from "../modals/InviteCircleMemberModal";
import { sendMemberInvite } from "../../pages/InviteMemberPage";
import SpendingControlsModal from "../modals/SpendingControlsModal";
import MobileTabBar from "../navigation/MobileTabBar";
import { firebaseDB } from "../../firebase";
import paymentService from "../../services/paymentService";

const AdminView = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [circle, setCircle] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [emergencyLock, setEmergencyLock] = useState(false);

  const openInviteFlow = () => {
    if (window.innerWidth < 1024) {
      navigate("/dashboard/members/invite");
      return;
    }
    setShowAddMember(true);
  };

  const loadDashboardData = async () => {
    try {
      if (user && user.familyCircle) {
        const [circleRes, pendingRes, transactionsRes] = await Promise.all([
          firebaseDB.getCircle(user.familyCircle),
          paymentService.getPendingTransactions(user.familyCircle),
          paymentService.getCircleTransactions(user.familyCircle),
        ]);
        if (circleRes.success) setCircle(circleRes.data);
        if (pendingRes.success) setPendingPayments(pendingRes.data);
        if (transactionsRes.success) setTransactions(transactionsRes.data);
      } else {
        setCircle(null);
        setPendingPayments([]);
        setTransactions([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard", err);
      setLoading(false);
    }
  };

  const handleApprovePayment = async (transactionId, approved) => {
    try {
      if (user && user.familyCircle) {
        if (approved) {
          await paymentService.approvePayment(transactionId, user.id);
        } else {
          await paymentService.rejectPayment(transactionId, user.id, "Rejected by Admin");
        }
        loadDashboardData();
      }
    } catch {
      alert("Failed to process payment");
    }
  };

  const handleUpdateLimit = async (memberId, limits) => {
    try {
      if (user && user.familyCircle && circle?.members) {
        const updatedMembers = circle.members.map((m) => {
          if (m.id === memberId || m.secondaryUserId === memberId) {
            return {
              ...m,
              dailyLimit: limits.dailyLimit,
              monthlyLimit: limits.monthlyLimit,
            };
          }
          return m;
        });
        await firebaseDB.updateCircle(user.familyCircle, {
          members: updatedMembers,
        });
        setCircle({ ...circle, members: updatedMembers });
        setSelectedMember(null);
      }
    } catch {
      throw new Error("Failed to update limits");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (user && user.familyCircle) {
          const [circleRes, pendingRes, transactionsRes] = await Promise.all([
            firebaseDB.getCircle(user.familyCircle),
            paymentService.getPendingTransactions(user.familyCircle),
            paymentService.getCircleTransactions(user.familyCircle),
          ]);
          if (isMounted) {
            if (circleRes.success) setCircle(circleRes.data);
            if (pendingRes.success) setPendingPayments(pendingRes.data);
            if (transactionsRes.success) setTransactions(transactionsRes.data);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setCircle(null);
            setPendingPayments([]);
            setTransactions([]);
            setLoading(false);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Error loading dashboard", err);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user]);



  // --- DYNAMIC CALCULATIONS ---
  const completedTransactions = transactions.filter(t => (t.status || "").toUpperCase() === "COMPLETED");
  const totalSpent = completedTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);
  const memberCount = circle?.members?.length || 0;
  const totalTransactionsCount = transactions.length;
  const pendingApprovalsCount = pendingPayments.length;

  const getDailySpendingData = () => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return {
        dateStr: d.toDateString(),
        day: daysOfWeek[d.getDay()],
        amount: 0,
      };
    }).reverse();

    completedTransactions.forEach((tx) => {
      if (!tx.createdAt) return;
      const txDate = new Date(tx.createdAt);
      const txDateStr = txDate.toDateString();
      const dayObj = last7Days.find(d => d.dateStr === txDateStr);
      if (dayObj) {
        dayObj.amount += Number(tx.amount || 0);
      }
    });

    const maxAmount = Math.max(...last7Days.map(d => d.amount), 1);
    return last7Days.map(d => ({
      day: d.day,
      amount: d.amount,
      percentage: Math.round((d.amount / maxAmount) * 100)
    }));
  };
  const dailySpendingData = getDailySpendingData();

  const getCategoryDistribution = () => {
    const categoryTotals = {};
    completedTransactions.forEach((tx) => {
      const cat = tx.category || tx.description || "Other";
      let normCat = "Other";
      const catLower = cat.toLowerCase();
      if (catLower.includes("groc") || catLower.includes("food")) normCat = "Food & Groceries";
      else if (catLower.includes("shop") || catLower.includes("amazon") || catLower.includes("clothing")) normCat = "Shopping";
      else if (catLower.includes("bill") || catLower.includes("electric") || catLower.includes("mobile") || catLower.includes("util")) normCat = "Bills & Utilities";
      else if (catLower.includes("fuel") || catLower.includes("petrol") || catLower.includes("travel") || catLower.includes("trans")) normCat = "Transport";
      else if (catLower.includes("fun") || catLower.includes("movie") || catLower.includes("entertainment") || catLower.includes("coffee") || catLower.includes("toy")) normCat = "Entertainment";

      categoryTotals[normCat] = (categoryTotals[normCat] || 0) + Number(tx.amount || 0);
    });

    const totalCategorySpent = Object.values(categoryTotals).reduce((sum, amt) => sum + amt, 0) || 1;

    const colors = {
      "Food & Groceries": "bg-green-500",
      "Shopping": "bg-blue-500",
      "Bills & Utilities": "bg-yellow-500",
      "Transport": "bg-purple-500",
      "Entertainment": "bg-pink-500",
      "Other": "bg-gray-500",
    };

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      percentage: Math.round((amount / totalCategorySpent) * 100),
      color: colors[category] || colors["Other"]
    })).sort((a, b) => b.amount - a.amount);
  };
  const categoryData = getCategoryDistribution();

  const getActivityFeed = () => {
    return transactions.slice(0, 5).map((tx, idx) => {
      const memberName = tx.fromUser?.name || "Member";
      if ((tx.status || "").toUpperCase() === "PENDING") {
        return {
          id: tx.id || idx,
          icon: "⚠️",
          title: "Pending Approval Request",
          description: `${memberName} requested ₹${tx.amount} for ${tx.description || "payment"}`,
          time: tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString() : "Just now",
        };
      } else if ((tx.status || "").toUpperCase() === "COMPLETED") {
        return {
          id: tx.id || idx,
          icon: "💸",
          title: "Transaction Completed",
          description: `${memberName} spent ₹${tx.amount} at ${tx.toUpiId || tx.description}`,
          time: tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString() : "Just now",
        };
      } else {
        return {
          id: tx.id || idx,
          icon: "❌",
          title: "Transaction Rejected",
          description: `${memberName}'s request of ₹${tx.amount} was rejected`,
          time: tx.createdAt ? new Date(tx.createdAt).toLocaleTimeString() : "Just now",
        };
      }
    });
  };
  const activityFeed = getActivityFeed();

  const totalMonthlyLimit = circle?.members?.reduce((sum, m) => sum + Number(m.monthlyLimit || 0), 0) || 1;
  const utilizationPercentage = Math.min(Math.round((totalSpent / totalMonthlyLimit) * 100), 100);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg animate-fade-in">
      <div className="w-full">
        <div className="p-6 pb-20 lg:pb-6">
          {/* Dashboard Header / Welcome Message */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-text">Welcome Back, {user?.name || "Admin"}! 👋</h2>
              <p className="text-text-muted text-sm font-medium">Here is what's happening with your family's circle payments today.</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setEmergencyLock(!emergencyLock)} 
                className={`btn ${emergencyLock ? "btn-danger bg-red-600 animate-pulse text-white font-bold" : "btn-secondary border-danger/40 text-danger hover:bg-danger/10"} flex items-center gap-2 text-sm px-4 py-2 rounded-lg`}
              >
                🔒 {emergencyLock ? "Unlock All Circle Payments" : "Emergency Pause All Payments"}
              </button>
            </div>
          </div>



          {emergencyLock && (
            <div className="alert alert-danger mb-6 flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 font-medium">
              <span className="font-bold">🚨 EMERGENCY LOCK ACTIVE:</span> All transactions from secondary family members are temporarily paused.
            </div>
          )}

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button onClick={openInviteFlow} className="card bg-bg-card border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-3 text-left">
              <div className="p-3 bg-primary/10 rounded-lg text-primary text-xl">👤</div>
              <div>
                <div className="font-semibold text-text text-sm">Invite Member</div>
                <div className="text-text-muted text-xs">Send secure access</div>
              </div>
            </button>
            <button onClick={() => window.location.href="/dashboard/payments"} className="card bg-bg-card border border-border hover:border-success/50 hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-3 text-left">
              <div className="p-3 bg-success/10 rounded-lg text-success text-xl">💸</div>
              <div>
                <div className="font-semibold text-text text-sm">Send UPI Money</div>
                <div className="text-text-muted text-xs">Simulate direct payments</div>
              </div>
            </button>
            <button onClick={() => window.location.href="/dashboard/transactions"} className="card bg-bg-card border border-border hover:border-info/50 hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-3 text-left">
              <div className="p-3 bg-info/10 rounded-lg text-info text-xl">📋</div>
              <div>
                <div className="font-semibold text-text text-sm">Download Report</div>
                <div className="text-text-muted text-xs">Statement PDF/CSV</div>
              </div>
            </button>
            <button onClick={() => window.location.href="/dashboard/profile"} className="card bg-bg-card border border-border hover:border-warning/50 hover:-translate-y-0.5 transition-all duration-200 p-4 flex items-center gap-3 text-left">
              <div className="p-3 bg-warning/10 rounded-lg text-warning text-xl">🛡️</div>
              <div>
                <div className="font-semibold text-text text-sm">Security & MFA</div>
                <div className="text-text-muted text-xs">Enforce double checks</div>
              </div>
            </button>
          </div>

          {/* Circle Limit Utilization Overview Banner */}
          <div className="card bg-bg-card border border-border mb-6 p-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
              <div>
                <h4 className="font-semibold text-text text-sm">Family Circle Monthly Limit Consumption</h4>
                <p className="text-text-muted text-xs">Consolidated usage across all delegated member accounts</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-base font-bold text-text">₹{totalSpent.toLocaleString()} spent</span>
                <span className="text-text-muted text-xs block sm:inline"> of ₹{totalMonthlyLimit.toLocaleString()} limit</span>
              </div>
            </div>
            <div className="w-full bg-bg-elevated rounded-full h-3 relative overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${utilizationPercentage > 85 ? "bg-danger" : utilizationPercentage > 60 ? "bg-warning" : "bg-primary"}`} 
                style={{ width: `${utilizationPercentage}%` }} 
              />
            </div>
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>0% consumed</span>
              <span className="font-semibold text-text">{utilizationPercentage}% budget utilized</span>
              <span>100% budget limit</span>
            </div>
          </div>

          {/* Family Pay Statistics Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Spending Card */}
            <div className="card bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-primary text-sm font-medium">Live Data</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">₹{totalSpent.toLocaleString()}</div>
                <div className="text-sm text-text-muted">Total Spending</div>
              </div>
            </div>

            {/* Family Members Card */}
            <div className="card bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 00-5.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <span className="text-blue-500 text-sm font-medium">
                  {memberCount} members
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{memberCount}</div>
                <div className="text-sm text-text-muted">Family Members</div>
              </div>
            </div>

            {/* Transactions Card */}
            <div className="card bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7-8h18m-4 0v8m0 0v8m0-8h8m-9-4h1m-9-4v8m0 0v8"
                    />
                  </svg>
                </div>
                <span className="text-green-500 text-sm font-medium">
                  {totalTransactionsCount} total
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{totalTransactionsCount}</div>
                <div className="text-sm text-text-muted">Transactions</div>
              </div>
            </div>

            {/* Pending Approvals Card */}
            <div className="card bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-500 rounded-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-orange-500 text-sm font-medium">
                  {pendingApprovalsCount} pending
                </span>
              </div>
              <div>
                <div className="text-2xl font-bold text-text">{pendingApprovalsCount}</div>
                <div className="text-sm text-text-muted">Pending Approvals</div>
              </div>
            </div>
          </div>


          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Spending Overview Chart */}
            <div className="lg:col-span-2 card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  💰 Spending Overview
                </h3>
                <select className="btn btn-secondary btn-sm">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                </select>
              </div>
              <div className="h-64">
                <div className="flex items-end justify-between h-full px-2">
                  {dailySpendingData.map((data, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div className="text-xs text-text-muted mb-1">
                        ₹{data.amount}
                      </div>
                      <div className="w-full bg-bg-elevated rounded-t-lg relative h-32 flex items-end">
                        <div
                          className="w-full bg-gradient-to-t from-primary to-secondary rounded-t-lg transition-all duration-300"
                          style={{ height: `${data.percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-muted mt-2">
                        {data.day}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📊 Category Distribution
                </h3>
              </div>
              <div className="space-y-4">
                {categoryData.length > 0 ? (
                  categoryData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-bg-elevated rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full ${item.color}`} />
                        <div>
                          <h4 className="font-semibold text-text text-sm">
                            {item.category}
                          </h4>
                          <p className="text-xs text-text-muted">
                            ₹{item.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-text">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-text-muted">
                    No transactions yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Member Spending Comparison (Full Width) */}
          <div className="mb-6">
            {/* Member Comparison */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  👥 Member Spending Comparison
                </h3>
              </div>
              <div className="space-y-4">
                {circle && circle.members && circle.members.length > 0 ? (
                  circle.members.map((member, index) => {
                    const spent = member.currentDailySpent || 0;
                    const limit = member.dailyLimit || 1;
                    const percentage = Math.round((spent / limit) * 100);
                    const name = member.secondaryUser?.name || member.name || `Member ${index + 1}`;
                    return (
                      <div key={member.id || index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-text">
                            {name}
                          </span>
                          <span className="text-xs text-text-muted">
                            ₹{spent} / ₹{limit}
                          </span>
                        </div>
                        <div className="w-full bg-bg-elevated rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              percentage > 80
                                ? "bg-danger"
                                : percentage > 60
                                  ? "bg-warning"
                                  : "bg-success"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-text-muted text-sm">No members active in this circle.</p>
                )}
              </div>
            </div>
          </div>

          {/* Pending Approvals */}
          {pendingPayments.length > 0 && (
            <div className="card mb-6">
              <div className="border-b border-border pb-4 mb-4">
                <h3 className="text-lg font-semibold text-text">
                  ⏳ Pending Approvals
                </h3>
              </div>
              <div className="space-y-4">
                {pendingPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 bg-bg-elevated rounded-default border border-border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-text mb-1">
                        {payment.fromUser.name}
                      </div>
                      <div className="text-text-muted text-sm mb-2">
                        {payment.description}
                      </div>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-info/10 text-info">
                          ₹{payment.amount}
                        </span>
                        <span className="text-text-muted text-sm">
                          To: {payment.toUpiId}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-success text-sm px-3 py-1"
                          onClick={() => handleApprovePayment(payment.id, true)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="btn btn-danger text-sm px-3 py-1"
                          onClick={() =>
                            handleApprovePayment(payment.id, false)
                          }
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Transactions and Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  💸 Recent Transactions
                </h3>
                <button className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.length > 0 ? (
                      transactions.slice(0, 10).map((transaction) => {
                        const memberName = transaction.fromUser?.name || "Family Member";
                        const memberPhone = transaction.fromUser?.phone || "No phone";
                        const avatar = memberName.charAt(0).toUpperCase();
                        const status = (transaction.status || "pending").toLowerCase();
                        return (
                          <tr key={transaction.id} className="hover:bg-bg-elevated">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {avatar}
                                </div>
                                <div>
                                  <div className="font-medium text-text">
                                    {memberName}
                                  </div>
                                  <div className="text-xs text-text-muted">
                                    {memberPhone}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="font-medium text-text">
                                  {transaction.description || "UPI Payment"}
                                </div>
                                <div className="text-xs text-text-muted">
                                  {transaction.category || "General"}
                                </div>
                              </div>
                            </td>
                            <td className="font-semibold text-text">
                              ₹{transaction.amount}
                            </td>
                            <td>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  status === "completed"
                                    ? "bg-success/10 text-success"
                                    : status === "rejected"
                                      ? "bg-danger/10 text-danger"
                                      : "bg-warning/10 text-warning"
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="text-text-muted text-sm">
                              {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "Today"}
                            </td>
                            <td>
                              <button className="p-1 hover:bg-bg-elevated rounded">
                                <svg
                                  className="w-4 h-4 text-text-muted"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 5v14m0 0l-7 7m7 7V7a2 2 0 002-2h2a2 2 0 002-2m0 10a2 2 0 002 2 2 2 0 002-2m-6 8a2 2 0 002-2-2 2 0 00-2z"
                                  />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-6 text-sm text-text-muted">
                          No transactions found for this circle.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Activity Feed */}
            <div className="card">
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
                <h3 className="text-lg font-semibold text-text">
                  📊 Activity Feed
                </h3>
                <button className="btn btn-secondary btn-sm">View All</button>
              </div>
              <div className="space-y-4">
                {activityFeed.length > 0 ? (
                  activityFeed.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-3 hover:bg-bg-elevated rounded-lg animate-fade-in"
                    >
                      <div className="text-2xl">{activity.icon}</div>
                      <div className="flex-1">
                        <div className="font-medium text-text mb-1">
                          {activity.title}
                        </div>
                        <div className="text-sm text-text-muted">
                          {activity.description}
                        </div>
                        <div className="text-xs text-text-muted mt-1">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-text-muted">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Circle Members */}
          <div className="card">
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text">
                👥 Family Members ({circle.members.length})
              </h3>
              <button
                className="btn btn-primary"
                onClick={openInviteFlow}
              >
                + Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {circle.members.filter(m => m.role !== "PRIMARY").map((member) => (
                <div key={member.id} className="card">
                  <div className="mb-4">
                    <h4 className="font-medium text-text mb-1">
                      {member.secondaryUser?.name || member.name || "Member"}
                    </h4>
                    <p className="text-text-muted text-sm">
                      {member.secondaryUser?.upiId || member.upiId || "No UPI ID"}
                    </p>
                    {(member.secondaryUser?.isMinor || member.isMinor) && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-warning/10 text-warning mt-2">
                        Minor
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-text-muted">Daily Limit</span>
                        <span className="font-medium text-text">
                          ₹{member.currentDailySpent || 0} / ₹{member.dailyLimit}
                        </span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(((member.currentDailySpent || 0) / member.dailyLimit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-text-muted">Monthly Limit</span>
                        <span className="font-medium text-text">
                          ₹{member.currentMonthlySpent || 0} / ₹{member.monthlyLimit}
                        </span>
                      </div>
                      <div className="w-full bg-bg-elevated rounded-full h-2">
                        <div
                          className="bg-secondary h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(((member.currentMonthlySpent || 0) / member.monthlyLimit) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <button
                      className="btn btn-secondary w-full text-sm"
                      onClick={() => setSelectedMember(member)}
                    >
                      Set Limits
                    </button>
                  </div>
                </div>
              ))}
              {circle.members.filter(m => m.role !== "PRIMARY").length === 0 && (
                <div className="col-span-full py-8 text-center text-text-muted text-sm">
                  No family members added yet. Click "+ Invite Member" to get started!
                </div>
              )}
            </div>
          </div>

          {/* Modals */}
          {showAddMember && (
            <InviteCircleMemberModal
              isOpen
              onClose={() => setShowAddMember(false)}
              onSubmit={async (memberData) => {
                await sendMemberInvite(memberData, user);
                setShowAddMember(false);
              }}
            />
          )}

          {selectedMember && (
            <SpendingControlsModal
              key={selectedMember.id}
              isOpen
              onClose={() => setSelectedMember(null)}
              member={{
                id: selectedMember.id,
                name: selectedMember.secondaryUser?.name,
                dailyLimit: selectedMember.dailyLimit,
                monthlyLimit: selectedMember.monthlyLimit,
              }}
              onSubmit={(limits) => handleUpdateLimit(selectedMember.id, limits)}
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileTabBar userRole={user?.role} />
    </div>
  );
};

export default AdminView;
