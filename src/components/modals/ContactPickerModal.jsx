import { useState } from "react";
import { AlertCircle, CheckCircle, Phone, Search, User, X } from "lucide-react";

const ContactPickerModal = ({ isOpen, onClose, onSelectContact }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);

  const [contacts] = useState(() => {
    const now = Date.now();
    return [
      {
        id: 1,
        name: "Mom",
        phone: "+91 98765 43210",
        email: "mom@familypay.com",
        avatar: "👩",
        status: "online",
        isFamily: true,
        lastTransaction: {
          amount: 500,
          date: new Date(now - 1000 * 60 * 60 * 24),
          type: "received",
        },
      },
      {
        id: 2,
        name: "Dad",
        phone: "+91 98765 43211",
        email: "dad@familypay.com",
        avatar: "👨",
        status: "online",
        isFamily: true,
        lastTransaction: {
          amount: 1000,
          date: new Date(now - 1000 * 60 * 60 * 48),
          type: "sent",
        },
      },
      {
        id: 3,
        name: "Sister",
        phone: "+91 98765 43212",
        email: "sister@familypay.com",
        avatar: "👧",
        status: "offline",
        isFamily: true,
        lastTransaction: {
          amount: 250,
          date: new Date(now - 1000 * 60 * 60 * 72),
          type: "received",
        },
      },
      {
        id: 4,
        name: "Brother",
        phone: "+91 98765 43213",
        email: "brother@familypay.com",
        avatar: "👦",
        status: "online",
        isFamily: true,
        lastTransaction: null,
      },
      {
        id: 5,
        name: "John Doe",
        phone: "+91 98765 43214",
        email: "john@example.com",
        avatar: "👤",
        status: "offline",
        isFamily: false,
        lastTransaction: {
          amount: 150,
          date: new Date(now - 1000 * 60 * 60 * 120),
          type: "sent",
        },
      },
      {
        id: 6,
        name: "Jane Smith",
        phone: "+91 98765 43215",
        email: "jane@example.com",
        avatar: "👩",
        status: "online",
        isFamily: false,
        lastTransaction: null,
      },
      {
        id: 7,
        name: "Mike Wilson",
        phone: "+91 98765 43216",
        email: "mike@example.com",
        avatar: "👨",
        status: "offline",
        isFamily: false,
        lastTransaction: {
          amount: 300,
          date: new Date(now - 1000 * 60 * 60 * 168),
          type: "received",
        },
      },
      {
        id: 8,
        name: "Sarah Johnson",
        phone: "+91 98765 43217",
        email: "sarah@example.com",
        avatar: "👩",
        status: "online",
        isFamily: false,
        lastTransaction: null,
      },
    ];
  });

  const handleClose = () => {
    setSearchQuery("");
    setSelectedContact(null);
    onClose();
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.phone.includes(searchQuery) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const familyContacts = filteredContacts.filter((contact) => contact.isFamily);
  const otherContacts = filteredContacts.filter((contact) => !contact.isFamily);

  const formatLastTransaction = (transaction) => {
    if (!transaction) return null;

    const now = new Date();
    const diffTime = Math.abs(now - transaction.date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleProceedToPayment = () => {
    if (!selectedContact) return;
    onSelectContact(selectedContact);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-semibold text-text">Send Money</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-bg-elevated rounded-lg transition-colors"
            type="button"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text" />
          </button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-elevated border border-border rounded-lg pl-12 pr-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {familyContacts.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted mb-3 tracking-wider">
                  FAMILY
                </h3>
                <div className="space-y-2">
                  {familyContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContact?.id === contact.id}
                      onSelect={() => setSelectedContact(contact)}
                      formatLastTransaction={formatLastTransaction}
                    />
                  ))}
                </div>
              </div>
            )}

            {otherContacts.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-text-muted mb-3 tracking-wider">
                  OTHERS
                </h3>
                <div className="space-y-2">
                  {otherContacts.map((contact) => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      isSelected={selectedContact?.id === contact.id}
                      onSelect={() => setSelectedContact(contact)}
                      formatLastTransaction={formatLastTransaction}
                    />
                  ))}
                </div>
              </div>
            )}

            {filteredContacts.length === 0 && (
              <div className="text-center py-12">
                <User className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-text mb-2">
                  No contacts found
                </h3>
                <p className="text-text-muted">
                  Try searching with a different name or phone number
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-muted">
              {selectedContact ? (
                <span>
                  Selected:{" "}
                  <span className="font-medium text-text">
                    {selectedContact.name}
                  </span>
                </span>
              ) : (
                <span>Select a contact to continue</span>
              )}
            </div>
            <button
              onClick={handleProceedToPayment}
              disabled={!selectedContact}
              className={`btn ${
                selectedContact ? "btn-primary" : "btn-secondary"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactCard = ({
  contact,
  isSelected,
  onSelect,
  formatLastTransaction,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary hover:bg-bg-elevated"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect();
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 bg-bg-elevated rounded-full flex items-center justify-center text-2xl border-2 border-border">
            {contact.avatar}
          </div>
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-bg-card ${
              contact.status === "online" ? "bg-success" : "bg-text-muted"
            }`}
          ></div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-text">{contact.name}</p>
            {contact.isFamily && (
              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                Family
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Phone className="w-3 h-3" />
            <span>{contact.phone}</span>
          </div>
          {contact.lastTransaction && (
            <div className="flex items-center gap-2 mt-1">
              <div
                className={`flex items-center gap-1 text-xs ${
                  contact.lastTransaction.type === "sent"
                    ? "text-danger"
                    : "text-success"
                }`}
              >
                {contact.lastTransaction.type === "sent" ? (
                  <AlertCircle className="w-3 h-3" />
                ) : (
                  <CheckCircle className="w-3 h-3" />
                )}
                <span>
                  {contact.lastTransaction.type === "sent" ? "Sent" : "Received"}{" "}
                  ₹{contact.lastTransaction.amount}
                </span>
              </div>
              <span className="text-xs text-text-muted">
                • {formatLastTransaction(contact.lastTransaction)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center">
        {isSelected && (
          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPickerModal;
