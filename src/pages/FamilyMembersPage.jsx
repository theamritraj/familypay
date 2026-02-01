import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import AddMemberModal from "../components/AddMemberModal";
import SetLimitModal from "../components/SetLimitModalFixed";
import {
  Users,
  UserPlus,
  Settings,
  Edit,
  Trash2,
  CreditCard,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Filter,
} from "lucide-react";

const FamilyMembersPage = () => {
  const { user } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock family members data
  const getMockMembers = () => {
    return [
      {
        id: 1,
        name: "Rajnish Kumar",
        email: "rajnish@familypay.com",
        phone: "+91 98765 43210",
        role: "ADMIN",
        status: "active",
        avatar: "👨‍💼",
        dailyLimit: 5000,
        monthlyLimit: 50000,
        currentDailySpent: 1200,
        currentMonthlySpent: 15000,
        joinDate: new Date("2023-01-15"),
        lastActive: new Date(Date.now() - 1000 * 60 * 30),
        transactions: 45,
      },
      {
        id: 2,
        name: "Priya Kumar",
        email: "priya@familypay.com",
        phone: "+91 98765 43211",
        role: "PRIMARY",
        status: "active",
        avatar: "👩",
        dailyLimit: 3000,
        monthlyLimit: 30000,
        currentDailySpent: 800,
        currentMonthlySpent: 8000,
        joinDate: new Date("2023-02-20"),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2),
        transactions: 32,
      },
      {
        id: 3,
        name: "Amit Kumar",
        email: "amit@familypay.com",
        phone: "+91 98765 43212",
        role: "SECONDARY",
        status: "active",
        avatar: "👦",
        dailyLimit: 1000,
        monthlyLimit: 10000,
        currentDailySpent: 500,
        currentMonthlySpent: 3500,
        joinDate: new Date("2023-03-10"),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24),
        transactions: 18,
      },
      {
        id: 4,
        name: "Sunita Kumar",
        email: "sunita@familypay.com",
        phone: "+91 98765 43213",
        role: "SECONDARY",
        status: "inactive",
        avatar: "👧",
        dailyLimit: 1500,
        monthlyLimit: 15000,
        currentDailySpent: 0,
        currentMonthlySpent: 0,
        joinDate: new Date("2023-04-05"),
        lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
        transactions: 12,
      },
    ];
  };

  useEffect(() => {
    // Simulate loading members
    setTimeout(() => {
      setMembers(getMockMembers());
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery);

    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleAddMember = async (memberData) => {
    // Simulate adding member
    const newMember = {
      id: members.length + 1,
      ...memberData,
      name: `New Member ${members.length + 1}`,
      email: `member${members.length + 1}@familypay.com`,
      phone: `+91 98765 432${members.length + 10}`,
      role: "SECONDARY",
      status: "active",
      avatar: "👤",
      currentDailySpent: 0,
      currentMonthlySpent: 0,
      joinDate: new Date(),
      lastActive: new Date(),
      transactions: 0,
    };

    setMembers([...members, newMember]);
    setShowAddModal(false);
  };

  const handleSetLimit = async (limitData) => {
    // Simulate setting limit
    if (selectedMember) {
      setMembers(
        members.map((member) =>
          member.id === selectedMember.id
            ? { ...member, ...limitData }
            : member,
        ),
      );
      setShowLimitModal(false);
      setSelectedMember(null);
    }
  };

  const handleRemoveMember = (memberId) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      setMembers(members.filter((member) => member.id !== memberId));
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-danger/10 text-danger";
      case "PRIMARY":
        return "bg-primary/10 text-primary";
      case "SECONDARY":
        return "bg-warning/10 text-warning";
      default:
        return "bg-text-muted/10 text-text-muted";
    }
  };

  const getStatusIcon = (status) => {
    return status === "active" ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <AlertCircle className="w-4 h-4 text-warning" />
    );
  };

  const calculateUsagePercentage = (spent, limit) => {
    return Math.min((spent / limit) * 100, 100);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)} days ago`;
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
              Family Members
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </button>
        </div>
      </header>

      <div className="px-4 py-4 sm:px-6 sm:py-6">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-bg-elevated border border-border rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMembers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text mb-2">
                No members found
              </h3>
              <p className="text-text-muted">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredMembers.map((member) => (
              <div key={member.id} className="card p-6">
                {/* Member Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-2xl border-2 border-border">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-text">{member.name}</p>
                        {getStatusIcon(member.status)}
                      </div>
                      <p className="text-sm text-text-muted">{member.email}</p>
                      <p className="text-sm text-text-muted">{member.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(member.role)}`}
                    >
                      {member.role}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowLimitModal(true);
                        }}
                        className="p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-text-muted" />
                      </button>
                      {member.role !== "ADMIN" && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-1.5 hover:bg-bg-elevated rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-text-muted">
                        Daily Usage
                      </span>
                      <span className="text-sm font-medium text-text">
                        ₹{member.currentDailySpent} / ₹{member.dailyLimit}
                      </span>
                    </div>
                    <div className="w-full bg-bg-elevated rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateUsagePercentage(
                            member.currentDailySpent,
                            member.dailyLimit,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-text-muted">
                        Monthly Usage
                      </span>
                      <span className="text-sm font-medium text-text">
                        ₹{member.currentMonthlySpent} / ₹{member.monthlyLimit}
                      </span>
                    </div>
                    <div className="w-full bg-bg-elevated rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${calculateUsagePercentage(
                            member.currentMonthlySpent,
                            member.monthlyLimit,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Member Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Transactions:</span>
                    <span className="ml-2 font-medium text-text">
                      {member.transactions}
                    </span>
                  </div>
                  <div>
                    <span className="text-text-muted">Joined:</span>
                    <span className="ml-2 font-medium text-text">
                      {formatDate(member.joinDate)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-text-muted">Last Active:</span>
                    <span className="ml-2 font-medium text-text">
                      {formatLastActive(member.lastActive)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4 text-center">
            <Users className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-text-muted mb-1">Total Members</p>
            <p className="text-2xl font-bold text-text">{members.length}</p>
          </div>
          <div className="card p-4 text-center">
            <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-sm text-text-muted mb-1">Active Members</p>
            <p className="text-2xl font-bold text-text">
              {members.filter((m) => m.status === "active").length}
            </p>
          </div>
          <div className="card p-4 text-center">
            <CreditCard className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-sm text-text-muted mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-text">
              {members.reduce((sum, m) => sum + m.transactions, 0)}
            </p>
          </div>
          <div className="card p-4 text-center">
            <TrendingUp className="w-8 h-8 text-info mx-auto mb-2" />
            <p className="text-sm text-text-muted mb-1">Avg. Daily Usage</p>
            <p className="text-2xl font-bold text-text">
              ₹
              {Math.round(
                members.reduce((sum, m) => sum + m.currentDailySpent, 0) /
                  members.length,
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav userRole={user?.role} />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddMember}
      />

      {/* Set Limit Modal */}
      <SetLimitModal
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        onSetLimit={handleSetLimit}
      />
    </div>
  );
};

export default FamilyMembersPage;
