import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Settings as SettingsIcon, 
    Moon, 
    Sun, 
    Monitor, 
    Smartphone, 
    Tablet, 
    MousePointer2, 
    Keyboard, 
    Trash2, 
    X, 
    Check,
    Layout,
    Eye,
    Zap,
    ShieldAlert,
    ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
    setTheme, 
    setShowDeviceFrames, 
    setEnableAnimations,
    setSyncScroll
} from '../store/slices/appSlice';
import { toggleDevice } from '../store/slices/screenSlice';
import Navbar from '../components/Navbar';

const SettingsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const theme = useSelector((state) => state.app.theme);
    const showDeviceFrames = useSelector((state) => state.app.showDeviceFrames);
    const enableAnimations = useSelector((state) => state.app.enableAnimations);
    const syncScroll = useSelector((state) => state.app.syncScroll);
    const visibleDeviceIds = useSelector((state) => state.screen?.visibleDeviceIds || []);

    const [activeTab, setActiveTab] = useState('appearance');

    const sidebarItems = [
        { id: 'general', label: 'General', icon: SettingsIcon },
        { id: 'appearance', label: 'Appearance', icon: Moon },
        { id: 'devices', label: 'Devices', icon: Monitor },
        { id: 'preferences', label: 'Preferences', icon: MousePointer2 },
        { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
        { id: 'danger', label: 'Danger Zone', icon: Trash2, danger: true },
    ];

    const toggleSwitch = (value, action) => {
        dispatch(action(!value));
    };

    return (
        <div className={clsx(
            "min-h-screen transition-colors duration-300",
            theme === 'light' ? "bg-zinc-50 text-zinc-900" : "bg-[#0a0a0a] text-zinc-300"
        )}>
            <Navbar />
            
            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className={clsx(
                            "p-2 rounded-lg transition-colors",
                            theme === 'light' ? "hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                        )}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className={clsx("text-2xl font-bold tracking-tight", theme === 'light' ? "text-zinc-900" : "text-white")}>Settings</h1>
                </div>

                <div className={clsx(
                    "flex rounded-3xl border overflow-hidden min-h-[600px] shadow-2xl transition-all",
                    theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/50"
                )}>
                    {/* Sidebar */}
                    <div className={clsx(
                        "w-64 border-r p-4 transition-colors",
                        theme === 'light' ? "bg-zinc-50/50 border-zinc-200" : "bg-[#0c0c0e] border-zinc-800/50"
                    )}>
                        <div className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={clsx(
                                        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                        activeTab === item.id
                                            ? (theme === 'light' ? "bg-white text-blue-600 shadow-md border border-zinc-200" : "bg-zinc-800 text-white shadow-lg")
                                            : item.danger 
                                                ? "text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5"
                                                : (theme === 'light' ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50")
                                    )}
                                >
                                    <item.icon size={18} className={clsx(
                                        activeTab === item.id ? "text-blue-500" : "text-zinc-600"
                                    )} />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8">
                        {activeTab === 'appearance' && (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className={clsx("text-xl font-bold", theme === 'light' ? "text-zinc-900" : "text-white")}>Appearance</h2>
                                    <button onClick={() => navigate('/dashboard')} className="text-zinc-500 hover:text-white transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* Theme */}
                                     <div className="flex items-center justify-between">
                                         <div>
                                             <h3 className={clsx("text-sm font-semibold", theme === 'light' ? "text-zinc-800" : "text-zinc-200")}>Theme</h3>
                                             <p className="text-xs text-zinc-500 mt-1">Choose your preferred visual theme</p>
                                         </div>
                                         <div className={clsx(
                                             "flex p-1 rounded-xl border transition-colors",
                                             theme === 'light' ? "bg-zinc-100 border-zinc-200" : "bg-[#0a0a0a] border-zinc-800"
                                         )}>
                                             <button 
                                                 onClick={() => dispatch(setTheme('light'))}
                                                 className={clsx(
                                                     "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                     theme === 'light' 
                                                         ? "bg-white text-blue-600 shadow-md border border-zinc-200" 
                                                         : "text-zinc-500 hover:text-zinc-300"
                                                 )}
                                             >
                                                 <Sun size={14} /> Light
                                             </button>
                                             <button 
                                                 onClick={() => dispatch(setTheme('dark'))}
                                                 className={clsx(
                                                     "flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                                                     theme === 'dark' 
                                                         ? (theme === 'light' ? "bg-zinc-800 text-white shadow-sm" : "bg-zinc-800 text-white shadow-sm") 
                                                         : (theme === 'light' ? "text-zinc-500 hover:text-zinc-800" : "text-zinc-500 hover:text-zinc-300")
                                                 )}
                                             >
                                                 <Moon size={14} /> Dark
                                             </button>
                                         </div>
                                     </div>

                                     {/* Default Devices */}
                                     <div>
                                         <h3 className={clsx("text-sm font-semibold mb-4", theme === 'light' ? "text-zinc-800" : "text-zinc-200")}>Default Devices</h3>
                                         <div className="space-y-3">
                                             {[
                                                 { id: 'mobile-m', label: 'Mobile (375px)', icon: Smartphone },
                                                 { id: 'tablet', label: 'Tablet (768px)', icon: Tablet },
                                                 { id: 'desktop', label: 'Desktop (1440px)', icon: Monitor },
                                             ].map((device) => (
                                                 <div key={device.id} className="flex items-center gap-3">
                                                     <div 
                                                         onClick={() => dispatch(toggleDevice(device.id))}
                                                         className={clsx(
                                                             "w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer",
                                                             visibleDeviceIds.includes(device.id) 
                                                                 ? (theme === 'light' ? "bg-blue-600 border-blue-600" : "bg-blue-500 border-blue-500")
                                                                 : (theme === 'light' ? "border-zinc-300 bg-white" : "border-zinc-700 bg-transparent")
                                                         )}
                                                     >
                                                         {visibleDeviceIds.includes(device.id) && <Check size={14} className="text-white" />}
                                                     </div>
                                                     <device.icon size={16} className="text-zinc-500" />
                                                     <span className={clsx("text-sm", theme === 'light' ? "text-zinc-600" : "text-zinc-400")}>{device.label}</span>
                                                 </div>
                                             ))}
                                         </div>
                                     </div>

                                     <div className={clsx("pt-6 border-t", theme === 'light' ? "border-zinc-100" : "border-zinc-800/50")}>
                                         <h3 className={clsx("text-sm font-semibold mb-6", theme === 'light' ? "text-zinc-800" : "text-zinc-200")}>Preferences</h3>
                                         
                                         <div className="space-y-6">
                                             {/* Sync Scroll */}
                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <div className="flex items-center gap-2">
                                                         <Layout size={16} className="text-blue-500" />
                                                         <h4 className={clsx("text-sm font-medium", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>Sync Scroll</h4>
                                                     </div>
                                                     <p className="text-xs text-zinc-500 mt-1">Scroll all screens together</p>
                                                 </div>
                                                 <button 
                                                     onClick={() => toggleSwitch(syncScroll, setSyncScroll)}
                                                     className={clsx(
                                                         "w-10 h-5 rounded-full relative transition-colors duration-200",
                                                         syncScroll ? "bg-blue-500" : (theme === 'light' ? "bg-zinc-200" : "bg-zinc-700")
                                                     )}
                                                 >
                                                     <div className={clsx(
                                                         "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm",
                                                         syncScroll ? "left-6" : "left-1"
                                                     )} />
                                                 </button>
                                             </div>

                                             {/* Show Device Frames */}
                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <div className="flex items-center gap-2">
                                                         <Eye size={16} className="text-emerald-500" />
                                                         <h4 className={clsx("text-sm font-medium", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>Show Device Frames</h4>
                                                     </div>
                                                     <p className="text-xs text-zinc-500 mt-1">Show device frames around previews</p>
                                                 </div>
                                                 <button 
                                                     onClick={() => toggleSwitch(showDeviceFrames, setShowDeviceFrames)}
                                                     className={clsx(
                                                         "w-10 h-5 rounded-full relative transition-colors duration-200",
                                                         showDeviceFrames ? "bg-blue-500" : (theme === 'light' ? "bg-zinc-200" : "bg-zinc-700")
                                                     )}
                                                 >
                                                     <div className={clsx(
                                                         "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm",
                                                         showDeviceFrames ? "left-6" : "left-1"
                                                     )} />
                                                 </button>
                                             </div>

                                             {/* Enable Animations */}
                                             <div className="flex items-center justify-between">
                                                 <div>
                                                     <div className="flex items-center gap-2">
                                                         <Zap size={16} className="text-amber-500" />
                                                         <h4 className={clsx("text-sm font-medium", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>Enable Animations</h4>
                                                     </div>
                                                     <p className="text-xs text-zinc-500 mt-1">Enable smooth animations</p>
                                                 </div>
                                                 <button 
                                                     onClick={() => toggleSwitch(enableAnimations, setEnableAnimations)}
                                                     className={clsx(
                                                         "w-10 h-5 rounded-full relative transition-colors duration-200",
                                                         enableAnimations ? "bg-blue-500" : (theme === 'light' ? "bg-zinc-200" : "bg-zinc-700")
                                                     )}
                                                 >
                                                     <div className={clsx(
                                                         "absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-200 shadow-sm",
                                                         enableAnimations ? "left-6" : "left-1"
                                                     )} />
                                                 </button>
                                             </div>
                                         </div>
                                     </div>

                                </div>
                            </div>
                        )}

                        {activeTab !== 'appearance' && (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                                    <ShieldAlert size={32} className="text-zinc-600" />
                                </div>
                                <h3 className="text-lg font-medium text-zinc-300 mb-1">{sidebarItems.find(i => i.id === activeTab).label}</h3>
                                <p className="text-zinc-500 text-sm max-w-[250px]">This section is coming soon. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
