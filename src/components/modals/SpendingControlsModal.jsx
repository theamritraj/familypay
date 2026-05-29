import { useState } from "react";

const SpendingControlsModal = ({ isOpen, member, onClose, onSubmit }) => {
  const [formData, setFormData] = useState(() => ({
    dailyLimit: member?.dailyLimit || 1000,
    monthlyLimit: member?.monthlyLimit || 10000,
  }));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: parseFloat(event.target.value) || 0,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err?.message || "An error occurred");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text">
            Set Limits for {member?.name || "Member"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            aria-label="Close"
            type="button"
          >
            <span className="text-text-muted">×</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="form-label">Daily Limit (₹)</label>
            <input
              type="number"
              name="dailyLimit"
              className="form-input"
              min="0"
              step="100"
              value={formData.dailyLimit}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Monthly Limit (₹)</label>
            <input
              type="number"
              name="monthlyLimit"
              className="form-input"
              min="0"
              step="100"
              value={formData.monthlyLimit}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 btn btn-primary"
            >
              {loading ? (
                <div className="loading-spinner mx-auto"></div>
              ) : (
                "Set Limits"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SpendingControlsModal;
