import React from 'react'
import { Smartphone, Link, UserPlus, ShieldCheck } from 'lucide-react';

const Footer = () => {
    return (
        <div className='flex flex-wrap items-center justify-around text-zinc-400 font-medium bg-zinc-900 border-b border-zinc-800 py-2'>
            <div className="flex flex-col justify-center items-center ">
                <div className="bg-zinc-800 px-3 py-3  rounded-full flex items-center justify-center my-1"><ShieldCheck /></div>
                <h3 className='text-md tracking-tight'>Real-time Preview</h3>
                <p className='text-sm'>See Changes Instantly</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="bg-zinc-800 px-3 py-3  rounded-full flex items-center justify-center my-1"><Smartphone /></div>
                <h3 className='text-md tracking-tight'>Multi-Device Support</h3>
                <p className='text-sm'>Mobile, Tablet, Desktop</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="bg-zinc-800 px-3 py-3  rounded-full flex items-center justify-center my-1"><UserPlus /></div>
                <h3 className='text-md tracking-tight'>Easy Sharing</h3>
                <p className='text-sm'>Share with anyone</p>
            </div>
            <div className="flex flex-col justify-center items-center">
                <div className="bg-zinc-800 px-3 py-3  rounded-full flex items-center justify-center my-1"><Link /></div>
                <h3 className='text-md tracking-tight'>No installation</h3>
                <p className='text-sm'>100% in Browser</p>
            </div>
        </div>
    )
}

export default Footer