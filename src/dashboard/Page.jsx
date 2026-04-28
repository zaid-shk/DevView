import React from 'react'
import Navbar from '../components/Navbar'

const Page = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Navbar /> 
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-zinc-400">Welcome to your dashboard. Select a project to get started.</p>
      </div>
    </div>
  )
}

export default Page