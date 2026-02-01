import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
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
} from "lucide-react";

const TransactionsPage = () => {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Mock transactions data
  const getMockTransactions = () => {
    const now = Date.now();
    return [
      {
        id: 1,
        type: "sent",
        amount: 500,
        description: "Payment to Mom",
        recipient: "Mom",
        recipientPhone: "+91 98765 43210",
        date: new Date(now - 1000 * 60 * 30), // 30 minutes ago
        status: "completed",
        method: "upi",
        category: "family",
      },
      {
        id: 2,
        type: "received",
        amount: 1000,
        description: "Salary credit",
        sender: "Company XYZ",
        date: new Date(now - 1000 * 60 * 60 * 2), // 2 hours ago
        status: "completed",
        method: "bank",
        category: "income",
      },
      {
        id: 3,
        type: "sent",
        amount: 250,
        description: "Grocery shopping",
        recipient: "Grocery Store",
        date: new Date(now - 1000 * 60 * 60 * 24), // 1 day ago
        status: "completed",
        method: "qr",
        category: "shopping",
      },
      {
        id: 4,
        type: "sent",
        amount: 1500,
        description: "Electric bill payment",
        recipient: "Electric Board",
        date: new Date(now - 1000 * 60 * 60 * 48), // 2 days ago
        status: "completed",
        method: "upi",
        category: "bills",
      },
      {
        id: 5,
        type: "pending",
        amount: 750,
        description: "Online shopping",
        recipient: "Amazon",
        date: new Date(now - 1000 * 60 * 60 * 72), // 3 days ago
        status: "pending",
        method: "card",
        category: "shopping",
      },
      {
        id: 6,
        type: "received",
        amount: 2000,
        description: "Freelance payment",
        sender: "Client ABC",
        date: new Date(now - 1000 * 60 * 60 * 120), // 5 days ago
        status: "completed",
        method: "upi",
        category: "income",
      },
      {
        id: 7,
        type: "sent",
        amount: 300,
        description: "Mobile recharge",
        recipient: "Mobile Operator",
        date: new Date(now - 1000 * 60 * 60 * 168), // 7 days ago
        status: "completed",
        method: "upi",
        category: "utilities",
      },
      {
        id: 8,
        type: "failed",
        amount: 1000,
        description: "Failed transaction",
        recipient: "Merchant",
        date: new Date(now - 1000 * 60 * 60 * 200), // 8 days ago
        status: "failed",
        method: "upi",
        category: "other",
      },
    ];
  };

  useEffect(() => {
    // Simulate loading transactions
    setTimeout(() => {
      setTransactions(getMockTransactions());
      setLoading(false);
    }, 1000);
  }, []);

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
            <h1 className="text-xl sm:text-2xl font-bold text-text">
              Transactions
            </h1>
          </div>
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
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
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
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">
                No transactions found
              </h3>
              <p className="text-text-muted">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
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
                      className={`font-semibold ${
                        transaction.type === "sent"
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

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />
    </div>
  );
};

export default TransactionsPage;
