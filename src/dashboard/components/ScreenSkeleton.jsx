import React from 'react';

const ScreenSkeleton = ({ width, height, scale }) => {
    return (
        <div
            className="absolute top-0 left-0 p-5 w-full h-full z-20 bg-[#111113]"
            style={{
                width: `${width}px`,
                height: `${height}px`,
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
    );
};

export default ScreenSkeleton;
