import { useState } from "react";
import { Settings, Users, CreditCard, Shield, Bell, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "general";

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const tabs = [
    { id: "general", name: "General Settings", icon: Settings },
    { id: "circle", name: "Circle Management", icon: Users },
    { id: "payments", name: "Payment Methods", icon: CreditCard },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Settings</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Nav for Settings */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="card p-2 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-bg-elevated"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1">
          <div className="card p-6">
            <h2 className="text-xl font-bold text-text mb-6">
              {tabs.find((t) => t.id === activeTab)?.name}
            </h2>
            
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <label className="form-label">Display Name</label>
                  <input type="text" className="form-input max-w-md" defaultValue="Admin User" />
                </div>
                <div>
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input max-w-md" defaultValue="admin@familypay.com" readOnly />
                  <p className="text-xs text-text-muted mt-2">Email address cannot be changed directly.</p>
                </div>
                <div>
                  <label className="form-label">Timezone</label>
                  <select className="form-input max-w-md">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <button className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === "circle" && (
              <div className="text-center py-12 text-text-muted">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Circle management tools will appear here.</p>
              </div>
            )}

            {activeTab === "payments" && (
               <div className="text-center py-12 text-text-muted">
                 <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <p>Bank accounts and UPI handles will appear here.</p>
               </div>
            )}

            {['security', 'notifications'].includes(activeTab) && (
               <div className="text-center py-12 text-text-muted">
                 <p>Configuration options coming soon.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
