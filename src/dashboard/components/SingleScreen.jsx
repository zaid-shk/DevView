import React from 'react';
import { Smartphone, Tablet, Laptop, Monitor, AlertTriangle, RefreshCw } from 'lucide-react';
import ScreenSkeleton from './ScreenSkeleton';

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
    if (!config) return null;

    const getIcon = (iconName) => {
        const icons = {
            smartphone: Smartphone,
            tablet: Tablet,
            laptop: Laptop,
            monitor: Monitor
        };
        const Icon = icons[iconName] || Monitor;
        return <Icon size={20} className="text-zinc-400" />;
    };

    return (
        <div className="flex flex-col gap-3" id={`device-preview-${screenId}`}>
            {/* Device Header */}
            <div className="flex items-center gap-3 px-2 py-1">
                {getIcon(config.icon)}
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
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#09090b] p-3 text-center">
                        <div className="mb-3 text-rose-500">
                            <AlertTriangle size={Math.max(20, 42 * scale)} strokeWidth={1.5} />
                        </div>
                        
                        <h3 
                            className="mb-2 font-semibold text-zinc-100 leading-tight"
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
                            className="rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1 font-medium text-zinc-300 transition-all hover:bg-zinc-800 hover:text-zinc-100 active:scale-95"
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
