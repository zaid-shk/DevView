import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, RefreshCw, History, Save, Camera, Grid2x2Plus, RotateCcw, MonitorSmartphone, Monitor, Tablet, Smartphone, Laptop, Check } from 'lucide-react';
import { setSyncScroll, setReload, incremented, decremented } from '../../store/slices/appSlice';
import { toggleDevice, addCustomDevice } from '../../store/slices/screenSlice';

const Control = () => {
    const dispatch = useDispatch();
    const syncScroll = useSelector((state) => state.app.syncScroll);
    const reload = useSelector((state) => state.app.reload);
    const zoomLevel = useSelector((state) => state.app.zoomLevel);
    const allDevices = useSelector((state) => state.screen?.devices || []);
    const visibleDeviceIds = useSelector((state) => state.screen?.visibleDeviceIds || []);

    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const [isCustomMenuOpen, setIsCustomMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const customDropdownRef = useRef(null);

    // Custom Device Form State
    const [customName, setCustomName] = useState('');
    const [customWidth, setCustomWidth] = useState('');
    const [customHeight, setCustomHeight] = useState('');

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDeviceMenuOpen(false);
            }
            if (customDropdownRef.current && !customDropdownRef.current.contains(event.target)) {
                setIsCustomMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAddCustomDevice = (e) => {
        e.preventDefault();
        if (!customName || !customWidth || !customHeight) return;
        
        dispatch(addCustomDevice({
            name: customName,
            width: customWidth,
            height: customHeight
        }));

        // Reset and close
        setCustomName('');
        setCustomWidth('');
        setCustomHeight('');
        setIsCustomMenuOpen(false);
    };

    // Icon helper
    const getIcon = (iconName) => {
        const icons = { smartphone: Smartphone, tablet: Tablet, laptop: Laptop, monitor: Monitor };
        const IconComponent = icons[iconName] || Monitor;
        return <IconComponent size={14} className="text-zinc-400" />;
    };

    return (
        <div className="flex justify-around px-9">


            <div className='bg-[#0a0a0a] text-zinc-300 flex flex-wrap items-center gap-6 px-4 py-3 border-b border-zinc-800/50 text-sm'>
                {/* Zoom Controls */}
                <div className="flex items-center gap-3 bg-[#18181b] px-2 py-1.5 rounded-xl border border-zinc-800/50 shadow-sm">
                    <button onClick={() => dispatch(decremented())} className="bg-[#27272a] hover:bg-zinc-600 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                        <Minus size={14} className="text-zinc-400 hover:text-white" />
                    </button>
                    <span className="font-medium text-xs w-10 text-center select-none text-zinc-200">{zoomLevel}%</span>
                    <button onClick={() => dispatch(incremented())} className="bg-[#27272a] hover:bg-zinc-600 p-1.5 rounded-lg transition-colors flex items-center justify-center">
                        <Plus size={14} className="text-zinc-400 hover:text-white" />
                    </button>
                </div>

                {/* Sync Scroll */}
                <div className="flex items-center gap-3 bg-[#18181b] px-4 py-2 rounded-xl border border-zinc-800/50 shadow-sm">
                    <RotateCcw size={14} className="text-zinc-400" />
                    <span className="font-medium text-xs text-zinc-200 select-none">Sync Scroll</span>
                    <button
                        onClick={() => dispatch(setSyncScroll(!syncScroll))}
                        className={clsx("w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none", syncScroll ? "bg-[#ffc53d]" : "bg-zinc-600")}
                    >
                        <div className={clsx("w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow-sm", syncScroll ? "left-[18px]" : "left-1")}></div>
                    </button>
                    <RefreshCw size={14} className="text-zinc-500 cursor-pointer hover:text-white ml-1" />
                </div>

                {/* Reload */}
                <button onClick={() => {
                    dispatch(setReload(!reload))
                    // window.location.reload();
                }} className="flex items-center gap-2 bg-[#18181b] hover:bg-[#27272a] px-4 py-2 rounded-xl border border-zinc-800/50 transition-colors shadow-sm">
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
                    <div className="relative" ref={customDropdownRef}>
                        <button 
                            onClick={() => setIsCustomMenuOpen(!isCustomMenuOpen)}
                            className="flex items-center gap-2 hover:bg-[#27272a] px-3 py-1.5 rounded-lg transition-colors text-zinc-400 hover:text-zinc-200"
                        >
                            <MonitorSmartphone size={14} />
                            <span className="text-xs font-medium hidden sm:inline">Custom Device</span>
                        </button>

                        {isCustomMenuOpen && (
                            <div className="absolute left-0 top-full mt-2 w-64 bg-[#18181b] border border-zinc-800/80 rounded-xl shadow-xl z-50 p-4 flex flex-col gap-3">
                                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                                    Add Custom Device
                                </div>
                                <form onSubmit={handleAddCustomDevice} className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-[10px] text-zinc-500 font-medium">Device Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. My Phone"
                                            value={customName}
                                            onChange={(e) => setCustomName(e.target.value)}
                                            className="bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-zinc-500 font-medium">Width (px)</label>
                                            <input 
                                                type="number" 
                                                placeholder="375"
                                                value={customWidth}
                                                onChange={(e) => setCustomWidth(e.target.value)}
                                                className="bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] text-zinc-500 font-medium">Height (px)</label>
                                            <input 
                                                type="number" 
                                                placeholder="812"
                                                value={customHeight}
                                                onChange={(e) => setCustomHeight(e.target.value)}
                                                className="bg-[#0a0a0a] border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        className="mt-1 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 rounded-lg text-xs transition-colors shadow-sm"
                                    >
                                        Add Device
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                            className="flex items-center gap-2 bg-[#ffc53d] hover:bg-[#facc15] text-black px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm"
                        >
                            <Grid2x2Plus size={14} />
                            <span className="text-xs">Add Device</span>
                        </button>

                        {isDeviceMenuOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#18181b] border border-zinc-800/80 rounded-xl shadow-xl z-50 py-1 flex flex-col max-h-96 overflow-y-auto">
                                <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-800/50 mb-1">
                                    Toggle Devices
                                </div>
                                {allDevices.map(device => {
                                    const isVisible = visibleDeviceIds.includes(device.id);
                                    return (
                                        <button
                                            key={device.id}
                                            onClick={() => dispatch(toggleDevice(device.id))}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-[#27272a] text-left transition-colors w-full group"
                                        >
                                            {getIcon(device.icon)}
                                            <div className="flex flex-col flex-1">
                                                <span className={clsx("text-xs font-medium transition-colors", isVisible ? "text-zinc-200" : "text-zinc-400 group-hover:text-zinc-300")}>
                                                    {device.name}
                                                </span>
                                                <span className="text-zinc-500 text-[10px]">{device.width}x{device.height}</span>
                                            </div>
                                            {isVisible && <Check size={14} className="text-[#ffc53d]" />}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Control;