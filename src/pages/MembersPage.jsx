import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { firebaseDB } from "../firebase";
import { Users, UserPlus, Settings, Shield, MoreVertical, Search, CheckCircle, Clock, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MembersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadMembers = async () => {
      try {
        if (user) {
          if (user.familyCircle) {
            const circleRes = await firebaseDB.getCircle(user.familyCircle);
            if (circleRes.success && circleRes.data.members) {
              // Get detailed member info and merge limit controls
              const memberPromises = circleRes.data.members.map(async m => {
                const res = await firebaseDB.getUser(m.id || m);
                if (res.success && res.data) {
                  return {
                    ...res.data,
                    dailyLimit: m.dailyLimit !== undefined ? m.dailyLimit : (res.data.dailyLimit || 1000),
                    monthlyLimit: m.monthlyLimit !== undefined ? m.monthlyLimit : (res.data.monthlyLimit || 10000),
                    relationship: m.relationship || res.data.relationship || "Family member",
                    joinedAt: m.joinedAt || res.data.joinedAt || ""
                  };
                }
                return null;
              });
              const memberResults = await Promise.all(memberPromises);
              
              const loadedMembers = memberResults.filter(Boolean);
              setMembers(loadedMembers);
            }
          }
          
          // Load pending invites (using both circleId and fallback userId)
          const invitesRes = await firebaseDB.getPendingInvites(user.familyCircle, user.id);
          if (invitesRes.success) {
            setPendingInvites(invitesRes.data);
          }
        }
      } catch (error) {
        console.error("Error loading members:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMembers();
  }, [user]);

  const handleUpdateLimits = async (memberId, limits) => {
    try {
      if (user && user.familyCircle) {
        const circleRes = await firebaseDB.getCircle(user.familyCircle);
        if (circleRes.success && circleRes.data.members) {
          const updatedMembers = circleRes.data.members.map((m) => {
            const mId = m.id || m;
            if (mId === memberId) {
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

          // Update local state for members list
          setMembers(prev => prev.map(m => {
            if (m.id === memberId) {
              return {
                ...m,
                dailyLimit: limits.dailyLimit,
                monthlyLimit: limits.monthlyLimit
              };
            }
            return m;
          }));
        }
      }
    } catch (err) {
      throw new Error("Failed to update spending limits in database.");
    }
  };

  const handleDeleteMember = async (memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from your FamilyPay circle? This will revoke all spending access and limits immediately.`)) {
      return;
    }
    
    try {
      if (user && user.familyCircle) {
        const res = await firebaseDB.removeMemberFromCircle(user.familyCircle, memberId);
        if (res.success) {
          // Remove from local members state!
          setMembers(prev => prev.filter(m => m.id !== memberId));
          alert("Member successfully removed from circle!");
        } else {
          alert(res.error || "Failed to remove member");
        }
      }
    } catch (err) {
      alert("An error occurred while removing the member.");
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInvites = pendingInvites.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone?.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Members</h1>
          <p className="text-text-muted mt-1">Manage everyone in your FamilyPay circle</p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/members/invite')}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2 bg-bg-elevated border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Owner Card (You) */}
          {user && (
            <div className="card p-5 border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                 <Shield className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-semibold text-text">{user.name} (You)</h3>
                  <p className="text-sm text-text-muted">Circle Owner</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border/50">
                 <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> Active
                 </span>
                 <button className="text-primary text-sm font-medium hover:underline">
                   View Profile
                 </button>
              </div>
            </div>
          )}

          {/* Other Members */}
          {filteredMembers.filter(m => m.id !== user?.id).map((member) => (
            <div 
              key={member.id} 
              onClick={() => navigate(`/dashboard/members/${member.id}`)}
              className="card p-5 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-text font-bold text-lg">
                    {member.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{member.name}</h3>
                    <p className="text-sm text-text-muted">{member.role === 'ADMIN' ? 'Admin' : 'Member'}</p>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); }} 
                  className="text-text-muted hover:text-text p-1 rounded-md hover:bg-bg-elevated transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-text-muted">Daily Limit</span>
                   <span className="font-medium text-text">₹{member.dailyLimit?.toLocaleString() || "1,000"}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-text-muted">Spent Today</span>
                   <span className="font-medium text-text">₹{member.currentDailySpent?.toLocaleString() || "0"}</span>
                 </div>
              </div>

               <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate(`/dashboard/members/${member.id}`); 
                      }}
                      className="text-text-muted hover:text-primary transition-colors p-1"
                      title="Manage Limits & Logs"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleDeleteMember(member.id, member.name); 
                      }}
                      className="text-text-muted hover:text-danger transition-colors p-1"
                      title="Remove Member"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-danger" />
                    </button>
                  </div>
               </div>
            </div>
          ))}

          {/* Pending Invites */}
          {filteredInvites.map((invite) => (
            <div key={invite.id} className="card p-5 border-dashed border-2 hover:border-primary/30 transition-colors bg-bg-elevated/30">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center text-text font-bold text-lg border border-border">
                    {invite.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text">{invite.name}</h3>
                    <p className="text-sm text-text-muted">Invite Sent</p>
                  </div>
                </div>
                <div className="bg-warning/10 text-warning text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Pending
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                 <div className="flex justify-between text-sm">
                   <span className="text-text-muted">Daily Limit</span>
                   <span className="font-medium text-text">₹{invite.dailyLimit || 0}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-text-muted">Email</span>
                   <span className="font-medium text-text truncate max-w-[120px]" title={invite.email}>{invite.email}</span>
                 </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                 <button className="text-sm font-medium text-primary hover:underline">
                   Resend Invite
                 </button>
                 <button className="text-sm font-medium text-danger hover:underline">
                   Cancel
                 </button>
              </div>
            </div>
          ))}

          {/* Empty State for Members */}
          {filteredMembers.length <= (user ? 1 : 0) && filteredInvites.length === 0 && (
             <div className="card p-5 flex flex-col items-center justify-center text-center border-dashed border-2 bg-transparent hover:bg-bg-elevated/30 transition-colors cursor-pointer" onClick={() => navigate('/dashboard/members/invite')}>
               <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
                 <UserPlus className="w-6 h-6" />
               </div>
               <h3 className="font-medium text-text mb-1">Add a Member</h3>
               <p className="text-sm text-text-muted mb-0">Invite family or team members to your circle.</p>
              </div>
           )}
        </div>
      )}
    </div>
  );
};

export default MembersPage;
