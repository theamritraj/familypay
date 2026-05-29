import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import paymentService from "../services/paymentService";
import {
  ArrowLeft,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  CreditCard,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Menu,
} from "lucide-react";

const TransactionsPage = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const loadTransactions = async () => {
    try {
      if (user) {
        setLoading(true);
        let result;
        if (user.role === 'ADMIN' || user.role === 'PRIMARY') {
          result = await paymentService.getCircleTransactions(user.familyCircle || user.id);
        } else {
          result = await paymentService.getUserTransactions(user.id, user.familyCircle);
        }

        if (result && result.success) {
          const mappedData = (result.data || []).map(t => ({
            id: t.id,
            type: t.fromUserId === user.id ? "sent" : "received",
            amount: t.amount,
            description: t.description || "Payment",
            recipient: t.recipientName || t.upiId || "Unknown",
            sender: t.fromUserName || "Unknown",
            date: new Date(t.createdAt || Date.now()),
            status: t.status,
            method: t.method || "upi",
            category: t.category || "other"
          }));
          mappedData.sort((a, b) => b.date - a.date);
          setTransactions(mappedData);
        } else {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.recipient
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.sender?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === "all" || transaction.type === filterType;

    return matchesSearch && matchesType;
  });

  const formatDate = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-danger" />;
      default:
        return <Clock className="w-4 h-4 text-text-muted" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "sent":
        return <TrendingUp className="w-4 h-4 text-danger" />;
      case "received":
        return <TrendingDown className="w-4 h-4 text-success" />;
      default:
        return <CreditCard className="w-4 h-4 text-text-muted" />;
    }
  };

  const exportTransactions = () => {
    // Simulate export functionality
    alert("Transactions exported successfully!");
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
      {/* Generic Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Transactions</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5 text-text" />
          </button>
          <button
            onClick={exportTransactions}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
          >
            <Download className="w-5 h-5 text-text" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions..."
          className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="card mb-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label text-sm">Transaction Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="form-input"
              >
                <option value="all">All Transactions</option>
                <option value="sent">Sent</option>
                <option value="received">Received</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="form-label text-sm">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="form-input"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? null : (
          filteredTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-bg-elevated rounded-full flex items-center justify-center">
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-text">
                        {transaction.type === "sent"
                          ? `To: ${transaction.recipient}`
                          : transaction.type === "received"
                            ? `From: ${transaction.sender}`
                            : transaction.description}
                      </p>
                      {getStatusIcon(transaction.status)}
                    </div>
                    <p className="text-sm text-text-muted">
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-text-muted">
                        {formatDate(transaction.date)}
                      </span>
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs text-text-muted capitalize">
                        {transaction.method}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${transaction.type === "sent"
                        ? "text-danger"
                        : transaction.type === "received"
                          ? "text-success"
                          : "text-text"
                      }`}
                  >
                    {transaction.type === "sent" ? "-" : "+"}₹
                    {transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-text-muted capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Total Sent</p>
          <p className="text-lg font-semibold text-danger">
            ₹
            {transactions
              .filter((t) => t.type === "sent")
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Total Received</p>
          <p className="text-lg font-semibold text-success">
            ₹
            {transactions
              .filter((t) => t.type === "received")
              .reduce((sum, t) => sum + t.amount, 0)
              .toLocaleString()}
          </p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-sm text-text-muted mb-1">Net Balance</p>
          <p className="text-lg font-semibold text-text">
            ₹
            {(
              transactions
                .filter((t) => t.type === "received")
                .reduce((sum, t) => sum + t.amount, 0) -
              transactions
                .filter((t) => t.type === "sent")
                .reduce((sum, t) => sum + t.amount, 0)
            ).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
