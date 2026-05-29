import { useState } from "react";
import { BarChart3, PieChart, TrendingUp, Calendar, Download } from "lucide-react";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text">Analytics</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-text">Spending Overview</h3>
              <p className="text-sm text-text-muted">Your spending over the last 30 days</p>
            </div>
            <select className="form-input text-sm py-1">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-border rounded-lg bg-bg-elevated/50">
            <div className="text-center">
              <BarChart3 className="w-8 h-8 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-text-muted">Chart visualization will appear here</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-text">Top Categories</h3>
            <p className="text-sm text-text-muted">Where your money goes</p>
          </div>
          <div className="space-y-4">
            {['Food & Dining', 'Shopping', 'Bills & Utilities', 'Entertainment'].map((cat, i) => (
              <div key={cat}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text">{cat}</span>
                  <span className="font-medium text-text">{40 - (i * 10)}%</span>
                </div>
                <div className="w-full bg-bg-elevated rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${40 - (i * 10)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
