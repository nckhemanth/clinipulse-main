'use client';

import { useState } from 'react';
import { Mail, Phone, Send, X, CheckCircle } from 'lucide-react';

interface AccessRequestModalProps {
    onClose: () => void;
}

export default function AccessRequestModal({ onClose }: AccessRequestModalProps) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Send request to backend
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
            const response = await fetch(`${apiUrl}/api/request-access`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, phone }),
            });

            if (response.ok) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to submit access request:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {submitted ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                        <p className="text-sm text-gray-600">
                            We&apos;ll review your request and get back to you shortly.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Request AI Access</h2>
                            <p className="text-sm text-gray-600">
                                Enter your details to request access to AI-powered features (Chat & Document Processing)
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-1" />
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-1" />
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !email || !phone}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Request Access
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center">
                                Note: AI services incur cloud GPU costs. Access is granted on a case-by-case basis.
                            </p>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
