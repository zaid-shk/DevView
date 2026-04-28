import React, { useState } from 'react';
import { Minus, Plus, RefreshCw, History, Save, Camera, Grid2x2Plus, RotateCcw, MonitorSmartphone } from 'lucide-react';

const Control = () => {
    const [syncScroll, setSyncScroll] = useState(true);

    return (
        <div className="flex justify-around px-9">


            <div className='bg-[#0a0a0a] text-zinc-300 flex flex-wrap items-center gap-6 px-4 py-3 border-b border-zinc-800/50 text-sm'>
                {/* Zoom Controls */}
                <div className="flex items-center gap-3 bg-[#18181b] px-2 py-1.5 rounded-xl border border-zinc-800/50 shadow-sm">
                    <button className="bg-[#27272a] hover:bg-zinc-600 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                        <Minus size={14} className="text-zinc-400 hover:text-white" />
                    </button>
                    <span className="font-medium text-xs w-10 text-center select-none text-zinc-200">100%</span>
                    <button className="bg-[#27272a] hover:bg-zinc-600 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                        <Plus size={14} className="text-zinc-400 hover:text-white" />
                    </button>
                </div>

                {/* Sync Scroll */}
                <div className="flex items-center gap-3 bg-[#18181b] px-4 py-2 rounded-xl border border-zinc-800/50 shadow-sm">
                    <RotateCcw size={14} className="text-zinc-400" />
                    <span className="font-medium text-xs text-zinc-200 select-none">Sync Scroll</span>
                    <button
                        onClick={() => setSyncScroll(!syncScroll)}
                        className={`w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none ${syncScroll ? 'bg-[#ffc53d]' : 'bg-zinc-600'}`}
                    >
                        <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow-sm ${syncScroll ? 'left-[18px]' : 'left-1'}`}></div>
                    </button>
                    <RefreshCw size={14} className="text-zinc-500 cursor-pointer hover:text-white ml-1" />
                </div>

                {/* Reload */}
                <button className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] px-4 py-2 rounded-xl border border-zinc-800/50 transition-colors shadow-sm">
                    <RefreshCw size={14} className="text-zinc-400" />
                    <span className="font-medium text-xs text-zinc-200 select-none">Reload</span>
                </button>

                {/* <div className="w-px h-6 bg-zinc-800/50 mx-1 hidden md:block"></div> */}

                {/* History & Saved Projects */}
                <div className="flex items-center gap-1 bg-[#18181b] p-1 rounded-xl border border-zinc-800/50 shadow-sm">
                    <button className="flex items-center gap-2 hover:bg-[#27272a] px-3 py-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200">
                        <History size={14} />
                        <span className="text-xs font-medium hidden sm:inline">History</span>
                    </button>
                    <button className="flex items-center gap-2 hover:bg-[#27272a] px-3 py-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200">
                        <Save size={14} />
                        <span className="text-xs font-medium hidden sm:inline">Saved Projects</span>
                    </button>
                </div>

                <div className="flex-1"></div>

                {/* Screenshot */}
                <button className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] px-4 py-2 rounded-xl border border-zinc-800/50 transition-colors shadow-sm text-zinc-400 hover:text-zinc-200">
                    <Camera size={14} />
                    <span className="text-xs font-medium hidden sm:inline">Screenshot</span>
                </button>

                {/* Add Devices / Custom */}
                <div className="flex items-center gap-3 bg-[#18181b] p-1 rounded-xl border border-zinc-800/50 shadow-sm">
                    <button className="flex items-center gap-2 hover:bg-[#27272a] px-3 py-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200">
                        <MonitorSmartphone size={14} />
                        <span className="text-xs font-medium hidden sm:inline">Custom Device</span>
                    </button>
                    <button className="flex items-center gap-2 bg-[#ffc53d] hover:bg-[#facc15] text-black px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm">
                        <Grid2x2Plus size={14} />
                        <span className="text-xs">Add Device</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Control;