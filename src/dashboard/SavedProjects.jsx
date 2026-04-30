import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
    Bookmark, 
    Trash2, 
    ExternalLink, 
    Calendar, 
    ArrowLeft,
    Smartphone,
    Tablet,
    Laptop,
    Monitor,
    Search,
    Clock,
    PlusCircle,
    AlertTriangle,
    X,
    Play
} from 'lucide-react';
import { clsx } from 'clsx';
import { deleteProject, setActiveUrl } from '../store/slices/appSlice';
import { setVisibleDevices } from '../store/slices/screenSlice';
import Navbar from '../components/Navbar';
import { toast } from 'react-hot-toast';

const SavedProjectsPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const savedProjects = useSelector((state) => state.app.savedProjects || []);
    const allDevices = useSelector((state) => state.screen.devices || []);
    const theme = useSelector((state) => state.app.theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [projectToDelete, setProjectToDelete] = useState(null);

    const handleLoadProject = (project) => {
        dispatch(setActiveUrl(project.url));
        dispatch(setVisibleDevices(project.deviceIds));
        navigate('/dashboard');
        toast.success(`Loaded project: ${project.name}`);
    };

    const confirmDelete = (e, project) => {
        e.stopPropagation();
        setProjectToDelete(project);
    };

    const handleDeleteProject = () => {
        if (projectToDelete) {
            dispatch(deleteProject(projectToDelete.id));
            toast.success('Project deleted');
            setProjectToDelete(null);
        }
    };

    const filteredProjects = savedProjects.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.url.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getDeviceIcon = (id) => {
        const device = allDevices.find(d => d.id === id);
        if (!device) return <Monitor size={14} />;
        const iconMap = { smartphone: Smartphone, tablet: Tablet, laptop: Laptop, monitor: Monitor };
        const Icon = iconMap[device.icon] || Monitor;
        return <Icon size={14} />;
    };

    return (
        <div className={clsx(
            "min-h-screen transition-colors duration-300",
            theme === 'light' ? "bg-zinc-50 text-zinc-900" : "bg-[#0a0a0a] text-zinc-300"
        )}>
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
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
                        <div>
                            <h1 className={clsx("text-2xl font-bold tracking-tight flex items-center gap-3", theme === 'light' ? "text-zinc-900" : "text-white")}>
                                <Bookmark className="text-blue-500" />
                                Saved Projects
                            </h1>
                            <p className="text-zinc-500 text-sm mt-1">Manage and launch your saved website previews</p>
                        </div>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={clsx(
                                "border rounded-xl pl-10 pr-4 py-2.5 text-sm w-full md:w-80 focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700",
                                theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/60"
                            )}
                        />
                    </div>
                </div>

                {/* Project Grid */}
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProjects.map((project) => (
                            <div 
                                key={project.id}
                                onClick={() => handleLoadProject(project)}
                                className={clsx(
                                    "group relative border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/5 transition-all cursor-pointer overflow-hidden",
                                    theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/60"
                                )}
                            >
                                {/* Launch Overlay */}
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none" />
                                
                                <div className="flex items-start justify-between mb-4">
                                    <div className={clsx(
                                        "p-2.5 rounded-xl border group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all",
                                        theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-zinc-900 border-zinc-800"
                                    )}>
                                        <Bookmark className="text-zinc-500 group-hover:text-blue-400" size={20} />
                                    </div>
                                    <button 
                                        onClick={(e) => confirmDelete(e, project)}
                                        className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-1 mb-6">
                                    <h3 className={clsx("font-bold text-lg group-hover:text-blue-400 transition-colors truncate", theme === 'light' ? "text-zinc-900" : "text-white")}>
                                        {project.name}
                                    </h3>
                                    <p className="text-zinc-500 text-sm flex items-center gap-2 truncate">
                                        <ExternalLink size={12} />
                                        {project.url}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.deviceIds.map((deviceId, i) => (
                                        <div 
                                            key={i}
                                            className={clsx(
                                                "w-8 h-8 flex items-center justify-center rounded-lg border text-zinc-500 group-hover:border-zinc-700 transition-colors",
                                                theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-zinc-900 border-zinc-800"
                                            )}
                                            title={allDevices.find(d => d.id === deviceId)?.name}
                                        >
                                            {getDeviceIcon(deviceId)}
                                        </div>
                                    ))}
                                    {project.deviceIds.length === 0 && <span className="text-xs text-zinc-600 italic">No devices selected</span>}
                                </div>

                                <div className={clsx("flex items-center justify-between pt-4 border-t", theme === 'light' ? "border-zinc-100" : "border-zinc-800/50")}>
                                    <div className="flex items-center gap-2 text-zinc-500 text-[11px] font-medium uppercase tracking-wider">
                                        <Clock size={12} />
                                        {new Date(project.timestamp).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-blue-500 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        Open Project
                                        <Play size={10} fill="currentColor" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={clsx(
                        "flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-dashed",
                        theme === 'light' ? "bg-white border-zinc-200 shadow-sm" : "bg-[#111113]/50 border-zinc-800/50"
                    )}>
                        <div className={clsx(
                            "w-20 h-20 rounded-full flex items-center justify-center mb-6 border",
                            theme === 'light' ? "bg-zinc-50 border-zinc-200" : "bg-zinc-900 border-zinc-800/50"
                        )}>
                            <Bookmark size={32} className="text-zinc-700" />
                        </div>
                        <h2 className={clsx("text-xl font-bold mb-2", theme === 'light' ? "text-zinc-900" : "text-white")}>
                            {searchQuery ? 'No matching projects found' : 'No saved projects yet'}
                        </h2>
                        <p className="text-zinc-500 text-sm max-w-sm">
                            {searchQuery 
                                ? "We couldn't find any projects matching your search term."
                                : "Save your frequent website previews with their device configurations for quick access."}
                        </p>
                        {!searchQuery && (
                            <button 
                                onClick={() => navigate('/dashboard')}
                                className="mt-8 flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
                            >
                                <PlusCircle size={18} />
                                Start a Project
                            </button>
                        )}
                    </div>
                )}
            </main>

            {/* Delete Confirmation Modal */}
            {projectToDelete && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className={clsx(
                        "border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200",
                        theme === 'light' ? "bg-white border-zinc-200" : "bg-[#111113] border-zinc-800/80"
                    )}>
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-rose-500/10 rounded-2xl">
                                    <AlertTriangle className="text-rose-500" size={24} />
                                </div>
                                <div>
                                    <h3 className={clsx("text-lg font-bold", theme === 'light' ? "text-zinc-900" : "text-white")}>Delete Project?</h3>
                                    <p className="text-zinc-500 text-sm">This action cannot be undone.</p>
                                </div>
                            </div>

                            <div className={clsx(
                                "p-4 rounded-xl border mb-6",
                                theme === 'light' ? "bg-zinc-50 border-zinc-100" : "bg-[#0a0a0a] border-zinc-800/50"
                            )}>
                                <p className={clsx("text-sm font-medium truncate", theme === 'light' ? "text-zinc-700" : "text-zinc-300")}>{projectToDelete.name}</p>
                                <p className="text-xs text-zinc-500 truncate mt-1">{projectToDelete.url}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setProjectToDelete(null)}
                                    className={clsx(
                                        "flex-1 px-4 py-3 rounded-xl text-sm font-bold transition-all border border-transparent",
                                        theme === 'light' ? "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-200" : "text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-zinc-700"
                                    )}
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleDeleteProject}
                                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all"
                                >
                                    Delete Project
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavedProjectsPage;
