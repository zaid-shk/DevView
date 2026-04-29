import React from 'react';
import { Search, AppWindow } from 'lucide-react';

const EmptyState = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center w-full h-[calc(100vh-150px)] bg-[#0a0a0a] relative overflow-hidden">
            {/* Floating background decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-yellow-500/30"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rotate-45 border border-zinc-500/40"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-zinc-600/30"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-yellow-500/20"></div>

            {/* Main Icon Container */}
            <div className="relative mb-10 mt-10">
                <div className="bg-[#18181b] p-8 rounded-2xl border border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10">
                    <AppWindow size={80} strokeWidth={1} className="text-zinc-500" />

                    <div className="absolute -bottom-3 -right-3 bg-[#ffc53d] p-3.5 rounded-full border-[6px] border-[#0a0a0a] shadow-lg">
                        <Search size={28} strokeWidth={3} className="text-[#0a0a0a]" />
                    </div>
                </div>

                <div className="absolute -top-6 -left-8 text-[#ffc53d]/70 text-xl">✦</div>
                <div className="absolute top-4 -right-12 text-[#ffc53d]/70 text-lg">✦</div>
                <div className="absolute bottom-2 -left-10 text-zinc-500/60 text-2xl">✦</div>
                <div className="absolute -bottom-8 right-8 text-zinc-500/40 text-lg">✦</div>
            </div>

            {/* Text Content */}
            <h2 className="text-[22px] font-semibold text-white mb-4 tracking-tight">Enter a URL to start previewing</h2>
            <p className="text-zinc-400 text-center max-w-[340px] text-[15px] leading-relaxed mb-8">
                Paste any website URL above and click Preview to see it across all devices.
            </p>

            {/* Hand-drawn Arrow SVG */}
            <div className="relative w-full max-w-md h-12">
                <svg
                    className="absolute right-12 -top-8 text-[#ffc53d] w-24 h-24 opacity-90"
                    viewBox="0 0 100 100"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M 10 60 Q 50 100 85 30" />
                    <path d="M 65 30 L 85 30 L 80 50" />
                </svg>
            </div>
        </div>
    );
};

export default EmptyState;
