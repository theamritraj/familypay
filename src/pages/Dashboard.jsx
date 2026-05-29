import { useAuth } from "../context/AuthContext";
import AdminView from "../components/dashboard/AdminView";
import UserView from "../components/dashboard/UserView";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // Determine which dashboard to show based on the user's role
  if (user?.role === "PRIMARY" || user?.role === "ADMIN") {
    return <AdminView />;
  }

  // Default to User view for SECONDARY or unknown roles
  return <UserView />;
};

export default Dashboard;
