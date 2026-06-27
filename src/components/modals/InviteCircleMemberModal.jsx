import { useState } from "react";
import { Mail, ShieldCheck, UserPlus, X } from "lucide-react";

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  relationship: "Family member",
  dailyLimit: "",
  monthlyLimit: "",
  note: "",
};

const InviteCircleMemberModal = ({
  isOpen,
  onClose,
  onSubmit,
  variant = "modal",
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError("");
    setLoading(false);
    setFormData(initialFormData);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        relationship: formData.relationship,
        dailyLimit: parseFloat(formData.dailyLimit),
        monthlyLimit: parseFloat(formData.monthlyLimit),
        note: formData.note.trim(),
      });
      handleClose();
    } catch (err) {
      setError(err?.message || "Unable to send invitation");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const content = (
    <div className={variant === "page" ? "w-full" : "w-full max-w-xl mx-auto"}>
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-bold text-text">
            Invite a member to FamilyPay
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            Send a controlled workspace invite with spending policy and login credentials.
          </p>
        </div>
      </div>

      {error && <div className="alert alert-error mt-4">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4 pt-4"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Full name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="Enter full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="form-label">Email address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Phone number</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="form-label">Relationship</label>
            <select
              name="relationship"
              className="form-select"
              value={formData.relationship}
              onChange={handleChange}
            >
              <option>Family member</option>
              <option>Child account</option>
              <option>Dependent</option>
              <option>Trusted contact</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="form-label">Daily spend limit (₹)</label>
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
            <label className="form-label">Monthly spend limit (₹)</label>
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
        </div>

        <div>
          <label className="form-label">Invite note (Optional)</label>
          <textarea
            name="note"
            className="form-input min-h-20 resize-none"
            placeholder="Add optional onboarding context for this member"
            value={formData.note}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-border mt-6">
          <button
            type="button"
            className="flex-1 btn btn-secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <div className="loading-spinner h-4 w-4 mx-auto"></div>
            ) : (
              "Send invite"
            )}
          </button>
        </div>
      </form>
    </div>
  );

  if (variant === "page") {
    return <div className="mx-auto w-full max-w-xl px-4 py-5">{content}</div>;
  }

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
    >
      <div className="relative bg-bg-card rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-border animate-fade-in">
        {/* Close Button Outside (Absolute Top Right) */}
        <button
          className="absolute -top-10 right-0 lg:-right-10 rounded-full p-2 bg-white/20 hover:bg-white/40 text-white hover:text-white transition-colors focus:outline-none"
          onClick={handleClose}
          type="button"
          aria-label="Close invite"
        >
          <X className="h-6 w-6" />
        </button>
        {content}
      </div>
    </div>
  );
};

export default InviteCircleMemberModal;
