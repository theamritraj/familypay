import React, { createContext, useContext, useState, useEffect } from "react";
import { firebaseAuth, firebaseDB, userService } from "../firebase";
import { mockAuthService } from "../services/mockAuthService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      async (firebaseUser) => {
        if (firebaseUser) {
          try {
            // Get user data from Firestore
            const userResult = await firebaseDB.getUser(firebaseUser.uid);
            if (userResult.success) {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                ...userResult.data,
              });
            } else {
              // If user data doesn't exist in Firestore, create basic user object
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email,
                name: firebaseUser.displayName || "User",
                photoURL: firebaseUser.photoURL || "",
                role: "SECONDARY",
              });
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            setError(error.message);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  // Email/Password Login function
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);

      // Check if credentials match mock admin user
      if (
        credentials.email === "rajnish@familypay.com" &&
        credentials.password === "admin123"
      ) {
        // Use mock authentication for admin
        const result = await mockAuthService.signIn(
          credentials.email,
          credentials.password,
        );

        if (result.success) {
          // Get mock user data
          const userDataResult = await mockAuthService.getUserData(
            result.user.uid,
          );

          if (userDataResult.success) {
            setUser({
              id: result.user.uid,
              email: result.user.email,
              photoURL: result.user.photoURL,
              ...userDataResult.data,
            });
            return { success: true, data: result.user };
          } else {
            setError(userDataResult.error);
            return { success: false, error: userDataResult.error };
          }
        } else {
          setError(result.error);
          return { success: false, error: result.error };
        }
      } else {
        // Use Firebase authentication for other users
        const result = await firebaseAuth.signIn(
          credentials.email,
          credentials.password,
        );

        if (result.success) {
          // User data will be set by the onAuthStateChanged listener
          return { success: true, data: result.user };
        } else {
          setError(result.error);
          return { success: false, error: result.error };
        }
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In function
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const result = await firebaseAuth.signInWithGoogle();

      if (result.success) {
        // User data will be set by the onAuthStateChanged listener
        return { success: true, data: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      const result = await firebaseAuth.signUp(
        userData.email,
        userData.password,
        {
          name: userData.name,
          role: userData.role || "SECONDARY",
          phone: userData.phone || "",
          familyCircle: userData.familyCircle || "",
          photoURL: userData.photoURL || "",
          dateOfBirth: userData.dateOfBirth || "",
          address: userData.address || "",
        },
      );

      if (result.success) {
        return { success: true, data: result.user };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Password Reset function
  const resetPassword = async (email) => {
    try {
      setError(null);
      const result = await firebaseAuth.resetPassword(email);

      if (result.success) {
        return { success: true, message: "Password reset email sent!" };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setError(null);
      const result = await firebaseAuth.signOut();
      if (result.success) {
        setUser(null);
        // Redirect to main page instead of login page
        window.location.href = "/";
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      setError(null);
      const result = await firebaseDB.updateUser(user.id, userData);

      if (result.success) {
        setUser((prevUser) => ({ ...prevUser, ...userData }));
        return { success: true };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Admin functions
  const adminFunctions = {
    // Get all users (admin only)
    getAllUsers: async () => {
      try {
        if (!user || user.role !== "ADMIN") {
          throw new Error("Admin access required");
        }

        const result = await userService.getAllUsers();
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Get users by role (admin only)
    getUsersByRole: async (role) => {
      try {
        if (!user || user.role !== "ADMIN") {
          throw new Error("Admin access required");
        }

        const result = await userService.getUsersByRole(role);
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Update user role (admin only)
    updateUserRole: async (userId, newRole) => {
      try {
        if (!user || user.role !== "ADMIN") {
          throw new Error("Admin access required");
        }

        const result = await userService.updateUserRole(userId, newRole);
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    // Assign user to family circle (admin only)
    assignToCircle: async (userId, circleId) => {
      try {
        if (!user || user.role !== "ADMIN") {
          throw new Error("Admin access required");
        }

        const result = await userService.assignToCircle(userId, circleId);
        return result;
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    resetPassword,
    logout,
    updateProfile,
    adminFunctions,
    isAuthenticated: !!user,
    isPrimary: user?.role === "PRIMARY",
    isSecondary: user?.role === "SECONDARY",
    isAdmin: user?.role === "ADMIN",
    role: user?.role || null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
