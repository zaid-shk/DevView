import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Plus, Trash2, Pencil, X, Check,
    Smartphone, Tablet, Laptop, Monitor,
    MonitorSmartphone, RotateCcw, Eye, EyeOff
} from 'lucide-react';
import { clsx } from 'clsx';
import { addCustomDevice, removeDevice, updateDevice, resetDevices, toggleDevice } from '../store/slices/screenSlice';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

const ICON_OPTIONS = [
    { value: 'smartphone', label: 'Phone', Icon: Smartphone },
    { value: 'tablet', label: 'Tablet', Icon: Tablet },
    { value: 'laptop', label: 'Laptop', Icon: Laptop },
    { value: 'monitor', label: 'Monitor', Icon: Monitor },
];

const CATEGORY_OPTIONS = [
    { value: 'mobile', label: 'Mobile', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
    { value: 'tablet', label: 'Tablet', color: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
    { value: 'desktop', label: 'Desktop', color: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
    { value: 'custom', label: 'Custom', color: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
];

const PRESETS = [
    { name: 'iPhone SE', width: 375, height: 667, icon: 'smartphone', category: 'mobile' },
    { name: 'iPhone 14 Pro', width: 393, height: 852, icon: 'smartphone', category: 'mobile' },
    { name: 'iPhone 15 Pro Max', width: 430, height: 932, icon: 'smartphone', category: 'mobile' },
    { name: 'Samsung Galaxy S24', width: 360, height: 780, icon: 'smartphone', category: 'mobile' },
    { name: 'Pixel 8', width: 412, height: 915, icon: 'smartphone', category: 'mobile' },
    { name: 'iPad Mini', width: 768, height: 1024, icon: 'tablet', category: 'tablet' },
    { name: 'iPad Air', width: 820, height: 1180, icon: 'tablet', category: 'tablet' },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, icon: 'tablet', category: 'tablet' },
    { name: 'Surface Pro', width: 912, height: 1368, icon: 'tablet', category: 'tablet' },
    { name: 'MacBook Air 13"', width: 1280, height: 800, icon: 'laptop', category: 'desktop' },
    { name: 'MacBook Pro 16"', width: 1728, height: 1117, icon: 'laptop', category: 'desktop' },
    { name: 'Desktop HD', width: 1920, height: 1080, icon: 'monitor', category: 'desktop' },
    { name: '4K Display', width: 2560, height: 1440, icon: 'monitor', category: 'desktop' },
    { name: 'Ultrawide', width: 3440, height: 1440, icon: 'monitor', category: 'desktop' },
];

const DeviceCard = ({ device, isVisible, onToggle, onEdit, onDelete, isBuiltIn, theme }) => {
    const iconMap = { smartphone: Smartphone, tablet: Tablet, laptop: Laptop, monitor: Monitor };
    const DeviceIcon = iconMap[device.icon] || Monitor;
    const categoryInfo = CATEGORY_OPTIONS.find(c => c.value === device.category) || CATEGORY_OPTIONS[3];

    return (
        <div className={clsx(
            "group relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden",
            isVisible
                ? (theme === 'light' ? "bg-white border-zinc-200 shadow-md" : "bg-[#111113] border-zinc-700/60 shadow-lg shadow-black/20")
                : (theme === 'light' ? "bg-zinc-50 border-zinc-100 opacity-60 hover:opacity-90" : "bg-[#0c0c0e] border-zinc-800/40 opacity-60 hover:opacity-90")
        )}>
            <div className="p-5 flex flex-col gap-4">
                {/* Header row */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={clsx(
                            "p-2.5 rounded-xl transition-colors",
                            isVisible 
                                ? (theme === 'light' ? "bg-zinc-100" : "bg-zinc-800") 
                                : (theme === 'light' ? "bg-zinc-50" : "bg-zinc-900")
                        )}>
                            <DeviceIcon size={20} className={clsx(
                                "transition-colors",
                                isVisible 
                                    ? (theme === 'light' ? "text-zinc-600" : "text-zinc-300") 
                                    : (theme === 'light' ? "text-zinc-400" : "text-zinc-600")
                            )} />
                        </div>
                        <div>
                            <h3 className={clsx("text-sm font-semibold leading-tight", theme === 'light' ? "text-zinc-900" : "text-zinc-100")}>{device.name}</h3>
                            <span className={clsx(
                                "inline-flex items-center mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider border",
                                categoryInfo.color
                            )}>
                                {categoryInfo.label}
                            </span>
                        </div>
                    </div>

                    {/* Visibility toggle */}
                    <button
                        onClick={onToggle}
                        className={clsx(
                            "p-2 rounded-lg transition-all",
                            isVisible
                                ? "bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                                : (theme === 'light' ? "bg-zinc-200/50 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700" : "bg-zinc-800/50 text-zinc-600 hover:bg-zinc-800 hover:text-zinc-400")
                        )}
                        title={isVisible ? "Hide from dashboard" : "Show on dashboard"}
                    >
                        {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                </div>

                {/* Dimensions display */}
                <div className="flex items-center gap-3">
                    <div className={clsx(
                        "flex-1 rounded-xl px-4 py-3 text-center border",
                        theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-zinc-900/80 border-zinc-800/50"
                    )}>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Width</p>
                        <p className={clsx("text-lg font-bold tabular-nums", theme === 'light' ? "text-zinc-900" : "text-zinc-200")}>{device.width}<span className="text-zinc-600 text-xs ml-0.5">px</span></p>
                    </div>
                    <X size={12} className="text-zinc-700 flex-shrink-0" />
                    <div className={clsx(
                        "flex-1 rounded-xl px-4 py-3 text-center border",
                        theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-zinc-900/80 border-zinc-800/50"
                    )}>
                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1">Height</p>
                        <p className={clsx("text-lg font-bold tabular-nums", theme === 'light' ? "text-zinc-900" : "text-zinc-200")}>{device.height}<span className="text-zinc-600 text-xs ml-0.5">px</span></p>
                    </div>
                </div>

                {/* Device preview silhouette */}
                <div className="flex items-center justify-center py-2">
                    <div
                        className={clsx(
                            "border rounded-md",
                            theme === 'light' ? "border-zinc-200 bg-zinc-50" : "border-zinc-800/80 bg-zinc-900/30"
                        )}
                        style={{
                            width: `${Math.min(device.width / 15, 120)}px`,
                            height: `${Math.min(device.height / 15, 80)}px`,
                            maxWidth: '100%'
                        }}
                    >
                        <div className={clsx("w-full h-1 rounded-t-sm", theme === 'light' ? "bg-zinc-200" : "bg-zinc-800/60")} />
                    </div>
                </div>

                {/* Actions */}
                <div className={clsx("flex items-center gap-2 pt-1 border-t", theme === 'light' ? "border-zinc-100" : "border-zinc-800/40")}>
                    <button
                        onClick={onEdit}
                        className={clsx(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                            theme === 'light' ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80"
                        )}
                    >
                        <Pencil size={12} />
                        Edit
                    </button>
                    {!isBuiltIn && (
                        <button
                            onClick={onDelete}
                            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        >
                            <Trash2 size={12} />
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

const DevicesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allDevices = useSelector((state) => state.screen?.devices || []);
    const visibleDeviceIds = useSelector((state) => state.screen?.visibleDeviceIds || []);
    const theme = useSelector((state) => state.app.theme);

    const BUILT_IN_IDS = ['mobile-m', 'mobile-l', 'tablet', 'laptop', 'desktop', 'desktop-l'];

    // Form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [showPresets, setShowPresets] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [formData, setFormData] = useState({ name: '', width: '', height: '', icon: 'monitor', category: 'custom' });
    const [filterCategory, setFilterCategory] = useState('all');

    const resetForm = () => {
        setFormData({ name: '', width: '', height: '', icon: 'monitor', category: 'custom' });
        setShowAddForm(false);
        setEditingDevice(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.width || !formData.height) {
            toast.error('Please fill all fields');
            return;
        }
        if (parseInt(formData.width) < 100 || parseInt(formData.height) < 100) {
            toast.error('Min dimensions: 100×100');
            return;
        }

        if (editingDevice) {
            dispatch(updateDevice({ id: editingDevice, ...formData }));
            toast.success('Device updated');
        } else {
            dispatch(addCustomDevice(formData));
            toast.success('Device added');
        }
        resetForm();
    };

    const handleEdit = (device) => {
        setFormData({
            name: device.name,
            width: String(device.width),
            height: String(device.height),
            icon: device.icon,
            category: device.category
        });
        setEditingDevice(device.id);
        setShowAddForm(true);
        setShowPresets(false);
    };

    const handleDelete = (deviceId) => {
        dispatch(removeDevice(deviceId));
        toast.success('Device removed');
    };

    const handleAddPreset = (preset) => {
        // Check if already exists
        const exists = allDevices.some(d => d.width === preset.width && d.height === preset.height);
        if (exists) {
            toast.error('A device with these dimensions already exists');
            return;
        }
        dispatch(addCustomDevice(preset));
        toast.success(`${preset.name} added`);
    };

    const filteredDevices = filterCategory === 'all'
        ? allDevices
        : allDevices.filter(d => d.category === filterCategory);

    const customCount = allDevices.filter(d => !BUILT_IN_IDS.includes(d.id)).length;

    return (
        <div className={clsx(
            "min-h-screen transition-colors duration-300",
            theme === 'light' ? "bg-zinc-50 text-zinc-900" : "bg-[#0a0a0a] text-zinc-300"
        )}>
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={clsx(
                                "p-2 rounded-lg transition-colors",
                                theme === 'light' ? "hover:bg-zinc-200 text-zinc-500 hover:text-zinc-900" : "hover:bg-zinc-800 text-zinc-400 hover:text-white"
                            )}
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-violet-500/10 rounded-xl">
                                <MonitorSmartphone className="text-violet-400" size={24} />
                            </div>
                            <div>
                                <h1 className={clsx("text-2xl font-bold tracking-tight", theme === 'light' ? "text-zinc-900" : "text-white")}>Device Manager</h1>
                                <p className="text-zinc-500 text-sm">
                                    {allDevices.length} devices · {visibleDeviceIds.length} active · {customCount} custom
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                dispatch(resetDevices());
                                toast.success('Devices reset to defaults');
                            }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all border",
                                theme === 'light' ? "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-900" : "text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border-zinc-800/50"
                            )}
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                        <button
                            onClick={() => { setShowPresets(!showPresets); setShowAddForm(false); }}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
                                showPresets
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                    : (theme === 'light' ? "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50" : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800/50")
                            )}
                        >
                            <Smartphone size={14} />
                            Presets
                        </button>
                        <button
                            onClick={() => { setShowAddForm(!showAddForm); setShowPresets(false); setEditingDevice(null); setFormData({ name: '', width: '', height: '', icon: 'monitor', category: 'custom' }); }}
                            className={clsx(
                                "flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all shadow-lg",
                                showAddForm && !editingDevice
                                    ? (theme === 'light' ? "bg-zinc-200 text-zinc-700" : "bg-zinc-700 text-white shadow-none")
                                    : "bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white shadow-blue-600/20"
                            )}
                        >
                            {showAddForm && !editingDevice ? <X size={14} /> : <Plus size={14} />}
                            {showAddForm && !editingDevice ? 'Cancel' : 'Add Device'}
                        </button>
                    </div>
                </div>

                {/* Add/Edit Form */}
                {showAddForm && (
                    <div className={clsx(
                        "mb-8 border rounded-2xl p-6 animate-in slide-in-from-top-2",
                        theme === 'light' ? "bg-white border-zinc-200 shadow-md" : "bg-[#111113] border-zinc-800/60"
                    )}>
                        <h2 className={clsx("text-sm font-semibold mb-5 flex items-center gap-2", theme === 'light' ? "text-zinc-800" : "text-zinc-200")}>
                            {editingDevice ? <Pencil size={14} className="text-amber-400" /> : <Plus size={14} className="text-blue-400" />}
                            {editingDevice ? 'Edit Device' : 'New Custom Device'}
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Name */}
                            <div className="flex flex-col gap-1.5 lg:col-span-1">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Device Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Galaxy Fold"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={clsx(
                                        "border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder:text-zinc-500",
                                        theme === 'light' ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500/50" : "bg-[#0a0a0a] border-zinc-800 text-zinc-200 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                                    )}
                                />
                            </div>

                            {/* Width */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Width (px)</label>
                                <input
                                    type="number"
                                    placeholder="375"
                                    value={formData.width}
                                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                                    className={clsx(
                                        "border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder:text-zinc-500",
                                        theme === 'light' ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500/50" : "bg-[#0a0a0a] border-zinc-800 text-zinc-200 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                                    )}
                                />
                            </div>

                            {/* Height */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Height (px)</label>
                                <input
                                    type="number"
                                    placeholder="812"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className={clsx(
                                        "border rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all placeholder:text-zinc-500",
                                        theme === 'light' ? "bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-blue-500/50" : "bg-[#0a0a0a] border-zinc-800 text-zinc-200 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20"
                                    )}
                                />
                            </div>

                            {/* Icon */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Icon</label>
                                <div className={clsx(
                                    "flex items-center gap-1.5 border rounded-xl px-2 py-1",
                                    theme === 'light' ? "bg-zinc-50 border-zinc-200" : "bg-[#0a0a0a] border-zinc-800"
                                )}>
                                    {ICON_OPTIONS.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: opt.value })}
                                            className={clsx(
                                                "p-2 rounded-lg transition-all flex-1 flex items-center justify-center",
                                                formData.icon === opt.value
                                                    ? (theme === 'light' ? "bg-blue-600 text-white shadow-sm" : "bg-violet-500/15 text-violet-400")
                                                    : (theme === 'light' ? "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200" : "text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800")
                                            )}
                                            title={opt.label}
                                        >
                                            <opt.Icon size={16} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex flex-col gap-1.5 justify-end">
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    <Check size={16} />
                                    {editingDevice ? 'Save Changes' : 'Add Device'}
                                </button>
                            </div>
                        </form>

                        {/* Category selector */}
                        <div className="mt-4 flex items-center gap-2">
                            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mr-2">Category:</span>
                            {CATEGORY_OPTIONS.map(cat => (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, category: cat.value })}
                                    className={clsx(
                                        "px-3 py-1 rounded-lg text-xs font-medium transition-all border",
                                        formData.category === cat.value
                                            ? cat.color
                                            : (theme === 'light' ? "text-zinc-400 border-zinc-100 hover:text-zinc-600 hover:bg-zinc-100" : "text-zinc-600 border-zinc-800/50 hover:text-zinc-400")
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Presets Panel */}
                {showPresets && (
                    <div className={clsx(
                        "mb-8 border rounded-2xl p-6 shadow-sm",
                        theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/60"
                    )}>
                        <h2 className={clsx("text-sm font-semibold mb-1 flex items-center gap-2", theme === 'light' ? "text-zinc-800" : "text-zinc-200")}>
                            <Smartphone size={14} className="text-amber-400" />
                            Popular Device Presets
                        </h2>
                        <p className="text-xs text-zinc-500 mb-5">Click to add a device preset to your collection</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                            {PRESETS.map((preset, i) => {
                                const IconComp = { smartphone: Smartphone, tablet: Tablet, laptop: Laptop, monitor: Monitor }[preset.icon] || Monitor;
                                const exists = allDevices.some(d => d.width === preset.width && d.height === preset.height);
                                const catInfo = CATEGORY_OPTIONS.find(c => c.value === preset.category);

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAddPreset(preset)}
                                        disabled={exists}
                                        className={clsx(
                                            "flex items-center gap-3 p-3 rounded-xl border text-left transition-all group",
                                            exists
                                                ? (theme === 'light' ? "bg-zinc-50 border-zinc-100 opacity-40 cursor-not-allowed" : "bg-zinc-900/30 border-zinc-800/30 opacity-40 cursor-not-allowed")
                                                : (theme === 'light' ? "bg-zinc-50 border-zinc-100 hover:bg-white hover:border-zinc-300" : "bg-[#0c0c0e] border-zinc-800/50 hover:bg-zinc-800/60 hover:border-zinc-700")
                                        )}
                                    >
                                        <div className={clsx(
                                            "p-2 rounded-lg group-hover:bg-opacity-80 transition-colors",
                                            theme === 'light' ? "bg-white" : "bg-zinc-900"
                                        )}>
                                            <IconComp size={16} className="text-zinc-500 group-hover:text-zinc-600 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={clsx("text-xs font-medium truncate", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>{preset.name}</p>
                                            <p className="text-[10px] text-zinc-600">{preset.width}×{preset.height}</p>
                                        </div>
                                        {exists ? (
                                            <Check size={14} className="text-zinc-600 flex-shrink-0" />
                                        ) : (
                                            <Plus size={14} className="text-zinc-600 group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filter bar */}
                <div className="flex items-center gap-2 mb-6">
                    <button
                        onClick={() => setFilterCategory('all')}
                        className={clsx(
                            "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                            filterCategory === 'all'
                                ? (theme === 'light' ? "bg-zinc-200 text-zinc-900 shadow-sm" : "bg-zinc-800 text-zinc-100")
                                : (theme === 'light' ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900")
                        )}
                    >
                        All ({allDevices.length})
                    </button>
                    {CATEGORY_OPTIONS.map(cat => {
                        const count = allDevices.filter(d => d.category === cat.value).length;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat.value}
                                onClick={() => setFilterCategory(cat.value)}
                                className={clsx(
                                    "px-4 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                    filterCategory === cat.value
                                        ? cat.color
                                        : (theme === 'light' ? "text-zinc-500 border-transparent hover:text-zinc-900 hover:bg-zinc-100" : "text-zinc-500 border-transparent hover:text-zinc-300 hover:bg-zinc-900")
                                )}
                            >
                                {cat.label} ({count})
                            </button>
                        );
                    })}
                </div>

                {/* Device Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredDevices.map(device => (
                        <DeviceCard
                            key={device.id}
                            device={device}
                            isVisible={visibleDeviceIds.includes(device.id)}
                            isBuiltIn={BUILT_IN_IDS.includes(device.id)}
                            onToggle={() => dispatch(toggleDevice(device.id))}
                            onEdit={() => handleEdit(device)}
                            onDelete={() => handleDelete(device.id)}
                            theme={theme}
                        />
                    ))}
                </div>

                {filteredDevices.length === 0 && (
                    <div className={clsx(
                        "flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-dashed",
                        theme === 'light' ? "bg-white border-zinc-200" : "bg-zinc-900/30 border-zinc-800/50"
                    )}>
                        <div className={clsx("p-4 rounded-full mb-4", theme === 'light' ? "bg-zinc-100" : "bg-zinc-800/50")}>
                            <MonitorSmartphone size={32} className="text-zinc-600" />
                        </div>
                        <h2 className={clsx("text-lg font-medium mb-1", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>No devices in this category</h2>
                        <p className="text-zinc-500 text-sm max-w-[250px]">Add a device or select a different category filter.</p>
                    </div>
                )}

                {/* Footer stats */}
                {allDevices.length > 0 && (
                    <div className={clsx("mt-10 pt-8 border-t flex justify-center", theme === 'light' ? "border-zinc-100" : "border-zinc-800/50")}>
                        <p className="text-[11px] text-zinc-600 uppercase tracking-widest font-semibold">
                            {allDevices.length} devices configured · {visibleDeviceIds.length} visible on dashboard
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default DevicesPage;
