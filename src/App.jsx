import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import PrimaryDashboard from "./pages/PrimaryDashboard";
import SecondaryDashboard from "./pages/SecondaryDashboard";
import RealtimeDashboard from "./pages/RealtimeDashboard";
import ProfilePage from "./pages/ProfilePage";
import PayPage from "./pages/PayPage";
import NotificationsPage from "./pages/NotificationsPage";
import TransactionsPage from "./pages/TransactionsPage";
import FamilyMembersPage from "./pages/FamilyMembersPage";
import TestPage from "./pages/TestPage";
import "./index.css";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user?.role === "PRIMARY" ? (
              <PrimaryDashboard />
            ) : user?.role === "ADMIN" ? (
              <PrimaryDashboard />
            ) : (
              <SecondaryDashboard />
            )}
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/payments"
        element={
          <ProtectedRoute>
            <PayPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/transactions"
        element={
          <ProtectedRoute>
            <TransactionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/members"
        element={
          <ProtectedRoute>
            <FamilyMembersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/test"
        element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
