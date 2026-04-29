import React from 'react';
import { Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';
import ScreenSkeleton from './ScreenSkeleton';

const SingleScreen = ({ 
    screenId, 
    config, 
    scale, 
    isLoading, 
    activeUrl, 
    reload, 
    iframeRef, 
    onIframeLoad 
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
        <div className="flex flex-col gap-3">
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
                {isLoading && (
                    <ScreenSkeleton 
                        width={config.width} 
                        height={config.height} 
                        scale={scale} 
                    />
                )}
            </div>
        </div>
    );
};

export default SingleScreen;
