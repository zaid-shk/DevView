import React from 'react'
import Navbar from '../landing/components/Navbar'
import Footer from '../landing/components/Footer'
import { Link } from 'react-router-dom'

const Pricing = () => {
  return (
    <div className='min-h-screen bg-zinc-950 flex flex-col font-sans'>
      <Navbar />
      
      <main className="flex-grow">
        {/* Header Section */}
        <div className="relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950"></div>
          <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6">
              Simple, transparent <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                pricing for everyone
              </span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-zinc-400">
              Start for free, upgrade when you need to. No hidden fees or surprise charges.
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">
            
            {/* Free Tier */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Hobby</h3>
              <p className="text-zinc-400 mb-6">Perfect for side projects and learning.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$0</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Up to 3 concurrent devices
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Localhost support
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Standard resolution screenshots
                </li>
              </ul>
              <Link to="/dashboard" className="block w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-center font-semibold rounded-xl transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="bg-zinc-900 border-2 border-purple-500 rounded-3xl p-8 relative transform md:-translate-y-4 shadow-2xl shadow-purple-500/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-zinc-400 mb-6">For professional developers and teams.</p>
              <div className="mb-8">
                <span className="text-5xl font-extrabold text-white">$12</span>
                <span className="text-zinc-500">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Unlimited concurrent devices
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom device dimensions
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Ultra high-res screenshots
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-purple-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Sync scrolling & interactions
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25">
                Upgrade to Pro
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-all duration-300">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-zinc-400 mb-6">For large organizations with custom needs.</p>
              <div className="mb-8">
                <span className="text-4xl font-extrabold text-white">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Everything in Pro
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  SSO Integration
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Dedicated support
                </li>
                <li className="flex items-center text-zinc-300">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Custom integrations
                </li>
              </ul>
              <button className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-colors">
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Pricing
