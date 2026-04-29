import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Trash2, ExternalLink, ArrowLeft, Clock, Globe } from 'lucide-react';
import { setActiveUrl, removeFromHistory, clearHistory } from '../store/slices/appSlice';
import Navbar from '../components/Navbar';

const HistoryPage = () => {
    const history = useSelector((state) => state.app.history);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePreview = (url) => {
        dispatch(setActiveUrl(url));
        navigate('/dashboard');
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-zinc-300">
            <Navbar />
            
            <main className="max-w-4xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/10 rounded-xl">
                                <HistoryIcon className="text-blue-500" size={24} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight">Recent History</h1>
                                <p className="text-zinc-500 text-sm">Websites you've recently previewed</p>
                            </div>
                        </div>
                    </div>

                    {history.length > 0 && (
                        <button 
                            onClick={() => dispatch(clearHistory())}
                            className="text-xs font-medium text-zinc-500 hover:text-rose-400 transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={14} />
                            Clear All
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
                            <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                                <HistoryIcon size={32} className="text-zinc-600" />
                            </div>
                            <h2 className="text-lg font-medium text-zinc-300 mb-1">No history yet</h2>
                            <p className="text-zinc-500 text-sm max-w-[250px]">Visited websites will appear here for quick access.</p>
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            >
                                Start Browsing
                            </button>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div 
                                key={item.id}
                                className="group flex items-center justify-between p-4 bg-[#111113] hover:bg-[#18181b] border border-zinc-800/50 rounded-2xl transition-all duration-200"
                            >
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="p-2.5 bg-zinc-800 rounded-lg group-hover:bg-zinc-700 transition-colors">
                                        <Globe size={18} className="text-zinc-400" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-zinc-200 font-medium truncate text-sm">
                                            {item.url}
                                        </span>
                                        <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                                            <Clock size={10} />
                                            {formatDate(item.timestamp)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handlePreview(item.url)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-blue-600 hover:text-white text-zinc-400 text-xs font-semibold rounded-lg transition-all"
                                    >
                                        <ExternalLink size={12} />
                                        Preview
                                    </button>
                                    <button 
                                        onClick={() => dispatch(removeFromHistory(item.id))}
                                        className="p-2 hover:bg-rose-500/10 text-zinc-500 hover:text-rose-500 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {history.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-zinc-800/50 flex justify-center">
                        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold">
                            End of history
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HistoryPage;
