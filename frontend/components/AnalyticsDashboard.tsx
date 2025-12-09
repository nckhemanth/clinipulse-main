'use client';

import { useCallback, useEffect, useState } from 'react';
import { BarChart3, FileText, MessageSquare, Database, Mail } from 'lucide-react';
import { api, AnalyticsData } from '@/lib/api';

interface AnalyticsDashboardProps {
    sessionId?: string;
}

export default function AnalyticsDashboard({ sessionId = 'default' }: AnalyticsDashboardProps) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAnalytics = useCallback(async () => {
        try {
            setError(null);
            const data = await api.analytics.get(sessionId);
            setAnalytics(data);
        } catch (error) {
            console.error('[Analytics] Fetch failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to load analytics data';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [sessionId]);

    useEffect(() => {
        fetchAnalytics();
        const interval = setInterval(() => {
            fetchAnalytics();
        }, 10000); // Refresh every 10s
        return () => clearInterval(interval);
    }, [fetchAnalytics]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-4">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64 text-red-600 flex-col gap-2">
                <p className="font-semibold">Error Loading Analytics</p>
                <p className="text-sm">{error}</p>
                <button
                    onClick={() => { setLoading(true); fetchAnalytics(); }}
                    className="text-sm bg-blue-50 px-3 py-1 rounded-md text-blue-600 hover:bg-blue-100"
                >
                    Retry
                </button>
            </div>
        );
    }

    const stats = [
        {
            label: 'Documents',
            value: analytics?.document_count || 0,
            icon: FileText,
            color: 'bg-blue-100 text-blue-600',
        },
        {
            label: 'Messages',
            value: analytics?.message_count || 0,
            icon: MessageSquare,
            color: 'bg-green-100 text-green-600',
        },
        {
            label: 'Vector DB',
            value: analytics?.vectorstore_ready ? 'Ready' : 'Not Ready',
            icon: Database,
            color: 'bg-purple-100 text-purple-600',
        },
        {
            label: 'Email',
            value: analytics?.email_configured ? 'Configured' : 'Not Set',
            icon: Mail,
            color: 'bg-orange-100 text-orange-600',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-lg ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Messages */}
            {analytics && analytics.recent_messages.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {analytics.recent_messages.slice(0, 5).map((message, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                                <p className="text-sm font-medium text-gray-700 capitalize">{message.role}</p>
                                <p className="text-sm text-gray-600 truncate">{message.content}</p>
                                {message.timestamp && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(message.timestamp).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
