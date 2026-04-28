import React, { useState, useEffect } from 'react'
import { Search, AppWindow, Smartphone, Tablet, Monitor } from 'lucide-react';
import { useSelector } from 'react-redux';

const Screens = () => {
    const activeUrl = useSelector((state) => state.app.activeUrl);
    const screens = ['mobile', 'tablet', 'desktop']; // Selected screens

    // Track loading state for each screen independently
    const [loadingStates, setLoadingStates] = useState({
        mobile: true,
        tablet: true,
        desktop: true
    });

    // Reset loading states when URL changes
    useEffect(() => {
        if (activeUrl) {
            setLoadingStates({
                mobile: true,
                tablet: true,
                desktop: true
            });
        }
    }, [activeUrl]);

    const handleIframeLoad = (screenId) => {
        setLoadingStates(prev => ({ ...prev, [screenId]: false }));
    };

    // Device configurations
    const deviceConfigs = {
        mobile: { name: 'Mobile', width: 375, height: 800, icon: Smartphone },
        tablet: { name: 'Tablet', width: 768, height: 1024, icon: Tablet },
        desktop: { name: 'Desktop', width: 1200, height: 800, icon: Monitor },
    };

    const scale = 0.35;

    // 1. Empty State (No URL searched)
    if (!activeUrl) {
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
        )
    }

    // 2. Devices State (Loading Skeletons or Loaded Iframes)
    return (
        <div className="w-full h-[calc(100vh-140px)] bg-[#0a0a0a] p-6 overflow-x-auto">
            <div className="flex items-start gap-8 min-w-max">
                {screens.map((screenId) => {
                    const config = deviceConfigs[screenId];
                    const Icon = config.icon;
                    const isLoading = loadingStates[screenId];

                    return (
                        <div key={screenId} className="flex flex-col gap-3">
                            {/* Device Header */}
                            <div className="flex items-center gap-3 px-2 py-1">
                                <Icon size={20} className="text-zinc-400" />
                                <div className="flex flex-col">
                                    <span className="text-zinc-200 text-sm font-medium">{config.name}</span>
                                    <span className="text-zinc-500 text-xs">{config.width}px</span>
                                </div>
                            </div>

                            {/* Device Screen Container (Scaled bounds) */}
                            <div
                                className="relative overflow-hidden rounded-xl border border-zinc-800/80 bg-[#111113] shadow-sm"
                                style={{
                                    width: `${config.width * scale}px`,
                                    height: `${config.height * scale}px`
                                }}
                            >
                                {/* Real Website Iframe */}
                                <div
                                    className="absolute top-0 left-0"
                                    style={{
                                        width: `${config.width}px`,
                                        height: `${config.height}px`,
                                        transform: `scale(${scale})`,
                                        transformOrigin: 'top left',
                                        opacity: isLoading ? 0 : 1,
                                        transition: 'opacity 0.4s ease-in-out',
                                        pointerEvents: isLoading ? 'none' : 'auto',
                                        zIndex: 10
                                    }}
                                >
                                    <iframe
                                        src={activeUrl}
                                        title={`${config.name} preview`}
                                        onLoad={() => handleIframeLoad(screenId)}
                                        className="w-full h-full border-none bg-white"
                                    />
                                </div>

                                {/* Loading Skeleton */}
                                {isLoading && (
                                    <div
                                        className="absolute top-0 left-0 p-5 w-full h-full z-20 bg-[#111113]"
                                        style={{
                                            width: `${config.width}px`,
                                            height: `${config.height}px`,
                                            transform: `scale(${scale})`,
                                            transformOrigin: 'top left'
                                        }}
                                    >
                                        <div className="animate-pulse flex flex-col h-full w-full">
                                            {/* Header skeleton */}
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-full bg-[#1f1f22]"></div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="w-32 h-3.5 bg-[#1f1f22] rounded-full"></div>
                                                    <div className="w-20 h-3 bg-[#1f1f22] rounded-full"></div>
                                                </div>
                                            </div>

                                            {/* Hero image skeleton */}
                                            <div className="w-full h-40 bg-[#1f1f22] rounded-xl mb-6"></div>

                                            {/* Text content skeleton */}
                                            <div className="flex flex-col gap-4">
                                                <div className="w-full h-3.5 bg-[#1f1f22] rounded-full"></div>
                                                <div className="w-[85%] h-3.5 bg-[#1f1f22] rounded-full"></div>
                                                <div className="w-[90%] h-3.5 bg-[#1f1f22] rounded-full"></div>
                                                <div className="w-[60%] h-3.5 bg-[#1f1f22] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Screens;