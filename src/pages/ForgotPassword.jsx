import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const { resetPassword, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Please enter your email address');
            return;
        }

        try {
            const result = await resetPassword(email);
            
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('An unexpected error occurred');
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-bg-card rounded-2xl shadow-xl border border-border p-8 text-center">
                        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-success" />
                        </div>
                        <h1 className="text-2xl font-bold text-text mb-4">Password Reset Email Sent</h1>
                        <p className="text-text-muted mb-6">
                            We've sent a password reset link to your email address. 
                            Please check your inbox and follow the instructions.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Back to Login
                            </button>
                            <Link
                                to="/"
                                className="block w-full py-3 bg-bg-elevated border border-border rounded-lg text-center font-medium hover:border-primary transition-colors"
                            >
                                Go to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-bg-card rounded-2xl shadow-xl border border-border p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/login')}
                            className="flex items-center text-text-muted hover:text-text mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </button>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">FP</span>
                            </div>
                            <h1 className="text-2xl font-bold text-text mb-2">Reset Password</h1>
                            <p className="text-text-muted">
                                Enter your email address and we'll send you a link to reset your password
                            </p>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-danger" />
                            <span className="text-danger text-sm">{error}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text mb-2">
                                <Mail className="w-4 h-4 inline mr-2" />
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-bg-elevated border border-border rounded-lg text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Enter your email address"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-text-muted">
                            Remember your password?{' '}
                            <Link
                                to="/login"
                                className="text-primary hover:text-primary/80 font-medium"
                            >
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
