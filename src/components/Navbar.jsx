import React from 'react'
import { Link } from 'react-router-dom'
import { Share2, Settings } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { clsx } from 'clsx'
import { setActiveUrl, addToHistory } from '../store/slices/appSlice'
import URLBar from './URLBar'

const Navbar = () => {
    const dispatch = useDispatch()
    const theme = useSelector((state) => state.app.theme)

    const handleUrlSubmit = (url) => {
        dispatch(setActiveUrl(url));
        dispatch(addToHistory(url));
    }

    return (
        <div className={clsx(
            "sticky top-0 z-100 border-b transition-all duration-300",
            theme === 'light' ? "bg-white/80 backdrop-blur-md border-zinc-200" : "bg-[#0a0a0a]/80 backdrop-blur-md border-zinc-800/50 pb-2 lg:pb-0"
        )}>
            <div className="flex justify-between items-center px-6 lg:px-10 py-3 max-w-400 mx-auto">
                <Link to="/" className={clsx(
                    "text-2xl font-black tracking-tighter transition-colors",
                    theme === 'light' ? "text-zinc-900" : "text-white"
                )}>
                    Dev<span className="text-blue-500">View</span>
                </Link>

                <div className="hidden lg:flex flex-1 max-w-2xl px-8">
                    <URLBar onSubmit={handleUrlSubmit} />
                </div>

                <div className="flex items-center gap-3">
                    <button className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all border",
                        theme === 'light' 
                            ? "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200" 
                            : "bg-zinc-900 border-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    )}>
                        <Share2 size={16} />
                        <span className="hidden sm:inline">Share</span>
                    </button>
                    
                    <Link to="/settings" className={clsx(
                        "flex items-center justify-center p-2.5 rounded-xl transition-all border",
                        theme === 'light'
                            ? "bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200"
                            : "bg-zinc-900 border-zinc-800/50 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                    )}>
                        <Settings size={18} />
                    </Link>
                </div>
                
            </div>
            <div className="flex lg:hidden flex-1 max-w-2xl px-8">
                    <URLBar onSubmit={handleUrlSubmit} />
                </div>
        </div>
    )
}

export default Navbar