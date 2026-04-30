import Layout from "./routing/Layout"
import { Toaster } from "react-hot-toast"
import { useSelector } from "react-redux"

function App() {
  const theme = useSelector((state) => state.app.theme);

  return (
    <div className={`${theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-zinc-950 text-white'} min-h-screen transition-colors duration-300`}>
      <Toaster position="top-right" />
      <Layout/>
    </div>
  )
}

export default App
