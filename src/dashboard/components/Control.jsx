import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, RefreshCw, History, Save, Camera, Grid2x2Plus, RotateCcw, MonitorSmartphone, Monitor, Tablet, Smartphone, Laptop, Check, Bookmark, X } from 'lucide-react';
import { setSyncScroll, setReload, incremented, decremented, saveProject } from '../../store/slices/appSlice';
import { toggleDevice } from '../../store/slices/screenSlice';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const BACKEND_URL = 'http://localhost:3000';

const Control = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const syncScroll = useSelector((state) => state.app.syncScroll);
    const reload = useSelector((state) => state.app.reload);
    const zoomLevel = useSelector((state) => state.app.zoomLevel);
    const activeUrl = useSelector((state) => state.app.activeUrl);
    const theme = useSelector((state) => state.app.theme);
    const allDevices = useSelector((state) => state.screen?.devices || []);
    const visibleDeviceIds = useSelector((state) => state.screen?.visibleDeviceIds || []);

    const [isScreenshotLoading, setIsScreenshotLoading] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [saveName, setSaveName] = useState('');

    const handleSaveProject = (e) => {
        e.preventDefault();
        const finalName = saveName.trim() || activeUrl;
        
        dispatch(saveProject({
            name: finalName,
            url: activeUrl,
            deviceIds: visibleDeviceIds
        }));
        
        toast.success('Project saved to your collection!');
        setIsSaveModalOpen(false);
        setSaveName('');
    };

    const openSaveModal = () => {
        if (!activeUrl) {
            toast.error('Enter a URL and click Preview first');
            return;
        }
        if (visibleDeviceIds.length === 0) {
            toast.error('Select at least one device to save');
            return;
        }
        setSaveName(activeUrl);
        setIsSaveModalOpen(true);
    };

    const handleScreenshot = async () => {
        if (visibleDeviceIds.length === 0) {
            toast.error("No screens selected to capture");
            return;
        }
        if (!activeUrl) {
            toast.error("No URL to capture");
            return;
        }

        setIsScreenshotLoading(true);
        const loadingToast = toast.loading("Capturing HD screenshots... This may take a moment.");

        try {
            // Build device list from visible devices
            const devices = visibleDeviceIds.map(id => {
                const device = allDevices.find(d => d.id === id);
                return device ? { name: device.name, width: device.width, height: device.height } : null;
            }).filter(Boolean);

            // Call backend Puppeteer API
            const response = await axios.post(`${BACKEND_URL}/api/screenshot`, {
                url: activeUrl,
                devices
            }, { timeout: 60000 }); // 60s timeout for slow pages

            const { screenshots } = response.data;

            // Load all screenshot images
            const loadImage = (src) => new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });

            const images = await Promise.all(
                screenshots.map(async (s) => ({
                    ...s,
                    img: await loadImage(s.image)
                }))
            );

            // Compose all screenshots onto a single canvas
            const padding = 40;
            const headerHeight = 50;
            const gap = 30;
            const scaleFactor = 0.5; // Scale each device screenshot to fit nicely

            const totalWidth = images.reduce((sum, s) => sum + (s.width * scaleFactor), 0) + gap * (images.length - 1) + padding * 2;
            const maxHeight = Math.max(...images.map(s => s.height * scaleFactor)) + headerHeight;
            const totalHeight = maxHeight + padding * 2;

            const canvas = document.createElement('canvas');
            canvas.width = totalWidth;
            canvas.height = totalHeight;
            const ctx = canvas.getContext('2d');

            // Background
            ctx.fillStyle = theme === 'light' ? '#f4f4f5' : '#0a0a0a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw each device screenshot
            let x = padding;
            for (const s of images) {
                const scaledW = s.width * scaleFactor;
                const scaledH = s.height * scaleFactor;

                // Device label
                ctx.fillStyle = theme === 'light' ? '#3f3f46' : '#a1a1aa';
                ctx.font = 'bold 14px Inter, system-ui, sans-serif';
                ctx.fillText(`${s.name}  (${s.width}×${s.height})`, x, padding + 16);

                // Device frame border
                const frameY = padding + headerHeight;
                ctx.strokeStyle = theme === 'light' ? '#e4e4e7' : '#27272a';
                ctx.lineWidth = 2;
                ctx.strokeRect(x - 1, frameY - 1, scaledW + 2, scaledH + 2);

                // Actual screenshot
                ctx.drawImage(s.img, x, frameY, scaledW, scaledH);

                x += scaledW + gap;
            }

            // Download
            const dataUrl = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `devview-responsive-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("HD Screenshot downloaded!", { id: loadingToast });
        } catch (error) {
            console.error("Screenshot error:", error);
            if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
                toast.error("Backend server not running. Start it with: node server.js", { id: loadingToast, duration: 5000 });
            } else {
                toast.error(`Capture failed: ${error.response?.data?.details || error.message}`, { id: loadingToast });
            }
        } finally {
            setIsScreenshotLoading(false);
        }
    };

    const [isDeviceMenuOpen, setIsDeviceMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDeviceMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Icon helper
    const getIcon = (iconName) => {
        const icons = { smartphone: Smartphone, tablet: Tablet, laptop: Laptop, monitor: Monitor };
        const IconComponent = icons[iconName] || Monitor;
        return <IconComponent size={14} className={theme === 'light' ? 'text-zinc-500' : "text-zinc-400"} />;
    };

    return (
        <div className="flex justify-around px-9">


            <div className={clsx(
                'flex flex-wrap items-center gap-6 px-4 py-3 border-b text-sm transition-colors duration-300',
                theme === 'light' ? 'bg-white text-zinc-600 border-zinc-200' : 'bg-[#0a0a0a] text-zinc-300 border-zinc-800/50'
            )}>
                {/* Zoom Controls */}
                <div className={clsx("flex items-center gap-3 px-2 py-1.5 rounded-xl border shadow-sm transition-colors", theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181b] border-zinc-800/50')}>
                    <button onClick={() => dispatch(decremented())} className={clsx("p-1.5 rounded-lg transition-colors flex items-center justify-center", theme === 'light' ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-[#27272a] hover:bg-zinc-600')}>
                        <Minus size={14} className={theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'} />
                    </button>
                    <span className={clsx("font-medium text-xs w-10 text-center select-none", theme === 'light' ? 'text-zinc-800' : 'text-zinc-200')}>{zoomLevel}%</span>
                    <button onClick={() => dispatch(incremented())} className={clsx("p-1.5 rounded-lg transition-colors flex items-center justify-center", theme === 'light' ? 'bg-zinc-200 hover:bg-zinc-300' : 'bg-[#27272a] hover:bg-zinc-600')}>
                        <Plus size={14} className={theme === 'light' ? 'text-zinc-600' : 'text-zinc-400'} />
                    </button>
                </div>

                {/* Sync Scroll */}
                <div className={clsx("flex items-center gap-3 px-4 py-2 rounded-xl border shadow-sm transition-colors", theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181b] border-zinc-800/50')}>
                    <RotateCcw size={14} className={theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'} />
                    <span className={clsx("font-medium text-xs select-none", theme === 'light' ? 'text-zinc-800' : 'text-zinc-200')}>Sync Scroll</span>
                    <button
                        onClick={() => dispatch(setSyncScroll(!syncScroll))}
                        className={clsx("w-9 h-5 rounded-full relative transition-colors duration-200 focus:outline-none", syncScroll ? "bg-blue-500" : (theme === 'light' ? "bg-zinc-300" : "bg-zinc-600"))}
                    >
                        <div className={clsx("w-3.5 h-3.5 bg-white rounded-full absolute top-[3px] transition-all duration-200 shadow-sm", syncScroll ? "left-[18px]" : "left-1")}></div>
                    </button>
                </div>

                {/* Reload */}
                <button onClick={() => {
                    dispatch(setReload(!reload))
                }} className={clsx("flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors shadow-sm", theme === 'light' ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200' : 'bg-[#18181b] hover:bg-[#27272a] border-zinc-800/50')}>
                    <RefreshCw size={14} className={theme === 'light' ? 'text-zinc-500' : 'text-zinc-400'} />
                    <span className={clsx("font-medium text-xs select-none", theme === 'light' ? 'text-zinc-800' : 'text-zinc-200')}>Reload</span>
                </button>

                {/* Saved Projects Actions */}
                <div className={clsx("flex items-center gap-1 p-1 rounded-xl border shadow-sm transition-colors", theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181b] border-zinc-800/50')}>
                    <button 
                        onClick={openSaveModal}
                        className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", theme === 'light' ? 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900' : 'hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200')}
                    >
                        <Save size={14} />
                        <span className="text-xs font-medium hidden sm:inline">Save</span>
                    </button>
                    <div className={clsx("w-px h-4 mx-1", theme === 'light' ? 'bg-zinc-300' : 'bg-zinc-800')}></div>
                    <Link 
                        to="/saved"
                        className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", theme === 'light' ? 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900' : 'hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200')}
                    >
                        <Bookmark size={14} />
                        <span className="text-xs font-medium hidden sm:inline">Saved Projects</span>
                    </Link>
                </div>

                <div className="flex-1"></div>

                {/* Screenshot */}
                <button 
                    onClick={handleScreenshot}
                    disabled={isScreenshotLoading}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors shadow-sm",
                        theme === 'light' ? 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600 hover:text-zinc-900' : 'bg-[#18181b] hover:bg-[#27272a] border-zinc-800/50 text-zinc-400 hover:text-zinc-200',
                        isScreenshotLoading && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Camera size={14} className={clsx(isScreenshotLoading && "animate-pulse")} />
                    <span className="text-xs font-medium hidden sm:inline">
                        {isScreenshotLoading ? "Capturing..." : "Screenshot"}
                    </span>
                </button>

                {/* Add Devices / Custom */}
                <div className={clsx("flex items-center gap-3 p-1 rounded-xl border shadow-sm transition-colors", theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-[#18181b] border-zinc-800/50')}>
                    <Link
                        to="/devices"
                        className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors", theme === 'light' ? 'hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900' : 'hover:bg-[#27272a] text-zinc-400 hover:text-zinc-200')}
                    >
                        <MonitorSmartphone size={14} />
                        <span className="text-xs font-medium hidden sm:inline">Manage Devices</span>
                    </Link>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDeviceMenuOpen(!isDeviceMenuOpen)}
                            className={clsx("flex items-center gap-2 px-4 py-1.5 rounded-lg font-medium transition-colors shadow-sm", theme === 'light' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-[#ffc53d] hover:bg-[#facc15] text-black')}
                        >
                            <Grid2x2Plus size={14} />
                            <span className="text-xs">Add Device</span>
                        </button>

                        {isDeviceMenuOpen && (
                            <div className={clsx(
                                "absolute right-0 top-full mt-2 w-56 border rounded-xl shadow-xl z-50 py-1 flex flex-col max-h-96 overflow-y-auto transition-colors",
                                theme === 'light' ? "bg-white border-zinc-200" : "bg-[#18181b] border-zinc-800/80"
                            )}>
                                <div className={clsx(
                                    "px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b mb-1",
                                    theme === 'light' ? "text-zinc-400 border-zinc-100" : "text-zinc-400 border-zinc-800/50"
                                )}>
                                    Toggle Devices
                                </div>
                                {allDevices.map(device => {
                                    const isVisible = visibleDeviceIds.includes(device.id);
                                    return (
                                        <button
                                            key={device.id}
                                            onClick={() => dispatch(toggleDevice(device.id))}
                                            className={clsx(
                                                "flex items-center gap-3 px-4 py-2 text-left transition-colors w-full group",
                                                theme === 'light' ? "hover:bg-zinc-50" : "hover:bg-[#27272a]"
                                            )}
                                        >
                                            {getIcon(device.icon)}
                                            <div className="flex flex-col flex-1">
                                                <span className={clsx(
                                                    "text-xs font-medium transition-colors",
                                                    isVisible 
                                                        ? (theme === 'light' ? "text-zinc-900" : "text-zinc-200") 
                                                        : (theme === 'light' ? "text-zinc-500 group-hover:text-zinc-700" : "text-zinc-400 group-hover:text-zinc-300")
                                                )}>
                                                    {device.name}
                                                </span>
                                                <span className="text-zinc-500 text-[10px]">{device.width}x{device.height}</span>
                                            </div>
                                            {isVisible && <Check size={14} className={theme === 'light' ? "text-blue-600" : "text-[#ffc53d]"} />}
                                        </button>
                                    );
                                })}
                                <div className={clsx("border-t mt-1 pt-1", theme === 'light' ? "border-zinc-100" : "border-zinc-800/50")}>
                                    <Link
                                        to="/devices"
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors w-full",
                                            theme === 'light' ? "text-blue-600 hover:bg-zinc-50" : "text-blue-400 hover:bg-[#27272a]"
                                        )}
                                    >
                                        <Plus size={12} />
                                        Add Custom Device...
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Project Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={clsx(
                        "border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
                        theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/80"
                    )}>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg">
                                        <Bookmark className="text-blue-500" size={20} />
                                    </div>
                                    <h3 className={clsx("text-lg font-bold", theme === 'light' ? "text-zinc-900" : "text-white")}>Save Project</h3>
                                </div>
                                <button 
                                    onClick={() => setIsSaveModalOpen(false)}
                                    className={clsx(
                                        "p-2 rounded-lg text-zinc-500 hover:text-white transition-colors",
                                        theme === 'light' ? "hover:bg-zinc-100" : "hover:bg-zinc-800"
                                    )}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProject} className="space-y-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Project Name</label>
                                    <input 
                                        type="text" 
                                        autoFocus
                                        placeholder="e.g. Portfolio Revamp"
                                        value={saveName}
                                        onChange={(e) => setSaveName(e.target.value)}
                                        className={clsx(
                                            "border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all placeholder:text-zinc-700",
                                            theme === 'light' ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500/50" : "bg-[#0a0a0a] border-zinc-800 text-zinc-200 focus:border-blue-500/50"
                                        )}
                                    />
                                </div>

                                <div className={clsx(
                                    "p-4 rounded-xl border space-y-2",
                                    theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-[#0a0a0a] border-zinc-800/50"
                                )}>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500">Website:</span>
                                        <span className={clsx("truncate max-w-[200px]", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>{activeUrl}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-zinc-500">Devices:</span>
                                        <span className={clsx(theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>{visibleDeviceIds.length} Selected</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => setIsSaveModalOpen(false)}
                                        className={clsx(
                                            "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all border border-transparent",
                                            theme === 'light' ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-200" : "text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
                                        )}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all"
                                    >
                                        Save Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Control;