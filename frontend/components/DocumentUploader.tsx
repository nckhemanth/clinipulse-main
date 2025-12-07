'use client';

import { useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { api, handleApiError } from '@/lib/api';

interface DocumentUploaderProps {
    sessionId?: string;
    onUploadComplete?: () => void;
}

export default function DocumentUploader({ sessionId = 'default', onUploadComplete }: DocumentUploaderProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
            setUploadStatus(null);
        }
    };

    const removeFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setUploadStatus(null);

        try {
            const result = await api.documents.upload(files, sessionId);
            setUploadStatus({
                success: true,
                message: result.message || `Uploaded ${files.length} document(s) successfully!`,
            });
            setFiles([]);
            if (onUploadComplete) onUploadComplete();
        } catch (error) {
            setUploadStatus({
                success: false,
                message: handleApiError(error),
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
            </div>

            <div className="space-y-4">
                {/* File input */}
                <div className="relative">
                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                        <Upload className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PDF files only</p>
                    </label>
                </div>

                {/* File list */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">{files.length} file(s) selected</p>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                            {files.map((file, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-gray-700 truncate max-w-md">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                            ({(file.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload button */}
                <button
                    onClick={handleUpload}
                    disabled={files.length === 0 || uploading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    {uploading ? 'Uploading...' : 'Upload Documents'}
                </button>

                {/* Status message */}
                {uploadStatus && (
                    <div
                        className={`flex items-center gap-2 p-3 rounded-lg ${uploadStatus.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                            }`}
                    >
                        {uploadStatus.success ? (
                            <CheckCircle className="w-5 h-5" />
                        ) : (
                            <X className="w-5 h-5" />
                        )}
                        <p className="text-sm">{uploadStatus.message}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
