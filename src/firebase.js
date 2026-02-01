// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB18If01xpZQMiVlVNj4CvItsue9hOo4Wg",
  authDomain: "familypay-11672.firebaseapp.com",
  projectId: "familypay-11672",
  storageBucket: "familypay-11672.firebasestorage.app",
  messagingSenderId: "264062515995",
  appId: "1:264062515995:web:e990b9e4d5b93e526a31be",
  measurementId: "G-M1YK840FHB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Firebase Authentication functions
export const firebaseAuth = {
  // Email/Password Sign In
  signIn: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Google Sign In
  signInWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        // Create new user document for Google sign-in
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: "SECONDARY", // Default role for new Google users
          phone: "",
          familyCircle: "",
          createdAt: serverTimestamp(),
          authProvider: "google",
          isEmailVerified: user.emailVerified,
        });
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Register new user with email/password
  signUp: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update user profile with display name
      if (userData.name) {
        await updateProfile(user, { displayName: userData.name });
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name || user.displayName,
        email: email,
        photoURL: userData.photoURL || user.photoURL || "",
        role: userData.role || "SECONDARY",
        phone: userData.phone || "",
        familyCircle: userData.familyCircle || "",
        createdAt: serverTimestamp(),
        authProvider: "email",
        isEmailVerified: user.emailVerified,
        dateOfBirth: userData.dateOfBirth || "",
        address: userData.address || "",
      });

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Password Reset
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChanged: (callback) => {
    return onAuthStateChanged(auth, callback);
  },
};

// Role-based user management
export const userService = {
  // Get user by role (admin function)
  getUsersByRole: async (role) => {
    try {
      const q = query(
        collection(db, "users"),
        where("role", "==", role),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user role (admin function)
  updateUserRole: async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Assign user to family circle
  assignToCircle: async (userId, circleId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        familyCircle: circleId,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get all users (admin function)
  getAllUsers: async () => {
    try {
      const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: users };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// Firestore Database functions
export const firebaseDB = {
  // Get user data
  getUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      }
      return { success: false, error: "User not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update user data
  updateUser: async (userId, userData) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        ...userData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get family circle data
  getCircle: async (circleId) => {
    try {
      const circleDoc = await getDoc(doc(db, "circles", circleId));
      if (circleDoc.exists()) {
        return { success: true, data: circleDoc.data() };
      }
      return { success: false, error: "Circle not found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update family circle
  updateCircle: async (circleId, circleData) => {
    try {
      await updateDoc(doc(db, "circles", circleId), {
        ...circleData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Create transaction
  createTransaction: async (transactionData) => {
    try {
      const transactionRef = doc(collection(db, "transactions"));
      await setDoc(transactionRef, {
        ...transactionData,
        createdAt: serverTimestamp(),
        status: transactionData.status || "pending",
      });
      return { success: true, id: transactionRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get transactions for a user
  getUserTransactions: async (userId, limitCount = 50) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("fromUserId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount),
      );
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get pending transactions for admin
  getPendingTransactions: async () => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("status", "==", "pending"),
        orderBy("createdAt", "desc"),
      );
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return { success: true, data: transactions };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update transaction status
  updateTransaction: async (transactionId, updateData) => {
    try {
      await updateDoc(doc(db, "transactions", transactionId), {
        ...updateData,
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Real-time listener for transactions
  listenToTransactions: (userId, callback) => {
    const q = query(
      collection(db, "transactions"),
      where("fromUserId", "==", userId),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(transactions);
    });
  },

  // Real-time listener for pending transactions (admin)
  listenToPendingTransactions: (callback) => {
    const q = query(
      collection(db, "transactions"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc"),
    );
    return onSnapshot(q, (querySnapshot) => {
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(transactions);
    });
  },
};

// Firebase Storage functions
export const firebaseStorage = {
  // Upload file
  uploadFile: async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return { success: true, url: downloadURL };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
};

// Export Firebase instances for direct use
export { auth, db, storage };

export default app;
