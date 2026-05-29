import { useState } from "react";
import { FileText, Download, Calendar, Filter } from "lucide-react";

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-bg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Financial Reports</h1>
          <p className="text-text-muted mt-1">Generate and download custom statements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold text-text mb-4">Generate Custom Report</h3>
          <div className="space-y-4">
            <div>
              <label className="form-label text-sm">Report Type</label>
              <select className="form-input">
                <option>Comprehensive Summary</option>
                <option>Transaction History</option>
                <option>Category Breakdown</option>
                <option>Member Activity</option>
              </select>
            </div>
            <div>
              <label className="form-label text-sm">Date Range</label>
              <select className="form-input">
                <option>Last 30 Days</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>Custom Range...</option>
              </select>
            </div>
            <div>
              <label className="form-label text-sm">Format</label>
              <select className="form-input">
                <option>PDF Document (.pdf)</option>
                <option>Excel Spreadsheet (.xlsx)</option>
                <option>CSV File (.csv)</option>
              </select>
            </div>
            <button className="w-full mt-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Generate & Download
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-text mb-2">Recent Reports</h3>
          {[
            { name: "April 2026 Summary", date: "May 1, 2026", type: "PDF" },
            { name: "Q1 2026 Expenses", date: "Apr 2, 2026", type: "Excel" },
            { name: "Tax Year 2025 Export", date: "Jan 15, 2026", type: "CSV" },
          ].map((report, i) => (
            <div key={i} className="card p-4 flex items-center justify-between hover:border-primary/30 cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-bg-elevated flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-text">{report.name}</p>
                  <p className="text-xs text-text-muted">{report.date} • {report.type}</p>
                </div>
              </div>
              <Download className="w-4 h-4 text-text-muted hover:text-primary transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
