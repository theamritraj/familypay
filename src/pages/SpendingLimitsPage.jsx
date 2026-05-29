import { useState } from "react";
import { Shield, Save, Edit2, Users } from "lucide-react";

const SpendingLimitsPage = () => {
  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Spending Limits</h1>
        <p className="text-text-muted mt-1">Manage global and member-specific transaction limits</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-text">Global Circle Limits</h3>
              <p className="text-sm text-text-muted">Applies to all members by default</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="flex justify-between text-sm font-medium text-text mb-2">
                <span>Daily Spending Limit</span>
                <span className="text-primary font-bold">₹10,000</span>
              </label>
              <input type="range" className="w-full" min="1000" max="50000" step="1000" defaultValue="10000" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-text mb-2">
                <span>Monthly Limit</span>
                <span className="text-primary font-bold">₹100,000</span>
              </label>
              <input type="range" className="w-full" min="10000" max="500000" step="10000" defaultValue="100000" />
            </div>
            <div>
              <label className="flex justify-between text-sm font-medium text-text mb-2">
                <span>Auto-Approval Limit</span>
                <span className="text-warning font-bold">₹1,000</span>
              </label>
              <p className="text-xs text-text-muted mb-2">Transactions above this amount require your approval.</p>
              <input type="range" className="w-full" min="500" max="10000" step="500" defaultValue="1000" />
            </div>
            <button className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Save Global Limits
            </button>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-text">Member Overrides</h3>
                <p className="text-sm text-text-muted">Custom limits for specific members</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="text-center py-8 border border-dashed border-border rounded-lg bg-bg-elevated/50">
               <p className="text-sm text-text-muted">No custom overrides set. All members are using global limits.</p>
               <button className="mt-4 px-4 py-2 bg-bg text-text border border-border rounded-lg text-sm hover:bg-bg-elevated">
                 Add Member Override
               </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingLimitsPage;
