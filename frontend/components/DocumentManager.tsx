'use client';

import { useState, useEffect } from 'react';
import { Trash2, Database, Loader2, CheckCircle, XCircle, CloudDownload } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';

interface DocumentManagerProps {
    aiEnabled?: boolean;
    refreshKey?: number;
}

export default function DocumentManager({ refreshKey = 0 }: DocumentManagerProps) {
    const [loading, setLoading] = useState(false);
    const [syncLoading, setSyncLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [docCount, setDocCount] = useState(0);

    // Check status on mount and refresh
    useEffect(() => {
        checkStatus();
    }, [refreshKey]);

    const checkStatus = async () => {
        try {
            const data = await api.analytics.get();
            setDocCount(data.document_count);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleSyncStorage = async () => {
        setSyncLoading(true);
        setStatus(null);

        try {
            const response = await api.documents.processStorage();
            setStatus({
                type: 'success',
                message: `Loaded ${response.documents_processed} docs (${response.total_chunks} chunks) from Azure Blob Storage`
            });
            checkStatus(); // Refresh count
        } catch (error) {
            setStatus({ type: 'error', message: handleApiError(error) });
        } finally {
            setSyncLoading(false);
        }
    };

    const handleClearDocuments = async () => {
        if (!confirm('Are you sure you want to clear all context? This will remove all embeddings from ChromaDB.')) {
            return;
        }

        setLoading(true);
        setStatus(null);

        try {
            await api.documents.clear();
            setStatus({ type: 'success', message: 'Context cleared successfully' });
            checkStatus(); // Refresh count
        } catch (error) {
            setStatus({ type: 'error', message: handleApiError(error) });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {/* Section 1: Context Status with Sync Button */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Context</span>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${docCount > 0 ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-100'}`}>
                        {docCount} docs
                    </span>
                </div>

                {/* Sync from Azure Blob Storage */}
                <button
                    onClick={handleSyncStorage}
                    disabled={syncLoading}
                    className="w-full bg-blue-50 text-blue-600 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors text-xs font-medium"
                >
                    {syncLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                        <CloudDownload className="w-3 h-3" />
                    )}
                    {syncLoading ? 'Loading from Azure...' : 'Load from Azure Storage'}
                </button>
            </div>

            {/* Section 2: Clear Context - Always visible, disabled when no docs */}
            <div className={`p-3 rounded-lg border ${docCount > 0 ? 'bg-red-50/50 border-red-100' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                    <Trash2 className={`w-4 h-4 ${docCount > 0 ? 'text-red-400' : 'text-gray-300'}`} />
                    <span className={`text-xs font-semibold uppercase tracking-wide ${docCount > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        Clear Context
                    </span>
                </div>
                <button
                    onClick={handleClearDocuments}
                    disabled={loading || docCount === 0}
                    className={`w-full px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-xs font-medium ${docCount > 0
                            ? 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-400'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Clearing...
                        </>
                    ) : (
                        <>
                            <Trash2 className="w-3 h-3" />
                            Clear All Context
                        </>
                    )}
                </button>
            </div>

            {/* Status Message */}
            {status && (
                <div
                    className={`p-3 rounded-lg flex items-start gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                >
                    {status.type === 'success' ? (
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                        <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-xs">{status.message}</p>
                </div>
            )}
        </div>
    );
}
