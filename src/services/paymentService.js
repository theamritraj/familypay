import { firebaseDB } from '../firebase';

// Payment service using Firebase
export const paymentService = {
  // Create a new payment request
  createPayment: async (paymentData) => {
    try {
      const transactionData = {
        ...paymentData,
        type: 'PAYMENT',
        status: paymentData.amount >= 1000 ? 'pending' : 'completed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await firebaseDB.createTransaction(transactionData);
      
      if (result.success) {
        // Update circle spending if payment is completed
        if (transactionData.status === 'completed') {
          await this.updateCircleSpending(paymentData.fromUserId, paymentData.amount);
        }
        return { 
          success: true, 
          data: { 
            id: result.id, 
            ...transactionData,
            autoApproved: paymentData.amount < 1000
          } 
        };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get user transactions
  getUserTransactions: async (userId, limit = 50) => {
    try {
      const result = await firebaseDB.getUserTransactions(userId, limit);
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Get pending transactions (for admin)
  getPendingTransactions: async () => {
    try {
      const result = await firebaseDB.getPendingTransactions();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Approve a payment (admin only)
  approvePayment: async (transactionId, adminId) => {
    try {
      const updateData = {
        status: 'completed',
        approvedBy: adminId,
        approvedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await firebaseDB.updateTransaction(transactionId, updateData);
      
      if (result.success) {
        // Get transaction details to update circle spending
        // Note: In a real app, you'd fetch the transaction first
        return { success: true, data: updateData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Reject a payment (admin only)
  rejectPayment: async (transactionId, adminId, reason) => {
    try {
      const updateData = {
        status: 'rejected',
        rejectedBy: adminId,
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
        updatedAt: new Date().toISOString()
      };

      const result = await firebaseDB.updateTransaction(transactionId, updateData);
      
      if (result.success) {
        return { success: true, data: updateData };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Update circle spending (helper function)
  updateCircleSpending: async (userId, amount) => {
    try {
      // Get user data to find their circle
      const userResult = await firebaseDB.getUser(userId);
      if (userResult.success && userResult.data.familyCircle) {
        // Update circle spending
        const circleId = userResult.data.familyCircle;
        const circleResult = await firebaseDB.getCircle(circleId);
        
        if (circleResult.success) {
          const circleData = circleResult.data;
          const updatedData = {
            currentDailySpent: (circleData.currentDailySpent || 0) + amount,
            currentMonthlySpent: (circleData.currentMonthlySpent || 0) + amount,
            updatedAt: new Date().toISOString()
          };
          
          await firebaseDB.updateCircle(circleId, updatedData);
        }
      }
    } catch (error) {
      console.error('Error updating circle spending:', error);
    }
  },

  // Listen to real-time transaction updates
  listenToUserTransactions: (userId, callback) => {
    try {
      return firebaseDB.listenToTransactions(userId, callback);
    } catch (error) {
      console.error('Error setting up transaction listener:', error);
      return null;
    }
  },

  // Listen to real-time pending transactions (for admin)
  listenToPendingTransactions: (callback) => {
    try {
      return firebaseDB.listenToPendingTransactions(callback);
    } catch (error) {
      console.error('Error setting up pending transactions listener:', error);
      return null;
    }
  },

  // Get payment statistics
  getPaymentStats: async (userId) => {
    try {
      const result = await firebaseDB.getUserTransactions(userId, 100);
      if (result.success) {
        const transactions = result.data;
        const stats = {
          totalTransactions: transactions.length,
          completedTransactions: transactions.filter(t => t.status === 'completed').length,
          pendingTransactions: transactions.filter(t => t.status === 'pending').length,
          rejectedTransactions: transactions.filter(t => t.status === 'rejected').length,
          totalSpent: transactions
            .filter(t => t.status === 'completed')
            .reduce((sum, t) => sum + (t.amount || 0), 0),
          averageTransaction: 0
        };

        if (stats.completedTransactions > 0) {
          stats.averageTransaction = stats.totalSpent / stats.completedTransactions;
        }

        return { success: true, data: stats };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default paymentService;
