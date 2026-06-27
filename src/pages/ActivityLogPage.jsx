import { useState } from "react";
import { Activity, UserPlus, Settings, LogIn, AlertCircle } from "lucide-react";

const ActivityLogPage = () => {
  const activities = [
    { id: 1, type: "login", text: "You logged into Operations Console", time: "Just now", icon: LogIn, color: "text-success", bg: "bg-success/10" },
    { id: 2, type: "settings", text: "Updated global spending limits", time: "2 hours ago", icon: Settings, color: "text-primary", bg: "bg-primary/10" },
    { id: 3, type: "invite", text: "Sent invitation to 'John Doe'", time: "1 day ago", icon: UserPlus, color: "text-secondary", bg: "bg-secondary/10" },
    { id: 4, type: "security", text: "Failed login attempt from new device", time: "3 days ago", icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" },
  ];

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Activity Log</h1>
          <p className="text-text-muted mt-1">Audit trail of system and security events</p>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {activities.map((act) => (
            <div key={act.id} className="p-4 flex items-start gap-4 hover:bg-bg-elevated/50 transition-colors">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}>
                <act.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text font-medium">{act.text}</p>
                <p className="text-sm text-text-muted mt-1">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-bg-elevated/30 border-t border-border text-center">
          <button className="text-primary text-sm font-medium hover:underline">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogPage;
