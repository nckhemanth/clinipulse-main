'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ZapOff } from 'lucide-react';
import { api, handleApiError, ChatMessage } from '@/lib/api';

interface ChatInterfaceProps {
    sessionId?: string;
    aiEnabled?: boolean;
}

export default function ChatInterface({ sessionId = 'default', aiEnabled = false }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await api.chat.send(input, sessionId);
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.response,
                timestamp: response.timestamp,
                insights: response.insights,
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                role: 'assistant',
                content: `Error: ${handleApiError(error)}`,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
                <Bot className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">AI Medical Assistant</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {!aiEnabled ? (
                    <div className="text-center text-amber-600 mt-20 px-6">
                        <ZapOff className="w-16 h-16 mx-auto mb-4 text-amber-400" />
                        <p className="text-lg font-bold">🔒 AI Services Disabled</p>
                        <p className="text-sm text-amber-700 mt-2 max-w-md mx-auto">
                            Chat functionality is currently disabled to minimize cloud GPU costs. Enable AI services from the banner above to start chatting.
                        </p>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-20">
                        <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No messages yet</p>
                        <p className="text-sm">Upload documents and start asking questions!</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-blue-600" />
                                    </div>
                                </div>
                            )}
                            <div
                                className={`max-w-3xl rounded-lg p-4 ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-900'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                {message.insights && (
                                    <div className="mt-2 pt-2 border-t border-gray-300 text-xs opacity-75">
                                        <p>Response time: {message.insights.response_time}s</p>
                                        <p>{message.insights.relevant_docs_count} relevant documents</p>
                                    </div>
                                )}
                            </div>
                            {message.role === 'user' && (
                                <div className="flex-shrink-0">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Bot className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4">
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={aiEnabled ? "Ask about your medical documents..." : "AI services disabled"}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500 text-gray-900"
                        disabled={loading || !aiEnabled}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading || !aiEnabled}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
