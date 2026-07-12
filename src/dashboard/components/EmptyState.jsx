import React from 'react';
import { Search, AppWindow } from 'lucide-react';
import { useSelector } from 'react-redux';
import { clsx } from 'clsx';

const EmptyState = () => {
    const theme = useSelector((state) => state.app.theme);

    return (
        <div className={clsx(
            "flex-1 flex flex-col items-center justify-center w-full h-[calc(100vh-150px)] relative overflow-hidden transition-colors duration-300",
            theme === 'light' ? "bg-white" : "bg-[#0a0a0a]"
        )}>
            {/* Floating background decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-yellow-500/30"></div>
            <div className="absolute top-1/3 right-1/4 w-2 h-2 rotate-45 border border-zinc-500/40"></div>
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 rounded-full bg-zinc-600/30"></div>
            <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-yellow-500/20"></div>

            {/* Main Icon Container */}
            <div className="relative mb-10 mt-10">
                <div className={clsx(
                    "p-8 rounded-2xl border relative z-10 transition-colors",
                    theme === 'light' ? "bg-zinc-100 border-zinc-200 shadow-xl shadow-zinc-200/50" : "bg-[#18181b] border-zinc-800/80 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                )}>
                    <AppWindow size={80} strokeWidth={1} className={theme === 'light' ? "text-zinc-400" : "text-zinc-500"} />

                    <div className={clsx(
                        "absolute -bottom-3 -right-3 p-3.5 rounded-full border-[6px] shadow-lg",
                        theme === 'light' ? "bg-blue-600 border-white text-white" : "bg-[#ffc53d] border-[#0a0a0a] text-[#0a0a0a]"
                    )}>
                        <Search size={28} strokeWidth={3} />
                    </div>
                </div>

                <div className="absolute -top-6 -left-8 text-[#ffc53d]/70 text-xl">✦</div>
                <div className="absolute top-4 -right-12 text-[#ffc53d]/70 text-lg">✦</div>
                <div className="absolute bottom-2 -left-10 text-zinc-500/60 text-2xl">✦</div>
                <div className="absolute -bottom-8 right-8 text-zinc-500/40 text-lg">✦</div>
            </div>

            {/* Text Content */}
            <h2 className={clsx("text-[22px] font-semibold mb-4 tracking-tight", theme === 'light' ? "text-zinc-900" : "text-white")}>Enter a URL to start previewing</h2>
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
