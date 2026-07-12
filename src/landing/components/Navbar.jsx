import { Link } from "react-router-dom";
import { useState } from "react"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 md:px-10 md:py-5 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white text-2xl font-bold tracking-tighter">
          Dev<span className="text-blue-500">View</span>
        </div>
        {/* Desktop menu */}
        <div className="hidden md:flex gap-8 text-zinc-400 font-medium">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/features" className="hover:text-white transition-colors">Features</Link>
          <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link to="/docs" className="hover:text-white transition-colors">Docs</Link>
        </div>
        {/* Action buttons */}
        <div className="hidden md:flex gap-4 items-center">
          <button className="text-white bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all">Log in</button>
          <Link to="/dashboard" className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Start Preview</Link>
        </div>
        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className="block h-0.5 w-6 bg-white rounded"></span>
          <span className="block h-0.5 w-6 bg-white rounded"></span>
          <span className="block h-0.5 w-6 bg-white rounded"></span>
        </button>
      </div>
      {/* Mobile menu panel */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-3 text-center text-zinc-400 font-medium">
          <Link to="/" className="block hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/features" className="block hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/pricing" className="block hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/docs" className="block hover:text-white transition-colors" onClick={() => setIsOpen(false)}>Docs</Link>
          <button className="w-full text-white bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all" onClick={() => setIsOpen(false)}>Log in</button>
          <Link to="/dashboard" className="block w-full text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20" onClick={() => setIsOpen(false)}>
            Start Preview
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar