'use client';

import { useState } from 'react';
import { Mail, Send, Loader2, CheckCircle, XCircle, Lock } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';

interface EmailActionsProps {
    aiEnabled?: boolean;
}

export default function EmailActions({ aiEnabled = false }: EmailActionsProps) {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'report' | 'support'>('report');

    const handleSendReport = async () => {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setStatus({ type: 'error', message: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            await api.email.sendReport(email);
            setStatus({ type: 'success', message: 'Analysis report sent successfully!' });
            setEmail('');
        } catch (error) {
            setStatus({ type: 'error', message: handleApiError(error) });
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async () => {
        if (!email || !phone || !message.trim()) {
            setStatus({ type: 'error', message: 'Please fill in all required fields' });
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            // Include phone in the message for now since backend expects it
            const fullMessage = `Phone: ${phone}\n\n${message}`;
            await api.email.createSupportTicket(fullMessage, email);
            setStatus({ type: 'success', message: 'Support ticket created successfully!' });
            setMessage('');
            setEmail('');
            setPhone('');
        } catch (error) {
            setStatus({ type: 'error', message: handleApiError(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Email Actions</h3>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'report'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Send Report
                </button>
                <button
                    onClick={() => setActiveTab('support')}
                    className={`px-4 py-2 font-medium transition-colors ${activeTab === 'support'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                        }`}
                >
                    Support Ticket
                </button>
            </div>

            {/* Report Tab */}
            {activeTab === 'report' && (
                <div className="space-y-4">
                    {!aiEnabled ? (
                        <div className="text-center py-8 px-4 bg-amber-50 rounded-lg border border-amber-200">
                            <Lock className="w-12 h-12 mx-auto mb-3 text-amber-500" />
                            <p className="font-semibold text-amber-900">AI Required</p>
                            <p className="text-sm text-amber-700 mt-1">
                                Report generation requires AI services. Enable AI from the banner above.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600">
                                Send a comprehensive analysis report of your session to an your or doctors email address.
                            </p>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="doctor@hospital.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                                />
                            </div>
                            <button
                                onClick={handleSendReport}
                                disabled={!email || loading}
                                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Send Report
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* Support Tab */}
            {activeTab === 'support' && (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                        Create a support ticket for any issues or questions. Use this to request AI access as well.
                    </p>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Describe your issue or request AI access..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 resize-none"
                        />
                    </div>
                    <button
                        onClick={handleCreateTicket}
                        disabled={loading || !email || !phone || !message}
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Create Ticket
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Status Message */}
            {status && (
                <div
                    className={`mt-4 p-3 rounded-lg flex items-start gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                >
                    {status.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    ) : (
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                    )}
                    <p className="text-sm">{status.message}</p>
                </div>
            )}
        </div>
    );
}
