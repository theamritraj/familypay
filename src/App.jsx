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
import PrimaryDashboard from "./pages/PrimaryDashboard";
import SecondaryDashboard from "./pages/SecondaryDashboard";
import RealtimeDashboard from "./pages/RealtimeDashboard";
import "./index.css";

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
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
        path="/dashboard/primary"
        element={
          <ProtectedRoute>
            <PrimaryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/secondary"
        element={
          <ProtectedRoute>
            <SecondaryDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/realtime"
        element={
          <ProtectedRoute>
            <RealtimeDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
