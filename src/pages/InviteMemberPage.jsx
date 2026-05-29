import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import InviteCircleMemberModal from "../components/modals/InviteCircleMemberModal";
import MobileTabBar from "../components/navigation/MobileTabBar";
import { firebaseDB } from "../firebase";

const createTemporaryPassword = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendMemberInvite = async (memberData, user) => {
  const inviteCode = user?.familyCircle || user?.id || "INVITE";
  const tempPassword = createTemporaryPassword();
  
  // Save invite to Firestore
  await firebaseDB.savePendingInvite({
    email: memberData.email,
    phone: memberData.phone || "",
    name: memberData.name,
    relationship: memberData.relationship,
    dailyLimit: memberData.dailyLimit,
    monthlyLimit: memberData.monthlyLimit,
    note: memberData.note,
    role: "SECONDARY",
    circleId: inviteCode,
    familyHeadName: user?.name || user?.email || "Circle Owner",
    tempPassword: tempPassword
  });

  const response = await fetch("/api/send-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: memberData.email,
      phone: memberData.phone,
      name: memberData.name,
      relationship: memberData.relationship,
      dailyLimit: memberData.dailyLimit,
      monthlyLimit: memberData.monthlyLimit,
      note: memberData.note,
      role: "SECONDARY",
      inviteCode: inviteCode,
      familyHeadName: user?.name || user?.email || "Circle Owner",
      tempPassword: tempPassword,
    }),
  });

  const result = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || "Failed to send invite email");
  }

  return result;
};

const InviteMemberPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleInvite = async (memberData) => {
    await sendMemberInvite(memberData, user);
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <InviteCircleMemberModal
        isOpen
        variant="page"
        onClose={() => navigate(-1)}
        onSubmit={handleInvite}
      />
      <MobileTabBar userRole={user?.role} />
    </>
  );
};

export { sendMemberInvite };
export default InviteMemberPage;
