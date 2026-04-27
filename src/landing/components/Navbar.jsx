import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <div className="flex justify-between items-center px-10 py-5 bg-zinc-900 border-b border-zinc-800">
      <div className="text-white text-2xl font-bold tracking-tighter">
        Dev<span className="text-blue-500">View</span>
      </div>
      <div className="flex gap-8 pl-13 text-zinc-400 font-medium">
        <Link to="/" className="hover:text-white transition-colors">Home</Link>
        <Link to="/features" className="hover:text-white transition-colors">Features</Link>
        <Link to="/about" className="hover:text-white transition-colors">Pricing</Link>
        <Link to="/about" className="hover:text-white transition-colors">Docs</Link>
      </div>
      <div className="flex gap-4">
        <button className="text-white bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all">Log in</button>
        <button className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20">Start Preview</button>
      </div>
    </div>
  )
}

export default Navbar