/**
 * CliniPulse AI - API Client
 * Type-safe client for interacting with the Spring Boot backend
 */

import axios, { AxiosError } from 'axios';

// Configure base URL - will use environment variable in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000, // temporary value used to reproduce long-running inference failures
});

// Types
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
    insights?: ChatInsights;
}

export interface ChatInsights {
    total_documents: number;
    relevant_docs_count: number;
    response_time: string;
    confidence_score: string;
    document_coverage: string;
    medical_keywords: string[];
}

export interface ChatResponse {
    response: string;
    relevant_docs: string[];
    insights: ChatInsights;
    timestamp: string;
}

export interface DocumentInfo {
    filename: string;
    key: string;
    size: number;
    last_modified: string;
    storage_url: string;
}

export interface UploadResponse {
    success: boolean;
    uploaded_to_storage: Array<{
        filename: string;
        storage_key: string;
        storage_url: string;
    }>;
    already_in_storage: Array<{
        filename: string;
        storage_key: string;
        storage_url: string;
    }>;
    failed_uploads: Array<{
        filename: string;
        error: string;
    }>;
    total_chunks: number;
    message: string;
}

export interface AnalyticsData {
    document_count: number;
    message_count: number;
    vectorstore_ready: boolean;
    email_configured: boolean;
    recent_messages: ChatMessage[];
}

// API functions
export const api = {
    // Health check
    health: async () => {
        const { data } = await apiClient.get('/health');
        return data;
    },

    // Document endpoints
    documents: {
        upload: async (files: File[], sessionId: string = 'default'): Promise<UploadResponse> => {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file);
            });
            formData.append('session_id', sessionId);

            const { data } = await apiClient.post('/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return data;
        },

        list: async (): Promise<DocumentInfo[]> => {
            const { data } = await apiClient.get('/api/documents/list');
            return data;
        },

        clear: async (sessionId: string = 'default') => {
            const { data } = await apiClient.delete('/api/documents/clear', {
                params: { session_id: sessionId },
            });
            return data;
        },

        processStorage: async (sessionId: string = 'default') => {
            const { data } = await apiClient.post('/api/documents/process-storage', null, {
                params: { session_id: sessionId },
            });
            return data;
        },
    },

    // Chat endpoint
    chat: {
        send: async (message: string, sessionId: string = 'default'): Promise<ChatResponse> => {
            const { data } = await apiClient.post('/api/chat', {
                message,
                session_id: sessionId,
            });
            return data;
        },
    },

    // Email endpoints
    email: {
        sendReport: async (email: string, sessionId: string = 'default') => {
            const { data } = await apiClient.post('/api/email/report', {
                email,
                session_id: sessionId,
            });
            return data;
        },

        createSupportTicket: async (
            message: string,
            email?: string,
            sessionId: string = 'default'
        ) => {
            const { data } = await apiClient.post('/api/email/support', {
                message,
                email,
                session_id: sessionId,
            });
            return data;
        },
    },

    // Analytics endpoint
    analytics: {
        get: async (sessionId: string = 'default'): Promise<AnalyticsData> => {
            const { data } = await apiClient.get('/api/analytics', {
                params: { session_id: sessionId },
            });
            return data;
        },
    },
};

// Error handler
export const handleApiError = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ detail: string }>;
        return axiosError.response?.data?.detail || axiosError.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
};
