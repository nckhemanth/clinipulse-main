'use client';

import { useState } from 'react';
import { MessageSquare, BarChart3, Mail, Database, Upload, Activity } from 'lucide-react';
import DocumentUploader from '@/components/DocumentUploader';
import ChatInterface from '@/components/ChatInterface';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import EmailActions from '@/components/EmailActions';
import DocumentManager from '@/components/DocumentManager';
import AboutCard from '@/components/AboutCard';
// Cost control removed - app is publicly accessible

export default function Home() {
  const aiEnabled = true;
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics'>('chat');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Cost Control Banner removed - app is publicly accessible */}

      {/* Professional Header - Fixed Height */}
      <header className="flex-none bg-white border-b border-gray-200 shadow-sm z-50">
        <div className="w-full px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Fixed with Visible Icon */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
                {/* Using Lucide icon instead of image */}
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-none">CliniPulse AI</h1>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">On-Prem Cloud Medical Intelligence</p>
              </div>
            </div>

            {/* Tab Navigation */}
            <nav className="flex items-center gap-1 bg-gray-100/80 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-all ${activeTab === 'chat'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
              >
                <MessageSquare className="w-4 h-4" />
                Assistant
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md font-medium text-sm transition-all ${activeTab === 'analytics'
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                  }`}
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </nav>
          </div>
        </div>
      </header >

      {/* Main Layout - Fixed Height Body */}
      < div className="flex-1 flex overflow-hidden" >
        {/* Left Sidebar - Scrollable */}
        < aside className="w-[380px] flex-none bg-white border-r border-gray-200 overflow-y-auto custom-scrollbar" >
          <div className="p-5 space-y-6">
            {/* About Section */}
            <section>
              <AboutCard />
            </section>

            <hr className="border-gray-100" />

            {/* Upload Section */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="p-1.5 bg-blue-50 rounded-md text-blue-600">
                  <Upload className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Documents</h2>
              </div>
              <DocumentUploader onUploadComplete={handleUploadComplete} />
            </section>

            <hr className="border-gray-100" />

            {/* Document Management */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="p-1.5 bg-indigo-50 rounded-md text-indigo-600">
                  <Database className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Database</h2>
              </div>
              <DocumentManager aiEnabled={aiEnabled} refreshKey={refreshKey} />
            </section>

            <hr className="border-gray-100" />

            {/* Email Actions */}
            <section>
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
                  <Mail className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Actions</h2>
              </div>
              <EmailActions aiEnabled={aiEnabled} />
            </section>

            {/* Footer in Sidebar */}
            <div className="pt-6 mt-6 border-t border-gray-100 text-center">
              <p className="text-xs text-gray-500">© 2026 CliniPulse AI</p>
              <p className="text-[10px] text-gray-400 mt-1">Contact: hemanth.reddy.n@nyu.edu</p>
            </div>
          </div>
        </aside >

        {/* Main Content Area - Scrollable */}
        < main className="flex-1 bg-gray-50/50 overflow-hidden relative" >
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div className="max-w-5xl mx-auto h-full">
              {activeTab === 'chat' ? (
                <div key={refreshKey} className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                  <ChatInterface aiEnabled={aiEnabled} />
                </div>
              ) : (
                <div key={refreshKey} className="h-full">
                  <AnalyticsDashboard />
                </div>
              )}
            </div>
          </div>
        </main >
      </div >
    </div >
  );
}
