import React, { useState } from 'react'
import Navbar from '../landing/components/Navbar'
import Footer from '../landing/components/Footer'

const Docs = () => {
  const [activeSection, setActiveSection] = useState('getting-started')

  return (
    <div className='min-h-screen bg-zinc-950 flex flex-col font-sans'>
      <Navbar />
      
      <main className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full px-6 lg:px-8 py-12 gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Documentation</h2>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveSection('getting-started')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'getting-started' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                Getting Started
              </button>
              <button 
                onClick={() => setActiveSection('devices')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'devices' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                Managing Devices
              </button>
              <button 
                onClick={() => setActiveSection('screenshots')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'screenshots' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                Taking Screenshots
              </button>
              <button 
                onClick={() => setActiveSection('troubleshooting')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeSection === 'troubleshooting' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
              >
                Troubleshooting
              </button>
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="flex-grow bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-8 lg:p-12">
          
          {activeSection === 'getting-started' && (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-6">Getting Started with DevView</h1>
              <p className="text-zinc-400 mb-6 text-lg">
                Welcome to DevView! This guide will help you set up your first workspace and start previewing your websites across multiple devices instantly.
              </p>
              
              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">1. Enter a URL</h2>
              <p className="text-zinc-400 mb-4">
                On the Dashboard, locate the URL input bar at the top of the screen. Enter the URL of the website you want to test. This can be a public website (e.g., <code>https://example.com</code>) or a local development server (e.g., <code>http://localhost:3000</code>).
              </p>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">2. Using Localhost</h2>
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-4">
                <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Pro Tip
                </h4>
                <p className="text-blue-200/70 text-sm">
                  If you're testing a local React or Vue app, make sure your development server is running and accessible. DevView renders exactly what your browser sees.
                </p>
              </div>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">3. Interact</h2>
              <p className="text-zinc-400 mb-4">
                Once the iframes load, you can interact with the website inside them just like a normal browser. DevView can synchronize scrolling across all visible devices if enabled.
              </p>
            </div>
          )}

          {activeSection === 'devices' && (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-6">Managing Devices</h1>
              <p className="text-zinc-400 mb-6 text-lg">
                DevView allows you to customize exactly which devices you see on your dashboard.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Adding & Removing Devices</h2>
              <p className="text-zinc-400 mb-4">
                Click the <strong>"Devices"</strong> button in the sidebar or top navigation. Here you will see a list of available devices (iPhone, iPad, Desktop, etc.). Check or uncheck the boxes next to them to add or remove them from your active workspace.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">Custom Devices</h2>
              <p className="text-zinc-400 mb-4">
                Need a specific resolution not listed? At the bottom of the device list, you can define a custom device by specifying a Name, Width, and Height.
              </p>
            </div>
          )}

          {activeSection === 'screenshots' && (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-6">Taking Screenshots</h1>
              <p className="text-zinc-400 mb-6 text-lg">
                Capture pixel-perfect screenshots of your previews for presentations or bug reports.
              </p>

              <h2 className="text-2xl font-semibold text-white mt-10 mb-4">How it works</h2>
              <p className="text-zinc-400 mb-4">
                Hover over any device preview. In the control bar that appears, click the <strong>Camera</strong> icon. DevView will generate a high-resolution image of that specific iframe.
              </p>
              <p className="text-zinc-400 mb-4">
                You can choose to save it to your local machine instantly.
              </p>
            </div>
          )}

          {activeSection === 'troubleshooting' && (
            <div className="prose prose-invert max-w-none">
              <h1 className="text-3xl font-bold text-white mb-6">Troubleshooting</h1>
              
              <h2 className="text-2xl font-semibold text-white mt-8 mb-4">"Site refuses to connect"</h2>
              <p className="text-zinc-400 mb-4">
                Some websites (like Google, GitHub, etc.) use <code>X-Frame-Options</code> or CSP headers to block their site from being embedded inside iframes. This is a security feature of those websites and cannot be bypassed purely via the frontend.
              </p>
              <p className="text-zinc-400 mb-4">
                <strong>Solution:</strong> DevView is best used for your own development projects or websites that allow iframe embedding.
              </p>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Docs
