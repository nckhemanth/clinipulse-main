import { Shield, Server, Bot } from 'lucide-react';

export default function AboutCard() {
    return (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-2 -mr-2 w-20 h-20 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>

            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 opacity-90 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Secure Platform
            </h3>

            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg mt-0.5 backdrop-blur-sm">
                        <Server className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">On-Premises Privacy</h4>
                        <p className="text-xs text-blue-100 leading-tight mt-0.5">
                            AI Model in your cloud. Your data never leaves your infrastructure. Full sovereignty over medical records.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-1.5 bg-white/20 rounded-lg mt-0.5 backdrop-blur-sm">
                        <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold">RAG Intelligence</h4>
                        <p className="text-xs text-blue-100 leading-tight mt-0.5">
                            Retrieval-Augmented Generation provides accurate citations from your specific documents.
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 text-[10px] text-blue-200 text-center">
                Enterprise-Grade Security • SOC2 Compliant Design
            </div>
        </div>
    );
}
