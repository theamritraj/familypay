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
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzNPVUu0BBoF3c44SEaaryl7fXd1Z0a1k",
  authDomain: "fmgp-14fec.firebaseapp.com",
  projectId: "fmgp-14fec",
  storageBucket: "fmgp-14fec.firebasestorage.app",
  messagingSenderId: "710284365652",
  appId: "1:710284365652:web:170e609c3c4a5aa14082c1",
  measurementId: "G-XM4J1W4QX1",
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
      // Try normal sign in first
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        return { success: true, user: userCredential.user };
      } catch (authError) {
        // If user not found, check if there is a pending invite for this email
        if (authError.code === "auth/invalid-credential" || authError.code === "auth/user-not-found" || authError.message.includes("credential")) {
          const inviteRes = await firebaseDB.getInviteByEmail(email);
          if (inviteRes.success && inviteRes.data) {
            const inviteData = inviteRes.data;
            if (inviteData.tempPassword && inviteData.tempPassword.toString().trim() === password.toString().trim()) {
              // Auto-register the secondary member using the temporary credentials
              const signUpRes = await firebaseAuth.signUp(email, password, {
                name: inviteData.name,
                role: "SECONDARY",
                familyCircle: inviteData.circleId,
                phone: inviteData.phone || "",
              });

              if (signUpRes.success) {
                // Mark invitation as accepted
                await updateDoc(doc(db, "invites", inviteData.id), {
                  status: "accepted",
                  acceptedAt: serverTimestamp(),
                  userId: signUpRes.user.uid
                });
                return { success: true, user: signUpRes.user };
              } else {
                return { success: false, error: signUpRes.error || "Failed to create account from invitation." };
              }
            }
          }
        }
        return { success: false, error: authError.message };
      }
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
        // Check if there is a pending invite for this email
        const inviteRes = await firebaseDB.getInviteByEmail(user.email);
        
        let familyCircle = "";
        let role = "SECONDARY";
        let phone = "";
        
        if (inviteRes.success && inviteRes.data) {
          familyCircle = inviteRes.data.circleId || "";
          role = inviteRes.data.role || "SECONDARY";
          phone = inviteRes.data.phone || "";
          
          // Add user to the circle's members array
          if (familyCircle) {
            const circleDocRef = doc(db, "circles", familyCircle);
            const circleDocSnap = await getDoc(circleDocRef);
            if (circleDocSnap.exists()) {
              const circleData = circleDocSnap.data();
              const updatedMembers = [
                ...(circleData.members || []),
                {
                  id: user.uid,
                  name: user.displayName || inviteRes.data.name || "",
                  role: role,
                  joinedAt: new Date().toISOString(),
                  dailyLimit: inviteRes.data.dailyLimit || 1000,
                  monthlyLimit: inviteRes.data.monthlyLimit || 10000,
                },
              ];
              await updateDoc(circleDocRef, { members: updatedMembers });
            }
          }
          
          // Mark invite as accepted
          await updateDoc(doc(db, "invites", inviteRes.data.id), {
            status: "accepted",
            acceptedAt: serverTimestamp(),
            userId: user.uid
          });
        } else {
          // If no pending invite, make them a PRIMARY user and create a circle
          role = "PRIMARY";
          const newCircleRef = await addDoc(collection(db, "circles"), {
            name: `${user.displayName || "User"}'s Family`,
            createdAt: serverTimestamp(),
            createdBy: user.uid,
            members: [
              {
                id: user.uid,
                name: user.displayName || "User",
                role: "PRIMARY",
                joinedAt: new Date().toISOString(),
              },
            ],
          });
          familyCircle = newCircleRef.id;
        }
      
        // Create new user document for Google sign-in
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: role,
          phone: phone,
          familyCircle: familyCircle,
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
      // If SECONDARY role, verify the invite code (familyCircle) before creating auth user
      if (userData.role === "SECONDARY" && userData.familyCircle) {
        const circleDocRef = doc(db, "circles", userData.familyCircle);
        const circleDocSnap = await getDoc(circleDocRef);
        if (!circleDocSnap.exists()) {
          return { success: false, error: "Invalid Family Invite Code." };
        }
      }

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

      let assignedCircleId = userData.familyCircle || "";

      // If PRIMARY role, create a new circle
      if (userData.role === "PRIMARY") {
        const newCircleRef = await addDoc(collection(db, "circles"), {
          name: `${userData.name}'s Family`,
          createdAt: serverTimestamp(),
          createdBy: user.uid,
          members: [
            {
              id: user.uid,
              name: userData.name || user.displayName || "",
              role: "PRIMARY",
              joinedAt: new Date().toISOString(),
            },
          ],
        });
        assignedCircleId = newCircleRef.id;
      } 
      // If SECONDARY role, we already verified it exists. Just add member to it.
      else if (userData.role === "SECONDARY" && assignedCircleId) {
        const circleDocRef = doc(db, "circles", assignedCircleId);
        const circleDocSnap = await getDoc(circleDocRef);
        const circleData = circleDocSnap.data();
        const updatedMembers = [
          ...(circleData.members || []),
          {
            id: user.uid,
            name: userData.name || user.displayName || "",
            role: "SECONDARY",
            joinedAt: new Date().toISOString(),
            dailyLimit: 1000,
            monthlyLimit: 10000,
          },
        ];
        await updateDoc(circleDocRef, { members: updatedMembers });
      }

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: userData.name || user.displayName || "",
        email: email,
        photoURL: userData.photoURL || user.photoURL || "",
        role: userData.role || "SECONDARY",
        phone: userData.phone || "",
        familyCircle: assignedCircleId,
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
  // Save pending invite
  savePendingInvite: async (inviteData) => {
    try {
      await addDoc(collection(db, "invites"), {
        ...inviteData,
        createdAt: serverTimestamp(),
        status: "pending"
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get pending invites for a circle
  getPendingInvites: async (circleId, fallbackId) => {
    try {
      const ids = [];
      if (circleId) ids.push(circleId);
      if (fallbackId && !ids.includes(fallbackId)) ids.push(fallbackId);
      
      if (ids.length === 0) {
        return { success: true, data: [] };
      }

      const q = query(
        collection(db, "invites"),
        where("circleId", "in", ids),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      const invites = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory to avoid needing a composite index
      invites.sort((a, b) => {
        const timeA = a.createdAt?.seconds || a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.seconds || b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });

      return { success: true, data: invites };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user by phone number
  getUserByPhone: async (phone) => {
    try {
      const q = query(
        collection(db, "users"),
        where("phone", "==", phone)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { success: true, data: querySnapshot.docs[0].data() };
      }
      return { success: false, error: "User not found with this phone number" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Find invite by email
  getInviteByEmail: async (email) => {
    try {
      const q = query(
        collection(db, "invites"),
        where("email", "==", email),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { success: true, data: { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } };
      }
      return { success: false, error: "No pending invite found" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user data
  getUser: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return { success: true, data: { id: userDoc.id, ...userDoc.data() } };
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

  // Remove member from circle
  removeMemberFromCircle: async (circleId, memberId) => {
    try {
      const circleDocRef = doc(db, "circles", circleId);
      const circleDoc = await getDoc(circleDocRef);
      if (circleDoc.exists()) {
        const circleData = circleDoc.data();
        const updatedMembers = (circleData.members || []).filter(m => (m.id || m) !== memberId);
        await updateDoc(circleDocRef, {
          members: updatedMembers,
          updatedAt: serverTimestamp(),
        });
        
        // Detach the user from the circle
        const userDocRef = doc(db, "users", memberId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            familyCircle: "",
            updatedAt: serverTimestamp()
          });
        }
        return { success: true };
      }
      return { success: false, error: "Circle not found" };
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
        circleId: transactionData.circleId || "",
        createdAt: serverTimestamp(),
        status: transactionData.status || "pending",
      });
      return { success: true, id: transactionRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get transactions for a user (restricted by circleId for multi-tenancy)
  getUserTransactions: async (userId, circleId, limitCount = 50) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("circleId", "==", circleId),
        where("fromUserId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      // Sort in memory
      transactions.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      return { success: true, data: transactions.slice(0, limitCount) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get pending transactions for admin (restricted by circleId for multi-tenancy)
  getPendingTransactions: async (circleId) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("circleId", "==", circleId),
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

  // Get all transactions for a circle (multi-tenant dashboard view)
  getCircleTransactions: async (circleId, limitCount = 100) => {
    try {
      const q = query(
        collection(db, "transactions"),
        where("circleId", "==", circleId),
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

  // Listen to all transactions for a circle in real-time
  listenToCircleTransactions: (circleId, callback) => {
    const q = query(
      collection(db, "transactions"),
      where("circleId", "==", circleId),
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

  // Real-time listener for transactions (restricted by circleId for multi-tenancy)
  listenToTransactions: (userId, circleId, callback) => {
    const q = query(
      collection(db, "transactions"),
      where("circleId", "==", circleId),
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

  // Real-time listener for pending transactions (admin, restricted by circleId for multi-tenancy)
  listenToPendingTransactions: (circleId, callback) => {
    const q = query(
      collection(db, "transactions"),
      where("circleId", "==", circleId),
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

  // Top up circle wallet balance
  topUpCircleWallet: async (circleId, amount) => {
    try {
      await updateDoc(doc(db, "circles", circleId), {
        walletBalance: increment(amount),
        updatedAt: serverTimestamp(),
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
