'use client';

import { useState, useEffect } from 'react';
import { Zap, ZapOff, AlertCircle, Mail } from 'lucide-react';

interface CostControlBannerProps {
    onModeChange: (enabled: boolean) => void;
    onRequestAccess: () => void;
}

export default function CostControlBanner({ onModeChange, onRequestAccess }: CostControlBannerProps) {
    const [aiEnabled, setAiEnabled] = useState(false);
    const [serverAiEnabled, setServerAiEnabled] = useState(true); // Assume true until checked

    useEffect(() => {
        // Check server AI status first
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        fetch(`${apiUrl}/api/ai-status`)
            .then(res => res.json())
            .then(data => {
                setServerAiEnabled(data.ai_enabled);
                // Load from localStorage only if server allows it
                const saved = localStorage.getItem('clinipulse_ai_enabled');
                const initialState = data.ai_enabled && saved === 'true';
                setAiEnabled(initialState);
                onModeChange(initialState);
            })
            .catch(() => {
                // If server check fails, default to localStorage
                const saved = localStorage.getItem('clinipulse_ai_enabled');
                const initialState = saved === 'true';
                setAiEnabled(initialState);
                onModeChange(initialState);
            });
    }, [onModeChange]);

    const handleToggle = () => {
        if (!serverAiEnabled && !aiEnabled) {
            // Don't allow enabling if server has it disabled
            return;
        }
        const newState = !aiEnabled;
        setAiEnabled(newState);
        localStorage.setItem('clinipulse_ai_enabled', String(newState));
        onModeChange(newState);
    };

    return (
        <div
            className={`transition-all duration-300 ${aiEnabled
                ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200'
                : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                } border-b px-6 py-2.5`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {aiEnabled ? (
                        <Zap className="w-4 h-4 text-emerald-600" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <div>
                        <p
                            className={`text-sm font-medium ${aiEnabled ? 'text-emerald-900' : 'text-amber-900'
                                }`}
                        >
                            {aiEnabled ? (
                                <>
                                    <span className="font-bold">AI Services Active</span> – Chat & Embedding Generation Enabled
                                </>
                            ) : (
                                <>
                                    <span className="font-bold">🔒 Cost-Saving Mode</span> – AI features disabled to minimize cloud GPU & API costs
                                </>
                            )}
                        </p>
                        {!aiEnabled && !serverAiEnabled && (
                            <p className="text-xs text-red-700 mt-0.5 font-medium">
                                ⚠️ Server-side AI disabled. Contact admin to enable.
                            </p>
                        )}
                        {!aiEnabled && serverAiEnabled && (
                            <p className="text-xs text-amber-700 mt-0.5">
                                Document upload & analytics remain available • Need access? Request below
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!aiEnabled && !serverAiEnabled ? (
                        <button
                            onClick={onRequestAccess}
                            className="px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" />
                            Request Access
                        </button>
                    ) : !aiEnabled ? (
                        <button
                            onClick={handleToggle}
                            className="px-5 py-2 bg-amber-600 text-white rounded-lg font-semibold text-sm hover:bg-amber-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                            title="Enable AI features"
                        >
                            <Zap className="w-4 h-4" />
                            Enable AI
                        </button>
                    ) : (
                        <button
                            onClick={handleToggle}
                            className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium text-sm transition-all shadow-sm bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                            <ZapOff className="w-4 h-4" />
                            Disable AI
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
