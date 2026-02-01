import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RealtimeDashboard = () => {
  const { logout } = useAuth();
  const [realTimeData, setRealTimeData] = useState({
    totalSpent: 45678.9,
    totalTransactions: 234,
    activeUsers: 4,
    pendingApprovals: 3,
    dailySpending: [],
    categorySpending: [],
    recentTransactions: [],
    liveNotifications: [],
  });

  const [isLive, setIsLive] = useState(true);

  // Helper functions
  const generateNewTransaction = (current) => {
    const names = ["Rajnish", "Sangam", "Raveena", "Shubh"];
    const categories = [
      "Food",
      "Shopping",
      "Transport",
      "Entertainment",
      "Bills",
    ];
    const newTransaction = {
      id: Date.now(),
      user: names[Math.floor(Math.random() * names.length)],
      amount: (Math.random() * 2000 + 100).toFixed(2),
      category: categories[Math.floor(Math.random() * categories.length)],
      status: Math.random() > 0.3 ? "completed" : "pending",
      time: new Date().toLocaleTimeString(),
      trend: Math.random() > 0.5 ? "up" : "down",
    };

    return [newTransaction, ...current.slice(0, 9)];
  };

  const generateNotification = (current) => {
    if (Math.random() > 0.7) {
      const types = ["payment", "approval", "limit", "new_user"];
      const type = types[Math.floor(Math.random() * types.length)];

      const notifications = {
        payment: {
          icon: CreditCard,
          message: "New payment received",
          color: "text-green-500",
        },
        approval: {
          icon: CheckCircle,
          message: "Payment approved",
          color: "text-blue-500",
        },
        limit: {
          icon: AlertCircle,
          message: "Spending limit warning",
          color: "text-yellow-500",
        },
        new_user: {
          icon: Users,
          message: "New member joined",
          color: "text-purple-500",
        },
      };

      const notification = notifications[type];
      return [
        {
          id: Date.now(),
          ...notification,
          time: new Date().toLocaleTimeString(),
        },
        ...current.slice(0, 4),
      ];
    }
    return current;
  };

  const generateDailySpending = () => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days.map((day) => ({
      day,
      amount: Math.floor(Math.random() * 5000 + 2000),
    }));
  };

  const generateCategorySpending = () => {
    return [
      { name: "Food", value: 35, color: "#10b981" },
      { name: "Shopping", value: 25, color: "#6366f1" },
      { name: "Transport", value: 20, color: "#f59e0b" },
      { name: "Entertainment", value: 15, color: "#8b5cf6" },
      { name: "Bills", value: 5, color: "#ef4444" },
    ];
  };

  const generateInitialTransactions = () => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() - i * 1000,
      user: ["Rajnish", "Sangam", "Raveena", "Shubh"][i % 4],
      amount: (Math.random() * 2000 + 100).toFixed(2),
      category: ["Food", "Shopping", "Transport"][i % 3],
      status: i % 3 === 0 ? "pending" : "completed",
      time: new Date(Date.now() - i * 60000).toLocaleTimeString(),
      trend: Math.random() > 0.5 ? "up" : "down",
    }));
  };

  const generateInitialNotifications = () => {
    return [
      {
        id: 1,
        icon: CheckCircle,
        message: "Payment approved",
        color: "text-green-500",
        time: "2:15 PM",
      },
      {
        id: 2,
        icon: CreditCard,
        message: "New payment received",
        color: "text-blue-500",
        time: "2:10 PM",
      },
      {
        id: 3,
        icon: AlertCircle,
        message: "Spending limit warning",
        color: "text-yellow-500",
        time: "2:05 PM",
      },
    ];
  };

  // Initialize sample data
  useEffect(() => {
    setRealTimeData((prev) => ({
      ...prev,
      dailySpending: generateDailySpending(),
      categorySpending: generateCategorySpending(),
      recentTransactions: generateInitialTransactions(),
      liveNotifications: generateInitialNotifications(),
    }));
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        totalSpent: prev.totalSpent + (Math.random() * 100 - 50),
        totalTransactions:
          prev.totalTransactions + Math.floor(Math.random() * 3),
        recentTransactions: generateNewTransaction(prev.recentTransactions),
        liveNotifications: generateNotification(prev.liveNotifications),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -mr-16 -mt-16" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {change && (
            <div
              className={`flex items-center text-sm ${
                change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change > 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <h3 className="text-text-muted text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-text">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-bg p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">
              Real-Time Dashboard
            </h1>
            <p className="text-text-muted">Live family payment analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
              />
              <span className="text-sm text-text-muted">
                {isLive ? "Live" : "Paused"}
              </span>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`btn ${isLive ? "btn-danger" : "btn-primary"}`}
            >
              {isLive ? "Pause Updates" : "Resume Updates"}
            </button>
            <button className="btn btn-danger" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Spent"
            value={`₹${realTimeData.totalSpent.toFixed(2)}`}
            change={12.5}
            icon={TrendingUp}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            title="Transactions"
            value={realTimeData.totalTransactions}
            change={8.2}
            icon={CreditCard}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Users"
            value={realTimeData.activeUsers}
            change={0}
            icon={Users}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Pending"
            value={realTimeData.pendingApprovals}
            change={-15.3}
            icon={AlertCircle}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Spending Chart */}
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">
                Daily Spending Trend
              </h3>
              <Activity className="w-5 h-5 text-text-muted" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={realTimeData.dailySpending}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Category Spending */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">Categories</h3>
              <TrendingUp className="w-5 h-5 text-text-muted" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={realTimeData.categorySpending}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {realTimeData.categorySpending.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                  }}
                  labelStyle={{ color: "#f3f4f6" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {realTimeData.categorySpending.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-text-muted">{category.name}</span>
                  </div>
                  <span className="text-text font-medium">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Live Transactions */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">
                Live Transactions
              </h3>
              <Clock className="w-5 h-5 text-text-muted" />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realTimeData.recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-bg-elevated rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.status === "completed"
                          ? "bg-green-500/10"
                          : "bg-yellow-500/10"
                      }`}
                    >
                      {transaction.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-text">
                        {transaction.user}
                      </p>
                      <p className="text-sm text-text-muted">
                        {transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text">
                      ₹{transaction.amount}
                    </p>
                    <p className="text-xs text-text-muted">
                      {transaction.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Live Notifications */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text">
                Live Notifications
              </h3>
              <Activity className="w-5 h-5 text-text-muted" />
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realTimeData.liveNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-bg-elevated rounded-lg border border-border"
                >
                  <notification.icon
                    className={`w-5 h-5 ${notification.color}`}
                  />
                  <div className="flex-1">
                    <p className="text-text">{notification.message}</p>
                    <p className="text-xs text-text-muted">
                      {notification.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeDashboard;
