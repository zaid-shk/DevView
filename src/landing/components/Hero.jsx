import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import mockupImg from '../../assets/mockup.png'

const Hero = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 py-20 overflow-hidden bg-zinc-950">
      {/* Background Glow */}
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none"></div> */}

      <div className="z-10 max-w-2xl text-center lg:text-left">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-semibold mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
          #1 Responsive Preview Tool
        </div>

        {/* Headline */}
        <h1 className="text-5xl lg:text-[4vw] font-[Helvetica] font-extrabold text-white tracking-wide leading-[1.1] mb-8">
          Preview Your <br />
          Website Across <br />
          All Devices <span className="text-blue-600">Instantly</span>
        </h1>

        {/* Subheadline */}
        <p className="text-zinc-400 text-lg lg:text-xl max-w-lg mb-8 leading-relaxed">
          Test your website's responsiveness on mobile, tablet, and desktop screens in real time.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row lg:justify-start justify-center items-center gap-4 mb-8">
          <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4  text-zinc-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">
            Start Preview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl border border-zinc-800 transition-all">
            View Demo
          </button>
        </div>

        {/* Footnote */}
        <p className="text-zinc-500 text-sm">
          No signup required <span className="mx-2">•</span> Free to use
        </p>
      </div>

      {/* Mockups Image */}
      <div className="z-10 mt-16 lg:mt-0 lg:w-1/2 relative flex justify-center lg:justify-end">
        <div className="relative group">
          {/* <div className="absolute -inset-1 "></div> */}
          <img 
            src={mockupImg} 
            alt="Device Mockups" 
            className="relative w-full max-w-[600px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}

export default Hero