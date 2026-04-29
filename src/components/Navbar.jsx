import React from 'react'
import { Link } from 'react-router-dom'
import { Share2, Settings } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setActiveUrl } from '../store/slices/appSlice'
import URLBar from './URLBar'

const Navbar = () => {
    const dispatch = useDispatch()

    const handleUrlSubmit = (url) => {
        dispatch(setActiveUrl(url));
    }

    return (
        <div><div className="flex justify-between items-center px-10 py-3 bg-zinc-900 border-b border-zinc-800">
            <div className="text-white text-2xl font-bold tracking-tighter">
                Dev<span className="text-blue-500">View</span>
            </div>

            <div className="flex-1 max-w-2xl">
                <URLBar onSubmit={handleUrlSubmit} />
            </div>
            <div className="flex gap-4">
                <button className="text-white text-md bg-zinc-800 px-3 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center gap-3"><Share2 size={20} />Share</button>
                <Link to="/dashboard" className="text-white text-lg bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all flex items-center"><Settings /></Link>
            </div>
        </div></div>
    )
}

export default Navbar