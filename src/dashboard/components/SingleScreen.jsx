import React from 'react';
import { useSelector } from 'react-redux';
import { Smartphone, Tablet, Laptop, Monitor, AlertTriangle, RefreshCw } from 'lucide-react';
import ScreenSkeleton from './ScreenSkeleton';
import { clsx } from 'clsx';

const SingleScreen = ({
    screenId,
    config,
    scale,
    isLoading,
    activeUrl,
    reload,
    iframeRef,
    onIframeLoad,
    isError,
    onRetry
}) => {
    const showDeviceFrames = useSelector((state) => state.app.showDeviceFrames);
    const enableAnimations = useSelector((state) => state.app.enableAnimations);
    const theme = useSelector((state) => state.app.theme);

    if (!config) return null;

    const getIcon = (iconName) => {
        const icons = {
            smartphone: Smartphone,
            tablet: Tablet,
            laptop: Laptop,
            monitor: Monitor
        };
        const Icon = icons[iconName] || Monitor;
        return <Icon size={20} className={theme === 'light' ? "text-zinc-500" : "text-zinc-400"} />;
    };

    return (
        <div className="flex flex-col gap-3" id={`device-preview-${screenId}`}>
            {/* Device Header */}
            {showDeviceFrames && (
                <div className="flex items-center gap-3 px-2 py-1">
                    {getIcon(config.icon)}
                    <div className="flex flex-col">
                        <span className={clsx("text-sm font-medium", theme === 'light' ? "text-zinc-900" : "text-zinc-200")}>{config.name}</span>
                        <span className="text-zinc-500 text-xs">{config.width}px</span>
                    </div>
                </div>
            )}

            {/* Device Screen Container (Scaled bounds) */}
            <div
                className={clsx(
                    "relative overflow-hidden shadow-sm transition-all",
                    theme === 'light' ? "bg-white" : "bg-[#111113]",
                    showDeviceFrames ? (theme === 'light' ? "rounded-md border border-zinc-200 shadow-md" : "rounded-xl border border-zinc-800/80") : "rounded-none border-none",
                    !enableAnimations && "transition-none"
                )}
                style={{
                    width: `${config.width * scale}px`,
                    height: `${config.height * scale}px`,
                    transitionDuration: enableAnimations ? '400ms' : '0ms'
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
                        transition: enableAnimations ? 'opacity 0.4s ease-in-out' : 'none',
                        pointerEvents: isLoading ? 'none' : 'auto',
                        zIndex: 10
                    }}
                >
                    <iframe
                        key={`${screenId}-${reload}`}
                        ref={iframeRef}
                        src={activeUrl}
                        title={`${config.name} preview`}
                        onLoad={onIframeLoad}
                        className="w-full h-full border-none bg-white"
                    />
                </div>

                {/* Loading Skeleton */}
                {isLoading && !isError && (
                    <ScreenSkeleton
                        width={config.width}
                        height={config.height}
                        scale={scale}
                    />
                )}

                {/* Error State */}
                {isError && (
                    <div className={clsx(
                        "absolute inset-0 z-20 flex flex-col items-center justify-center p-3 text-center transition-colors duration-300",
                        theme === 'light' ? "bg-zinc-50" : "bg-[#09090b]"
                    )}>
                        <div className="mb-3 text-rose-500">
                            <AlertTriangle size={Math.max(20, 42 * scale)} strokeWidth={1.5} />
                        </div>
                        
                        <h3 
                            className={clsx("mb-2 font-semibold leading-tight", theme === 'light' ? "text-zinc-900" : "text-zinc-100")}
                            style={{ fontSize: `${Math.max(11, 17 * scale)}px` }}
                        >
                            This website cannot <br /> be loaded in preview
                        </h3>
                        
                        <p 
                            className="mb-5 text-zinc-500 leading-snug mx-auto"
                            style={{ 
                                fontSize: `${Math.max(9, 13 * scale)}px`,
                                maxWidth: '90%'
                            }}
                        >
                            This website doesn't allow <br /> embedding in iframes.
                        </p>

                        <button
                            onClick={onRetry}
                            className={clsx(
                                "rounded-md border px-3 py-1 font-medium transition-all active:scale-95",
                                theme === 'light' ? "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50" : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800"
                            )}
                            style={{ fontSize: `${Math.max(9, 12 * scale)}px` }}
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleScreen;
