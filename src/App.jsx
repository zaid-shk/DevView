import Layout from "./routing/Layout"
import { Toaster } from "react-hot-toast"

function App() {

  return (
    <div className="bg-zinc-950 min-h-screen">
      <Toaster position="top-right" />
      <Layout/>
    </div>
  )
}

export default App
